const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

// count num of connections
const countConnect = () => {
    const numOfConnect = mongoose.connections.length;
    console.log(`Number of connections::${numOfConnect}`);
}

// check overload
const checkOverload = () => {
    setInterval(() => {
        const numOfConnect = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connections based on number ost cores
        const maxConnections = numCores * 5;

        console.log(`Active connections::${numOfConnect}`);

        console.log(`Memory use :: ${memoryUsage / 1024 / 1024} MB`)

        if (numOfConnect > maxConnections) {
            console.log(`Connection overload detected!`)
        }
    }, _SECONDS);
}

module.exports = {
    countConnect,
    checkOverload,
}