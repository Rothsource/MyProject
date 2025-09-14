import { getAccessToken} from "../TokensStorage/storeTokens.js";
const token = await getAccessToken();
if (!token) throw new Error("No access token found.");

export async function link_input(links, hash, id) {
  const res = await fetch("http://127.0.0.1:5000/input/links", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      links,
      hash,
      id
    }),
  });
  return res.json();
}

export async function url_detection(hash, userid,inputId) {
  try {    
    const res = await fetch("http://127.0.0.1:5000/detect/url", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hash,
        userid,
        inputId
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const result = await res.json(); 
    return result;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}


export async function file_input(name, userid, hash_md5, hash_sha1, hash_sha256, size = 0) {
  try {
    const res = await fetch("http://127.0.0.1:5000/input/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, size, userid, hash_md5, hash_sha1, hash_sha256 })
    });
    return res.json(); 
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}


export async function File_Detection(file_input_id, userid, hash_md5, hash_sha1, hash_sha256) {
  try {
    const res = await fetch("http://127.0.0.1:5000/detect/file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_input_id, userid, md5: hash_md5, sha1: hash_sha1, sha256: hash_sha256 })
    });
    return res.json(); 
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}


export async function hash_input(hash, userid) {
  try {
    const res = await fetch("http://127.0.0.1:5000/input/hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hash,
        UserId: userid 
      }),
    }); 

    return res.json();
  } catch (error) {
    console.error('Hash input request failed:', error);
    throw error;
  }
}

export async function Hash_Detection(hash, userid, inputid) {
  try {    
    const res = await fetch("http://127.0.0.1:5000/detect/hash", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        hash,
        userid,
        inputid
    })
  });

  return res.json();
  } catch (error) {
    console.error('Hash detection request failed:', error);
    throw error;
  }
}