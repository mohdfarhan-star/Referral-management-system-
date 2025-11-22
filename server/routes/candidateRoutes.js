const express = require("express");
const { getAllCandidates, createCandidate, updateCandidate, deleteCandidate } = require("../controllers/Candidate");
const router = express.Router()


// API routes for Candidate
router.post("/createCandidate", createCandidate);
router.post("/updateCandidate", updateCandidate);
router.post("/deleteCandidate", deleteCandidate);
router.get("/getAllCandidates", getAllCandidates);

module.exports = router
