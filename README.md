# Imdad Areeph - Personal Portfolio Website

<div align="center">
  <img src="images/version.svg?sanitize=true" alt="version" width="100">
  <br>
  <strong>Senior Java Developer | Event-Driven Architect | AI Ecosystem Specialist</strong>
</div>

## 🚀 About

This is the personal portfolio website for **Imdad Areeph**, a Senior Java Developer with **13+ years of experience** in event-driven application development, microservices, and AI-powered ecosystems.

### Current Role
- **Senior Java Developer** at Emirates Airlines
- **Project:** Emirates Internet Booking Engine (Flight Booking System)
- **Specializations:** Event-driven architectures, AI ecosystems, reactive programming

### Key Expertise
- **Event-Driven Systems:** Solace, Apache Kafka, RabbitMQ, Event Sourcing, CQRS
- **Reactive Frameworks:** Spring WebFlux, Project Reactor, Functional Programming
- **AI/ML Ecosystems:** RAG, LangChain4j, Ollama, Vector DBs (PGVector, Neo4j)
- **Microservices:** Spring Boot, Spring Cloud, Docker, Kubernetes
- **Observability:** OpenTelemetry, Prometheus, Grafana, Jaeger

---

## 🛠️ Technology Stack

- **Backend:** Node.js, Express.js
- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap
- **Build Tools:** npm, Docker
- **Deployment:** Docker, GitHub Pages

---

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Docker** (optional, for containerized deployment)

### Check Installation
```bash
node --version
npm --version
docker --version  # if using Docker
```

---

## 🚀 Quick Start

### Option 1: Local Development (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/imdadareeph/imdadareeph.github.io.git
   cd imdadareeph.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and navigate to: `http://localhost:8888`
   - Health check endpoint: `http://localhost:8888/health`

### Option 2: Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t imdadareeph/portfolio:v1.0.0 .
   ```

2. **Run the container**
   ```bash
   docker run -d -p 8888:8888 --name portfolio imdadareeph/portfolio:v1.0.0
   ```

3. **Access the application**
   - Open your browser and navigate to: `http://localhost:8888`

### Option 3: Production Deployment

1. **Set environment variables**
   ```bash
   export PORT=3000  # or your preferred port
   ```

2. **Start with PM2 (recommended for production)**
   ```bash
   npm install -g pm2
   pm2 start index.js --name "portfolio"
   pm2 startup
   pm2 save
   ```

---

## 📁 Project Structure

```
imdadareeph.github.io/
├── css/                    # Stylesheets
│   ├── aos.css            # Animate On Scroll
│   ├── bootstrap.min.css  # Bootstrap framework
│   └── index.css          # Custom styles
├── js/                     # JavaScript files
│   ├── core/              # Core libraries
│   ├── aos.js             # Animate On Scroll
│   └── index.js           # Main JavaScript
├── images/                 # Image assets
├── libs/                   # External libraries
├── scripts/                # Custom scripts
├── index.html             # Main HTML file
├── index.js               # Express server
├── package.json           # Node.js dependencies
├── Dockerfile             # Docker configuration
└── README.md              # This file
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the development server |
| `npm test` | Run tests (placeholder) |
| `npm run build` | Build for production (if applicable) |

---

## 🌐 Live Demo

- **Website:** [imdadareeph.com](http://www.imdadareeph.com)
- **GitHub:** [github.com/imdadareeph](https://github.com/imdadareeph)
- **LinkedIn:** [linkedin.com/in/imdadareeph](https://www.linkedin.com/in/imdadareeph/)

---

## 📊 Features

### ✅ Implemented
- Responsive design with Bootstrap
- Animated sections with AOS (Animate On Scroll)
- Contact form integration
- Social media links
- Portfolio showcase
- Skills visualization
- Experience timeline
- Education details
- Certifications & awards
- Recent projects showcase

### 🔄 Recent Updates
- Updated to reflect current role and expertise
- Added AI/ML ecosystem projects
- Enhanced skills section with modern technologies
- Added certifications and awards section
- Improved server configuration with security headers
- Added health check endpoint
- Enhanced Docker support

---

## 🐳 Docker Commands

### Build Image
```bash
docker build -t imdadareeph/portfolio:latest .
```

### Run Container
```bash
docker run -d -p 8888:8888 --name portfolio imdadareeph/portfolio:latest
```

### Stop Container
```bash
docker stop portfolio
docker rm portfolio
```

### View Logs
```bash
docker logs portfolio
```

### Update Image
```bash
docker pull imdadareeph/portfolio:latest
docker stop portfolio
docker rm portfolio
docker run -d -p 8888:8888 --name portfolio imdadareeph/portfolio:latest
```

---

## 🔒 Security Features

- **Security Headers:** X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Compression:** Gzip compression for better performance
- **Static File Serving:** Secure static file handling
- **Health Check:** Built-in health monitoring endpoint

---

## 📈 Performance Optimization

- **Compression:** Gzip compression enabled
- **Static Assets:** Optimized image and CSS delivery
- **Caching:** Browser caching for static assets
- **Minification:** Minified CSS and JavaScript files

---

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 8888
   lsof -i :8888
   # Kill the process
   kill -9 <PID>
   ```

2. **Docker permission issues**
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER
   # Logout and login again
   ```

3. **Node modules issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Email:** imdadareeph@gmail.com
- **Phone:** +971-507605159
- **Website:** [imdadareeph.com](http://www.imdadareeph.com)
- **LinkedIn:** [linkedin.com/in/imdadareeph](https://www.linkedin.com/in/imdadareeph/)
- **GitHub:** [github.com/imdadareeph](https://github.com/imdadareeph)

---

<div align="center">
  <p>Made with ❤️ by Imdad Areeph</p>
  <p>Last updated: December 2024</p>
</div>
