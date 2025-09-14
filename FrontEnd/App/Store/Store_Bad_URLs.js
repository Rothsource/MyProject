import fs from "fs";
import crypto from "crypto";
import url_upload from "./request.js";

async function importUrls(links) {
    const hash = crypto.createHash('sha256').update(links, 'utf8').digest('hex');
    url_upload(links,hash);
}

export default importUrls;