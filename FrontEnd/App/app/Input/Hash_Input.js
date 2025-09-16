import { Hash_Detection } from "./request.js";
import { hash_input } from "./request.js";

async function inputhash(hash) {
    const input = hash.trim();

    const input_hash = await hash_input(input);

    const detect = await Hash_Detection(input, input_hash.inputId);

    if(!detect.label){
        console.log("No Label!");
    }
    
    return detect;
}

export default inputhash;

