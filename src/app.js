const express = require('express') 

// let the database connects 
require('./db/mongoose.js') // it will automatically run the specified file, and we have established connection to our database


const app = express(); 
const port = process.env.PORT || 3000 

// routers :) 
const userRouter = require('./routers/user') 
const taskRouter = require('./routers/task')

// app.use((req, res, next) => {
//     if(req.method == 'GET') {
//         res.send('GET requests are disabled') 
//     } else {
//         next()
//     }
// })

// app.use((req,res,next) => {
//     res.status(503).send('We are under maintainance, try back soon :)') 
// })

app.use(express.json())

// register router with app 
app.use(userRouter) 
app.use(taskRouter)


// start server on specified port 
app.listen(port, () => {
    console.log(`server is up on port ${port}`)
})


// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('62c549816b09098cc6fee399')
//     // await task.populate(['owner'])

//     // console.log(task.owner)

//     const user = await User.findById('62c5466c6e161ec77d85f7c9')
//     await user.populate('tasks')
//     console.log(user.tasks) 

// }

// main()