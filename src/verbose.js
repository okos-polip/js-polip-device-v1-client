
/// Flag we will use to turn on/off verbose logging during testing
var POLIP_VERBOSE = false;

const setVerboseDebug = (val) => {
    POLIP_VERBOSE = val;
}

const getVerboseDebug = () => {
    return POLIP_VERBOSE;
};

module.exports = {
    getVerboseDebug,
    setVerboseDebug
}