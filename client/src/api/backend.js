

const BASE_URL = "http://localhost:3000";

//upload pdf
export default async function uploadPDF(file) {
  console.log("Uploading PDF:", file.name);
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Upload failed");
  }

  return res.json();
}

//genrate quiz
export async function getQuiz() {
  const res = await fetch(`${BASE_URL}/quiz`);
  console.log(res);
  return res.json();
}
