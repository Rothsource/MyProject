import { link_input, url_detection } from "./request.js";  
import crypto from 'crypto';

async function inputlinks(ask) {
    const input = (await ask("Enter URL: ")).trim();
    const hash = crypto.createHash('sha256').update(input, 'utf8').digest('hex');
    
    try {
        const result = await link_input(input, hash, null); 
        
        const detection = await url_detection(hash, null, result.link_id); 
        console.log('\n');
        console.log('====================================\n');
        console.log('Detection label:', detection.label); 
        console.log('\n====================================');
        console.log('\n');
    } catch (error) {
        
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            console.error('Authentication failed. Please login first.');
        } else {
            console.error('Error in inputlinks:', error);
        }
    }
}

export default inputlinks;