import express from 'express';
import { detectLink } from '../controller/Links.js';
import { detectFile } from '../controller/Files.js';
import { detectHash } from '../controller/Hash.js';
import { verifyToken } from '../Jwt/midware/middleware.js';

const detect = express.Router();

detect.post('/url',verifyToken, detectLink);

detect.post('/file',verifyToken, detectFile);

detect.post('/hash',verifyToken, detectHash);

export default detect;