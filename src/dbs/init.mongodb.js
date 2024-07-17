'use-strict'
const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');
const connectionString = 'mongodb://localhost:27017/shopDEV';
class Database {
    constructor() {
        this.connect();
    }
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });
        }
        mongoose.connect(connectionString, { maxPoolSize: 50 })
            .then(_ => {
                countConnect();
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