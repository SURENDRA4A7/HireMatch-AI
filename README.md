# HireMatch AI

## AI-Powered Job and Resume Matching Platform

HireMatch AI is a full-stack web application designed to connect candidates and employers through intelligent job and resume matching.

The platform analyzes candidate resume content against job descriptions and required skills to calculate a match score. Candidates can discover jobs, analyze compatibility, apply for opportunities, track their applications, and receive email notifications. Employers can create and manage job postings, track applications, and manage candidates through a centralized dashboard.

---

## Features

### Candidate Features

* User registration and authentication
* Secure JWT-based login
* Browse available job opportunities
* Search jobs by skills and location
* Resume and job description matching
* AI-powered match score calculation
* Skill match analysis
* Apply for jobs
* Track submitted applications
* View application status
* Candidate dashboard
* View application match details
* Application confirmation email notifications
* Application status update notifications

### Employer Features

* Employer registration and authentication
* Employer dashboard
* Create job postings
* View posted jobs
* Edit job details
* Delete job postings
* Open and close jobs
* View applications received for each job
* Track application counts
* Manage candidate applications

---

## Match Scoring System

HireMatch AI evaluates the compatibility between a candidate's resume and a job posting using two main factors.

### 1. Text Similarity

The application compares:

* Resume content
* Job description
* Required skills

Text similarity is calculated using TF-IDF techniques provided by the Natural library.

### 2. Skill Matching

The system identifies:

* Matched skills
* Missing skills
* Skill match percentage

### Overall Match Score

The final score is calculated using the following weighting:

* 40% Text Similarity
* 60% Skill Matching

This provides a more balanced evaluation by giving greater importance to required technical skills.

---

## Application Workflow

### Candidate Flow

1. Candidate registers or logs into the platform.
2. Candidate browses available job opportunities.
3. Candidate opens a job.
4. The system compares the resume with the job description and required skills.
5. HireMatch AI generates a match score.
6. The candidate applies for the job.
7. The application is stored in the database.
8. A confirmation email is sent to the candidate.
9. The candidate can track the application from the Candidate Dashboard or My Applications page.
10. The candidate receives email notifications when the application status changes.

### Employer Flow

1. Employer registers or logs into the platform.
2. Employer accesses the Employer Dashboard.
3. Employer creates a job posting.
4. The job becomes available to candidates when its status is OPEN.
5. Candidates apply for the job.
6. The employer can view all posted jobs.
7. The employer can edit or delete job postings.
8. The employer can view applications received for each job.
9. Application status can be updated during the hiring process.
10. Candidates receive email notifications about application updates.

---

## Technology Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* Role-Based Authorization
* Natural NLP Library
* Nodemailer

### Database

* MySQL

### Additional Services

* Gmail SMTP
* Gmail App Password

### Development Tools

* Git
* GitHub
* Visual Studio Code
* Postman

---

## System Architecture

```text
                        ┌─────────────────────┐
                        │      React.js       │
                        │      Frontend       │
                        └──────────┬──────────┘
                                   │
                                   │ Axios / HTTP Requests
                                   ▼
                        ┌─────────────────────┐
                        │     Express.js      │
                        │       Backend       │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
             ┌────────────┐ ┌────────────┐ ┌────────────┐
             │   MySQL    │ │ AI Matching│ │ Email सेवा │
             │  Database  │ │  Algorithm │ │ Nodemailer │
             └────────────┘ └────────────┘ └────────────┘
```

---

## Project Structure

```text
HireMatch-AI
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   │   ├── candidate
│   │   │   └── employer
│   │   ├── services
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── .gitignore
│
└── README.md
```

---

# API Overview

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

---

## Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id

POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id

GET    /api/jobs/employer/my-jobs
```

---

## Applications

```text
POST /api/applications/jobs/:jobId

GET  /api/applications/my-applications

GET  /api/applications/employer/jobs/:jobId

PUT  /api/applications/:applicationId/status
```

---

## Dashboards

### Candidate Dashboard

```text
GET /api/dashboard/candidate
```

### Employer Dashboard

```text
GET /api/dashboard/employer
```

---

## Authentication and Authorization

HireMatch AI uses JWT for secure authentication.

After successful login, the backend generates a JSON Web Token.

The token is sent with protected API requests.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Role-based authorization ensures that users can only access features allowed for their role.

### Candidate

Candidates can:

* Browse jobs
* View match results
* Apply for jobs
* View applications
* Access the Candidate Dashboard

### Employer

Employers can:

* Create jobs
* Update jobs
* Delete jobs
* Access the Employer Dashboard
* View applications for their jobs

---

# Database Design

The main database entities include:

```text
Users
│
├── Candidates
│
└── Employers
     │
     └── Jobs
          │
          └── Applications
```

### Main Tables

#### Users

Stores:

* User information
* Name
* Email
* Password
* Role

#### Jobs

Stores:

* Employer ID
* Job title
* Company
* Job description
* Required skills
* Location
* Employment type
* Salary range
* Experience requirement
* Job status

#### Applications

Stores:

* Candidate ID
* Job ID
* Match score
* Application status
* Applied date

---

# Email Notification System

HireMatch AI includes an automated email notification system using Nodemailer and Gmail SMTP.

### Application Confirmation

When a candidate successfully applies for a job, the system sends a confirmation email.

The email includes information such as:

* Job title
* Company
* Application status
* Confirmation of successful submission

### Application Status Updates

Candidates receive email notifications when employers update their application status.

Possible statuses include:

```text
APPLIED
REVIEWING
SHORTLISTED
REJECTED
HIRED
```

---

# Installation and Setup

## 1. Clone the Repository

```bash
git clone HireMatch-AI
```

Move into the project folder:

```bash
cd HireMatch-AI
```

---

## 2. Install Backend Dependencies

```bash
cd server

npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the `server` folder.

```text
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_NAME=YOUR_DATABASE_NAME

JWT_SECRET=YOUR_JWT_SECRET

EMAIL_USER=YOUR_GMAIL_ADDRESS
EMAIL_PASS=YOUR_GMAIL_APP_PASSWORD
```


---

## 4. Start the Backend Server

From the `server` directory:

```bash
npm start
```

Or, if using Nodemon:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

## 5. Install Frontend Dependencies

Open another terminal.

```bash
cd client

npm install
```

---

## 6. Start the Frontend

```bash
npm run dev
```

The frontend will typically run on:

```text
http://localhost:5173
```

---

# Security

The project includes several security practices:

* Password hashing
* JWT authentication
* Protected API routes
* Role-based authorization
* Employer ownership validation for job updates and deletion
* Candidate ownership validation for applications
* Environment variables for sensitive credentials
* `.env` exclusion from Git

---

# Future Improvements

Possible future enhancements include:

* Resume PDF upload
* Automatic resume text extraction
* Advanced AI-based semantic matching
* Job recommendations
* Candidate profile management
* Employer profile management
* Pagination
* Advanced filtering
* Application analytics
* Interview scheduling
* Real-time notifications
* File storage using cloud services
* Deployment using cloud platforms
* Docker containerization

---
**Home Page**
<img width="1902" height="897" alt="image" src="https://github.com/user-attachments/assets/01dbb735-7d78-4e06-854a-9e9b8d824e9f" />
**Candidate Dashboard**
<img width="1887" height="910" alt="image" src="https://github.com/user-attachments/assets/0eb33f1e-3938-460c-9448-3a4cdb60f54d" />
**Jobs Page**
<img width="1902" height="917" alt="image" src="https://github.com/user-attachments/assets/f381d6d1-4f06-4c84-9d8e-20b3550f3652" />
**Match Result Page**
<img width="1867" height="900" alt="image" src="https://github.com/user-attachments/assets/f6284b81-ba6b-4626-94d7-2e6cd8365b87" />
**My Applications**
<img width="1582" height="807" alt="image" src="https://github.com/user-attachments/assets/0a6271a8-3585-41dd-af3f-16f990592a41" />
**Employer Dashboard**
<img width="1725" height="890" alt="image" src="https://github.com/user-attachments/assets/9dd2adfc-3322-4ba9-9c31-aa9e0232a704" />
**Post Job**
<img width="1432" height="807" alt="image" src="https://github.com/user-attachments/assets/61a16fdf-cc1d-4d3c-9eb1-775e088e2ac4" />
**My Jobs**
<img width="1717" height="912" alt="image" src="https://github.com/user-attachments/assets/8231ebfe-7e0a-4919-885e-835dd1b6d664" />
**Edit Job**
<img width="1473" height="822" alt="image" src="https://github.com/user-attachments/assets/485a2db1-f323-4740-8bbb-32c083f73855" />
**View Applications**
<img width="1691" height="730" alt="image" src="https://github.com/user-attachments/assets/2fde96d4-6575-4c30-9425-b9133a4e681b" />
**Email Notificatrion**
<img width="1327" height="687" alt="image" src="https://github.com/user-attachments/assets/a0fbfb5b-693e-48a2-a97a-b0f91002a47f" />

```text
Home Page
Candidate Dashboard
Employer Dashboard
Job Listing Page
Job Match Result
My Applications
My Jobs
Post Job
View Applications
Email Notification
```


---

# Key Learning Outcomes

Through building HireMatch AI, the following concepts were implemented and practiced:

* Full-stack web application development
* RESTful API development
* React component architecture
* State management using React Hooks
* JWT authentication
* Role-based authorization
* MySQL database integration
* SQL queries and relationships
* Backend controller architecture
* Resume and job matching logic
* TF-IDF text similarity
* Skill matching algorithms
* Email automation using Nodemailer
* Gmail SMTP integration
* Git and GitHub version control

---

# Author

**Surendra Mangali**

Aspiring Software Developer | Java Backend Developer | Full Stack Developer

---


