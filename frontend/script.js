const BASE_URL = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("upload-form");
  const fileInput = document.getElementById("file-input");
  const uploadStatus = document.getElementById("upload-status");

  const askForm = document.getElementById("ask-form");
  const questionInput = document.getElementById("question-input");
  const answerText = document.getElementById("answer-text");

  //Upload & index
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!fileInput.files.length) return;

    uploadStatus.textContent = "Uploading...";
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      uploadStatus.textContent = data.message;
    } catch (err) {
      uploadStatus.textContent = `${err.message}`;
    }
  });

  //Ask the LLM
  askForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = questionInput.value.trim();
    if (!q) return;

    answerText.textContent = "Thinking…";
    try {
      const res = await fetch(`${BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "LLM error");
      answerText.textContent = data.answer;
    } catch (err) {
      answerText.textContent = `${err.message}`;
    }
  });
});