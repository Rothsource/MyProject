import express from 'express';
import{
    createLink
}from "../controller/Links.js";

import {createFile} from "../controller/Files.js";
import { createHash } from '../controller/Hash.js';

const input = express.Router();

input.post("/links", createLink);

input.post("/files", createFile);

input.post("/hash", createHash);

export default input;