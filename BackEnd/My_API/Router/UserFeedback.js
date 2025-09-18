import express from 'express';
import { verifyToken } from '../Jwt/midware/middleware.js';
import { writeFeedBack } from '../controller/UserFeedBack.js';

const router = express.Router();

router.post("/", verifyToken, writeFeedBack);

export default router;