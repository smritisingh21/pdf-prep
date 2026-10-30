const BASE_URL = "http://localhost:3000";

// Upload PDF
export default async function uploadPDF(file) {
  console.log("Uploading PDF:", file.name);
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Upload failed");
  }

  return res.json();
}

// Generate Quiz
export async function getQuiz(query) {
  const url = query
    ? `${BASE_URL}/quiz?query=${encodeURIComponent(query)}`
    : `${BASE_URL}/quiz`;
  const res = await fetch(url);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Failed to generate quiz");
  }

  return res.json();
}

// Generate Flashcards
export async function getFlashcards(query) {
  const url = query
    ? `${BASE_URL}/flashcards?query=${encodeURIComponent(query)}`
    : `${BASE_URL}/flashcards`;
  const res = await fetch(url);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Failed to generate flashcards");
  }

  return res.json();
}
