use hirematch_ai;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CANDIDATE', 'EMPLOYER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    phone VARCHAR(20),
    location VARCHAR(100),
    bio TEXT,
    skills TEXT,
    experience DECIMAL(4,1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_profiles_location (location)
);

CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT NOT NULL,
    location VARCHAR(100),
    experience_required DECIMAL(4,1) DEFAULT 0,
    status ENUM('OPEN', 'CLOSED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_job_employer
        FOREIGN KEY (employer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_jobs_location (location),
    INDEX idx_jobs_status (status),
    INDEX idx_jobs_employer (employer_id)
);

CREATE TABLE resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    extracted_text LONGTEXT,
    extracted_skills TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_resume_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    INDEX idx_resumes_candidate (candidate_id)
);

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    candidate_id INT NOT NULL,
    resume_id INT,
    match_score DECIMAL(5,2) DEFAULT 0,
    status ENUM(
        'APPLIED',
        'REVIEWING',
        'SHORTLISTED',
        'REJECTED',
        'HIRED'
    ) DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_application_job
        FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_application_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_application_resume
        FOREIGN KEY (resume_id)
        REFERENCES resumes(id)
        ON DELETE SET NULL,

    UNIQUE KEY unique_job_candidate (job_id, candidate_id),

    INDEX idx_applications_job (job_id),
    INDEX idx_applications_candidate (candidate_id),
    INDEX idx_applications_score (match_score),
    INDEX idx_applications_status (status)
);

SHOW TABLES;

INSERT INTO users (name, email, password, role)
VALUES
('surya', 'surya@gmail.com', '252676', 'EMPLOYER'),
('Manthu', 'candidate@gmail.com', '123456', 'CANDIDATE');

--- testing
SELECT id, name, email, password, role
FROM users;