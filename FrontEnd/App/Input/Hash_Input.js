// Fixed client-side code (inputhash.js)
import { Hash_Detection } from "./request.js";
import login from "../Account/Login.js";
import { hash_input } from "./request.js";

async function inputhash(ask) {
    const loginResult = await login(ask);
    if (!loginResult.success) {
        console.log("Authentication failed. Cannot proceed with link input.");
        return;
    }

    const input = (await ask("Enter Hash: ")).trim();

    const input_hash = await hash_input(input, loginResult.userid );
    
    const detect = await Hash_Detection(input, loginResult.userid, input_hash.inputId);

    console.log("\n========================================");
    console.log(`\n${detect.label}`); 
    console.log("\n========================================");
}

export default inputhash;