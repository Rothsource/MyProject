const { rejects } = require('assert');
const crypto = require('crypto');
const fs = require('fs');
import path from "path";
const { resolve } = require('path');

function hashMd5(filePath) {
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

function hashSha1(filePath) {
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

function hashSha256(filePath) {
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

function hashSha512(filePath) {
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
function filename(filePath){
    return new Promise((resolve, reject) => {
        path.basename(filePath);
    })
}

// Export functions for use in other modules
module.exports = {
    hashMd5,
    hashSha1,
    hashSha256,
    hashSha512,
    filename
};