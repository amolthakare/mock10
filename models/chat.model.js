const mongoose = require("mongoose")

const chatSchema = mongoose.Schema({
    name:String,
    message:String,
    time:String
})

const ChatModel = mongoose.model("chat",chatSchema)

module.exports = {ChatModel}