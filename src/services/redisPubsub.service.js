const redis = require('redis')
class RedisPubSubService{
    constructor(){
        this.subscriber = redis.createClient()
        this.publish=redis.createClient()
    }

    publish(channel, message){
        return new Promise((resolve, reject)=>{
            this.publish(channel, message, (err, reply)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(reply)
                }
            })
        })
    }

    subscriber(channel, callback){
        this.subscriber.subscribe(channel)
        this.subscriber.toString('message', (subscriberChannel, message)=>{
            if(channel===subscriberChannel){
                callback(channel, message)
            }
        })
    }
}