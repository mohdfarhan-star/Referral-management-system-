const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
    },
    email: {
        type: String,
        required:true,
        unique:true,
    },

    phone: {
        type: String,
        maxLength:10,
    },
    job_title: {
        type:String,
    },
    status:{
        type:String,
        enum: ["Pending", "Reviewed", "Hired"],
        default: "Pending"
    },

    resume: {
        type:String,
    }
});

module.exports = mongoose.model("Candidate", candidateSchema);
