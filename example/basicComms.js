#!/usr/bin/env node

const { 
    PolipDevice, 
    formatVersion, 
    blockAwaitServerOk, 
    valueRetryHandler,
    setVerboseDebug
} = require('../src');

const DEFAULT_REVOCABLE_KEY = "revocable-key-1";
const DEFAULT_DEVICE_SERIAL = "fake-0-0001";
const FIRMWARE_VERSION = formatVersion(0,0,0);
const HARDWARE_VERSION = formatVersion(0,0,0);
const ROLLOVER = 2**32;

const dev = new PolipDevice(
    DEFAULT_DEVICE_SERIAL,
    DEFAULT_REVOCABLE_KEY,
    HARDWARE_VERSION,
    FIRMWARE_VERSION,
    ROLLOVER
);

const main = async () => {
    let res;

    setVerboseDebug(true);

    await blockAwaitServerOk(dev);
 
    res = await valueRetryHandler(dev, async () => {
        return await dev.getStateByParam({ state: true, rpc: true });
    });

    console.log('State Returned', res.state);
    console.log('RPC Returned', res.rpc)

    res = await valueRetryHandler(dev, async () => {
        return await dev.getSchema();
    });

    console.log('Device Schema', res.schema.deviceSchema);
    console.log("State", res.schema.stateSchema);
    console.log('RPC Parameters', res.schema.rpcParametersByType);
    console.log('Sensors', res.schema.sensorsBySensorId);

    res = await valueRetryHandler(dev, async () => {
        return await dev.getErrorSemantic();
    });

    console.log('Full Error Semantics', res.semantic)

    res = await valueRetryHandler(dev, async () => {
        return await dev.getErrorSemantic(0);
    });

    console.log('Error Semantic for code = 0', res.semantic);

    res = await valueRetryHandler(dev, async () => {
        return await dev.pushNotification("Hello World"); 
    }); 

    console.log('Push Notification ACKed');

    res = await valueRetryHandler(dev, async () => {
        return await dev.pushError("Error", -1); 
    }); 

    console.log('Push Error ACKed');

    res = await valueRetryHandler(dev, async () => {
        return await dev.pushSensors({
            moisture: 0,
            light: 0,
            fakeSensor: "?",
            voltage0: 0,
            voltage1: 0
        }); 
    }); 

    console.log('Push Sensors ACKed');

    res = await valueRetryHandler(dev, async () => {
        return await dev.pushState({
            power: false,
            readonlySpoof: 0
        }); 
    }); 

    console.log('Push State ACKed');
}

main();