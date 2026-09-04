# 🎮 Awesome Sandbox

An interactive code sandbox for learning and demonstrations. Execute JavaScript code safely in a browser-based environment with real-time output and beautiful UI.

![Sandbox Preview](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🚀 **Real-time Code Execution** - Execute JavaScript instantly with safe VM sandbox
- 📝 **Interactive Editor** - Full-featured code editor with syntax highlighting
- 📊 **Live Output** - See results immediately with color-coded logs
- 🎨 **Beautiful UI** - Modern dark theme with smooth animations
- 📚 **6 Built-in Examples** - Learn with Hello World, Arrays, Async/Await, Classes, Recursion, and RegEx
- ✓ **Code Validation** - Check syntax before execution
- 🔄 **Real-time Collaboration** - WebSocket support for collaborative coding (coming soon)
- ⏱️ **Performance Metrics** - Execution time tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/debugeddd/awesome-sandbox.git
cd awesome-sandbox

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the server
npm start
```

Server will run on `http://localhost:3000`

### Development Mode

```bash
npm run dev
```

Uses nodemon for auto-restart on file changes.

## 🎯 Usage

1. **Open** `http://localhost:3000` in your browser
2. **Write** or paste JavaScript code in the editor
3. **Click** "Execute" or press `Ctrl+Enter` to run
4. **View** results in the output panel
5. **Choose** from 6 examples to learn

## 🛠️ API Endpoints

### POST `/api/execute`
Execute code and get results

```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "code": "console.log(2 + 2)"
  }'
```

Response:
```json
{
  "success": true,
  "result": null,
  "type": "undefined"
}
```

### POST `/api/validate`
Validate code syntax

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "const x = 1;"}'
```

Response:
```json
{
  "valid": true
}
```

### GET `/health`
Health check

```bash
curl http://localhost:3000/health
```

## 📚 Built-in Examples

### 1️⃣ Hello World
Basic console output and variables

### 2️⃣ Array Methods
Map, filter, and reduce operations

### 3️⃣ Async/Await
Promise handling and asynchronous code

### 4️⃣ Classes
Object-oriented programming with classes

### 5️⃣ Recursion
Factorial and Fibonacci implementations

### 6️⃣ RegEx
Pattern matching and string manipulation

## 🔒 Security

- Code execution in isolated VM2 sandbox
- 5-second timeout for infinite loops protection
- No file system access
- Limited standard library exposure
- Safe for untrusted code

## 📦 Dependencies

- **express** - Web framework
- **socket.io** - WebSocket support
- **vm2** - JavaScript sandbox
- **cors** - Cross-origin support
- **dotenv** - Environment variables

## 🎨 Project Structure

```
awesome-sandbox/
├── server.js           # Express server & API
├── package.json        # Dependencies
├── .env.example        # Environment template
├── public/
│   ├── index.html     # Main UI
│   ├── styles.css     # Styling
│   └── app.js         # Client logic
└── README.md          # Documentation
```

## 🚀 Deployment

### Heroku

```bash
heroku create your-sandbox
git push heroku main
heroku open
```

### Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t awesome-sandbox .
docker run -p 3000:3000 awesome-sandbox
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🗺️ Roadmap

- [ ] Python support via Pyodide
- [ ] Real-time collaboration
- [ ] Code sharing via URL
- [ ] Snippet library
- [ ] Dark/Light theme toggle
- [ ] Multi-file projects
- [ ] npm package imports
- [ ] Advanced performance profiling

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support

- 📧 Email: debugeddd@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/debugeddd/awesome-sandbox/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/debugeddd/awesome-sandbox/discussions)

## 🎉 Acknowledgments

- Built with Node.js & Express
- Styled with modern CSS
- Secured with VM2 sandbox
- Inspired by CodePen, JSFiddle, and RunKit

---

**Made with ❤️ by debugeddd**

Don't forget to ⭐ star this repository!