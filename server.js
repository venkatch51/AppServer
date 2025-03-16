const Product = require('./models/product_model')
const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const user = require('./models/userSchema')
const auth = require('./auth/authentication')
const cors = require('cors');
const e = require('express');
const app = express();

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))

const dummydata = [
    {
        "id":"1",
        "studentName":"harsha",
        "college":"gitam"
    },
    {
        "id":"2",
        "studentName":"Shannu",
        "college":"SRM"
    },
    {
        "id":"3",
        "studentName":"vamsi",
        "college":"VIT"
    }
]

app.get('/api/students', (req,res) => {
    res.json(dummydata)
})
app.post('/api/students',(req,res) => {
    const studentsData = req.body
    console.log("studentsdata ",studentsData)
    dummydata.push(studentsData)
    res.json(dummydata)
})
app.get('/api/students/:id',(req,res) => {
    const { id } = req.params;
    const jsondata = dummydata.filter((list) => list.id === id)
    // console.log("req id",id)
    res.json(jsondata)
})
app.post('/api/register',async (req,res) => {
    console.log(req.body)
    try{
        const {username,email,password} = req.body
        const userDetails = await user.create({username,email,password})
        res.status(200).json(userDetails)
    }
    catch(error){
        console.log("Error while registering");
    }
})
app.post('/api/login',async (req,res) => {
    try{
        const { email, password} = req.body
        console.log(email,password)
        const userEmail = await user.findOne({email:email})
        console.log(userEmail.password)
        if(!userEmail){
            res.status(400).json({message:"user not found"})
        }
        else if(userEmail.password === password){
            const tokenPayload = {
                userId: userEmail._id,  
                email: userEmail.email
            }
            const accessToken = jwt.sign(tokenPayload,'secretkey',{ expiresIn: '1h' })
            res.status(201).json({
                status:'sucess',
                data: {
                    accessToken,
                  },
            })
        }
        else{
            const err = new Error('Wrong Password!');
            err.status = 400;
            throw err;
        }
    }
    catch(error){
        console.log("Error logging",error)
    }
})
app.get('/api/products',auth,async (req,res) => {
    try{
        const products = await Product.find({})
        res.status(200).json(products)
    }   
    catch(error){
        res.status(500).statusMessage("Error")
    }
})

app.get('/api/products/:id',async (req,res) => {
    try{
        const {id} = req.params
        const product = await Product.findById(id)
        res.status(200).json(product)
    }
    catch(error){
        res.status(500).statusMessage(error)
    }
})
app.post('/api/products',async (req,res) => { 
    try{    
        const product = await Product.create(req.body)
        res.status(200).json(product) 
    }
    catch(error){
        res.status(500)
    }
})
app.put('/api/products/:id',async (req,res) => {
    try{
        const {id} = req.params
        const product = await Product.findByIdAndUpdate(id,req.body)
        if(!product){
            res.status(400).json({message:"Product not found"})
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)
    }
    catch(error){
        res.status(500).statusMessage("Product not Updated")
    }
})

app.post('api/products/:id',async (req,res) => {
    try{
        const {id} = req.params
        await Product.findByIdAndDelete(id)
        if(!product){
            res.json({message:"Product not found"})
        }
        else{
            const deletedProduct = await Product.findById(id)
            res.json(deletedProduct)
        }
    }
    catch(error){
        res.status(500).json({message:"Error"})
    }
})
// app.listen(5000,() => {
//     console.log("running on port 5000")
// })


mongoose
  .connect("mongodb+srv://venkatch8051:venkat8051@cluster0.0v6sw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log("Connected to database");
    app.listen(5000, () => {
      console.log("Server running at 5000");
    });
  })
  .catch((error) => {
    console.log(`Error while connecting ${error}`);
  });
app.get("/", (req, res) => {
  res.json([{ name: "venkat", id: "1000" }]);
});
