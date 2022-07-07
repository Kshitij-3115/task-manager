const express = require('express') 

// let the database connects 
require('./db/mongoose.js') // it will automatically run the specified file, and we have established connection to our database


const app = express(); 
const port = process.env.PORT  

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

// -------- multer testing ----------
// const multer = require('multer')

// const upload = multer({
//     dest : 'images', 
//     limits : {
//         fileSize : 1*1024*1024          // 1 MB 
//     }, 
//     fileFilter(req, file, cb) {
//         if(!file.originalname.match(/\.(doc|docx|pdf)$/)) {
//             return cb(new Error('only doc,docx,pdf are allowed :) '))
//         }

//         cb(undefined, true)
//     }
// })


// app.post('/upload', upload.single('upload') ,(req,res) => {
//     res.send() 
// }, (error, req, res, next) => {
//     res.send({error : error.message})
// })

// --------------------------------------------
app.use(express.json())

// register router with app 
app.use(userRouter) 
app.use(taskRouter)


// start server on specified port 
app.listen(port, () => {
    console.log(`server is up on port ${port}`)
})


