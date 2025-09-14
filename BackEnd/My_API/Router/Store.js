import express from 'express';
import { store_url } from "../controller/Store_BadUrls.js";
import { store_files } from '../controller/Store_BadFiles.js';

const store = express.Router();

store.post("/url", store_url);

store.post("/file", store_files)

export default store;