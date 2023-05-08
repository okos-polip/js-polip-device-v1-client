const CryptoJS = require('crypto-js');
const crypto = require('crypto').webcrypto;

async function createTagViaNodeCrypto(payloadStr, clientKey) {
    const enc = new TextEncoder("utf-8");
    const algorithm = { name: "HMAC", hash: "SHA-256" };
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(clientKey),
        algorithm,
        false, ["sign", "verify"]
    );

    const hashBuffer = await crypto.subtle.sign(
        algorithm.name, 
        key, 
        enc.encode(payloadStr)
    );

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(
        b => b.toString(16).padStart(2, '0')
    ).join('');

    return hashHex;
}

async function createTagViaCryptoJS(payloadStr, clientKey) {
    const hashBuffer = CryptoJS.HmacSHA256(payloadStr, clientKey);
    const hashHex = hashBuffer.toString(CryptoJS.enc.Hex);
    return hashHex;
}

async function main() {
    const payload = {
        serial: 1,
        timestamp: (new Date()).toISOString(),
        data: "this is some data",
        tag: "0"
    };

    const key = "revocable-key-0";

    tag1 = await createTagViaNodeCrypto(JSON.stringify(payload), key);
    tag2 = await createTagViaCryptoJS(JSON.stringify(payload), key);

    console.log("Tag1 =", tag1);
    console.log("Tag2 =", tag2);
}

main();