import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import User from "../model/User/User.js"
import { generateAccessToken } from "../Jwt/token/generateToekns.js";
import { generateRefreshToken } from "../Jwt/token/generateToekns.js";
import cloudinary from "../config/cloudinary.js";

async function uploadImage(image) {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "MyApp/Users",   
    });

    console.log("Image URL:", result.secure_url); 
    return result.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
  }
}

//ge

// otp generator
function generateOTP(length = 8) {
  const min = 10 ** (length - 1); 
  const max = 10 ** length - 1;   
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

// create new user
export async function writeUsers(name, phone_number, password, salt, picURL) {
  const id = uuidv4();

  const user = await User.create({
    User_id: id,
    User_Name: name,
    User_PhoneNumber: phone_number,
    User_Password: password,
    Salt: salt,
    pic_url: picURL,
  });

  return { id, name, phone_number };
}

// get all users
export async function readUserById(id) {
  return await User.findByPk(id);
}

// get user by phone number
export async function readUsersId(phone) {
  return await User.findAll({
    where: { User_PhoneNumber: phone },
  });
}

// get all users endpoint
export const getUser = async (req, res) => {
  try {
    const userId = req.user.sub;   
    const user = await readUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: { 
        name: user.User_Name, 
        phone_number: user.User_PhoneNumber, 
        picUrl: user.pic_url
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};


// create new user endpoint
export const checkPhone = async (req, res) => {
  try {
    const phoneExistsBefore = await readUsersId(req.body.phone_number);
    if (phoneExistsBefore.length > 0) {
      return res.status(409).json({ 
        success: false,
        error: "This phone number has already been used" 
      });
    }
    return res.status(200).json({ success: true, message: "Phone available" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const PostUsers = async (req, res) => {
  try {
    const { name, phone_number, password, profile_image } = req.body;

    if (!name || !phone_number || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const phoneExistsBefore = await readUsersId(phone_number);
    if (phoneExistsBefore.length > 0) {
      return res.status(409).json({ 
        success: false,
        error: "This phone number has already been used" 
      });
    }

    // Hash password
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHash("sha512").update(password + salt).digest("hex");

    let photoUrl = null;
    if (profile_image) {
      console.log("Upload Image to Cloudinary")
      photoUrl = await uploadImage(profile_image);
    }else{
      console.log("Don't Have Profile Image!");
    }

    const newUser = await User.create({
      User_id: uuidv4(),
      User_Name: name,
      User_PhoneNumber: phone_number,
      User_Password: hash,
      Salt: salt,
      pic_url: photoUrl, 
    });

    const users = { sub: newUser.User_id, name: newUser.User_Name, phone_number: newUser.User_PhoneNumber };
    const accessTokens = generateAccessToken(users);
    const refreshTokens = generateRefreshToken(users);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: newUser.User_id, name: newUser.User_Name, phone_number: newUser.User_PhoneNumber, pic_url: photoUrl },
      tokens: { accessTokens, refreshTokens, expiratoinIn: 900 },
      proImage: photoUrl
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// user login
export const Userlogin = async (req, res) => {
  const { phone, password } = req.body;

  try {
    if (!phone || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number and password are required" 
      });
    }

    const user = await User.findOne({ where: { User_PhoneNumber: phone } });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const storedPassword = user.User_Password;
    const storedSalt = user.Salt;
    const hash = crypto.createHash("sha512").update(password + storedSalt).digest("hex");

    if (storedPassword === hash) {
      const loginTime = new Date();
      await user.update({ login_time: loginTime });

      const users = {sub: user.User_id, name: user.User_Name, phone_number: user.User_PhoneNumber};
      const accessTokens = generateAccessToken(users);
      const refreshTokens = generateRefreshToken(users);

      return res.status(200).json({ 
        success: true,
        message: "Login successful",
        user: {
          id: user.User_id,
          name: user.User_Name,
          phone_number: user.User_PhoneNumber,
        },
        tokens: {
          accessToken: accessTokens,
          refreshToken: refreshTokens,
          expirationIn: 900
        }
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// generate otp
export const generateotp = async (req, res) => {
  const { phone } = req.body;

  try {
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const user = await User.findOne({ where: { User_PhoneNumber: phone } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOTP(); 
    const createdAt = new Date();

    await user.update({ OTP: otp, OTP_CreateAt: createdAt });

    console.log(`OTP for ${phone}: ${otp}`);

    return res.json({ 
      success: true, 
      message: "OTP generated successfully"
    });

  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ error: "Failed to generate OTP" });
  }
};

// verify otp
export const verifyotp = async (req, res) => {
  const { otp, phone } = req.body;

  try {
    if (!otp || !phone) {
      return res.status(400).json({
        success: false,
        message: "OTP and phone number are required",
      });
    }

    const user = await User.findOne({ where: { User_PhoneNumber: phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.OTP || !user.OTP_CreateAt) {
      return res.status(400).json({
        success: false,
        message: "No OTP found or OTP expired",
      });
    }

    const currentTime = new Date();
    const otpCreationTime = new Date(user.OTP_CreateAt);
    const timeDifference = currentTime - otpCreationTime;

    if (timeDifference > 60000) {
      await user.update({ OTP: null, OTP_CreateAt: null });
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (user.OTP === otp) {
      await user.update({ OTP: null, OTP_CreateAt: null });
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully!",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// clear stored OTP
export const clearOTP = async (req, res) => {
  const { phone } = req.body;

  try {
    if (!phone) {
      return res.status(400).json({ 
        success: false,
        message: "Phone number is required" 
      });
    }

    const user = await User.findOne({ where: { User_PhoneNumber: phone } });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Clear OTP and OTP creation time
    await user.update({ OTP: null, OTP_CreateAt: null });

    return res.json({ 
      success: true, 
      message: "OTP cleared successfully" 
    });

  } catch (error) {
    console.error("Error clearing OTP:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to clear OTP" 
    });
  }
};

// update password
export const updatePassword = async (req, res) => {
  const { phone, newPassword } = req.body;

  try {
    if (!phone || !newPassword) {
      return res.status(400).json({ 
        error: "Phone number and new password are required" 
      });
    }

    const user = await User.findOne({ where: { User_PhoneNumber: phone } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHash("sha512").update(newPassword + salt).digest("hex");

    await user.update({ User_Password: hash, Salt: salt });

    return res.json({ 
      success: true, 
      message: "Password updated successfully" 
    });

  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
};