const { getVerboseDebug } = require('./verbose');
const { createTimestamp, createTag, valueRetryHandler } = require('./util');
const { POLIP_DEVICE_INGEST_SERVER_URL_SECURE } = require('./const');

/**
 * Defines all necessary meta-data to establish communication with server
 * Application code must setup all strings / parameters according to spec 
 * in Okos Polip database
 */
class PolipDevice {
    constructor(
        commObj,
        serial, 
        key,
        hardware, 
        firmware,
        rollover = null,
        url = POLIP_DEVICE_INGEST_SERVER_URL_SECURE,
        value = 0, 
        skipTagCheck = false
    ) {
        this._commObj = commObj;            // External comm object (wrapper for various HTTP clients)
        this.serial = serial;               // Serial identifier unique to this device
        this.key = key;                     // Revocable key used for tag gen
        this.hardware = hardware;           // Hardware version to report to server
        this.firmware = firmware;           // Firmware version to report to server
        this.rollover = rollover;           // Defines integer rollover (for fixed width devices)
        this.url = url;                     // Ingest URL (by default set to secure fixed api name)
        this.value = value;                 // Incremented value for next transmission id
        this.skipTagCheck = skipTagCheck;   // Set true if key -> tag gen not needed
    }

    get serial() {
        return this._serial;
    }

    set serial(value) {
        this._serial = value;
    }

    get key() {
        return this._key;
    }

    set key(value) {
        this._key = value;
    }

    get hardware() {
        return this._hardware;
    }

    set hardware(value) {
        this._hardware = value;
    }

    get firmware() {
        return this._firmware;
    }

    set firmware(value) {
        this._firmware = value;
    }

    get rollover() {
        return this._rollover;
    }

    set rollover(value) {
        this._rollover = value;
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    get skipTagCheck() {
        return this._skipTagCheck;
    }

    set skipTagCheck(value) {
        this._skipTagCheck = value;
    }

    /**
     * GET request to status endpoint
     * @returns true if reaches end of function else throws error
     */
    async checkServerStatus() {
        try {
            const response = await this._commObj.get(this.url + "/api/v1/");
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
     * @param {*} rpc boolean flag to retrieve pending RPCs list
     * @param {*} manufacturer boolean flag to retrieve manufacturer defined data
     * @returns fully formed response JSON data with requested data from server
     */
    async getState(state = false, rpc = false, manufacturer = false) {

        const params = new URLSearchParams({
            state: !!state,
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
     * POST meta request
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
     * @param {*} general boolean flag to retrieve general device metadata
     * @param {*} state boolean flag to retrieve state device metadata
     * @param {*} sensors boolean flag to retrieve sensor device metadata
     * @param {*} manufacturer boolean flag to retrieve manufacturer defined data
     * @returns fully formed response JSON data with requested data from server
     */
    async getMeta(general = false, state = false, sensors = false, manufacturer = false) {
        console.log('IN getMeta()', general, state, sensors, manufacturer);

        const params = new URLSearchParams({
            general: !!general,
            state: !!state,
            sensors: !!sensors,
            manufacturer: !!manufacturer
        }).toString();

        const res = await this._requestTemplate(
            this.url + '/api/v1/device/meta?' + params, 
            {}
        );

        if (getVerboseDebug()) {
            console.log(res);
        }
        
        return res;
    }

    /**
     * Wrapper on getState for passing in a single params object instead of listing parameters
     * @param {state, meta, sensors, rpc, manufacturer} params key:value booleans
     * @returns result of device.getState()
     */
    async getStateByParam(params) {
        const { state, rpc, manufacturer } = params;
        return this.getState(state, rpc, manufacturer);
    }

    /**
     * Wrapper on getMeta for passing in a single params object instead of listing parameters
     * @param {general, state, sensors, manufacturer} params key:value booleans
     * @returns result of device.getMeta()
     */
    async getMetaByParam(params) {
        console.log(params);
        const { general, state, sensors, manufacturer } = params;
        console.log('IN getMetaByParam', general, state, sensors, manufacturer);
        return this.getMeta(general, state, sensors, manufacturer);
    }

    /**
     * POST push (general) request
     * 
     * Pushes state, sense, and/or rpc data to server. Each should be compliant 
     * with their specific type schema.
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
     * @param {state, sense, rpc} params: objects with properly formated state representation 
     * @returns fully formed response JSON data - acknowledgement
     */
    async push({ state, sense, rpc }) {
        const res = await this._requestTemplate(
            this.url + "/api/v1/device/state",
            { state, sense, rpc }
        );

        if (getVerboseDebug()) {
            console.log(res);
        }

        return res;
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

        const res = await this._requestTemplate(
            this.url + "/api/v1/device/state",
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
     * @param {*} userVisible (optional default=true) boolean metadata that notification is renderable
     * @returns fully formed response JSON data - acknowledgement
     */
    async pushNotification(message, userVisible=true) {
        return this.pushError(message, 0, userVisible);
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
     * @param {*} userVisible (optional default=true) boolean metadata that notification is renderable
     * @returns fully formed response JSON data - acknowledgement
     */
    async pushError(message, errorCode, userVisible=true) {
        message = String(message);
        errorCode = parseInt(errorCode);
        userVisible = !!userVisible;
    
        const res = await this._requestTemplate(
            this.url + "/api/v1/device/error",
            { 
                code: errorCode, 
                message: message, 
                userVisible: userVisible 
            }
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

        const response = await this._commObj.post(endpoint, reqObj);
        if (response.status !== 200) {
            throw response;
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

    /**
     * Create a new polip object from an exported state type
     * 
     * Useful if Polip device is being serialized / converted to immutable state-management
     * 
     * @param {*} commObj linkage to desired HTTP comm object
     * @param {*} state settings to be imported on new polip device
     * @returns polip device instance
     */
    static constructFromState(commObj, state) {
        return new PolipDevice(
            commObj,
            state.serial,
            state.key,
            state.hardware,
            state.firmware,
            state.rollover,
            state.url,
            state.value,
            state.skipTagCheck
        );
    }

    /**
     * Updates this device with a previously exported / generated state
     * @param {*} state settings to be imported
     */
    importFromState(state) {
        this.serial = state.serial;
        this.key = state.key;
        this.hardware = state.hardware;
        this.firmware = state.firmware;
        this.rollover = state.rollover;
        this.url = state.url;
        this.value = state.value;
        this.skipTagCheck = state.skipTagCheck;
    }

    /**
     * @returns Exports current device state to a simple JS object
     */
    exportToState() {
        return {
            serial: this.serial,
            key: this.key,
            hardware: this.hardware,
            firmware: this.firmware,
            rollover: this.rollover,
            url: this.url,
            value: this.value,
            skipTagCheck: this.skipTagCheck
        };
    }
};


module.exports = PolipDevice;