const { request } = require("express");
const { uploadImageToCloudinary } = require("../utils/UploadToCloudinary")
const Candidate = require("../models/Candidate");

exports.createCandidate = async (req, res)=>{

    try{
        const {name, email, phone, job_title, status} = req.body;
        const resume = req.files ? req.files.resume : null;

        if(!name || !email || !phone || !job_title){
            return res.status(400).json({
                success:"false",
                message:"All fields are mandatory",
            });
        }

        let candidateStatus = status || "Pending";

        if(resume){
            const resume_pdf = await uploadImageToCloudinary(
                resume,
                process.env.FOLDER_NAME
            )

            const candidate = await Candidate.create({
                name,
                email,
                phone,
                job_title,
                status: candidateStatus,
                resume:resume_pdf.secure_url,
            });

            return res.status(200).json({
                success:true,
                message:"Candidate created successfully",
                data:candidate
            });
        }

        const candidate = await Candidate.create({
            name,
            email,
            phone,
            job_title,
            status: candidateStatus,
        });
        

        return res.status(200).json({
            success:true,
            message:"Candidate created successfully",
            data:candidate
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create candidate"
        });
    }
}

exports.updateCandidate = async (req, res) => {
    try{
        const {candidateId} = req.body
        const {updatedStatus} = req.body

        const candidate = await Candidate.findById(candidateId);

        if(!candidate){
            return res.status(404).json({
                success:false,
                message:"Candidate not found"
            })
        }

        if(candidate.status !== updatedStatus){
            candidate.status = updatedStatus;
        }

        await candidate.save();

        return res.status(200).json({
            success:true,
            message:"Candidate status updated successfully",
            data:candidate,
        });
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Candidate updation failed",
        });
    }
}

exports.deleteCandidate = async(req, res) => {

    try{
        const {candidateId} = req.body

        if(!candidateId){
            return res.status(404).json({
                success:false,
                message:"Candidate not found"
            });
        }

        await Candidate.findByIdAndDelete(candidateId);

        return res.status(200).json({
            success:true,
            message:"Candidate deleted Successfully"
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to delete candidate",
        });
    }
}

exports.getAllCandidates = async(req, res) => {

    try{
        const allCandidates = await Candidate.find({});

        return res.status(200).json({
            success:true,
            message:"All candidates fetched successfully",
            data: allCandidates
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error",
        })
    }
}
