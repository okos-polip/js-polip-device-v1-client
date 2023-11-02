import { PolipRPCStatusEnum } from "./const";
import { CoreSemantic } from "./semantic";

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
    rpc?: boolean;
    manufacturer?: boolean;
}

export interface GetMetaParams {
    general?: boolean;
    state?: boolean;
    sensors?: boolean;
    manufacturer?: boolean;
}

export interface RPCReturnObject {
    uuid: string;
    result: any;
    status: PolipRPCStatusEnum;
    timestamp: string;
}

export interface PolipResponseAck {
    serial: string;
    timestamp: string;
    hardware: string;
    firmware: string;
    value: number;
    tag: string;
}

export interface DataEntryMetadata extends CoreSemantic {
    id: string;
}

export interface RPCRequestObject {
    uuid: string;
    type: string;
    parameters?: null | object;
    status: PolipRPCStatusEnum;
    timestamp: string;
}

export interface Metadata {
	type?: string;
    typeName?: string;
	name?: string;
	description?: string;
	rollover?: number | string | null;
	skipTagCheck?: boolean;
	manufacturer?: string;
    rpcQueueLength?: number;
    schemaVersion?: string;
    createdOn?: string;
}

export interface PolipResponsePoll extends PolipResponseAck {
    state?: object;
    manufacturerData?: null | object;
    rpc?: RPCRequestObject[];
}

export interface FullSchema {
    deviceSchema: object;
    stateSchema: object;
    rpcParameterSchemas: object;
    sensorSchema: object;
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
    rollover: number | string | null;
    url: string;
    value: number;
    skipTagCheck: boolean;
}

export interface PolipResponseMeta extends PolipResponseAck, Metadata {
    state?: {
        [key: string]: DataEntryMetadata
    }
    sensors?: {
        [key: string]: DataEntryMetadata
    };
    manufacturerData?: null | object;
}

export interface StateObject {
    [key: string]: any
}

export interface SenseObject {
    [key: string]: any
}

export interface PushParams {
    state?: StateObject;
    sense?: SenseObject;
    rpc?: RPCReturnObject
}

export class PolipDevice {
    constructor(
        commObj: CommunicationObject,
        serial: string,
        key: string,
        hardware: string,
        firmware: string,
        rollover?: number | string | null,
        url?: string,
        value?: number,
        skipTagCheck?: boolean
    );
    serial: string;
    key: string;
    hardware: string;
    firmware: string;
    rollover: number | string | null;
    url: string;
    value: number;
    skipTagCheck: boolean;
    checkServerStatus(): Promise<boolean>;
    getState(
        state?: boolean,
        meta?: boolean,
        rpc?: boolean, 
    ): Promise<PolipResponsePoll>;
    getMeta(
        general?: boolean,
        state?: boolean,
        sensors?: boolean,
        manufacturer?: boolean
    ): Promise<PolipResponseMeta>;
    getStateByParam(params: GetStateParams): Promise<PolipResponsePoll>;
    getMetaByParam(params: GetMetaParams): Promise<PolipResponseMeta>;
    push(params: PushParams): Promise<PolipResponseAck>;
    pushState(stateObj: StateObject): Promise<PolipResponseAck>;
    pushNotification(message: string, userVisible?: boolean): Promise<PolipResponseAck>;
    pushError(message: string, errorCode: number, userVisible?: boolean): Promise<PolipResponseAck>;
    pushSensors(sensorsObj: SenseObject): Promise<PolipResponseAck>;
    getValue(): Promise<PolipResponseAck>;
    pushRPC(rpcObj: RPCReturnObject): Promise<PolipResponseAck>;
    getSchema(): Promise<PolipResponseSchema>;
    getErrorSemantic(code?: number): Promise<PolipResponseSemantic>;
    static constructFromState(commObj: CommunicationObject, state: PolipDeviceStateExport): PolipDevice;
    importFromState(state: PolipDeviceStateExport): void;
    exportToState(): PolipDeviceStateExport;
}

export default PolipDevice;