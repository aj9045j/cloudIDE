# CloudIDE 🚀

> A web-based Integrated Development Environment (IDE) with Docker container integration, file editing, and terminal access capabilities.

---

## 🌟 Project Overview

CloudIDE is a powerful, web-based Integrated Development Environment (IDE) designed for developers to interact directly with files inside Docker containers. It provides a responsive and dynamic UI for coding, editing files, and running commands in real time using **Node.js** and **Next.js**. This project aims to create a seamless development experience by combining frontend UI/UX with backend container operations.

### Key Features:
- 📁 **File Management:** Retrieve, edit, and update files in Docker containers.
- 🖥 **Terminal Integration:** Execute shell commands inside containers.
- ⚙️ **Docker Support:** Manage Docker containers, inspect file structures, and more.
- 🎨 **Responsive Design:** Fully responsive layout built with custom CSS and React.
- 📦 **Modular Design:** Easy to extend and customize for other container platforms.

## 🚧 Technologies Used

### Backend:
- **Node.js**: Powering the backend API.
- **Express.js**: Handling API requests.
- **Dockerode**: Interacting with Docker containers for file and process management.
- **Axios**: For making HTTP requests.

### Frontend:
- **Next.js**: Frontend library for UI rendering.
- **Monaco Editor**: Integrated code editor for real-time file editing.
- **CSS**: Custom styles for a responsive layout.

### Infrastructure:
- **Docker**: Containerized environment for the application.

---

## 📦 Project Setup

### Prerequisites

Make sure you have **Docker** and **Node.js** installed on your machine.

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/cloudIDE.git
```
2.**Install dependencies**:
```bash
  cd client
  npm install
```
3.**Run the project:**

```bash
npm run dev
```
4.**Run Backend**
```bash
cd server
npm i
node index.js
```
**Start Docker:** Ensure Docker is running and accessible. The app communicates with containers via Dockerode.

**🔧 Usage
File Operations:**
Navigate to the IDE section to interact with Docker containers.
You can view file structures and update files in real time.
File contents are fetched using the getFileContent API, allowing safe and clean read operations from the container.
**Terminal:**
Access the terminal to run shell commands inside the selected container.
Commands are executed and streamed to the frontend in real time.

**💡 How It Works**
Backend: The backend API interfaces with Docker containers using dockerode. It executes commands like cat to read files, and shell commands to update file contents.
Frontend: The React frontend uses axios to send API requests to the backend. The file tree and Monaco editor are synchronized for editing container files.

**🌱 Contributing**
Feel free to fork this project and contribute by submitting a pull request. Please follow the contribution guidelines.

**🙌 Acknowledgments**
Thanks to the contributors of Dockerode for simplifying container management in Node.js.
Monaco Editor for providing a smooth, in-browser code editor experience.



