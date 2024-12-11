import mongoose from "mongoose";

const monetaryModelSchema = new mongoose.Schema({
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

const monetaryModel = mongoose.model('monetaryModel', monetaryModelSchema)

export default monetaryModel;