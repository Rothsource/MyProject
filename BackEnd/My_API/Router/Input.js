import express from 'express';
import{
    createLink
}from "../controller/Links.js";
import { verifyToken } from '../Jwt/midware/middleware.js';

import {createFile} from "../controller/Files.js";
import { createHash } from '../controller/Hash.js';

const input = express.Router();

input.post("/links", verifyToken, createLink);

input.post("/files", verifyToken,createFile);

input.post("/hash", verifyToken, createHash);

export default input;