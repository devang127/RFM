import mongoose from "mongoose"

const tableModelSchema = new mongoose.Schema({
    Segment: {
        type: String
    },
    Scores:{
        type: Number
    }

})

const TableModel = mongoose.model('TableModel', tableModelSchema)

export default TableModel;