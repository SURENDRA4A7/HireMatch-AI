import { useState } from "react";

import { uploadResume } from "../../services/resumeService";

function ResumeUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setError("");
    setUploadResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Allows only PDF files
    if (file.type !== "application/pdf") {
      setError("Please select a PDF resume.");

      setSelectedFile(null);

      event.target.value = "";

      return;
    }

    // Maximum file size: 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file size must be less than 5 MB.");

      setSelectedFile(null);

      event.target.value = "";

      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF resume.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setUploadResult(null);

      const formData = new FormData();

      // IMPORTANT:
      // "resume" must match your backend multer field name
      formData.append("resume", selectedFile);

      const data = await uploadResume(formData);

      setUploadResult(data);
    } catch (error) {
      console.error("Resume upload failed:", error);

      setError(
        error.response?.data?.message ||
          "Failed to upload resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-upload-page">
      <div className="resume-upload-card">

        <h1>Upload Your Resume</h1>

        <p className="resume-subtitle">
          Upload your PDF resume and HireMatch AI will
          extract your information for job matching.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload}>

          <div className="file-upload-area">

            <label
              htmlFor="resume"
              className="file-upload-label"
            >
              Choose Resume PDF
            </label>

            <input
              id="resume"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={loading}
            />

            {selectedFile && (
              <div className="selected-file">
                <strong>Selected File:</strong>

                <p>{selectedFile.name}</p>

                <p>
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

          </div>

          <button
            type="submit"
            className="upload-button"
            disabled={loading}
          >
            {loading
              ? "Uploading and Parsing..."
              : "Upload Resume"}
          </button>

        </form>

        {uploadResult && (
          <div className="resume-result">

            <h2>Resume Processed Successfully ✓</h2>

            <div className="resume-result-info">

              <p>
                <strong>Resume ID:</strong>{" "}
                {uploadResult.resumeId}
              </p>

              <p>
                <strong>File Name:</strong>{" "}
                {uploadResult.fileName}
              </p>

              <p>
                <strong>Extracted Text Length:</strong>{" "}
                {uploadResult.textLength} characters
              </p>

            </div>

            <h3>Extracted Resume Preview</h3>

            <div className="extracted-text-preview">
              <pre>
                {uploadResult.extractedText}
              </pre>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default ResumeUpload;