import { getAccessToken } from "../../TokensStorage/storeTokens";

const Network = "http://10.0.2.2:5000";

export async function getFeedback({ text, url = null, file = null }) {
  const token = await getAccessToken();

  const res = await fetch(`${Network}/feedback`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      text,
      url,
      file,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to send feedback");
  }

  return res.json();
}
