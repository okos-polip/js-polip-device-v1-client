//! Fixed device ingest server URL 
const POLIP_DEVICE_INGEST_SERVER_ADDRESS = "api.okospolip.com";
const POLIP_DEVICE_INGEST_SERVER_HTTP_PORT = 3021;
const POLIP_DEVICE_INGEST_SERVER_HTTPS_PORT = 3022;

const POLIP_DEVICE_INGEST_SERVER_URL = `http://${POLIP_DEVICE_INGEST_SERVER_ADDRESS}:${POLIP_DEVICE_INGEST_SERVER_HTTP_PORT}`;
const POLIP_DEVICE_INGEST_SERVER_URL_SECURE = `https://${POLIP_DEVICE_INGEST_SERVER_ADDRESS}:${POLIP_DEVICE_INGEST_SERVER_HTTPS_PORT}`;

//! Periodic poll of server device state
const POLIP_DEFAULT_POLL_STATE_PERIOD = 1000;

//! Periodic push of device sensors
const POLIP_DEFAULT_PUSH_SENSE_PERIOD = 1000;

//! Periodic check of server okay on initialization
const POLIP_AWAIT_SERVER_OK_RECHECK_PERIOD = 500;

// Errors generated during polip function operation (comprehensive)
// Not all routines will generate all errors.
class PolipError {
    static OK = 0;
    static ERROR_TAG_MISMATCH = 1;
    static ERROR_VALUE_MISMATCH = 2;
    static ERROR_RESPONSE_DESERIALIZATION = 3;
    static ERROR_SERVER_ERROR = 4;
    static ERROR_LIB_REQUEST = 5;
    static ERROR_WORKFLOW = 6;
};

module.exports = {
    POLIP_DEVICE_INGEST_SERVER_ADDRESS,
    POLIP_DEVICE_INGEST_SERVER_HTTP_PORT,
    POLIP_DEVICE_INGEST_SERVER_HTTPS_PORT,
    POLIP_DEVICE_INGEST_SERVER_URL,
    POLIP_DEVICE_INGEST_SERVER_URL_SECURE,
    POLIP_DEFAULT_POLL_STATE_PERIOD,
    POLIP_DEFAULT_PUSH_SENSE_PERIOD,
    POLIP_AWAIT_SERVER_OK_RECHECK_PERIOD,
    PolipError
};