# 🎓 EduScribe - Transform Lectures into Learning

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **AI-powered transcription, summarization, and translation for educational content. Upload once, access forever with support for Nigerian local languages.**

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [User Roles](#-user-roles)
- [Supported Languages](#-supported-languages)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Features
- **📤 Audio/Video Upload**: Support for multiple formats (.mp3, .wav, .mp4, .mov, etc.)
- **📝 AI Transcription**: Automatic speech-to-text conversion
- **📚 Smart Summarization**: AI-generated summaries of lecture content
- **🌍 Multi-Language Translation**: Translation to Nigerian local languages (Yoruba, Igbo, Hausa)
- **👥 Role-Based Access**: Separate dashboards for teachers and students
- **🔒 Secure Authentication**: JWT-based authentication system
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 👨‍🏫 Teacher Features
- Upload lecture recordings
- Manage sessions and content
- View analytics and statistics
- Create and manage translations
- Access to all uploaded content

### 👨‍🎓 Student Features
- Access to transcribed lectures
- Download transcripts and summaries
- View translated content
- Search and filter sessions
- 24/7 availability to catch up on missed classes

## 🎬 Demo

Visit the live demo: [EduScribe Demo](https://your-demo-url.com)

### Screenshots

| Dashboard | Upload Interface | Session View |
|-----------|------------------|--------------|
| ![Dashboard](./screenshots/dashboard.png) | ![Upload](./screenshots/upload.png) | ![Session](./screenshots/session.png) |

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.5.3 (App Router)
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend Integration
- **API**: RESTful API integration
- **Authentication**: JWT tokens
- **File Upload**: FormData with multipart support
- **State Management**: React Context API

### Development Tools
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm/yarn/pnpm/bun
- **Development Server**: Next.js dev server

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun
- Backend API server (refer to backend documentation)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/edu_scribe.git
   cd edu_scribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5260/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
edu_scribe/
├── app/                          # Next.js App Router
│   ├── components/              # Reusable components
│   │   ├── AuthContext.js       # Authentication context
│   │   └── ProtectedRoute.js    # Route protection component
│   ├── [role]/                  # Dynamic role-based routing
│   │   └── session/
│   │       └── [id]/
│   │           └── page.jsx     # Session detail page
│   ├── login/                   # Authentication pages
│   ├── register/
│   │   ├── student/
│   │   └── teacher/
│   ├── student/                 # Student dashboard
│   │   └── dashboard/
│   ├── teacher/                 # Teacher dashboard & upload
│   │   ├── dashboard/
│   │   └── upload/
│   ├── globals.css              # Global styles
│   ├── layout.jsx               # Root layout
│   ├── page.jsx                 # Landing page
│   └── ClientWrapper.jsx        # Client-side wrapper
├── public/                      # Static assets
│   ├── image/
│   │   └── logo.png
│   └── [svg files]
├── package.json
├── tailwind.config.js
├── next.config.mjs
└── README.md
```

## 🔌 API Integration

### Authentication Endpoints
- `POST /api/User/Login` - User login
- `POST /api/User/RegisterTeacher` - Teacher registration
- `POST /api/User/RegisterStudent` - Student registration

### Session Management
- `GET /api/Session/Get/{id}` - Get session details
- `POST /api/Session/Upload` - Upload new session
- `GET /api/Session/GetByUser` - Get user sessions

### Translation Services
- `GET /api/SessionTranslation/GetAll/{sessionId}` - Get all translations
- `POST /api/SessionTranslation/Create/{sessionId}` - Create translation
- `GET /api/SessionTranslation/GetById/{id}` - Get translation content

### Summary Services
- `GET /api/Summary/Get/{sessionId}` - Get session summary

## 👥 User Roles

### 🎓 Teacher Role
- **Access**: Full CRUD operations on their content
- **Features**: Upload, manage, and analyze lecture content
- **Dashboard**: Analytics, session management, upload interface

### 📚 Student Role
- **Access**: Read-only access to educational content
- **Features**: View transcripts, summaries, and translations
- **Dashboard**: Browse sessions, search content, download materials

## 🌍 Supported Languages

### Primary Language
- **English** - Source language for uploads

### Translation Languages
- **Yoruba** (`yo`) - Nigerian local language
- **Igbo** (`ig`) - Nigerian local language  
- **Hausa** (`ha`) - Nigerian local language

## 📱 Responsive Design

EduScribe is fully responsive and optimized for:
- 📱 **Mobile devices** (320px and up)
- 📱 **Tablets** (768px and up)
- 💻 **Desktop** (1024px and up)
- 🖥 **Large screens** (1280px and up)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: Role-based access control
- **Session Management**: Automatic token validation and refresh
- **CORS Handling**: Proper cross-origin request handling
- **Input Validation**: Client-side and server-side validation

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Dark/Light Mode**: Adaptive color schemes
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages with toast notifications
- **Accessibility**: ARIA labels and keyboard navigation support

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint
```

## 📈 Performance

- **Next.js Optimization**: Automatic code splitting and optimization
- **Image Optimization**: Next.js Image component for optimized loading
- **Font Optimization**: Automatic font optimization with next/font
- **Bundle Analysis**: Optimized bundle sizes

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add appropriate comments and documentation
- Test your changes thoroughly
- Update the README if needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

## 📞 Support

If you have any questions or need help, please:
- 📧 Email: support@eduscribe.com
- 💬 Open an issue on GitHub
- 📖 Check the documentation

---

<div align="center">
  <p>Made with ❤️ for education</p>
  <p>EduScribe - Making education accessible through AI-powered transcription and translation</p>
</div>
