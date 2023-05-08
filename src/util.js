const { getVerboseDebug } = require('./verbose');
const { POLIP_AWAIT_SERVER_OK_RECHECK_PERIOD } = require('./const');
const CryptoJS = require('crypto-js');

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
    
    string = `v${major}.${minor}.${patch}`;

    if (getVerboseDebug()) {
        console.log(`Formatting Version: ${string}`);
    }

    return string;
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
        if (getVerboseDebug()) {
            console.log("Connecting to Okos Polip Device Ingest Service");
        }

        let count = 0;

        const _checkServerStatus = async () => {
            let status;

            try {
                status = await device.checkServerStatus();
            } catch (e) {
                if (getVerboseDebug()) {
                    console.log(e);
                }

                status = false;
            }

            if (status) {
                if (getVerboseDebug()) {
                    console.log("Connected");
                }

                if (cb) {
                    cb();
                }
                resolve();
            } else if (numRetries && count >= numRetries) {
                if (getVerboseDebug()) {
                    console.log("Failed. Exceeded number of retries.");
                }

                reject("Number of retries exceeded");
            } else {
                count = count + 1;

                if (getVerboseDebug()) {
                    console.log("Failed to connect. Retrying...");
                }

                setTimeout(_checkServerStatus, POLIP_AWAIT_SERVER_OK_RECHECK_PERIOD);
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
    const now = new Date();
    const string = now.toISOString();

    if (getVerboseDebug()) {
        console.log(`Creating Timestamp: ${string}`);
    }

    return string;
}

/**
 * Generates an HMAC parsable by device ingest server
 * @param {*} payloadStr string version of json payload to send. 'tag' key must have value '0'
 * @param {*} clientKey string hex-encoded client key tied to specific device
 * @returns HMAC as a hex-encoded string
 */
async function createTag(payloadStr, clientKey) {
    const hashBuffer = CryptoJS.HmacSHA256(payloadStr, clientKey);
    const hashHex = hashBuffer.toString(CryptoJS.enc.Hex);

    if (getVerboseDebug()) {
        console.log(`Creating Tag: ${payloadStr}, ${clientKey} -> ${hashHex}`);
    }
 
    return hashHex;
}

/**
 * If device value gets out of sync with server, this handler will perform a single
 * resync-retry on callback.
 * @param {*} cb operation to run with value sync retry
 * @param {*} retry flag for recursion
 * @returns result from cb return
 */
const valueRetryHandler = async (device, cb, retry = true) => {
    let res = null;

    try {
        res = await cb();
    } catch (e) {
        if (e.response && e.response.data == 'value invalid') {
            const ack = await device.getValue();

            if (getVerboseDebug()) {
                console.log('getValue()', ack);
            }

            if (retry) {
                res = valueRetryHandler(device, cb, false);
            } else {
                throw new Error('Number of retries exceeded');
            }
            
        } else {
            throw e;
        }
    }

    return res;
}

module.exports = {
    formatVersion,
    blockAwaitServerOk,
    createTimestamp,
    createTag,
    valueRetryHandler
};