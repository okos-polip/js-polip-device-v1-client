#!/usr/bin/env node

const axios = require('axios');

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
    {
        get: async (url) => {
            return axios.get(url);
        },
        post: async (url, payload) => {
            return axios.post(url, payload);
        }
    },
    DEFAULT_DEVICE_SERIAL,
    DEFAULT_REVOCABLE_KEY,
    HARDWARE_VERSION,
    FIRMWARE_VERSION,
    ROLLOVER
);

const main = async () => {
    let res;

    setVerboseDebug(false);

    await blockAwaitServerOk(dev);
 
    res = await valueRetryHandler(dev, async () => {
        return await dev.getStateByParam({ state: true, rpc: true });
    });

    console.log('\tState Returned', res.state);
    console.log('\tRPC Returned', res.rpc)

    res = await valueRetryHandler(dev, async () => {
        return await dev.getSchema();
    });

    console.log('Schema Response');
    console.log('\tDevice Schema', res.schema.deviceSchema);
    console.log("\tState Schema", res.schema.stateSchema);
    console.log('\tRPC Parameters by Type', res.schema.rpcParametersByType);
    console.log('\tSensors by Sensor ID', res.schema.sensorsBySensorId);

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