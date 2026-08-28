const fs = require("fs");
const pool = require("../config/db");
const { PDFParse } = require("pdf-parse");
const { extractSkills } = require("../services/nlpService");

// Upload and process resume
const uploadResume = async (req, res) => {
  let parser;

  try {
    const candidateId = req.user.id;

    // Check whether file was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    const filePath = req.file.path;

    // Read uploaded PDF
    const pdfBuffer = fs.readFileSync(filePath);

    // Create PDF parser
    parser = new PDFParse({
      data: pdfBuffer,
    });

    // Extract text from PDF
    const pdfData = await parser.getText();

    const extractedText = pdfData.text.trim();

    // Check extracted text
    if (!extractedText) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({
        message: "Could not extract text from the PDF",
      });
    }

    // Extract skills using NLP
    const extractedSkills = extractSkills(extractedText);

    // Store resume information in MySQL
    const [result] = await pool.query(
      `INSERT INTO resumes
       (
         candidate_id,
         file_name,
         file_path,
         extracted_text,
         extracted_skills
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        candidateId,
        req.file.originalname,
        filePath,
        extractedText,
        JSON.stringify(extractedSkills),
      ]
    );

    return res.status(201).json({
      message: "Resume uploaded and processed successfully",
      resumeId: result.insertId,
      fileName: req.file.originalname,
      textLength: extractedText.length,
      skills: extractedSkills,
      extractedText: extractedText.substring(0, 1000),
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    // Delete uploaded file if processing fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      message: "Failed to process resume",
      error: error.message,
    });
  } finally {
    // Clean up PDF parser
    if (parser) {
      try {
        await parser.destroy();
      } catch (error) {
        console.error(
          "PDF parser cleanup error:",
          error.message
        );
      }
    }
  }
};

// Get resumes uploaded by logged-in candidate
const getMyResume = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const [resumes] = await pool.query(
      `SELECT
        id,
        candidate_id,
        file_name,
        extracted_text,
        extracted_skills,
        created_at
       FROM resumes
       WHERE candidate_id = ?
       ORDER BY created_at DESC`,
      [candidateId]
    );

    // Convert stored JSON string into an array
    const formattedResumes = resumes.map((resume) => {
      let skills = [];

      try {
        skills = resume.extracted_skills
          ? JSON.parse(resume.extracted_skills)
          : [];
      } catch (error) {
        skills = [];
      }

      return {
        ...resume,
        extracted_skills: skills,
      };
    });

    return res.status(200).json({
      message: "Resumes fetched successfully",
      count: formattedResumes.length,
      resumes: formattedResumes,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    return res.status(500).json({
      message: "Failed to fetch resumes",
      error: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  getMyResume,
};