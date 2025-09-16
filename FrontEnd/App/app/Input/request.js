import { getAccessToken } from "../../TokensStorage/storeTokens";
const Network = "http://10.0.2.2:5000";

export async function link_input(links, hash) {
  const token = await getAccessToken();
  const res = await fetch(`${Network}/input/links`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      links,
      hash
    }),
  });
  return res.json();
}

export async function url_detection(hash,inputId) {
  const token = await getAccessToken();
  try {    
    const res = await fetch(`${Network}/detect/url`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        hash,
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
  const token = await getAccessToken();
  try {
    const res = await fetch("http://10.0.2.2:5000/input/files", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
       },
      body: JSON.stringify({ name, size, userid, hash_md5, hash_sha1, hash_sha256 })
    });
    return res.json(); 
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}


export async function File_Detection(file_input_id, userid, hash_md5, hash_sha1, hash_sha256) {
  const token = await getAccessToken();
  try {
    const res = await fetch("http://127.0.0.1:5000/detect/file", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ file_input_id, userid, md5: hash_md5, sha1: hash_sha1, sha256: hash_sha256 })
    });
    return res.json(); 
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}


export async function hash_input(hash) {
  const token = await getAccessToken();
  try {
    const res = await fetch(`${Network}/input/hash`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        hash
      }),
    }); 

    const data = await res.json();
    console.log("Here hash input reqest to backend respnose: ", data);
    return data;
  } catch (error) {
    console.error('Hash input request failed:', error);
    throw error;
  }
}

export async function Hash_Detection(hash,inputid) {
  const token = await getAccessToken();
  try {    
    const res = await fetch(`${Network}/detect/hash`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        hash,
        inputid
    })
  });
 
  const data = await res.json();
  console.log("Data: ", data);
  return data;
  } catch (error) {
    console.error('Hash detection request failed:', error);
    throw error;
  }
}