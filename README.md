# Blog List App – Backend

This repository contains the backend implementation of the Blog List application, developed as part of the [Full Stack Open](https://fullstackopen.com/en/) course by the University of Helsinki.

## 📚 Part 4 – Introduction to backend

Currently implemented exercises:

- ✅ 4.1: Blog list application, step 1
- ✅ 4.2: Blog list application, step 2

More exercises will be added progressively as I advance in the course.

## 🛠️ Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- Jest (for future testing)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/The-Memin/fullstackopen-bloglist.git
cd bloglist
```
### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a ```.env``` file in the root directory with the following content:

```env
MONGODB_URI=your_mongodb_uri_here
PORT=3001
```

### 4. Run the development server
```bash
npm run dev
```

## 📁 Project structure

```pgsql
project-root/
├── dist/ # React frontend build (served statically)
├── index.js # Express backend entry point
├── package.json
└── README.md
```
-----

Made with 📖 by Guillermo
---