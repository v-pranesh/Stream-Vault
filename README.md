# STREAM VAULT — Video Upload, Processing & Streaming App

## Overview
Stream Vault is a full-stack video upload, processing, and streaming application. Users can upload videos, track real-time processing progress, and stream processed videos using HTTP range-based playback. The system supports authentication, role-based access control, and multi-tenant user isolation.

## Tech Stack
**Frontend**
- React (Vite)
- TypeScript
- Tailwind CSS
- shadcn-ui

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Multer (file upload)
- Socket.io (real-time updates)
- FFmpeg / processing simulation
- HTTP Range streaming API
- JWT authentication & RBAC

## Features
- Video upload with metadata storage  
- Processing pipeline with progress tracking  
- Sensitivity classification (safe / flagged — simulated)  
- Real-time processing updates via WebSockets  
- Secure video streaming using HTTP range requests  
- Role-based access control (Viewer / Editor / Admin)  
- Multi-tenant user isolation  
- MongoDB-based video and status tracking  

## Project Structure
- backend/
- frontend/
- README.md

## Local Development Setup

### Prerequisites
- Node.js and npm
- MongoDB (local or cloud)

### Installation
- git clone <REPO_URL>
- cd <PROJECT_NAME>
- npm install
- npm run dev


## Environment Variables
Create a `.env` file and configure the following:
- MONGO_URI
- JWT_SECRET
- PORT


## Notes
- The processing pipeline currently uses a simulated classifier  
- The architecture is designed to support real FFmpeg integration  
- The project can be extended for cloud storage and distributed processing  
