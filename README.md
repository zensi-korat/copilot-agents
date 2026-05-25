# Admin Panel - React + Tailwind CSS

A modern, responsive admin panel built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, professional design
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast Build**: Powered by Vite for lightning-fast development and builds
- 🧩 **Reusable Components**: Pre-built UI components like Cards, Buttons, and StatCards
- 🛣️ **Routing**: React Router for multi-page navigation
- 📊 **Dashboard**: Sample dashboard with stats, charts, and activity feeds
- 👥 **User Management**: Demo users table with CRUD operations
- ⚙️ **Settings Page**: Settings management with sections and forms
- 🎯 **TypeScript**: Full type safety for better development experience

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Card.tsx
│   ├── StatCard.tsx
│   └── Button.tsx
├── pages/            # Page components
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   └── Settings.tsx
├── layouts/          # Layout components
│   └── AdminLayout.tsx
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will open automatically at http://localhost:3000

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technologies Used

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Next-generation build tool
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icons

## Customization

### Colors

Modify `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        /* your colors */
      }
    }
  }
}
```

### Components

All components are located in `src/components/` and can be easily modified or extended.

### Pages

Add new pages in `src/pages/` and add routes in `src/App.tsx`:

```typescript
<Route path="/new-page" element={<NewPage />} />
```

## License

MIT
