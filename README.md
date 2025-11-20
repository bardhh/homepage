# Academic Homepage

A modern academic homepage built with Next.js, featuring automatic publication parsing from BibTeX files, dark mode support, and responsive design.

## Features

- 🎨 **Modern UI/UX**: Clean, professional design with smooth animations and transitions
- 🌓 **Dark Mode**: System-aware theme toggle with persistent user preferences
- 📚 **BibTeX Integration**: Automatic publication parsing from `.bib` files
- 📱 **Responsive Design**: Optimized for all device sizes
- 🚀 **Static Export**: Builds to static HTML for fast deployment
- 🎯 **SEO Optimized**: Proper meta tags and semantic HTML
- ♿ **Accessible**: WCAG compliant with proper ARIA labels

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: React Icons, Font Awesome, Academicons
- **Theming**: next-themes

## Getting Started

### Prerequisites

- Node.js >= 20.9.0
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

Generate a static export:

```bash
npm run build
```

The static files will be generated in the `out` directory.

## Project Structure

```
├── public/
│   ├── publications.bib    # BibTeX file for publications
│   ├── profile.jpg         # Profile picture
│   └── ...                 # Other assets
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   │   ├── Header.tsx
│   │   ├── Publications.tsx
│   │   ├── ResearchAreas.tsx
│   │   └── ...
│   ├── lib/                # Utility functions (e.g., BibTeX parser)
│   └── types/              # TypeScript type definitions
└── scripts/                # Build and utility scripts
```

## Updating Content

### Publications

Edit `public/publications.bib` with your BibTeX entries. The site will automatically parse and display them.

### Profile & Bio

- Update profile picture: Replace `public/profile.jpg`
- Update bio text: Edit `src/app/page.tsx`

### Research Areas, Teaching, Software

Edit the respective component files in `src/components/`:
- `ResearchAreas.tsx`
- `Teaching.tsx`
- `Software.tsx`

## Deployment

This site is configured for deployment on **Azure Static Web Apps** via GitHub Actions.

On every push to the `master` branch, the site automatically:
1. Builds the Next.js static export
2. Deploys to Azure Static Web Apps

See `.github/workflows/` for the deployment configuration.

## License

This project is for personal academic use.

## Acknowledgments

Built with Next.js and deployed on Azure Static Web Apps.
