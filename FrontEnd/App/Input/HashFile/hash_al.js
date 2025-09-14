import crypto from "crypto";
import fs from "fs";

export function hashMd5(filePath) {
    return new Promise((resolve, reject) => {
        const hasher = crypto.createHash('md5');
        const stream = fs.createReadStream(filePath);
        
        stream.on('data', chunk => {
            hasher.update(chunk);
        });
        
        stream.on('end', () => {
            resolve(hasher.digest('hex'));
        });
        
        stream.on('error', reject);
    });
}

export function hashSha1(filePath) {
    return new Promise((resolve, reject) => {
        const hasher = crypto.createHash('sha1');
        const stream = fs.createReadStream(filePath);
        
        stream.on('data', chunk => {
            hasher.update(chunk);
        });
        
        stream.on('end', () => {
            resolve(hasher.digest('hex'));
        });
        
        stream.on('error', reject);
    });
}

export function hashSha256(filePath) {
    return new Promise((resolve, reject) => {
        const hasher = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        
        stream.on('data', chunk => {
            hasher.update(chunk);
        });
        
        stream.on('end', () => {
            resolve(hasher.digest('hex'));
        });
        
        stream.on('error', reject);
    });
}

export function hashSha512(filePath) {
    return new Promise((resolve, reject) => {
        const hasher = crypto.createHash('sha512');
        const stream = fs.createReadStream(filePath);
        
        stream.on('data', chunk => {
            hasher.update(chunk);
        });
        
        stream.on('end', () => {
            resolve(hasher.digest('hex'));
        });
        
        stream.on('error', reject);
    });
}
