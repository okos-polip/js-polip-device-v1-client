const axios = require('axios');
const { createTimestamp, createTag } = require('./util');
const { POLIP_DEVICE_INGEST_SERVER_URL_SECURE } = require('./const');

/**
 * Defines all necessary meta-data to establish communication with server
 * Application code must setup all strings / parameters according to spec 
 * in Okos Polip database
 */
class PolipDevice {
    constructor(
        url = POLIP_DEVICE_INGEST_SERVER_URL_SECURE,
        value = 0, 
        skipTagCheck = false, 
        serial = null, 
        key = null,
        hardware = null, 
        firmware = null,
        rollover = null
    ) {
        this.url = url;
        this.value = value;             // Incremented value for next transmission id
        this.skipTagCheck = skipTagCheck; // Set true if key -> tag gen not needed
        this.serial = serial;     // Serial identifier unique to this device
        this.key = key;           // Revocable key used for tag gen
        this.hardware = hardware; // Hardware version to report to server
        this.firmware = firmware; // Firmware version to report to server
        this.rollover = rollover;
    }

    async checkServerStatus() {
        try {
            const response = await axios.get(this.url + "/api/v1/");
            if (response.status !== 200) {
                throw new Error('Server returned non-200 status code');
            }
        } catch (error) {
            throw new Error('Failed to check server status: ' + error.message);
        }
    }

    async getState(state = true, meta = false, sensors = false, rpc = false, manufacturer = false) {

        const params = new URLSearchParams({
            meta: meta,
            state: state,
            sensors: sensors,
            rpc: rpc,
            manufacturer: manufacturer
        }).toString();

        const res = await this._requestTemplate(
            this.url + '/api/v1/device/poll?' + params, 
            {}
        );

        console.log(res);

        return res;
    }

    async pushState(stateObj) {
        if (typeof stateObj !== 'object' && stateObj === null) {
            throw new Error('Invalid parameterization: sensor object must be provided');
        }

        const res = this._requestTemplate(
            this.url + "/api/v1/device/push",
            { state: stateObj }
        );

        console.log(res);

        return res;
    }

    async pushNotification(message) {
        this.pushError(message, 0);
    }

    async pushError(message, errorCode) {
        message = String(message);
        errorCode = parseInt(errorCode);
    
        const res = await this._requestTemplate(
            this.url + "/api/v1/device/error",
            { code: errorCode, message: message }
        );

        console.log(res)

        return res;
    }

    async pushSensors(sensorsObj) {
        if (typeof sensorsObj !== 'object' && sensorsObj === null) {
            throw new Error('Invalid parameterization: sensor object must be provided');
        }
    
        const res = await _requestTemplate(
            this.url + "/api/v1/device/sense",
            { sense: sensorsObj }
        );
    
        return res;
    }

    async getValue() {
        const res = await _requestTemplate(
            this.url + "/api/v1/device/value",
            {}, 
            true, // skip value in request pack 
            true  // skip tag in request pack, response check
        );
    
        this.value = res.value;

        console.log(res);
        
        return res;
    }

    async pushRPC(rpcObj) {
        if (rpcObj.uuid === undefined || rpcObj.uuid === null) {
            throw new Error('Invalid parameterization: RPC must have uuid');
        } else if (rpcObj.result === undefined ||rpcObj.result === null) {
            throw new Error('Invalid parameterization: RPC must have result');
        }

        const res = await _requestTemplate( 
            this.url + "/api/v1/device/rpc",
            { rpc: rpcObj }
        );

        console.log(res);

        return res;
    }

    async getSchema() {
        const res = await this._requestTemplate(
            this.url + '/api/v1/device/schema', 
            {}
        );

        console.log(res);

        return res;
    }

    async getErrorSemantic(code) {
        let params = (code !== undefined) ? `?code=${code}` : '';

        const res = await this._requestTemplate(
            this.url + '/api/v1/device/error/semantic' + params, 
            {}
        );

        console.log(res);

        return res;
    }

    async _requestTemplate(endpoint, reqObj = {}, skipValue = false, skipTag = false) {
        reqObj.serial = this.serial;
        reqObj.firmware = this.firmware;
        reqObj.hardware = this.hardware;
        reqObj.timestamp = createTimestamp();

        if (!skipValue) {
            reqObj.value = this.value;
        }

        if (!skipTag) {
            reqObj.tag = '0';
            if (!this.skipTagCheck) {
                reqObj.tag = await createTag(JSON.stringify(reqObj), this.key);
            }
        }

        const response = await axios.post(endpoint, reqObj);

        if (response.status !== 200) {
            if (response.data === 'value invalid') {
                throw new Error('Value invalid');
            } else {
                throw new Error('Server error');
            }
        }

        if (!skipTag && !this.skipTagCheck) {
            const oldTag = response.data.tag;
            response.data.tag = '0';
            response.data.tag = await createTag(JSON.stringify(response.data), this.key);
            if (oldTag !== response.data.tag) {
                throw new Error('Tag match failed');
            }
        }

        if (!skipValue) {
            this.value += 1;
            if (this.rollover !== null && this.value >= this.rollover) {
                this.value = 0;
            }
        }

        return response.data;
    }
};


module.exports = PolipDevice;