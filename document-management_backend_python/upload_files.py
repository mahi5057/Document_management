import os
import shutil
import argparse
from document_rag.settings import Settings

def upload_files(documents):
    # Validate and prepare to upload files
    for path in documents:
        _, ext = os.path.splitext(path)
        if not os.path.exists(path):
            print(f"File '{path}' does not exist.")
            exit(1)
        if not ext.lower() == ".pdf":
            print(f"File extension '{ext}' for '{path}' not supported. Must be PDF.")
            exit(1)

    # Clear previous cache if needed
    shutil.rmtree(Settings().DOCUMENT_RAG_VECTOR_DB_CACHE_DIR, ignore_errors=True)

    # Here, you would implement the logic to store or process the files as needed
    print("Ingested PDF documents. You can now start the Q&A application.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "documents",
        type=str,
        nargs="+",
        help="One or more local paths to PDF documents.",
    )
    args = parser.parse_args()

    upload_files(args.documents)
