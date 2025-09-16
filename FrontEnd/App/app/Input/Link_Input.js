import { link_input, url_detection } from "./request.js";
import * as Crypto from 'expo-crypto';

async function inputlinks(url) {
    const input = url.trim(); // use the passed URL

    // Use expo-crypto to hash
    const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256, 
        input,
        { encoding: Crypto.CryptoEncoding.HEX } 
    );

    try {
        const result = await link_input(input, hash);

        const detection = await url_detection(hash, result.link_id);
        // console.log('\n');
        // console.log('====================================\n');
        // console.log('Detection label:', detection.label);
        // console.log('\n====================================');
        // console.log('\n');

        return detection.label;
    } catch (error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            console.error('Authentication failed. Please login first.');
        } else {
            console.error('Error in inputlinks:', error);
        }
    }
}

export default inputlinks;
