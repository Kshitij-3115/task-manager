require('../src/db/mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/task')  

// user_id : 62c1315822f26a64881898bd 

// update its age to 12, and count number of users with age 12 

const _id = '62c1315822f26a64881898bd'

// User.findByIdAndUpdate(_id, {
//     age : 13
// }).then((user)=> {
//     console.log(user)
    
//     return User.countDocuments({age : 12}) 

// }).then((count) => {
//     console.log(count) 
// }).catch((err) => {
//     console.log(err) 
// })


// task id : "62c1339a3003ecb6e66206b2" 

// const task_id = "62c1339a3003ecb6e66206b2"

// Task.findByIdAndDelete(task_id).then((result) => {
//     console.log(result) 

//     return Task.countDocuments({completed : false}) 
// }).then((count) => {
//     console.log(count) 
// }).catch((err) => {
//     console.log(err) 
// })

// const updateAgeAndCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate(id, {age : age}) 

//     const count = await User.countDocuments({age}) 

//     return count; 
// }


// updateAgeAndCount(_id, 12).then((result) => {
//     console.log(result) 
// }).catch((err) => {
//     console.log(err) 
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id) 

    const count = await Task.countDocuments({completed : false}) 

    return count; 
}

deleteTaskAndCount('62bff8c217c596e4a1869ba8').then((result) => {
    console.log(result) 
}).catch((err) => {
    console.log(err) 
})