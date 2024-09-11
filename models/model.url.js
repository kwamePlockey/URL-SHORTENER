const mongoose = require("mongoose")

const urlSchema = mongoose.Schema({
    original_url : {
        type : String,
        required: true
    },
    short_url: {
        type: String,
        required: true,
    }
},{timestamps: true})

const URL = mongoose.model("URL", urlSchema)

module.exports = URL