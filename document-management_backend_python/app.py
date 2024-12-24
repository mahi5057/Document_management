import os
import shutil
from flask_cors import CORS
from flask import Flask, request, jsonify
from document_rag.rag import RAG
from document_rag.settings import Settings
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for specific route (/upload)
CORS(app, resources={r"/upload": {"origins": "http://localhost:4200"}})

# Store uploaded PDF paths in memory (you can modify this for persistent storage)
uploaded_files = []

@app.route('/upload', methods=['POST','OPTIONS'])
def upload_files():
    # import ipdb;ipdb.set_trace()
    if request.method == 'OPTIONS':
        return '', 200 
    files = request.files.getlist('files')
    
    if not files:
        return jsonify({"error": "No files uploaded."}), 400

    # global uploaded_files
    # uploaded_files = []  # Reset the list for new uploads

    # Clear previous cache if needed
    shutil.rmtree(Settings().DOCUMENT_RAG_VECTOR_DB_CACHE_DIR, ignore_errors=True)

    for file in files:
        if not file.filename.endswith('.pdf'):
            return jsonify({"error": f"File '{file.filename}' is not a PDF."}), 400

        file_path = os.path.join('assets', file.filename)  # Change to your desired upload folder
        file.save(file_path)
        uploaded_files.append(file_path)

    # You would normally process the PDFs here, e.g., adding to RAG
    print("Ingested PDF documents.")

    return jsonify({"message": "Files uploaded successfully."}), 200

@app.route('/ask', methods=['POST','OPTIONS'])
def ask_question():
    try:
        # Check if files have been uploaded
        if not uploaded_files:
            return jsonify({"error": "No files uploaded. Please upload files first."}), 400

        # Parse JSON data from request
        data = request.get_json()
        if not data or not data.get("question"):
            return jsonify({"error": "No question provided."}), 400

        prompt = data["question"].strip()
        if not prompt:
            return jsonify({"error": "The question cannot be empty."}), 400

        # Initialize RAG instance
        rag = RAG.from_settings()

        # Add PDF documents to RAG
        try:
            rag.add_pdf_documents(paths=uploaded_files, verbose=True)
        except FileNotFoundError as e:
            return jsonify({"error": "One or more uploaded files could not be found.", "details": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Failed to process uploaded documents.", "details": str(e)}), 500

        # Generate the answer
        try:
            result = rag.generate(prompt=prompt)
        except ValueError as e:
            return jsonify({"error": "Invalid input provided to the model.", "details": str(e)}), 400
        except Exception as e:
            return jsonify({"error": "Failed to generate a response from the model.", "details": str(e)}), 500

        # Prepare the response
        response = {
            "answer": result.get("text", "No answer could be generated."),
            "references": []
        }

        # Add references if available
        for reference in result.get("search_results", []):
            response["references"].append({
                "path": reference["metadata"].get("path", "Unknown"),
                "page_range": reference["metadata"].get("page_range", "Unknown"),
                "text": reference.get("text", "No text available.")
            })

        return jsonify(response), 200

    except Exception as ex:
        # Catch any other unexpected errors
        print(f"Error: {ex}")
        return jsonify({
            "error": "An unexpected error occurred.",
            "details": str(ex)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)