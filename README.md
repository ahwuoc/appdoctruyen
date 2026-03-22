# 📚 Manga Platform (AppDocTruyen)

A modern, high-performance web application for reading comics online. Built with a premium "Cyber-Editorial" design aesthetic, leveraging **Next.js 15**, **Supabase**, and **Bun** for an ultra-fast and smooth user experience. 🚀

## 🌟 Key Features

✅ **Premium Reader UI** – A beautifully designed reading interface optimized for both desktop and mobile, featuring "Mimi" design tokens and smooth transitions.
✅ **Smart Image Optimization** – Automatically converts uploaded images to **WebP** format (reducing file size by 30-50%) and provides **AVIF** support for superior performance.
✅ **Advanced Content Management** – Interactive manager dashboard with drag-and-drop reordering, natural sorting for chapter images, and seamless Supabase Storage integration.
✅ **Real-time Navigation** – Fast chapter switching with server-side prefetching and client-side caching.
✅ **Skeleton Loading States** – Cyber-style skeleton loaders provide immediate visual feedback while content loads in the background.
✅ **Secure Authentication** – Robust user management via Supabase Auth (Login, Register, Admin roles).
✅ **Scalable Performance** – Powered by Bun for significantly faster builds and runtime execution compared to traditional Node.js setups.

---

## 🔧 Installation & Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/anhquoc1k98/appdoctruyen.git
cd appdoctruyen
```

### **2️⃣ Install Dependencies**
Using **Bun** is highly recommended:
```bash
bun install
```

### **3️⃣ Configuration**
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **4️⃣ Start Development Server**
```bash
bun run dev
```

---

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Runtime:** [Bun](https://bun.sh/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Components:** [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)

---

## 📸 Project Status
Currently in active development. Recent updates include:
- Client-side WebP image conversion before upload.
- Drag-and-drop reordering for both chapters and chapter-images.
- Fixed storage deletion logic to ensure orphaned files are removed from Supabase.
- Enhanced reader with premium skeleton loading background.

Made with ❤️ by [Anh Quoc](https://github.com/anhquoc1k98)