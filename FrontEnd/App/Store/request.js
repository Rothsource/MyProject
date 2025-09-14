export async function url_upload(url,hash) {
  try {    
    const res = await fetch("http://127.0.0.1:5000/store/url", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        url,
        hash
      })
    });
    
    return res.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

export async function file_upload(hash){
    try {    
    const res = await fetch("http://127.0.0.1:5000/store/file", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        hash
      })
    });
    
    return res.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
