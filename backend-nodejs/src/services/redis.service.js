'use strict'

const redis = require('redis')
const {promisify} = require('util')
const { product } = require('../models/product.model')
const { reservationInventory } = require('../models/repo/inventory.repo')
const redisClient = redis.createClient()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async(productId, quantity, cartId)=>{
    const key= `lock_v2024_${productId}`
    const retryTimes = 10
    const expireTime = 3000

    for (let i = 0; i < retryTimes; i++) {
        // tao mot key, thang nao nam giu duoc vao thanh toan
        const result = await setnxAsync(key, expireTime)
        console.log("🚀 ~ acquireLock ~ result:", result)
        if(result ===1){
            // thao tac voi inventory
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            if(isReservation.modifiedCount){
                await pexpire(key, expireTime)
                return key
            }
            return null
        }else{
            await new Promise((resolve)=> setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock =>{
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports ={
    acquireLock,
    releaseLock
}