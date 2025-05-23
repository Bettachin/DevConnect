# 📘 DevConnect
DevConnect is a modern developer directory and blogging platform built with Next.js, Tailwind CSS, ShadCN UI, and Supabase. It allows developers to register, log in, create posts, comment, and connect with others. Admins have special access to monitor and manage the community.

# 🌐 Live Demo
👉 View Live on Vercel(https://dev-connect-green.vercel.app/)

# 📌 Features
🧑‍💻 Developer authentication (register/login/logout via Supabase)

📝 Post creation and listing

❤️ Like, comment, and reply to comments

🔍 User profile view and dashboard

🗺️ Map-based address autofill with Mapbox

👨‍💼 Admin dashboard to manage users and posts

🎨 Responsive, gradient-themed UI with Tailwind + ShadCN

# 🚀 Tech Stack
Frontend: Next.js 14, TypeScript, Tailwind CSS, ShadCN UI

Backend/Auth: Supabase

Maps: Mapbox API

Deployment: Vercel

 # 🛠️ Installation
 # 1. Clone the repo

git clone https://github.com/yourusername/devconnect.git

cd devconnect

# 2. Install dependencies

npm install or yarn install

# 3. Environment Variables
Create a .env file and add the following:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

🔒 Keep these values private and never commit them to version control.

# 4. Run locally
bash

npm run dev or yarn dev

Visit: http://localhost:3000

# 🧪 Supabase Setup
Create a Supabase project at supabase.com

Enable Email Auth

Add user metadata columns:

username, phone, address

Enable Row Level Security if needed

# 🗺️ Mapbox Setup
Sign up at mapbox.com

Generate an access token and add it to .env.local as NEXT_PUBLIC_MAPBOX_TOKEN

# 📁 Folder Structure (Summary)

/components      // Reusable UI components

/context         // Auth context

/pages           // Route pages

/styles          // Tailwind + global styles

/lib             // Supabase and utility functions

# 👮 Admin Access
To access the admin dashboard, log in with:

Email: admin@admin.com

Password: admin123

You can configure this in the Supabase user table or hardcode the credentials.

📄 License
MIT License. Feel free to use and modify.
