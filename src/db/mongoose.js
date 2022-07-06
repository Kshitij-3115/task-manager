const mongoose = require('mongoose')


const options = {
    useNewUrlParser : true
}

const connectionUrl = 'mongodb://127.0.0.1:27017/task-manager-api' 
mongoose.connect(connectionUrl, options) 





 


