from document_rag.rag import RAG
from document_rag.settings import Settings

def start_qa_application():
    rag = RAG.from_settings()
    print("Ingested PDF documents. Please ask your questions.")

    while True:
        prompt = input(">>> ").replace("\n", "").strip()
        if prompt == "":
            continue
        elif prompt.lower() == "exit":
            break

        result = rag.generate(prompt=prompt)
        print(result["text"])

        # Optional: Show references if needed
        if "show_references" in result:
            print("\nReferences:")
            for reference in result["search_results"]:
                print()
                print(reference["metadata"]["path"], end="")
                start_page, end_page = reference["metadata"]["page_range"]
                if start_page == end_page:
                    print(f"(p {start_page})")
                else:
                    print(f"(pp {start_page}-{end_page})")
                print(reference["text"])
            print()

if __name__ == "__main__":
    start_qa_application()
