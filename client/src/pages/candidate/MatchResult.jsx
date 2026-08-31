import { useEffect, useState } from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import {
  getJobMatch,
} from "../../services/matchingService";

import {
  applyForJob,
} from "../../services/applicationService";


function MatchResult() {
  const { jobId } = useParams();


  const [matchData, setMatchData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [matchError, setMatchError] =
    useState("");

  const [applyError, setApplyError] =
    useState("");

  const [applyMessage, setApplyMessage] =
    useState("");

  const [applying, setApplying] =
    useState(false);



  // FETCH JOB MATCH RESULT
 

  useEffect(() => {
    const fetchMatchResult = async () => {
      try {
        setLoading(true);
        setMatchError("");

        const data =
          await getJobMatch(jobId);

        console.log(
          "Match Result:",
          data
        );

        setMatchData(data);

      } catch (error) {

        console.error(
          "Match calculation error:",
          error
        );

        setMatchError(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to calculate job match."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchMatchResult();

  }, [jobId]);


  // APPLY FOR JOB
 

  const handleApply = async () => {
    try {
      setApplying(true);

      setApplyError("");

      setApplyMessage("");

      console.log(
        "Applying for Job ID:",
        jobId
      );


      const response =
        await applyForJob(
          jobId,
          ""
        );


      console.log(
        "Application Response:",
        response
      );


      setApplyMessage(
        response?.message ||
        "Application submitted successfully!"
      );

    } catch (error) {

      console.error(
        "Application error:",
        error
      );

      console.error(
        "Application server response:",
        error.response?.data
      );


      setApplyError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to submit application."
      );

    } finally {

      setApplying(false);

    }
  };



  // LOADING
 

  if (loading) {
    return (
      <div className="page-container">

        <div className="loading-message">
          Calculating your resume match...
        </div>

      </div>
    );
  }


  // MATCH ERROR
 

  if (matchError) {
    return (
      <div className="page-container">

        <div className="match-result-container">

          <div className="error-message">
            {matchError}
          </div>


          <div className="match-actions">

            <Link
              to="/jobs"
              className="secondary-button"
            >
              Back to Jobs
            </Link>

          </div>

        </div>

      </div>
    );
  }


  
  // MATCH RESULT
 

  return (
    <div className="page-container">

      <div className="match-result-container">

        <h1>
          Your Job Match Result
        </h1>


        <p>
          Your resume was analyzed against
          the job requirements.
        </p>


        {/* APPLICATION ERROR */}

        {applyError && (
          <div className="error-message">
            {applyError}
          </div>
        )}


        {/* APPLICATION SUCCESS */}

        {applyMessage && (
          <div className="success-message">
            {applyMessage}
          </div>
        )}


        {/* MATCH SCORE */}

        <div className="match-score-card">

          <h2>
            {matchData?.matchScore ?? 0}%
          </h2>

          <p>
            Match Score
          </p>

        </div>


        {/* MATCH DETAILS */}

        <div className="match-details-grid">

          <div className="match-detail-card">

            <h3>
              Text Similarity
            </h3>

            <p>
              {matchData?.textSimilarity ?? 0}%
            </p>

          </div>


          <div className="match-detail-card">

            <h3>
              Skill Match
            </h3>

            <p>
              {matchData?.skillMatchScore ?? 0}%
            </p>

          </div>

        </div>


        {/* MATCHED SKILLS */}

        <div className="skills-section">

          <h2>
            ✓ Matched Skills
          </h2>


          {matchData?.matchedSkills?.length > 0 ? (

            <div className="skills-list">

              {matchData.matchedSkills.map(
                (skill, index) => (

                  <span
                    key={index}
                    className="skill matched-skill"
                  >
                    ✓ {skill}
                  </span>

                )
              )}

            </div>

          ) : (

            <p>
              No matched skills found.
            </p>

          )}

        </div>


        {/* MISSING SKILLS */}

        <div className="skills-section">

          <h2>
            Skills to Improve
          </h2>


          {matchData?.missingSkills?.length > 0 ? (

            <div className="skills-list">

              {matchData.missingSkills.map(
                (skill, index) => (

                  <span
                    key={index}
                    className="skill missing-skill"
                  >
                    ✗ {skill}
                  </span>

                )
              )}

            </div>

          ) : (

            <p>
              Excellent! No missing skills.
            </p>

          )}

        </div>


        {/* ACTION BUTTONS */}

        <div className="match-actions">

          <button
            type="button"
            onClick={handleApply}
            disabled={
              applying ||
              Boolean(applyMessage)
            }
            className="primary-button"
          >
            {applying
              ? "Submitting Application..."
              : applyMessage
                ? "Application Submitted ✓"
                : "Apply for This Job"}
          </button>


          <Link
            to="/jobs"
            className="secondary-button"
          >
            Back to Jobs
          </Link>

        </div>

      </div>

    </div>
  );
}


export default MatchResult;