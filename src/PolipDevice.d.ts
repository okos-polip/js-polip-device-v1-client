export interface CommunicationObjectResponse {
    status: number;
    data: any;
}

export interface CommunicationObject {
    get: (url: string) => Promise<CommunicationObjectResponse>;
    post: (url: string, payload: any) => Promise<CommunicationObjectResponse>;
}

export interface GetStateParams {
    state?: boolean;
    meta?: boolean;
    sensors?: boolean;
    rpc?: boolean;
    manufacturer?: boolean;
}

export interface RPCReturnObject {
    uuid: string;
    result: string;
}

export interface PolipResponseAck {
    serial: string;
    timestamp: string;
    hardware: string;
    firmware: string;
    value: number;
    tag: string;
}

export interface SensorMetaData {
    sensorId: string;
    units: string;
    types: string[];
    name: string;
    description: string;
}

export interface RPCRequestObject {
    uuid: string;
    type: string;
    parameters: undefined | null | object;
}

export interface PolipResponsePoll {
    serial: string;
    timestamp: string;
    hardware: string;
    firmware: string;
    value: number;
    tag: string;
    state: undefined | object;
    type: undefined | string;
    typeName: undefined | string;
    skipTagCheck: undefined | boolean;
    rollover: undefined | number | null;
    manufacturer: undefined | string;
    name: undefined | string;
    description: undefined | string;
    sensors: undefined | {
        [string]: SensorMetaData
    };
    manufacturerData: undefined | null | object;
    pendingRpcs: undefined | RPCRequestObject[];
}

export interface PolipResponseSchema {
    serial: string;
    timestamp: string;
    hardware: string;
    firmware: string;
    value: number;
    tag: string;
    schema: {
        deviceSchema: object;
        stateSchema: object;
        rpcParametersByType: object;
        sensorsBySensorId: object;
    }
}

export interface ErrorRangeEntry {
    min: number | null;
    max: number | null;
    description: string;
}

interface SemanticRangesAndDescriptions {
    descriptions: {
        [key: string]: string;
    };
    ranges: ErrorRangeEntry[];
}

interface SemanticRangeAndDescription {
    description: string;
    range: ErrorRangeEntry;
}

export interface PolipResponseSemantic {
    serial: string;
    timestamp: string;
    hardware: string;
    firmware: string;
    value: number;
    tag: string;
    semantic: SemanticRangesAndDescriptions | SemanticRangeAndDescription;
}

export class PolipDevice {
    constructor(
        commObj: CommunicationObject,
        serial: string,
        key: string,
        hardware: string,
        firmware: string,
        rollover?: number | null,
        url?: string,
        value?: number,
        skipTagCheck?: boolean
    );
    serial: string;
    key: string;
    hardware: string;
    firmware: string;
    rollover: number | null;
    url: string;
    value: number;
    skipTagCheck: boolean;
    checkServerStatus(): Promise<boolean>;
    getState(
        state?: boolean,
        meta?: boolean,
        sensors?: boolean,
        rpc?: boolean,
        manufacturer?: boolean
    ): Promise<PolipResponsePoll>;
    getStateByParam(params: GetStateParams): Promise<PolipResponsePoll>;
    pushState(stateObj: object): Promise<PolipResponseAck>;
    pushNotification(message: string): Promise<PolipResponseAck>;
    pushError(message: string, errorCode: number): Promise<PolipResponseAck>;
    pushSensors(sensorsObj: object): Promise<PolipResponseAck>;
    getValue(): Promise<PolipResponseAck>;
    pushRPC(rpcObj: RPCReturnObject): Promise<PolipResponseAck>;
    getSchema(): Promise<PolipResponseSchema>;
    getErrorSemantic(code?: number): Promise<PolipResponseSemantic>;
}

export default PolipDevice;