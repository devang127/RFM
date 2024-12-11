import mongoose from "mongoose";

const recencyModelSchema = new mongoose.Schema({
    Category: {
        type: String
    },
    Score:{
        type: Number
    },
    Range:{
        type: String
    }
   
})

const recencyModel = mongoose.model('recencyModel', recencyModelSchema)

export default recencyModel;