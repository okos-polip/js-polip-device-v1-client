export const POLIP_DEVICE_INGEST_SERVER_ADDRESS: string;
export const POLIP_DEVICE_INGEST_SERVER_HTTP_PORT: number;
export const POLIP_DEVICE_INGEST_SERVER_HTTPS_PORT: number;
export const POLIP_DEVICE_INGEST_SERVER_URL: string;
export const POLIP_DEVICE_INGEST_SERVER_URL_SECURE: string;
export const POLIP_DEFAULT_POLL_STATE_PERIOD: number;
export const POLIP_DEFAULT_PUSH_SENSE_PERIOD: number;
export const POLIP_AWAIT_SERVER_OK_RECHECK_PERIOD: number;
export const POLIP_DEFAULT_ROLLOVER: number;
export declare enum PolipRPCStatusEnum {
    PENDING = "pending",
    SUCCESS = "success",
    FAILURE = "failure",
    REJECTED = "rejected",
    ACKNOWLEDGED = "acknowledged",
    CANCELED = "canceled"
}