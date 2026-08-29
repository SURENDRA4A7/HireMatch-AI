const nodemailer = require("nodemailer");


// =====================================
// GMAIL TRANSPORTER
// =====================================

const transporter = nodemailer.createTransport({

  service: "gmail",

  auth: {

    user:
      process.env.EMAIL_USER,

    pass:
      process.env.EMAIL_PASSWORD,

  },

});


// =====================================
// SEND APPLICATION CONFIRMATION EMAIL
// =====================================

const sendApplicationConfirmation =
  async (
    candidateEmail,
    candidateName,
    jobTitle,
    company
  ) => {

    try {

      const mailOptions = {

        from: `"HireMatch AI" <${process.env.EMAIL_USER}>`,

        to:
          candidateEmail,

        subject:
          `Application Received - ${jobTitle}`,

        html: `

          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
          ">

            <h2 style="
              color: #1f2937;
            ">
              Application Received Successfully
            </h2>

            <p>
              Hi <strong>${candidateName}</strong>,
            </p>

            <p>
              Your application has been successfully submitted
              through <strong>HireMatch AI</strong>.
            </p>

            <div style="
              background: #f3f4f6;
              padding: 18px;
              border-radius: 8px;
              margin: 20px 0;
            ">

              <p>
                <strong>Job:</strong>
                ${jobTitle}
              </p>

              <p>
                <strong>Company:</strong>
                ${company}
              </p>

            </div>

            <p>
              You can track your application status from
              your HireMatch AI dashboard.
            </p>

            <p>
              Best regards,
              <br />
              <strong>HireMatch AI Team</strong>
            </p>

          </div>

        `,

      };


      const info =
        await transporter.sendMail(
          mailOptions
        );


      console.log(
        "Application confirmation email sent:",
        info.messageId
      );


      return true;


    } catch (error) {

      console.error(
        "Application email sending error:",
        error.message
      );


      return false;

    }

  };


// =====================================
// SEND APPLICATION STATUS EMAIL
// =====================================

const sendApplicationStatusEmail =
  async (
    candidateEmail,
    candidateName,
    jobTitle,
    company,
    status
  ) => {

    try {

      const statusMessages = {

        APPLIED: {
          title:
            "Application Submitted",
          message:
            "Your application has been successfully submitted.",
        },

        REVIEWING: {
          title:
            "Application Under Review",
          message:
            "Your application is currently being reviewed by the employer.",
        },

        SHORTLISTED: {
          title:
            "Congratulations! You Have Been Shortlisted",
          message:
            "Congratulations! The employer has shortlisted your application for the next stage.",
        },

        REJECTED: {
          title:
            "Application Update",
          message:
            "Thank you for your interest. Unfortunately, the employer has decided not to move forward with your application at this time.",
        },

        HIRED: {
          title:
            "Congratulations! You Have Been Selected",
          message:
            "Congratulations! The employer has selected you for this opportunity.",
        },

      };


      const emailContent =
        statusMessages[status] ||
        {
          title:
            "Application Status Updated",

          message:
            `Your application status has been updated to ${status}.`,
        };


      const mailOptions = {

        from:
          `"HireMatch AI" <${process.env.EMAIL_USER}>`,

        to:
          candidateEmail,

        subject:
          `${emailContent.title} - ${jobTitle}`,

        html: `

          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
          ">

            <h2 style="
              color: #1f2937;
            ">
              ${emailContent.title}
            </h2>

            <p>
              Hi <strong>${candidateName}</strong>,
            </p>

            <p>
              ${emailContent.message}
            </p>

            <div style="
              background: #f3f4f6;
              padding: 18px;
              border-radius: 8px;
              margin: 20px 0;
            ">

              <p>
                <strong>Job:</strong>
                ${jobTitle}
              </p>

              <p>
                <strong>Company:</strong>
                ${company}
              </p>

              <p>
                <strong>Current Status:</strong>
                ${status}
              </p>

            </div>

            <p>
              Please log in to HireMatch AI to view
              your latest application details.
            </p>

            <p>
              Best regards,
              <br />
              <strong>HireMatch AI Team</strong>
            </p>

          </div>

        `,

      };


      const info =
        await transporter.sendMail(
          mailOptions
        );


      console.log(
        `Application status email sent (${status}):`,
        info.messageId
      );


      return true;


    } catch (error) {

      console.error(
        "Application status email sending error:",
        error.message
      );


      return false;

    }

  };


// =====================================
// EXPORTS
// =====================================

module.exports = {

  sendApplicationConfirmation,

  sendApplicationStatusEmail,

};