const express = require('express') 
const router = new express.Router() 

// middlewares 
const auth = require('../middlewares/auth')

// import task model
const Task = require('../models/task') 
const mongoose = require('mongoose')


// create new task :) 
router.post('/tasks', auth, async (req,res) => {
    // const task = new Task(req.body) 

    const task = new Task({
        ...req.body, 
        owner : req.user._id 
    })

    try {
        await task.save()
        res.status(201).send({'success' : 'task created', task})  

    } catch(err) {
        res.status(400).send(err) 
    }

    // task.save().then((result)=>{
    //     res.status(201).send(result) 
    // }).catch((error) => {
    //     res.status(400).send(error) 
    // })
})

// get all tasks :)  GET /tasks?completed=true    OR /tasks?completed=false
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req,res) => {
    
    // match object for filtering 
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1     // default : ascending
    }

    try {
        // const tasks = await Task.find({ owner : req.user._id}) 

        // use populate functionality 
        await req.user.populate({
            path : 'tasks',
            match , 
            options :{
                limit : parseInt(req.query.limit), 
                skip : parseInt(req.query.skip), 
                sort 
            }
        }) 
         
        res.send(req.user.tasks) 
    } catch(err) {
        res.status(500).send(err) 
    }

    // Task.find({}).then((tasks)=>{
    //     if(!tasks) {
    //         return res.status(404).send()
    //     } 
    //     res.send(tasks) 
    // }).catch((error)=>{
    //     res.status(500).send()  
    // })
})

// get task by id :) 
router.get('/tasks/:id', auth, async (req,res) => {
    const _id = req.params.id; 

    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).send('invalid task id') 
    }
    // else find this task using the id 

    try {
        // const task = await Task.findById(_id) 
        const task = await Task.findOne({ _id, owner : req.user._id }) 

        if(!task) {
            return res.status(404).send({'Error' : 'No task found'}) 
        }
        res.send(task) 
    } catch(err) {
        res.status(500).send(err) 
    }

    // Task.findById(_id).then((task) => {
    //     if(!task) {return res.status(404).send()} 

    //     res.send(task) 
    // }).catch((err) => {
    //     res.status(500).send() 
    // })
})

// update task by id :) 
router.patch('/tasks/:id', auth, async (req,res) => {
    // first check validity of the target tields for updation
    const updates = Object.keys(req.body) 
    const allowedUpdates = ['completed', 'description'] 

    const isValidUpdates = updates.every((update) => {
        return allowedUpdates.includes(update) 
    })

    if(!isValidUpdates) {
        return res.status(400).send({'error' : 'invalid update operation'}) 
    }

    try {
        // const task = await Task.findById(req.params.id)
        
        const task = await Task.findOne({ _id : req.params.id, owner : req.user._id }) 

        if(!task) {
            return res.status(404).send({'Error ' : 'Nothing to update'}) 
        }

        updates.forEach((update) => { task[update] = req.body[update] })

        await task.save() 
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true}) 
        
        res.send(task) 
    }catch(err) {
        res.status(400).send(err) 
    }
})

// delete task by id :) 
router.delete('/tasks/:id', auth, async (req,res) => {

    try {
        // const task = await Task.findByIdAndDelete(req.params.id)

        const task = await Task.findOneAndDelete( { _id : req.params.id, owner : req.user._id })

        if(!task) {
            return res.status(404).send({'Error' : 'No such task exists'})
        }

        res.send(task)
    } catch (err) {
        res.status(500).send({'Error' : 'Internal server error'})
    }
})


module.exports = router 