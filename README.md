# 🚀 Orbit AI - LOR Generator Suite

<div align="center">

![Orbit AI Logo](https://img.shields.io/badge/Orbit_AI-LOR_Generator-6366f1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Bun](https://img.shields.io/badge/Bun-Runtime-f472b6?style=for-the-badge&logo=bun)

**An AI-powered Letter of Recommendation generator designed for elite institution applications**

[Features](#-features) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [Structure](#-project-structure) • [Usage](#-usage)

</div>

---

## 📖 Overview

Orbit AI's LOR Generator Suite is a comprehensive web application that leverages Google's Gemini 2.5 AI model to generate highly personalized, professional Letters of Recommendation. Built with modern web technologies, it provides an intuitive interface for creating, editing, and managing recommendation letters with advanced customization options.

**Author:** Swapnanil Manna

---

## ✨ Features

### 🔐 **Authentication System**
- Secure user registration with username, email, and password
- Session management powered by `better-auth`
- Protected routes and API endpoints
- **Routes:**
  - `/signup` - User registration
  - `/login` - User authentication

### 📝 **LOR Generator** (`/generator`)
- Comprehensive input form capturing:
  - Applicant information (name, achievements, qualities)
  - Referrer details (name, position, institution)
  - Letter tone and type customization
  - Target program/institution specifications
- **AI-Powered Generation** using Gemini 2.5 Flash
  - 700-900 word letters (increased from 400-600)
  - 3-4 substantial body paragraphs (100-150 words each)
  - 4096 token limit for rich, detailed content
- Real-time editable preview with rich text editor
- Save generated letters to database

### 📊 **Dashboard** (`/dashboard`)
- View all saved recommendation letters
- Edit letters with integrated rich text editor
- Delete unwanted letters
- Quick access to generate new letters
- Organized letter management interface

### 📥 **Export Capabilities**
- **PDF Export** - Professional, print-ready format
- **DOCX Export** - Editable Microsoft Word documents
- Available from both generator and dashboard views

### 🎨 **Modern UI/UX**
- Beautiful gradient design system
- Fully responsive layout (mobile, tablet, desktop)
- Professional landing page
- Intuitive navigation and user flows
- Professional typography and styling

### 🏆 **Elite Institution Quality**
- **10 comprehensive evaluation criteria:**
  - Intellectual rigor and academic excellence
  - Research capabilities and scholarly potential
  - Leadership and initiative
  - Innovation and creative thinking
  - Collaborative abilities
  - Communication skills
  - Personal character and integrity
  - Long-term potential and trajectory
  - Comparative assessments (e.g., "top 1-5% of students")
  - Specific examples with metrics and outcomes
- Sophisticated academic vocabulary
- Context-specific content for target programs
- Authentic, credible referrer perspective
- Complete professional signature block

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework with App Router | 15.x |
| **TypeScript** | Type-safe development | 5.x |
| **Bun** | JavaScript runtime and package manager | Latest |
| **Better-Auth** | Authentication and session management | Latest |
| **Gemini 2.5 Flash** | AI model for LOR generation | API |
| **React 19** | UI library (fully compatible) | 19.x |
| **Tailwind CSS** | Utility-first styling | 3.x |
| **Prisma** | Database ORM | Latest |
| **PostgreSQL/MySQL** | Relational database | - |

---

## 📁 Project Structure
```
orbit-ai-lor-generator/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── signup/
│   │       └── page.tsx          # Signup page
│   ├── (protected)/              # Protected routes group
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard page
│   │   └── generator/
│   │       └── page.tsx          # LOR generator page
│   ├── api/                      # API routes
│   │   ├── auth/                 # Auth endpoints
│   │   ├── generate-lor/         # LOR generation endpoint
│   │   ├── letters/              # CRUD operations
│   │   └── export/               # PDF/DOCX export
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── ...
│   ├── auth/                     # Auth components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── generator/                # Generator components
│   │   ├── LORForm.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── PreviewPanel.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── LetterCard.tsx
│   │   └── LetterList.tsx
│   └── shared/                   # Shared components
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/                          # Utility functions
│   ├── auth.ts                   # Better-auth configuration
│   ├── db.ts                     # Database connection
│   ├── gemini.ts                 # Gemini API setup
│   ├── utils.ts                  # Helper functions
│   └── validations.ts            # Zod schemas
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── public/                       # Static assets
│   ├── images/
│   └── fonts/
├── types/                        # TypeScript types
│   └── index.ts                  # Global type definitions
├── .env.local                    # Environment variables
├── .gitignore                    # Git ignore file
├── bun.lockb                     # Bun lock file
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.js                # Next.js config
└── README.md                     # This file
```

---

## 🚀 Installation

### Prerequisites

- **Bun** (v1.0 or higher) - [Install Bun](https://bun.sh)
- **Node.js** (v18 or higher) - Optional, as Bun replaces Node
- **PostgreSQL** or **MySQL** database
- **Google Gemini API Key** - [Get API Key](https://makersuite.google.com/app/apikey)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/orbit-ai-lor-generator.git
cd orbit-ai-lor-generator
```

### Step 2: Install Dependencies
```bash
bun install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/orbit_ai"
# Or for MySQL:
# DATABASE_URL="mysql://user:password@localhost:3306/orbit_ai"

# Better Auth
BETTER_AUTH_SECRET="your-super-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Database Setup
```bash
# Generate Prisma Client
bun prisma generate

# Run database migrations
bun prisma migrate dev --name init

# (Optional) Seed database with sample data
bun prisma db seed
```

### Step 5: Run Development Server
```bash
bun dev
```

The application will be available at `http://localhost:3000`

---

## 📦 Essential Commands

### Development
```bash
# Start development server
bun dev

# Start development server with turbo (faster)
bun dev --turbo
```

### Building
```bash
# Create production build
bun run build

# Start production server
bun start
```

### Database Management
```bash
# Open Prisma Studio (Database GUI)
bun prisma studio

# Create a new migration
bun prisma migrate dev --name migration_name

# Apply migrations to production
bun prisma migrate deploy

# Reset database (⚠️ deletes all data)
bun prisma migrate reset
```

### Code Quality
```bash
# Run TypeScript type checking
bun run type-check

# Run linting
bun run lint

# Format code with Prettier
bun run format
```

### Testing
```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

---

## 💻 Usage

### 1. **User Registration**
Navigate to `/signup` and create an account with:
- Username
- Email address
- Secure password

### 2. **Generate a Letter**
1. Log in and navigate to `/generator`
2. Fill out the comprehensive form:
   - **Applicant Details:** Name, program, achievements
   - **Referrer Information:** Your position, relationship to applicant
   - **Letter Specifications:** Tone (formal/warm), type (academic/professional)
   - **Target Institution:** Specific program or university
3. Click **"Generate LOR"**
4. Review the AI-generated letter in the rich text editor
5. Edit as needed using the toolbar controls
6. Click **"Save Letter"** to store in your dashboard

### 3. **Manage Letters**
- Navigate to `/dashboard` to view all saved letters
- **Edit:** Click on any letter to modify content
- **Export:** Download as PDF or DOCX
- **Delete:** Remove letters you no longer need

### 4. **Export Options**
- **PDF:** Professional format, ideal for printing or email
- **DOCX:** Editable Word document for further customization

---

## 🔑 Key Features Explained

### AI Generation Parameters
```typescript
{
  model: "gemini-2.5-flash",          // Stable Gemini 2.5 model
  maxOutputTokens: 4096,               // Supports 700-900 word letters
  temperature: 0.7,                    // Balanced creativity and consistency
  topP: 0.9,                           // Diverse vocabulary
  topK: 40                             // Quality output selection
}
```

### Letter Quality Standards

- **Length:** 700-900 words (substantial, detailed)
- **Structure:** 3-4 body paragraphs (100-150 words each)
- **Content:** Specific examples, metrics, and achievements
- **Tone:** Professional, authentic, credible
- **Format:** Complete with signature block and contact information

### Security Features

- JWT-based session management
- Password hashing with bcrypt
- Protected API routes with middleware
- CSRF protection
- Secure cookie handling

---

## 🎨 Customization

### Modify AI Generation Prompt

Edit `app/api/generate-lor/route.ts`:
```typescript
const prompt = `Generate a Letter of Recommendation...`;
```

### Adjust Letter Length

Modify token limits in `lib/gemini.ts`:
```typescript
maxOutputTokens: 4096, // Increase for longer letters
```

### Styling

Customize Tailwind configuration in `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      // Your custom color palette
    }
  }
}
```

---

## 🐛 Troubleshooting

### Issue: "Gemini API Model Not Found"

**Solution:** Ensure you're using `gemini-2.5-flash` (not 1.5 versions):
```typescript
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

### Issue: Database Connection Failed

**Solution:** Check your `DATABASE_URL` in `.env.local` and ensure the database is running.

### Issue: Authentication Not Working

**Solution:** Verify `BETTER_AUTH_SECRET` is set and is at least 32 characters long.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Swapnanil Manna**

- GitHub: [@swapnanil](https://github.com/swapnanil)
- Email: swapnanil@example.com

---

## 🙏 Acknowledgments

- **Google Gemini** for providing the AI model
- **Vercel** for Next.js framework
- **Better-Auth** for authentication solution
- **Bun** team for the fast runtime

---

## 🚀 Deployment

### Deploy to Vercel
```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

---

## 📞 Support

For issues, questions, or contributions:

1. Open an issue on [GitHub Issues](https://github.com/yourusername/orbit-ai-lor-generator/issues)
2. Contact the author directly
3. Check documentation at `/docs`

---

<div align="center">

**Made with ❤️ by Swapnanil Manna**

⭐ Star this repo if you find it helpful!

</div>
