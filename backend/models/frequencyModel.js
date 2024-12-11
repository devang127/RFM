import mongoose from "mongoose";

const frequencyModelSchema = new mongoose.Schema({
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

const frequencyModel = mongoose.model('frequencyModel', frequencyModelSchema)

export default frequencyModel;