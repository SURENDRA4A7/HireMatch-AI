const fs = require("fs");
const pool = require("../config/db");
const { PDFParse } = require("pdf-parse");
const { extractSkills } = require("../services/nlpService");

// =================================
// UPLOAD AND PROCESS RESUME
// =================================

const uploadResume = async (req, res) => {
  let parser = null;
  let filePath = null;

  try {
    const candidateId = req.user.id;

    // Check whether file was uploaded
    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    filePath = req.file.path;

    console.log(
      "Processing resume:",
      req.file.originalname
    );

    console.log(
      "Resume file path:",
      filePath
    );

    // Check uploaded file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(
        "Uploaded resume file was not found"
      );
    }

    // Read uploaded PDF
    const pdfBuffer = fs.readFileSync(filePath);

    // Create PDF parser
    parser = new PDFParse({
      data: pdfBuffer,
    });

    // Extract text from PDF
    const pdfData = await parser.getText();

    const extractedText =
      pdfData?.text?.trim() || "";

    // Check extracted text
    if (!extractedText) {
      return res.status(400).json({
        message:
          "Could not extract text from the PDF. Please upload a text-based PDF.",
      });
    }

    console.log(
      "PDF text extracted successfully. Length:",
      extractedText.length
    );

    // Extract skills using NLP
    const extractedSkills =
      extractSkills(extractedText) || [];

    console.log(
      "Extracted skills:",
      extractedSkills
    );

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

    console.log(
      "Resume stored successfully:",
      result.insertId
    );

    return res.status(201).json({
      message:
        "Resume uploaded and processed successfully",
      resumeId: result.insertId,
      fileName: req.file.originalname,
      textLength: extractedText.length,
      skills: extractedSkills,
      extractedText: extractedText.substring(
        0,
        1000
      ),
    });

  } catch (error) {

    console.error(
      "Resume upload error:",
      error.message
    );

    console.error(error);

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

    // Delete temporary uploaded PDF
    if (
      filePath &&
      fs.existsSync(filePath)
    ) {
      try {
        fs.unlinkSync(filePath);

        console.log(
          "Temporary resume file deleted"
        );
      } catch (error) {
        console.error(
          "Resume file cleanup error:",
          error.message
        );
      }
    }
  }
};


// =================================
// GET LOGGED-IN CANDIDATE RESUMES
// =================================

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

    const formattedResumes = resumes.map(
      (resume) => {
        let skills = [];

        try {
          skills = resume.extracted_skills
            ? JSON.parse(
                resume.extracted_skills
              )
            : [];
        } catch (error) {
          console.error(
            "Skills JSON parse error:",
            error.message
          );

          skills = [];
        }

        return {
          ...resume,
          extracted_skills: skills,
        };
      }
    );

    return res.status(200).json({
      message:
        "Resumes fetched successfully",
      count: formattedResumes.length,
      resumes: formattedResumes,
    });

  } catch (error) {

    console.error(
      "Get resume error:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to fetch resumes",
      error: error.message,
    });
  }
};


module.exports = {
  uploadResume,
  getMyResume,
};