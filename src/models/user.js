
const mongoose = require('mongoose') 
const validator = require('validator') 
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name : {
        type : String, 
        required : true, 
        trim : true 
    }, 
    email : {
        type : String,
        unique : true, 
        required : true, 
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("an invalid email :)") 
            }
        }, 
        trim : true, 
        lowercase : true 
    },
    password : {
        type : String, 
        required : true, 
        minlength : 7, 
        trim : true, 
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error("Password is containing 'password' , its not allowed ! ")
            }
        }
    },
    age : {
        type : Number, 
        validate(value) {
            if(value < 0) {
                throw new Error("age cannot be negative :)")
            }
        }, 
        default : 0  // default age of user
    }, 
    tokens : [{
        token : {
            type : String, 
            required : true
        }
    }], 
    avatar : {
        type : Buffer
    }
}, {
    timestamps : true
})

// virtuals 
userSchema.virtual('tasks', {
    ref : 'Task', 
    localField : '_id',
    foreignField : 'owner' 
})

// register middlewares on this schema :) 

// -> trim  data to be exposed 
userSchema.methods.toJSON = function () {
    const user = this 
    const userObject = user.toObject() 

    delete userObject.password 
    delete userObject.tokens 
    delete userObject.avatar
    
    return userObject 
}

// -> generate token for the user and store it to database 
userSchema.methods.generateAuthToken = async function () {
    const user = this 
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET, {expiresIn : '1 day'}) 

    // save it to database 
    user.tokens = user.tokens.concat({token}) 

    await user.save() 

    return token 
}

// -> find user by email, and check if password matches 
userSchema.statics.findByCredantials = async (email, password) => {
    // find email 
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('Unable to login') 
    }

    const isMatch = await bcrypt.compare(password, user.password) 

    // console.log(isMatch)

    if(!isMatch) {
        throw new Error('Unable to login') 
    }

    // logged in 
    return user; 
}

// -> hash passwords before saving 
userSchema.pre('save', async function (next) {
    const user = this 

    // check if password field is modified , if so hash the password
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8) 
    }

    next() 
})

// -> delete all tasks before deleting the user iteself first 
userSchema.pre('delete', async function (next) {
    const user = this 

    await Task.deleteMany({ owner : user_id }) 

    next(); 
})


const User = mongoose.model('User', userSchema)

// export model 
module.exports = User  