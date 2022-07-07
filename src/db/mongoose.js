const mongoose = require('mongoose')


const options = {
    useNewUrlParser : true
}

const connectionUrl = process.env.MONGODB_URL

mongoose.connect(connectionUrl, options) 





 


