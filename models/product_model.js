const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema(
    {
        id:{
            type:Number,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        price:{
            type: Number,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        }
    }
)

const Product = mongoose.model('product',ProductSchema)
module.exports = Product