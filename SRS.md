# Software Requirements Specification (SRS) - AI Smart Quiz System

## 1. Introduction
**Prompt:** Write a professional Introduction for the AI Smart Quiz System SRS, covering the Purpose (1.1), Scope (1.2), Definitions and Abbreviations (1.3), and References (1.4) tailored for a web engineering project.

## 2. Problem Statement
**Prompt:** Elaborate on the Problem Statement (2.0) for the quiz system, highlighting how manual methods are inefficient and why an AI-driven centralized web solution is necessary.

## 3. Objectives
**Prompt:** Define the core Objectives (3.0) for the AI Smart Quiz System, focusing on automation, online accessibility, platform efficiency, and data security.

## 4. Overall Description
**Prompt:** Generate an Overall Description (4.0) that defines the client-server Perspective (4.1), core Product Functions (4.2) like AI generation and grading, User Classes (4.3) including Admin, Teacher, and Student, and the MERN stack Operating Environment (4.4).

## 5. System Architecture
**Prompt:** Explain the System Architecture (5.0) as a 3-tier MERN stack model, describing the Presentation Layer (React), Application Layer (Node.js/Express), and Data Layer (MongoDB).

## 6. System Models / Diagrams
### 6.1 Use Case Diagram
**Bot Prompt:** Generate a Mermaid.js or PlantUML code for a Use Case Diagram for an AI Smart Quiz System. Actors: Student, Teacher, and Admin. Key Use Cases: User Registration/Login, AI Question Generation (Topic/URL/Text), Quiz Attempting (MCQ/Theoretical), AI-based Theoretical Grading (Groq API), Folder-based Access Requests, and System Data Cleanup. Show relationships like "include" for Auth and "extend" for AI features.

### 6.2 Use Case Descriptions
**Bot Prompt:** Create a detailed Use Case Description table for the "Take Theoretical Quiz with AI Grading" feature. Include fields: Actor, Pre-conditions (Student enrolled), Basic Flow (Answer submission, Groq API evaluation), Post-conditions (Marks updated, Review Queue updated), and Exception flows (AI API Timeout).

### 6.3 Class Diagram
**Bot Prompt:** Generate a Class Diagram for a MERN stack application. Include classes for: **User** (name, email, role), **Quiz** (title, type, difficulty, duration), **Question** (text, type, points, correctAnswer), **Attempt** (score, percentage, timeTaken), and **Folder** (name, description). Show associations like: Teacher creates Quizzes, Quiz contains Questions, Student makes Attempts, and Folders contain multiple Quizzes.

### 6.4 Entity Relationship Diagram (ERD)
**Bot Prompt:** Generate an ERD for a MongoDB-based Quiz System. Define entities and their attributes: **Users** (ObjectId, name, email, hashedPassword), **Quizzes** (ObjectId, creatorId, type), **Questions** (ObjectId, quizId, text, explanation), **Attempts** (ObjectId, userId, quizId, score), and **ReviewQueue** (ObjectId, userId, questionId, nextReviewDate). Use Crow’s Foot notation to show One-to-Many relationships.

### 6.5 Data Flow Diagram (DFD)
**Bot Prompt:** Describe a Level 1 Data Flow Diagram for this system. Show the flow of data starting from a Student submitting a Theoretical Answer -> through the Application Server -> to the Groq AI API for grading -> returning a Score -> saving to the MongoDB Database -> and updating the Student Dashboard UI.

### 6.6 Sequence Diagram
**Bot Prompt:** Generate a Mermaid.js Sequence Diagram for the "AI Grading Process". Participants: Student (UI), Express Server (API), Groq API (LLM), and MongoDB. Flow: Student submits theoretical answer -> Server validates JWT -> Server sends prompt to Groq API -> Groq returns JSON score/feedback -> Server saves attempt data to Mongo -> Server sends success response to Student.

### 6.7 Activity Diagram
**Bot Prompt:** Generate an Activity Diagram for a Student taking a "Competitive Quiz". Start: Quiz Selected -> Check if already attempted? (Decision) -> If Yes: Show "Completed" and End. If No: Start Timer -> Render Questions -> Decision: Is Question MCQ or Theoretical? -> MCQ: Select Option -> Theoretical: Type Answer -> Loop until all questions answered or Timer ends -> Decision: Submit Quiz -> Calculate Mastery -> End.

### 6.8 Flowchart
**Bot Prompt:** Create a logical flowchart for the "Groq AI Theoretical Marking Logic". Steps: Receive Student Answer -> Compare with Reference Answer -> Generate prompt for Llama 3.1 -> Call API -> Parse JSON result -> Decision: Is score > 50%? -> Yes: Mark as 'Correct' for Mastery -> No: Mark as 'Incorrect' -> Update PointsEarned -> Add to ReviewQueue if wrong -> Finalize Result.

## 7. Functional Requirements
**Prompt:** List the Functional Requirements (7.0) for the system, specifically detailing User Registration, Login/Logout, AI Question Generation, AI Theoretical Grading, and Admin Management.

## 8. Non-Functional Requirements
**Prompt:** Define the Non-Functional Requirements (8.0), covering Performance metrics, Security standards (JWT/Bcrypt), UI/UX Usability, System Reliability, and Scalability.

## 9. External Interface Requirements
**Prompt:** Outline the External Interface Requirements (9.0), specifying the Responsive User Interface (9.1), Hardware Interface compatibility (9.2), and Software Interfaces for Google Gemini and Groq APIs (9.3).

## 10. Tools & Technologies
**Prompt:** Document the Tools & Technologies (10.0) section, listing React.js, Node.js, Express.js, MongoDB, Tailwind CSS, and the AI SDKs used for generating and grading content.

## 11. Future Enhancements
**Prompt:** Propose Future Enhancements (11.0) for the project, such as mobile app development, payment integration for premium features, and real-time multiplayer quiz modes.

## 12. Appendices
**Prompt:** Prepare the Appendices (12.0) section with descriptions of where to place system screenshots and examples of sample AI-generated quiz data.