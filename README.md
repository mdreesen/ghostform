# 👻 GhostForm
GhostForm is a high-performance, minimalist multi-step form engine built with Nuxt 4 and TypeScript. It features client-side image compression to bypass server payload limits and seamless integration with Resend for lead delivery.

## ✨ Features
⚡ Ultra-Lightweight: Built with Nuxt 4 and optimized for speed.

🖼️ Smart Compression: Automatic client-side image resizing (Canvas API) to prevent 413 Payload Too Large errors.

📧 Resend Integration: Direct-to-email lead delivery with image attachments.

📱 Responsive UI: Styled with Tailwind CSS and designed for mobile-first interactions.

🔒 Type Safe: Fully written in TypeScript for robust development.

## 🚀 Getting Started
1. Clone the repository
Bash
git clone https://github.com/your-username/ghostform.git
cd ghostform
2. Install dependencies
Bash
npm install
3. Environment Setup
Create a .env file in the root directory and add your Resend API key:

Code snippet
RESEND_API_KEY=re_your_api_key_here
4. Run Development Server
Bash
npm run dev
Open http://localhost:3000 to see the form in action.

## 🛠️ How It Works
Image Compression
GhostForm intercepts file uploads using a custom TypeScript utility. It resizes images to a maximum width of 1600px and converts them to JPEG (0.7 quality) before sending. This typically reduces a 10MB mobile photo to under 500KB.

Multi-Step Logic
The form uses a reactive step state to transition between questions with smooth CSS transitions. Data is collected into a FormData object and sent to a Nitro server route.

Backend (Nitro)
The /server/api/lead.index.ts endpoint:

Parses multipart form data.

Extracts the JSON payload and the image buffer.

Constructs an email via Resend with the image as an attachment.
