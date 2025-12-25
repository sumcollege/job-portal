-- 🎨 ELEVATE WORKFORCE SOLUTIONS DATABASE SETUP 🎨
-- Drop and recreate database to ensure clean setup
DROP DATABASE IF EXISTS job_portal2;
CREATE DATABASE job_portal2;
USE job_portal2;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('jobseeker', 'company') NOT NULL,
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    company_name VARCHAR(255) NULL,
    company_description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NULL,
    salary_range VARCHAR(100) NULL,
    location VARCHAR(255) NOT NULL,
    job_type ENUM('full-time', 'part-time', 'contract', 'internship') NOT NULL,
    company_id INT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    cover_letter TEXT NOT NULL,
    status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, user_id)
);

-- Insert sample data with bcrypt hash for "password"
INSERT INTO users (name, email, password, role, company_name, company_description) VALUES
('Tech Solutions Ltd', 'hr@techsolutions.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'company', 'Tech Solutions Ltd', 'Leading technology company in Nepal providing innovative software solutions.'),
('Digital Nepal', 'contact@digitalnepal.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'company', 'Digital Nepal', 'Digital transformation specialists helping businesses grow.'),
('Creative Hub', 'hello@creativehub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'company', 'Creative Hub', 'Award-winning creative agency specializing in design and branding.'),
('John Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jobseeker', NULL, NULL),
('Jane Smith', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jobseeker', NULL, NULL);

-- Insert sample jobs
INSERT INTO jobs (title, description, requirements, salary_range, location, job_type, company_id) VALUES
('Senior Full Stack Developer', 'Join our team to build amazing web applications using modern technologies. Work with React, Node.js, and cloud platforms.', 'Experience with React, Node.js, MySQL, REST APIs, 3+ years experience', 'NPR 100,000 - 150,000', 'Kathmandu', 'full-time', 1),
('UI/UX Designer', 'Create beautiful and intuitive user experiences. Work on web and mobile app designs.', 'Figma, Adobe Creative Suite, 2+ years experience, Portfolio required', 'NPR 70,000 - 100,000', 'Pokhara', 'full-time', 3),
('Mobile App Developer', 'Build cross-platform mobile applications using React Native and Flutter.', 'React Native or Flutter, JavaScript/Dart, Mobile development experience', 'NPR 80,000 - 120,000', 'Lalitpur', 'full-time', 1),
('Digital Marketing Specialist', 'Drive digital growth through SEO, social media, and content marketing.', 'SEO, Google Analytics, Social Media Marketing, Content Creation', 'NPR 50,000 - 80,000', 'Kathmandu', 'full-time', 2),
('Project Manager', 'Lead development projects and coordinate with cross-functional teams.', 'Project management experience, Agile/Scrum, Leadership skills', 'NPR 90,000 - 130,000', 'Kathmandu', 'full-time', 1),
('Frontend Developer Intern', 'Learn and grow with our development team. Perfect for recent graduates.', 'HTML, CSS, JavaScript, React basics, Eagerness to learn', 'NPR 25,000 - 35,000', 'Lalitpur', 'internship', 2);

-- Insert sample applications
INSERT INTO applications (job_id, user_id, cover_letter, status) VALUES
(1, 4, 'I am excited about this Full Stack Developer position. With my experience in React and Node.js, I believe I can contribute significantly to your team.', 'pending'),
(2, 5, 'As a creative professional, I am thrilled about joining your design team. My portfolio showcases various UI/UX projects.', 'reviewed'),
(4, 4, 'Digital marketing is my passion! I have experience with SEO and social media campaigns.', 'pending');

SELECT '🎉 Database setup completed successfully!' as message;
SELECT 'Login Credentials:' as info;
SELECT 'Job Seeker: john@example.com / password' as jobseeker;
SELECT 'Company: hr@techsolutions.com / password' as company;
