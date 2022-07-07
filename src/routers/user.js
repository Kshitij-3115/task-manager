const express = require('express') 
const router = new express.Router()
const multer = require('multer') 
const sharp = require('sharp')

// middlewares :)
const auth = require('../middlewares/auth')


const mongoose = require('mongoose') 

const User = require('../models/user')

// create new user :)  or sign up 
router.post('/users', async (req,res) => {
    const user = new User(req.body)
    
    try {
        await user.save() 
        //get token 
        const token = await user.generateAuthToken() 

        res.status(201).send({user, token}) 
    } catch(err) {
        res.status(400).send(err)
    }

    // user.save().then((result)=>{
    //     res.status(201).send(result)
    // }).catch((error) => {
    //     res.status(400).send()
    // })
})

// user login
router.post('/users/login', async (req,res) => {
   
    try {
        const user = await User.findByCredantials(req.body.email, req.body.password) 

        // get a token 
        const token = await user.generateAuthToken()

        return res.send({user, token }) 

    }catch (err) {
        res.status(400).send(err) // bad request : login failed
    }

})

// user logout 
router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save() 
        
        console.log(req.user)
        
        res.send()
    } catch (err) {
        res.status(500).send({'Error' : 'Server side error '}) 
    }
})

// user logout from all sessions 
router.post('/users/logoutAll', auth, async (req,res) => {
    try {
        req.user.tokens = []   // wipe all user tokens 
        await req.user.save() 

        // console.log(req.user) 

        res.send() 
    }catch (err) {
        res.status(500).send({'Error ' : 'Server side error' }) 
    }
}) 


// get user profile 
router.get('/users/me', auth ,async (req, res) => {

    res.send(req.user)

    // // fetch all users from database 
    // try {
    //     const users = await User.find({})
    //     res.send(users) 
    // }catch (err) {
    //     res.status(500).send(err)
    // }
    
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((users) => {
    //     res.status(500).send(error) 
    // })
})


// get user by id :) 
// router.get('/users/:id',async (req,res) => {
//     const _id = req.params.id 
    
//     // check if it is valid objectId 
//     if(! mongoose.Types.ObjectId.isValid(_id)) {
//         return res.status(400).send('invalid id') 
//     }

//     try {
//         const user = await User.findById(_id)
//         if(!user) {
//             return res.status(404).send('no user found')
//         } 
//         res.send(user) 
//     }catch (err) {
//         res.status(500).send(err) 
//     }
    

//     // User.findById(_id).then((user)=>{
//     //     // it might user is undefined 
//     //     if(!user) {
//     //         return res.status(404).send() 
//     //     } 
//     //     // else send user
//     //     res.send(user) 
//     // }).catch((error) => {
//     //     res.status(500).send(error)
//     // })
// })




// update user by id

router.patch('/users/me', auth, async (req,res) => {

    const updates = Object.keys(req.body) 

    const allowedUpdates = ['name', 'age', 'password', 'email'] 

    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update) 
    })

    if(!isValidUpdate) {
        return res.status(400).send({'error' : 'invalid update operation'})  
    }

    try {
        // const user = await User.findById(req.params.id) 

        // if(!user) {
        //     return res.status(404).send('no such user exists') 
        // }

        updates.forEach((update) => { req.user[update] = req.body[update] }) 

        await req.user.save() 

        // below direct update operation will not allow to use mongoose middlewares so we use above few lines instead of directly updating the user 
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true})

        res.send(req.user) 
    } catch(err) {
        res.status(400).send(err) 
    }
})

// delete user by id 
router.delete('/users/me', auth, async (req,res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id) 
        // if(!user) {
        //     return res.status(404).send('no such user exists')
        // }

        await req.user.remove()

        res.send(req.user) 
    } catch (err) {
        res.status(500).send({'Error' : 'Internal server error'}) 
    }
})


const upload = multer({
    limits : {
        fileSize : 1*1024*1024
    }, 
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('please upload jpg, png, or jpeg format'))
        }

        cb(undefined, true)
    }
})

// upload profile pic
router.post('/users/me/avatar', auth, upload.single('avatar'),  async (req,res) => {

    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer() 

    req.user.avatar = buffer

    await req.user.save() 

    res.send({status : 'success'}) 
}, (error, req, res, next) => {
    res.status(400).send({error : error.message}) 
})

//delete profile avatar 
router.delete('/users/me/avatar', auth, async (req,res) => {
    req.user.avatar = undefined 

    await req.user.save()

    res.send({status : 'success'}) 
})

// GET profile image : avatar
router.get('/users/:id/avatar', async (req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error()
        }

        // serve user with a avatar :) 

        res.set('Content-Type','image/png')
        res.send(user.avatar) 
        
    }catch (err) {
        res.status(404).send()
    }
})

module.exports = router 