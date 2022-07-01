// we are learning CRUD operations using mongodb 

const { MongoClient, ObjectId } =  require("mongodb");

// connection :) 
const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbname = 'task-manager'  // database name

const options = {
    useNewUrlParser : true
}

// CREATE OBJECTID manually :) -- although this task is done by mongodb internally :( 
// const id = new ObjectId()
// console.log(id.id.length) 
// console.log(id.toHexString().length) 


// connect is an asynchronous operation :) 
MongoClient.connect(connectionUrl, options, (error, client) => {
    // run when function execution over 
    if(error) {
        return console.log('unable to connect to the database :)')
    }

    const db = client.db(dbname)   // particular database 

    // access particular collection in database and insert a document

    // accesing data :) find (multiple) , findOne (individual) 

    // db.collection('users').findOne({ _id : new ObjectId("62bd946e9f3d3b678dcfe219") }, (error, result) => {
    //     if(error) {
    //         console.log('unable to fetch user')
    //     }

    //     console.log(result)
    // })

    // db.collection('tasks').find({completed : false}).toArray((error, tasks) => {
    //     console.log(tasks) 
    // })

    // db.collection('users').updateOne({
    //     _id : new ObjectId("62bd94cd335fe72f0df84aa6") 
    // }, {
    //     $inc : {
    //         age : 1
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error)  
    // })

    // db.collection('tasks').updateMany({
    //     completed : false
    // }, {
    //     $set : {
    //         completed : true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.lof(error) 
    // })

    db.collection('tasks').deleteMany({
        task : 'go to the market and by some food there'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error) 
    })
    

})
