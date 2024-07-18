'use-strict'

const bcrypt = require('bcrypt');
const shopModel = require('../models/shop.model');

const ROLESHOP = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessServices {
    static signUp = async ({ name, email, password }) => {
        try {
            // stepl: check email exists??
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered!'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, roles: [ROLESHOP.SHOP], password: passwordHash
            })

        } catch (e) {
            return {
                code: 'xxxx',
                message: e.message,
                status: 'error'
            }
        }

    }
}