const jwt = require("jsonwebtoken")
require('dotenv').config()

const authentication = (req, res, next)=>{
    const token = req.headers.authorization;
    if(token){
        const decode = jwt.verify(token, process.env.key)
        if(decode){
            const userId = decode.userId;
            req.body.userId = userId;
            next()
        }else{
            res.send("Please login First")
        }
    }else{
        res.send("Please login First")
    }
}

module.exports = {authentication}