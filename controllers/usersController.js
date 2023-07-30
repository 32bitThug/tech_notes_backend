const  Note=require('../models/Note')
const  User=require('../models/User')

const asyncHandler =require('express-async-handler') // this enables us to avoid multiple try catch blocks

const bcrypt =require('bcrypt')// this hashes our password

//@desc Get all users
//@route GET /users
// @access Private
const getAllUsers =asyncHandler(async(req,res)=>{
    // lean method avoids any extra info given by mangoose
    const users= await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message:'No users found'})
    }
    res.json(users)
})

//@desc Create  new user
//@route POST /users
// @access Private
const createNewUser =asyncHandler(async(req,res)=>{
    const {username,password,roles}=req.body
    
    // confirm data
    if(!username || !password || !Array.isArray(roles ) || !roles.length){
        return res.status(400).json({message:'All fields are required'})
    }
    // check for duplicates
  

    //By using exec(), you have more control over when and how the query is executed, allowing you to chain multiple query modifiers and control the order of execution
    const duplicates =await User.findOne({username}).lean().exec()
    if(duplicates){
        return res.status(409).json({message:'Username aleady exists'})
    }
    // hash password
    const hashedPwd = await bcrypt.hash(password,10)// salt rounds
    
    // create user object
    const userObject={username,"password":hashedPwd,roles}
    const user= await User.create(userObject)

    if(user){
        res.status(201).json({message: `New user ${username} created`})
    }
    else{
        res.status(400).json({message: 'Invalid user data received'})
    }
})
//@desc update users
//@route PATCH /users
// @access Private
const updateUser =asyncHandler(async(req,res)=>{
    const { id, username, roles, active, password } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }
    
    const user =await User.findById(id).exec()

    if(!user ) return res.status(400).json({message :' user not found'})
    
    //  CHECK FOR duplicates
    const duplicates =await User.findOne({username}).lean().exec()
    if(duplicates && duplicates?._id.toString()!== id){
        return res.status(409).json({message:'Username aleady exists'})
    }
    user.username=username
    user.roles=roles
    user.active=active
    if(password){
        user.password=await bcrypt.hash(password,10);
    }
    const updatedUser=await user.save()

    res.json({message:`updated user ${updatedUser.username}`})

})
//@desc delete  users
//@route DELETE /users
// @access Private
const deleteUser =asyncHandler(async(req,res)=>{
    const {id}=req.body;
    if(!id){
        return res.status(400).json({message:'User id is required'})
    }
    const note= await Note.findOne({user:id}).lean().exec();
    if(note){
        return res.status(400).json({message:'User has assigned note'})

    }
    const user=await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message:'User not found'})

    }
    const result=await user.deleteOne()

    const reply= `Username ${result.username} with ID ${result._id} deleted`
   
    res.json(reply)
})

//@desc Get user by ID
//@route GET /users/:id
// @access Private
const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
  
    // Fetch the user by ID from the database
    const user = await User.findById(userId).select('-password').lean().exec();
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    res.json(user);
  });
  
module.exports={
    getAllUsers,
    deleteUser,
    updateUser,
    createNewUser,
    getUserById
}