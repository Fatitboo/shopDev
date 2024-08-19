'use strict'
const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');
const { db: { host, name, port } } = require('../configs/config.mongodb')
const connectionString = `mongodb://${host}:${port}/${name}`;
class Database {
    constructor() {
        this.connect();
    }
    async connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        mongoose.connect(connectionString, { maxPoolSize: 50 })
            .then(async _ => {
                countConnect();
                // const collections = await mongoose.collections();
                // for (const collection of collections) {
                //     await collection.drop();
                //     console.log(`Dropped collection: ${collection.collectionName}`);
                //   }
                console.log("Connect Mongodb successfully!");
            })
            .catch(err => { console.log("Connect fail") })
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;