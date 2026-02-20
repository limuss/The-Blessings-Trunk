# 🎁 The Blessings Basket

A premium, interactive e-commerce platform for high-quality dry fruits and curated festive hampers. Designed with a focus on visual excellence and smooth user experience.

---

## ✨ Key Features

### 🎬 Interactive Product Animations
The site features custom-built **Image Sequence Animations** for flagship products. Using a high-performance `<canvas>` based player, products come to life as you scroll or hover.
- **Dynamic Preloading**: Images are cached for zero-lag playback.
- **Smart Placeholders**: The middle frame of the sequence is displayed immediately, ensuring a polished look even during initial load.
- **Responsive Sequences**: Tailored for both mobile and desktop experiences.

### 🍱 Curated Collections
- **Dry Fruits**: Premium Almonds, Cashews, Dates (Ajwa & Kalmi), Walnuts, and Saffron.
- **Festive Hampers**: Specially designed boxes for Eid, Diwali, Weddings, and Corporate Gifting.
- **Customization**: A personalized "Custom Hamper" experience for unique gifting needs.

### 🚀 Performance & UI
- **Tech Stack**: Built with **React 19**, **TypeScript**, and **Vite**.
- **Styling**: Modern, responsive CSS with a focus on premium aesthetics (serif typography, soft palettes, ivory backgrounds).
- **Backend & Deployment**: Powered by **Firebase** (Hosting & Auth) and deployed seamlessly via **Vercel** & **GitHub Actions**.

---

## 🛠️ Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) (Functional Components, Context API)
- **Typing**: [TypeScript](https://www.typescriptlang.org/) for robust development
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast HMR
- **Animations**: Custom HTML5 Canvas Image Sequence Player
- **Deployment**: [Firebase Hosting](https://firebase.google.com/docs/hosting) & [Vercel Sync](https://vercel.com/)

---

## 📦 Recent Major Updates

- ✅ **Product Visual Overhaul**: Replaced all generic placeholders with local high-definition assets.
- ✅ **Image Sequence Engine**: Implemented a reusable `ImageSequencePlayer` component.
- ✅ **Asset Optimization**: Organized source assets (ZIPs and static images) into a clean, readable structure.
- ✅ **Loading UX**: Added `placeholderFrame` support to animations for an instant "above-the-fold" visual presence.

---

## 🚀 Getting Started

### Local Development
1. Clone the repository: `git clone https://github.com/[USER]/The-Blessings-Basket.git`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

### Production Build
```bash
npm run build
firebase deploy --only hosting
```

---

## 📁 Project Structure

```text
├── components/          # Reusable UI components (Canvas player, Modals, etc.)
├── context/             # Global State (AuthContext, StoreContext)
├── pages/               # Main view components (Hampers, Home, Login)
├── public/              # Production-ready assets (Image sequences, static images)
└── services/            # Firebase and API configuration
```

---

*Hand-crafted with care for The Blessings Basket.*
