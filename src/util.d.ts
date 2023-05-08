export function formatVersion(major: number, minor: number, patch: number): string;
export function blockAwaitServerOk(
    device: any,
    cb: () => void,
    numRetries?: number
): Promise<void>;
export function createTimestamp(): string;
export function createTag(payloadStr: string, clientKey: string): Promise<string>;
export function valueRetryHandler(
    device: any,
    cb: () => Promise<any>,
    retry?: boolean
): Promise<any>;
