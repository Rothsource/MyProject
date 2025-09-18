import express from 'express';
import {
  getUser,
  //getUserID,
  PostUsers,
  updatePassword,
  //DeleteUser,
  Userlogin,
  //PutUser
  generateotp,
  verifyotp,
  clearOTP,
  checkPhone,
  updateUser,
} from "../controller/User.js";

import { verifyToken } from '../Jwt/midware/middleware.js';

const router = express.Router();

router.get("/", verifyToken, getUser);

router.patch("/update", verifyToken, updateUser);


router.post("/signup", PostUsers);

router.post("/reset", generateotp);

router.post("/phone", checkPhone);

router.post("/verify", verifyotp)

router.post("/clearOTP", clearOTP)

router.patch("/password", updatePassword);

router.post("/login", Userlogin);


export default router;