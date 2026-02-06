

const BASE_URL = "http://localhost:3000";

export default async function uploadPDF(file) {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

export async function getQuiz() {
  const res = await fetch(`${BASE_URL}/quiz`);
  return res.json();
}
