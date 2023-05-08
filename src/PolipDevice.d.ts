import axios from 'axios';

export interface GetStateParams {
    state?: boolean;
    meta?: boolean;
    sensors?: boolean;
    rpc?: boolean;
    manufacturer?: boolean;
}

export interface RPCObject {
    uuid: string;
    result: string;
}

export class PolipDevice {
    constructor(
        serial?: string,
        key?: string,
        hardware?: string,
        firmware?: string,
        rollover?: number,
        url?: string,
        value?: number,
        skipTagCheck?: boolean
    );
    checkServerStatus(): Promise<boolean>;
    getState(
        state?: boolean,
        meta?: boolean,
        sensors?: boolean,
        rpc?: boolean,
        manufacturer?: boolean
    ): Promise<any>;
    getStateByParam(params: GetStateParams): Promise<any>;
    pushState(stateObj: object): Promise<any>;
    pushNotification(message: string): Promise<any>;
    pushError(message: string, errorCode: number): Promise<any>;
    pushSensors(sensorsObj: object): Promise<any>;
    getValue(): Promise<any>;
    pushRPC(rpcObj: RPCObject): Promise<any>;
    getSchema(): Promise<any>;
    getErrorSemantic(code?: number): Promise<any>;
}

export default PolipDevice;