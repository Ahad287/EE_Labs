<div align="center">

  <img width="476" height="235" alt="image" src="https://github.com/user-attachments/assets/030af1ae-39e3-4ea9-9782-fc196c58fd60" />

  # ⚡ EE Labs: Digital Laboratory & Learning Management System
  
  **A production-grade, full-stack Virtual Lab Platform bridging the gap between theoretical electrical engineering and practical execution.**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
</div>

---

## 📖 Overview

**EE Labs** is a comprehensive Learning Management System (LMS) specifically tailored for university-level engineering laboratories. It replaces physical lab manuals with dynamic, interactive digital records and provides educators with powerful tools to assess students through strict, time-bound live exams and AI-generated quizzes.

Protected by Enterprise-grade security and strict Role-Based Access Control (RBAC), this platform ensures academic integrity while modernizing the student experience.

---

## ✨ Key Features

### 🛡️ Enterprise Security & Authentication
* **Hybrid SSO Login:** Seamless and passwordless Google Authentication powered by Firebase, strictly locked to the university domain (`@bitmesra.ac.in`).
* **OTP Fallback:** Custom-built email verification system using JavaMailSender for users without Google SSO.
* **JWT Authorization:** Secure, stateless API protection using SHA-256 encrypted JSON Web Tokens.
* **Triple-Role Architecture:** Distinct dashboards and route-guarding for **Students**, **Teachers**, and **Administrators**.

### 👨‍🎓 Interactive Student Experience
* **Virtual Lab Manuals:** Dynamic observation tables that auto-save locally and sync seamlessly to the backend.
* **Live Exam Engine:** Strict, time-bound assessments featuring ticking countdowns, auto-submission upon expiry, and one-attempt locks to prevent cheating.
* **Embedded Simulators:** Direct access to external circuit simulators within the lab manual interface.

### 👨‍🏫 Teacher Command Center
* **AI Quiz Generator:** Integrated with AI to automatically generate contextual quizzes based directly on laboratory manual data.
* **Manual Quiz Builder:** Granular control to author custom assessments, define correct answers, and schedule publish dates.
* **Data Export:** Instantly export student grades, lab submissions, and observation tables to Excel/CSV for official grading software.
* **Dynamic Experiment Manager:** Add, edit, or remove lab manuals, learning objectives, and safety protocols in real-time.

### ⚙️ Admin Controls
* **Approval Workflow:** Strict moderation queue for newly registered teacher accounts to prevent unauthorized access to grading systems.

---

## 🛠️ Technology Stack

### Frontend
* **Core:** React.js (v18), React Router
* **Auth:** Firebase Authentication (Google SSO)
* **Styling:** Custom CSS, Premium UI/UX with responsive design
* **Networking:** Axios

### Backend
* **Core:** Java 17, Spring Boot 3.x
* **Security:** Spring Security, JWT (JSON Web Tokens)
* **Database Management:** Spring Data JPA, Hibernate
* **Mail Integration:** Spring Boot Starter Mail (SMTP)

### Database
* **Database:** PostgreSQL
* **Structure:** Relational data modeling with foreign key constraints for Users, Submissions, Quizzes, and Experiments.

---

## 📸 Platform Gallery


| Student Dashboard |
| :---: |
| <img width="1900" height="937" alt="image" src="https://github.com/user-attachments/assets/e56aa203-e76f-407d-921b-abc4aa09afdb" /> |

| Student Live Exam Engine |
| :---: |
 | <img width="1904" height="940" alt="image" src="https://github.com/user-attachments/assets/f4700f8c-7870-4b0c-a768-f0a9fd9e2eab" /> |
 
| Teacher Command Center |
| :---: |
| <img width="1902" height="946" alt="image" src="https://github.com/user-attachments/assets/b4d98fc4-64f4-47a0-aa85-dc0c50e0569f" /> |

| AI Quiz Generator |
| :---: |
 | <img width="1908" height="941" alt="image" src="https://github.com/user-attachments/assets/c6809256-a34b-47e0-bb96-87418e9b5de6" /> |

---

## 📂 Project Structure (Monorepo)

```text
EE-Labs-LMS/
│
├── frontend/                   # React.js Client Application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components & Modals
│   │   ├── pages/              # Role-specific Dashboards
│   │   ├── firebase.js         # Firebase SSO Configuration
│   │   └── App.js              # Main Router & Theme
│   ├── package.json
│   └── .env                    # Hidden Firebase Keys
│
├── backend/                    # Spring Boot REST API
│   ├── src/main/java/.../
│   │   ├── controllers/        # API Endpoints (Auth, Submissions, Teacher)
│   │   ├── models/             # JPA Entities
│   │   ├── repository/         # Postgres Interfaces
│   │   └── security/           # JWT & Firebase Configuration
│   ├── src/main/resources/
│   │   ├── application.properties.example # DB & SMTP configuration template
│   │   └── firebase-service-account.json  # Hidden Firebase Admin SDK Key
│   └── pom.xml
│
└── .gitignore                  # Root level lockdown
