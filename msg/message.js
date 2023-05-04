const moment = require("moment")

function formateMessage(username, text){
    return{
        username,
        receive,
        text,
        Time_now:moment().format('DD MM YYYY h:mm a')
    }
}

module.exports  = formateMessage