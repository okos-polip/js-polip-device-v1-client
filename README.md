# Javascript Okos Polip Device Ingest V1 Client

## Installation
Install as an npm module `npm install git+ssh://git@github.com:okos-polip/js-polip-device-v1-client.git`

Or install as gitsubmodule 
```
git submodule add  git@github.com:okos-polip/js-polip-device-v1-client.git
git submodule update --init --recursive
```

Or directly use the minimized bundle `polip-ingest-v1.min.js`

## Usage
TODO fill this in later

## Endpoint API
These values are to be used as examples. Specific data returned may change. Refer to official API schemas for up-to-date documentation

### For HTTP GET /
Request Query Params = None

Response = redirect /api/v1/

### For HTTP GET /api/v1/
Request Query Params = None

Response = String
```
"Device Server Running ~ V1 API"
```

### For HTTP POST /api/v1/poll
Request Query Params =
- state : Boolean {'true', 'false'}
- meta : Boolean {'true', 'false'}
- sensors : Boolean {'true', 'false'}
- manufacturer : Boolean {'true', 'false'}
- rpc : Boolean {'true', 'false'}

Request Body = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77"
}
```

Response (if all query params true - see C-style comments) = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77",
    
    /*state=true (omitted if false)*/
    "state": {
        "power": false,
        "readonlySpoof": 0
    },

    /*meta=true (omitted if false)*/
    "type": "fake-0",
    "typeName": "Fake Device",
    "skipTagCheck": false,
    "rollover": 4294967296,
    "manufacturer": "okos-polip",
    "name": "Fake Device Name",
    "description": "Fake device used to test service behavior",

    /*sensors=true (omitted if false)*/
    "sensors: {
        "moisture": {
            "sensorId: "sensor-0-fake-0-0000",
            "units": "%",
            "types: ["fake","soil-sensor","moisture"],
            "name": "Fake Moisture Sensor",
            "description": "A fake sensor"
        },
        "light": {
            "sensorId: "sensor-1-fake-0-0000",
            "units": "lumens",
            "types: ["fake","soil-sensor","light"],
            "name": "Fake Light Sensor",
            "description": "A fake sensor"
        },
        "fakeSensor": {
            "sensorId: "sensor-2-fake-0-0000",
            "units": "lumens",
            "types: ["fake","soil-sensor","light"],
            "name": "Fake Light Sensor",
            "description": "A fake sensor"
        },
        "voltage0": {
            "sensorId: "sensor-3-fake-0-0000",
            "units": "volts",
            "types: ["fake","robot","voltage","battery"],
            "name": "Fake Battery Voltage",
            "description": "A fake sensor"
        },
        "voltage1": {
            "sensorId: "sensor-4-fake-0-0000",
            "units": "volts",
            "types: ["fake","robot","voltage"],
            "name": "Fake Generic Voltage",
            "description": "A fake sensor"
        }
    }

    /*manufacturer=true (omitted if false)*/
    "manufacturerData": {},

    /*rpc=true (omitted if false)*/
    "pendingRpcs: [
        {
            "uuid": "63caebb6-7b3d-4c62-8f23-0c7d31726be2",
            "type": "test",
            "parameters": {}
        }
    ]
}
``` 

### For HTTP POST /api/v1/push
Request Query Params = None
Request Body = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77",

    "state": {
        "power": false,
        "readonlySpoof": 0
    }
}
```

Response = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77"
}
```

### For HTTP POST /api/v1/error
Request Query Params = None
Request Body = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77",

    "message": "Error message sent",
    "code": 0
}
```

Response = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77"
}
```

### For HTTP POST /api/v1/error/semantic
Request Query Params = None
Request Body = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77"
}
```

Response = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77",

    "semantic": {
        "descriptions" : {
            "-300": "Generic Device Specific Error",
            "-200": "Generic Execution Error",
            "-1"  : "Generic Command Syntax Error",
            "0"   : "Notification Message",
            "1"   : "Warning Message",
            "2"   : "Generic User Defined Error"
        },
        "ranges": [
            {
                "min": null,
                "max": -300,
                "description": "Device Specific Error"
            },
            {
                "min": -299,
                "max": -200,
                "description": "Execution Error"
            },
            {
                "min": -199,
                "max": -1,
                "description": "Command Syntax Error"
            },
            {
                "min": 0,
                "max": 1,
                "description": "Notification"
            },
            {
                "min": 2,
                "max": null,
                "description": "User Defined Error"
            }
        ]
    }
}
```

### For HTTP POST /api/v1/error/semantic
Request Query Params = 
- code = integer

Request Body = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77"
}
```

Response = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77",

    "semantic": {
        "description": "Notification Message",
        "range": {
            "min": 0,
            "max": 1,
            "description": "Notification"
        }
    }
}
```

### For HTTP POST /api/v1/sense
Request Query Params = None
Request Body = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77",

    "sense": {
        "moisture": 0,
        "light": 0,
        "fakeSensor": "?",
        "voltage0": 0,
        "voltage1": 0
    }
}
```

Response = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77"
}
```

### For HTTP POST /api/v1/rpc
Request Query Params = None
Request Body = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77",

    "rpc": {
        "uuid": "63caebb6-7b3d-4c62-8f23-0c7d31726be2",
        "result": "success"
    }
}
```

Response = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77"
}
```

### For HTTP POST /api/v1/value
Request Query Params = None
Request Body = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0"
}
```

Response = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "0"
}
```

### For HTTP POST /api/v1/schema
Request Query Params = None
Request Body = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77"
}
```

Response = JSON
```
{
    "serial": "fake-0-0000",
    "timestamp": "2022-02-10T16:32:45.123456Z",
    "hardware": "v0.0.0",
    "firmware": "v0.0.0",
    "value": 1,
    "tag": "1f6c640f7d072b6c5dc26e55e320f78d7df1b012ae9b31f3c3e1da2da39c6d77",

    "schema": {
        "deviceSchema": {
            "type": "object",
            "properties": {
                "serial": {
                    "type": "string",
                    "format": "uuid",
                    "readonly": true
                },
                "type": {
                    "type": "string"
                },
                "name": {
                    "type": "string",
                    "readonly": false
                },
                "description": {
                    "type": "string",
                    "readonly": false
                },
                "hardware": {
                    "type": "string",
                    "readonly": true
                },
                "firmware": {
                    "type": "string",
                    "readonly": true
                },
                "manufacturer": {
                    "type": "string"
                },
                "rollover": {
                    "anyOf": [
                        {
                            "type": "integer"
                        },
                        {
                            "type": "null"
                        }
                    ]
                },
                "skipTagCheck": {
                    "type": "boolean"
                },
                "state": {
                    "type": "object",
                    "patternProperties": {
                        ".*": {}
                    }
                },
                "sensors": {
                    "type": "object",
                    "patternProperties": {
                        ".*": {
                            "type": "object",
                            "properties": {
                                "sensorId": {
                                    "type": "string",
                                    "format": "uuid"
                                },
                                "units": {
                                    "type": "string"
                                },
                                "types": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "name": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "types",
                                "units",
                                "sensorId",
                                "name",
                                "description"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
                "manufacturerData": {
                    "type": "object",
                    "properties": {}
                },
                "rpc": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "uuid": {
                                "type": "string",
                                "format": "uuid",
                                "readonly": true
                            },
                            "type": {
                                "type": "string",
                                "readonly": true
                            },
                            "parameters": {
                                "type": "array",
                                "items": {}
                            }
                        },
                        "required": [
                            "uuid",
                            "parameters"
                        ],
                        "additionalProperties": false
                    }
                }
            },
            "required": [
                "serial",
                "type",
                "name",
                "description",
                "hardware",
                "firmware",
                "manufacturerId",
                "rollover",
                "skipTagCheck",
                "state",
                "sensors",
                "manufacturer",
                "rpc"
            ],
            "additionalProperties": false
        },
        "stateSchema": {
            "type": "object",
            "properties": {
                "power": {
                    "type": "boolean",
                    "readonly": false
                },
                "readonlySpoof": {
                    "type": "integer",
                    "minimum": -1,
                    "maximum": 345,
                    "readonly": true
                }
            },
            "required": [
                "power",
                "readonlySpoof"
            ],
            "additionalProperties": false
        },
        "rpcParametersByType": {
            "test": {
                "type": "array",
                "properties": {}
            }
        },
        "sensorsBySensorId": {
            "moisture": {
                "type": "number",
                "readonly": true
            },
            "light": {
                "type": "number",
                "readonly": true
            },
            "fakeSensor": {
                "type": "string",
                "readonly": true
            },
            "voltage0": {
                "type": "number",
                "readonly": true
            },
            "voltage1": {
                "type": "number",
                "readonly": true
            }
        }
    }
}
```

