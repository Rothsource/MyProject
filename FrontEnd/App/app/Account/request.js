import User from "./User.js" // Singular naming
import { getAccessToken } from "../../TokensStorage/storeTokens.js";

export async function userInfo() {
  try{
    const token = await getAccessToken();
    console.log("Token being sent:", token);
    const res = await fetch("http://10.0.2.2:5000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
    const data = await res.json();
    console.log("Response Get user", data);
    return data;
  }catch(error){
    console.error("Request error: ", error);
  }
}

export async function checkPhonenumber(phone) {
  try {
    
    const res = await fetch("http://10.0.2.2:5000/users/phone", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({phone_number: phone}),
    });
    
    console.log("Response status:", res.status);
    
    const data = await res.json();
    console.log("Response data:", data);
    
    return data;
  } catch (error) {
    console.error("Request error:", error);
    return { success: false, error: "Network request failed" };
  }
}

export async function createUserAndSend(username, phoneNumber, password, profileImageData = null) {
  const user = new User(username, phoneNumber, password);

  try {
    const res = await fetch("http://10.0.2.2:5000/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.getUsername(),
        phone_number: user.getPhoneNumber(),
        password: user.getPassword(),
        profile_image: profileImageData, // ✅ send Base64 string or null
      }),
    });

    const data = await res.json();
    console.log("Signup response:", data);
    return data;
  } catch (error) {
    console.error("Signup request error:", error);
    return { success: false, error: "Network request failed" };
  }
}

export async function userlogin(phone, password) {
  try {
    const API_BASE = "http://10.0.2.2:5000/users/login"; // Android Emulator

    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error("Server response is not JSON:", text);
      return { success: false, message: "Invalid server response" };
    }

  } catch (err) {
    console.error("API error:", err);
    return { success: false, message: "Network error" };
  }
}


async function requestotp(phone) {
  const res = await fetch("http://10.0.2.2:5000/users/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
  });
  return res.json();
}

async function checkotp(otp, phone) {
  const res = await fetch("http://10.0.2.2:5000/users/verify", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({otp, phone}),
  });

  return res.json();
}

async function NewPassword(newPassword, phone) {
  try {
    const res = await fetch("http://10.0.2.2:5000/users/password", {
      method: "PATCH", // or POST if your backend uses POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, newPassword }),
    });

    if (!res.ok) {
      const text = await res.text();
      // This handles the case when the server returns HTML (like a 404 page)
      return { success: false, message: text };
    }

    return await res.json(); // <- make sure backend returns JSON {success, message}
    } catch (error) {
    console.error("Error calling NewPassword:", error);
    return { success: false, message: error.message };
  }
}

async function clearStoredOtp(phone) {
  try {
    const res = await fetch("http://10.0.2.2:5000/users/clearOTP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, message: text };
    }

    return await res.json();
  } catch (error) {
    console.error("Error clearing stored OTP:", error);
    return { success: false, message: error.message };
  }
}

export default {
  createUserAndSend,
  userlogin,
  requestotp,
  checkotp,
  NewPassword,
  clearStoredOtp
};