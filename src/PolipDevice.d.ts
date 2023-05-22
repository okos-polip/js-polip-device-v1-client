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

export interface Metadata {
	type: string | undefined;
    typeName: undefined | string;
	name: string | undefined;
	description: string | undefined;
	rollover: number | null | undefined;
	skipTagCheck: boolean | undefined;
	manufacturer: string | undefined;
}

export interface PolipResponsePoll extends PolipResponseAck, Metadata {
    state: undefined | object;
    sensors: undefined | {
        [key: string]: SensorMetaData
    };
    manufacturerData: undefined | null | object;
    pendingRpcs: undefined | RPCRequestObject[];
}

export interface FullSchema {
    deviceSchema: object;
    stateSchema: object;
    rpcParametersByType: object;
    sensorsBySensorId: object;
}

export interface PolipResponseSchema extends PolipResponseAck  {
    schema: FullSchema
}

export interface ErrorRangeEntry {
    min: number | null;
    max: number | null;
    description: string;
}

export interface SemanticRangesAndDescriptions {
    descriptions: {
        [key: string]: string;
    };
    ranges: ErrorRangeEntry[];
}

export interface SemanticRangeAndDescription {
    description: string;
    range: ErrorRangeEntry;
}

export interface PolipResponseSemantic extends PolipResponseAck {
    semantic: SemanticRangesAndDescriptions | SemanticRangeAndDescription;
}

export interface PolipDeviceStateExport {
    serial: string;
    key: string;
    hardware: string;
    firmware: string;
    rollover: number | null;
    url: string;
    value: number;
    skipTagCheck: boolean;
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
    pushNotification(message: string, userVisible?: boolean): Promise<PolipResponseAck>;
    pushError(message: string, errorCode: number, userVisible?: boolean): Promise<PolipResponseAck>;
    pushSensors(sensorsObj: object): Promise<PolipResponseAck>;
    getValue(): Promise<PolipResponseAck>;
    pushRPC(rpcObj: RPCReturnObject): Promise<PolipResponseAck>;
    getSchema(): Promise<PolipResponseSchema>;
    getErrorSemantic(code?: number): Promise<PolipResponseSemantic>;
    static constructFromState(commObj: CommunicationObject, state: PolipDeviceStateExport): PolipDevice;
    importFromState(state: PolipDeviceStateExport): void;
    exportToState(): PolipDeviceStateExport;
}

export default PolipDevice;