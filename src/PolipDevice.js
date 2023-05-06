const axios = require('axios');
const { getVerboseDebug } = require('./verbose');
const { createTimestamp, createTag } = require('./util');
const { POLIP_DEVICE_INGEST_SERVER_URL_SECURE } = require('./const');

/**
 * Defines all necessary meta-data to establish communication with server
 * Application code must setup all strings / parameters according to spec 
 * in Okos Polip database
 */
class PolipDevice {
    constructor(
        serial = null, 
        key = null,
        hardware = null, 
        firmware = null,
        rollover = null,
        url = POLIP_DEVICE_INGEST_SERVER_URL_SECURE,
        value = 0, 
        skipTagCheck = false, 
    ) {
        this.serial = serial;               // Serial identifier unique to this device
        this.key = key;                     // Revocable key used for tag gen
        this.hardware = hardware;           // Hardware version to report to server
        this.firmware = firmware;           // Firmware version to report to server
        this.rollover = rollover;           // Defines integer rollover (for fixed width devices)
        this.url = url;                     // Ingest URL (by default set to secure fixed api name)
        this.value = value;                 // Incremented value for next transmission id
        this.skipTagCheck = skipTagCheck;   // Set true if key -> tag gen not needed
    }

    /**
     * GET request to status endpoint
     * @returns true if reaches end of function else throws error
     */
    async checkServerStatus() {
        try {
            const response = await axios.get(this.url + "/api/v1/");
            if (response.status !== 200) {
                throw new Error('Server returned non-200 status code');
            }
        } catch (error) {
            throw new Error('Failed to check server status: ' + error.message);
        }

        return true;
    }

    /**
     * POST poll request
     * 
     * Requests data from server according to the query param list provided
     * 
     * This call will perform request tag generation (if device configured) and
     * response tag match (if device configured). Will throw errors if
     *  - server fails to communicate (axios error)
     *  - value invalid (polip protocol error)
     *  - tag match fail (most likely key / tag check settings mismatch)
     * 
     * When a value error is encountered, need to call getValue() to refresh.
     * Then recall this method.
     * 
     * @param {*} state boolean flag to retrieve device state data
     * @param {*} meta boolean flag to retrieve device meta data
     * @param {*} sensors boolean flag to retrieve sensor meta data
     * @param {*} rpc boolean flag to retrieve pending RPCs list
     * @param {*} manufacturer boolean flag to retrieve manufacturer defined data
     * @returns fully formed response JSON data with requested data from server
     */
    async getState(state = true, meta = false, sensors = false, rpc = false, manufacturer = false) {

        const params = new URLSearchParams({
            meta: !!meta,
            state: !!state,
            sensors: !!sensors,
            rpc: !!rpc,
            manufacturer: !!manufacturer
        }).toString();

        const res = await this._requestTemplate(
            this.url + '/api/v1/device/poll?' + params, 
            {}
        );

        if (getVerboseDebug()) {
            console.log(res);
        }
        
        return res;
    }

    /**
     * Wrapper on getState for passing in a single params object instead of listing parameters
     * @param {state, meta, sensors, rpc, manufacturer} params key:value
     * @returns result of device.getState()
     */
    async getStateByParam({ state, meta, sensors, rpc, manufacturer }) {
        return this.getState(state, meta, sensors, rpc, manufacturer);
    }

    /**
     * POST push state request
     * 
     * Pushes state data to server. State should be compliant with schema for
     * device.
     * 
     * This call will perform request tag generation (if device configured) and
     * response tag match (if device configured). Will throw errors if
     *  - server fails to communicate (axios error)
     *  - value invalid (polip protocol error)
     *  - tag match fail (most likely key / tag check settings mismatch)
     * 
     * When a value error is encountered, need to call getValue() to refresh.
     * Then recall this method.
     * 
     * @param {} stateObj object with properly formated state representation 
     * @returns fully formed response JSON data - acknowledgement
     */
    async pushState(stateObj) {
        if (typeof stateObj !== 'object' && stateObj === null) {
            throw new Error('Invalid parameterization: sensor object must be provided');
        }

        const res = this._requestTemplate(
            this.url + "/api/v1/device/push",
            { state: stateObj }
        );

        if (getVerboseDebug()) {
            console.log(res);
        }

        return res;
    }

    /**
     * Wrapper around push error for notification messages (errorCode = 0)
     * @param {*} message string message to be provided with error - should be human readable
     */
    async pushNotification(message) {
        return this.pushError(message, 0);
    }

    /**
     * POST push error (and notification) request
     * 
     * Pushes a message to the server (message will be treated as an urgent request 
     * unlike state update). Up to user code to make use of this feature.
     * 
     * This call will perform request tag generation (if device configured) and
     * response tag match (if device configured). Will throw errors if
     *  - server fails to communicate (axios error)
     *  - value invalid (polip protocol error)
     *  - tag match fail (most likely key / tag check settings mismatch)
     * 
     * When a value error is encountered, need to call getValue() to refresh.
     * Then recall this method.
     * 
     * @param {*} message string message to be provided with error - should be human readable
     * @param {*} errorCode integer code (as defined by the error semantic tables / descriptions)
     * @returns fully formed response JSON data - acknowledgement
     */
    async pushError(message, errorCode) {
        message = String(message);
        errorCode = parseInt(errorCode);
    
        const res = await this._requestTemplate(
            this.url + "/api/v1/device/error",
            { code: errorCode, message: message }
        );

        if (getVerboseDebug()) {
            console.log(res);
        }

        return res;
    }

    /**
     * POST request push sensors
     * 
     * Pushes sensor data to server
     * 
     * This call will perform request tag generation (if device configured) and
     * response tag match (if device configured). Will throw errors if
     *  - server fails to communicate (axios error)
     *  - value invalid (polip protocol error)
     *  - tag match fail (most likely key / tag check settings mismatch)
     * 
     * When a value error is encountered, need to call getValue() to refresh.
     * Then recall this method.
     * 
     * @param {*} sensorsObj key-value pair of subset of valid sensor keys 
     *                       (list provided in poll-sensors / schema)
     * @returns fully formed response JSON data - acknowledgement
     */
    async pushSensors(sensorsObj) {
        if (typeof sensorsObj !== 'object' && sensorsObj === null) {
            throw new Error('Invalid parameterization: sensor object must be provided');
        }
    
        const res = await this._requestTemplate(
            this.url + "/api/v1/device/sense",
            { sense: sensorsObj }
        );

        if (getVerboseDebug()) {
            console.log(res);
        }
    
        return res;
    }

    /**
     * POST request get value
     * 
     * This method should be called when a value mismatch occurs and/or at startup
     * 
     * This method does not follow normal value update rules (instead sets internal
     * device value to the response value). This method does not perform tag checks
     * 
     * Will throw error only if axios error or server encounters error
     * 
     * @returns fully formed response JSON data - acknowledgement
     */
    async getValue() {
        const res = await this._requestTemplate(
            this.url + "/api/v1/device/value",
            {}, 
            true, // skip value in request pack 
            true  // skip tag in request pack, response check
        );
    
        this.value = res.value;

        if (getVerboseDebug()) {
            console.log(res);
        }
        
        return res;
    }

    /**
     * POST request push completed RPC
     * 
     * Called when RPC is finished on device and needs to report state to server
     * 
     * This call will perform request tag generation (if device configured) and
     * response tag match (if device configured). Will throw errors if
     *  - server fails to communicate (axios error)
     *  - value invalid (polip protocol error)
     *  - tag match fail (most likely key / tag check settings mismatch)
     * 
     * When a value error is encountered, need to call getValue() to refresh.
     * Then recall this method.
     * 
     * @param {uuid, result} rpcObj object with uuid as identifier string from poll
     *                       and result as string with arbitrary form
     * @returns fully formed response JSON data - acknowledgement
     */
    async pushRPC(rpcObj) {
        if (rpcObj.uuid === undefined || rpcObj.uuid === null) {
            throw new Error('Invalid parameterization: RPC must have uuid');
        } else if (rpcObj.result === undefined ||rpcObj.result === null) {
            throw new Error('Invalid parameterization: RPC must have result');
        }

        const res = await this._requestTemplate( 
            this.url + "/api/v1/device/rpc",
            { rpc: rpcObj }
        );

        if (getVerboseDebug()) {
            console.log(res);
        }

        return res;
    }

    /**
     * POST request schema
     * 
     * This call will perform request tag generation (if device configured) and
     * response tag match (if device configured). Will throw errors if
     *  - server fails to communicate (axios error)
     *  - value invalid (polip protocol error)
     *  - tag match fail (most likely key / tag check settings mismatch)
     * 
     * When a value error is encountered, need to call getValue() to refresh.
     * Then recall this method.
     * 
     * @returns fully formed response JSON data - schema for device, state, 
     *          sensor, and rpc key tables
     */
    async getSchema() {
        const res = await this._requestTemplate(
            this.url + '/api/v1/device/schema', 
            {}
        );

        if (getVerboseDebug()) {
            console.log(res);
        }

        return res;
    } //NOTE: we should use the getSchema() method to drive UI composition?

    /**
     * POST Requests error semantic description and range
     * 
     * If code not supplied provides all specific code semantics and 
     * error code ranges. However if a code is valid, provides single
     * description and single range for that code.
     * 
     * This call will perform request tag generation (if device configured) and
     * response tag match (if device configured). Will throw errors if
     *  - server fails to communicate (axios error)
     *  - value invalid (polip protocol error)
     *  - tag match fail (most likely key / tag check settings mismatch)
     * 
     * When a value error is encountered, need to call getValue() to refresh.
     * Then recall this method.
     * 
     * @param {*} code integer error code to be looked up (optional)
     * @returns fully formed response JSON data - range table and descriptions
     */
    async getErrorSemantic(code) {
        let params = (code !== undefined) ? `?code=${code}` : '';

        const res = await this._requestTemplate(
            this.url + '/api/v1/device/error/semantic' + params, 
            {}
        );

        if (getVerboseDebug()) {
            console.log(res);
        }

        return res;
    }

    /**
     * Private utility method
     * 
     * This method packs request per polip protocol, generates tag (if device configured),
     * POSTs to endpoint, performs tag match on response (if device configured), and 
     * increments value (with rollover if configured).
     * 
     * Throws errror if
     *  - axios communication error with server
     *  - server returns status != 200
     *      - value mismatch error if specifically indicated
     * 
     * @param {*} endpoint valid URI for okospolip
     * @param {*} reqObj request object with proper parameters filled in. Default empty
     * @param {*} skipValue override value inclusion in request / update on response
     * @param {*} skipTag override adding tag in request / tag check in response
     * @returns response data object from server - tag validated
     */
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
                if (getVerboseDebug()) {
                    console.log(`Value invalid error detected - recommending to call device.getValue()`);
                }

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
                if (getVerboseDebug()) {
                    console.log(`Tag match error detected: Old = ${oldTag}, New = ${response.data.tag }`);
                }
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