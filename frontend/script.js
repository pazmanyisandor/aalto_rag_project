const BASE_URL = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("upload-form");
  const fileInput = document.getElementById("file-input");
  const uploadStatus = document.getElementById("upload-status");

  const askForm = document.getElementById("ask-form");
  const questionInput = document.getElementById("question-input");
  const chatWindow = document.getElementById("chat-window");

  // Helper to append a chat bubble
  function appendMessage(sender, text) {
    const wrapper = document.createElement("div");
    wrapper.classList.add(
      "d-flex",
      "mb-2",
      sender === "user" ? "justify-content-end" : "justify-content-start"
    );

    const bubble = document.createElement("div");
    bubble.classList.add("p-2", "rounded");
    if (sender === "user") {
      bubble.classList.add("bg-primary", "text-white");
    } else {
      bubble.classList.add("bg-light");
    }
    bubble.textContent = text;

    wrapper.appendChild(bubble);
    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Upload & index
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
      uploadStatus.textContent = `Error: ${err.message}`;
    }
  });

  // Ask the LLM
  askForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = questionInput.value.trim();
    if (!q) return;

    appendMessage("user", q);
    appendMessage("bot", "Thinking…");
    questionInput.value = "";

    try {
      const res = await fetch(`${BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "LLM error");

      const botBubbles = chatWindow.querySelectorAll(
        "div > div.bg-light"
      );
      botBubbles[botBubbles.length - 1].innerHTML = data.answer.replace(/\n/g, "<br>");
    } catch (err) {
      const botBubbles = chatWindow.querySelectorAll(
        "div > div.bg-light"
      );
      botBubbles[botBubbles.length - 1].textContent = `Error: ${err.message}`;
    }
  });
});