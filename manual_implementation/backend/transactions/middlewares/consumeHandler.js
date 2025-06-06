async function handleMessage(data) {
    console.log('receved request', data);
}


async function handleRPCMessage(data) {
    console.log('receved rpc request', data);
    return data
}

module.exports = { handleMessage, handleRPCMessage };