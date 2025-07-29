import os
from dotenv import load_dotenv

#load .env file
load_dotenv()

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

from PyPDF2 import PdfReader
import docx

#Config
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"txt", "pdf", "docx"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#Flask setup
app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

#Initting RAG components
embedder = OpenAIEmbeddings()
vector_store = None #FAISS placeholder
qa_chain = None #RetrievalQA placeholder


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def load_file(path: str) -> str:
    """Load and return all text from a .pdf, .docx, or .txt."""
    ext = path.rsplit(".", 1)[1].lower()
    if ext == "pdf":
        reader = PdfReader(path)
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    elif ext == "docx":
        doc = docx.Document(path)
        return "\n".join(p.text for p in doc.paragraphs)
    else:  # txt
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

#Splits the uploaded document, embeds the chunks, and updates the FAISS index
@app.route("/upload", methods=["POST"])
def upload():
    global vector_store, qa_chain

    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    f = request.files["file"]
    if f.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if not allowed_file(f.filename):
        return jsonify({"error": f"Unsupported file type: {f.filename}"}), 400

    filename = secure_filename(f.filename)
    path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    f.save(path)

    #Extract text
    text = load_file(path)

    #Chunk into ~1000-token pieces with 200-token overlap
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = splitter.create_documents([text], metadatas=[{"source": filename}])

    #Embed & add to FAISS
    if vector_store is None:
        vector_store = FAISS.from_documents(docs, embedder)
    else:
        vector_store.add_documents(docs)

    #Build RetrievalQA chain
    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    llm = ChatOpenAI(temperature=0)
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever
    )

    return jsonify({"message": f"Indexed {filename}: {len(docs)} chunks."})

#Returns the LLM’s answer based on the indexed documents
@app.route("/ask", methods=["POST"])
def ask():
    if qa_chain is None:
        return jsonify({"error": "No documents have been uploaded yet."}), 400

    data = request.get_json()
    question = data.get("question", "").strip()
    if not question:
        return jsonify({"error": "Empty question."}), 400

    answer = qa_chain.run(question)
    return jsonify({"answer": answer})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
