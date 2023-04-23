/**
 * Standard format for hardware and firmware version strings 
 * @param {*} major integer
 * @param {*} minor integer
 * @param {*} patch integer
 * @returns version string
 */
function formatVersion(major, minor, patch) {
    major = parseInt(major);
    minor = parseInt(minor);
    patch = parseInt(patch);
    return `v${major}.${minor}.${patch}`;
}

/**
 * Waits for comms with device ingest server
 * @param {*} device device object with checkServerStatus hook
 * @param {*} cb on connection callback (optional - can just wait for promise to resolve)
 * @param {*} numRetries number of retries to attempt before failure (optional - undefined = infinite)
 * @returns Promise on connection, error on exceed numRetries
 */
function blockAwaitServerOk(device, cb, numRetries) {
    return new Promise((resolve, reject) => {
        console.log("Connecting to Okos Polip Device Ingest Service");

        let count = 0;

        const _checkServerStatus = async () => {
            if (POLIP_OK === await device.checkServerStatus()) {
                console.log("Connected");
                if (cb) {
                    cb();
                }
                resolve();
            } else if (numRetries && count >= numRetries) {
                reject("Number of retries exceeded");
            } else {
                count = count + 1;
                console.log("Failed to connect. Retrying...");
                setTimeout(_checkServerStatus, POLIP_AWAIT_SERVER_OK_DELAY);
            }
        };

        // Start the initial check of the server status
        _checkServerStatus(); 
    });
}

/**
 * Creates a timestamp for transactions
 * @returns date string
 */
function createTimestamp() {
    return + new Date();
}

/**
 * Generates an HMAC parsable by device ingest server
 * @param {*} payloadStr string version of json payload to send. 'tag' key must have value '0'
 * @param {*} clientKey string hex-encoded client key tied to specific device
 * @returns HMAC as a hex-encoded string
 */
async function createTag(payloadStr, clientKey) {
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

    // console.log("Creating Tag:");
    // console.log(payloadStr);
    // console.log(clientKey);
    // console.log(hashHex);

    return hashHex;
}

module.exports = {
    formatVersion,
    blockAwaitServerOk,
    createTimestamp,
    createTag
};