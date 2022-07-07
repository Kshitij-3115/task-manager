

const jwt = require('jsonwebtoken') 
const User = require('../models/user') 

const auth = async (req,res,next) => {
     try {
        const token = req.header('Authorization').replace('Bearer ','')

      //   console.log(token) 

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await User.findOne({_id : decoded._id, 'tokens.token' : token})  // find that user and check if token exists there
        
        if(!user) {
            throw new Error() 
        }

        // else user is authorized 

        // we already have user, so add this to req because route handler may need this for some task
        req.user = user 
        req.token = token

        next() 
     } catch(err) {
        console.log(err)
        res.status(401).send({'Error' : 'Authenticate first :)'}) 
     }
}

module.exports = auth 