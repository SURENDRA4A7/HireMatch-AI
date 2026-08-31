import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../../services/api";


function CreateJob() {

  const navigate =
    useNavigate();


  const [
    formData,
    setFormData,
  ] = useState({

    title: "",

    company: "",

    location: "",

    employmentType:
      "FULL_TIME",

    description: "",

    requiredSkills: "",

  });


  const [
    loading,
    setLoading,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  const handleChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;


    setFormData({

      ...formData,

      [name]: value,

    });

  };


  
  // CREATE JOB
  

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();


    try {

      setLoading(true);

      setError("");


      await api.post(
        "/jobs",
        {

          title:
            formData.title,

          company:
            formData.company,

          location:
            formData.location,

          employment_type:
            formData.employmentType,

          description:
            formData.description,

          required_skills:
            formData.requiredSkills,

        }
      );


      navigate(
        "/employer/jobs"
      );


    } catch (error) {

      console.error(
        "Create job error:",
        error
      );


      setError(

        error.response?.data?.message ||

        error.response?.data?.error ||

        "Failed to create job."

      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="page-container">

      <div className="create-job-page">


        {/* HEADER */}

        <div className="create-job-header">

          <span>
            EMPLOYER PORTAL
          </span>


          <h1>
            Post a New Job
          </h1>


          <p>
            Create a job opportunity and
            connect with qualified candidates.
          </p>

        </div>


        {/* FORM */}

        <div className="create-job-card">


          {error && (

            <div className="error-message">

              {error}

            </div>

          )}


          <form
            onSubmit={handleSubmit}
          >


            {/* JOB INFORMATION */}

            <div className="form-section">

              <h2>
                Job Information
              </h2>


              <p>
                Enter the basic details of
                the position you are hiring for.
              </p>


              <div className="form-grid">


                <div className="form-group">

                  <label>
                    Job Title
                  </label>


                  <input
                    type="text"
                    name="title"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: Java Backend Developer"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Company Name
                  </label>


                  <input
                    type="text"
                    name="company"
                    value={
                      formData.company
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: HireMatch Technologies"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Location
                  </label>


                  <input
                    type="text"
                    name="location"
                    value={
                      formData.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: Bangalore"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Employment Type
                  </label>


                  <select
                    name="employmentType"
                    value={
                      formData.employmentType
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="FULL_TIME">
                      Full Time
                    </option>


                    <option value="PART_TIME">
                      Part Time
                    </option>


                    <option value="INTERNSHIP">
                      Internship
                    </option>


                    <option value="CONTRACT">
                      Contract
                    </option>

                  </select>

                </div>


              </div>

            </div>


            {/* JOB DESCRIPTION */}

            <div className="form-section">

              <h2>
                Job Description
              </h2>


              <p>
                Describe the responsibilities,
                requirements and expectations
                for this role.
              </p>


              <div className="form-group">

                <label>
                  Job Description
                </label>


                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe the role, responsibilities and candidate requirements..."
                  rows="8"
                  required
                />

              </div>

            </div>


            {/* REQUIRED SKILLS */}

            <div className="form-section">

              <h2>
                Required Skills
              </h2>


              <p>
                Enter the important skills
                required for this position.
                Separate each skill with a comma.
              </p>


              <div className="form-group">

                <label>
                  Skills
                </label>


                <input
                  type="text"
                  name="requiredSkills"
                  value={
                    formData.requiredSkills
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: Java, Spring Boot, MySQL, REST API"
                  required
                />


                <small>
                  Example: Java, Spring Boot,
                  React, MySQL
                </small>

              </div>

            </div>


            {/* FORM ACTIONS */}

            <div className="create-job-actions">


              <button
                type="submit"
                disabled={
                  loading
                }
                className="create-job-submit"
              >

                {loading
                  ? "Publishing Job..."
                  : "Publish Job"}

              </button>


              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/employer/dashboard"
                  )
                }
                className="create-job-cancel"
              >

                Cancel

              </button>


            </div>


          </form>


        </div>


      </div>

    </div>

  );

}


export default CreateJob;