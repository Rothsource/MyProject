import { getFeedback } from "./reqeust";

export async function handleFeedback({ text, url, file }) {

  const payload = {
    text: text || null,
    url: url || null,
    file: file || null,
  };

  const response = await getFeedback(payload);
  return response;
}
