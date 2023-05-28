// Fixed device ingest server DNS name 
const POLIP_DEVICE_INGEST_SERVER_ADDRESS = "api.okospolip.com";

// Unsecure HTTP port
const POLIP_DEVICE_INGEST_SERVER_HTTP_PORT = 3021;

// Secure HTTPS port
const POLIP_DEVICE_INGEST_SERVER_HTTPS_PORT = 3022;

// ingest URL unsecure (use only if state data is not sensitive)
const POLIP_DEVICE_INGEST_SERVER_URL = `http://${POLIP_DEVICE_INGEST_SERVER_ADDRESS}:${POLIP_DEVICE_INGEST_SERVER_HTTP_PORT}`;

// ingest URL secure
const POLIP_DEVICE_INGEST_SERVER_URL_SECURE = `https://${POLIP_DEVICE_INGEST_SERVER_ADDRESS}:${POLIP_DEVICE_INGEST_SERVER_HTTPS_PORT}`;

// Periodic poll of server device state
const POLIP_DEFAULT_POLL_STATE_PERIOD = 1000;

// Periodic push of device sensors
const POLIP_DEFAULT_PUSH_SENSE_PERIOD = 1000;

// Periodic check of server okay on initialization
const POLIP_AWAIT_SERVER_OK_RECHECK_PERIOD = 500;

// 32-bit rollover
const POLIP_DEFAULT_ROLLOVER = Math.pow(2, 32);

// Enum values for RPC status
const PolipRPCStatusEnum = {
    PENDING: "pending",
    SUCCESS: "success",
    FAILURE: "failure",
    REJECTED: "rejected",
    ACKNOWLEDGED: "acknowledged",
    CANCELED: "canceled"
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
    POLIP_DEFAULT_ROLLOVER,
    PolipRPCStatusEnum
};