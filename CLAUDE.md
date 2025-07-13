# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Canto Learn is a Progressive Web App (PWA) for learning Cantonese through interactive quizzes. It's designed for children and presents Cantonese words/phrases with Norwegian translation options and visual icons.

## Key Commands

### Development
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

### Environment Setup
Create `.env` file with Noun Project API credentials:
```
VITE_NOUN_PROJECT_KEY=your_api_key
VITE_NOUN_PROJECT_SECRET=your_api_secret
```

## Architecture

### Core Components
- **App.jsx**: Main app wrapper that renders the Quiz component
- **Quiz.jsx**: Primary component handling quiz logic, state management, and user interactions
- **iconService.js**: Handles fetching icons from The Noun Project API with emoji fallbacks

### Data Structure
- **questions.json**: Contains 30 quiz questions with:
  - `tts_text`: Cantonese text for text-to-speech
  - `correct_answer`: Correct Norwegian translation with icon search term
  - `alternatives`: Array of 4 possible answers (including correct one)

### Key Features
- **Text-to-Speech**: Uses Web Speech API to pronounce Cantonese text
- **Icon System**: Fetches icons from The Noun Project API with comprehensive emoji fallbacks
- **Quiz Logic**: Shuffles answer alternatives, tracks score, handles answer validation
- **PWA Support**: Uses vite-plugin-pwa and Workbox for offline functionality

### State Management
Quiz component manages all state locally using React hooks:
- Current question index
- Selected answer and correctness
- Score tracking
- Icon loading and caching
- Shuffled alternatives with correct answer position

### Icon Handling
The iconService implements a two-tier system:
1. Primary: The Noun Project API for high-quality icons
2. Fallback: Comprehensive emoji mapping for all quiz terms

**Note**: The app now includes Netlify Functions to proxy API calls and avoid CORS issues in production. In local development without Netlify CLI, it falls back to direct API calls (which fail due to CORS) and then to emoji icons.

Icons are cached to improve performance and reduce API calls.

### Styling
- Uses CSS Grid and Flexbox for responsive design
- Child-friendly visual design with large touch targets
- Separate CSS files for components (Quiz.css, App.css)

## Development Notes

### Adding New Questions
Questions follow a specific structure in `src/data/questions.json`. Each question needs:
- Unique question_id
- Cantonese tts_text
- Correct answer with Norwegian text and icon_search term
- 3 alternative wrong answers with their icon_search terms

### Icon Search Terms
When adding new questions, ensure icon_search terms exist in the emoji fallback map in `iconService.js` or will return valid results from The Noun Project API.

### Text-to-Speech
The app attempts to find Cantonese voices (zh-HK, yue) but falls back to general Chinese voices if unavailable.

## Netlify Deployment

### Setup
1. Connect repository to Netlify
2. Add environment variables in Netlify dashboard:
   - `VITE_NOUN_PROJECT_KEY`
   - `VITE_NOUN_PROJECT_SECRET`
3. Deploy automatically uses `netlify.toml` configuration

### Local Development with Netlify CLI
```bash
npm install -g netlify-cli
netlify dev  # Runs with functions support
```

### Files
- `netlify/functions/get-icon.js`: Serverless function to proxy icon API calls
- `netlify.toml`: Netlify configuration for build and deployment
- Updated `iconService.js`: Uses Netlify function in production, falls back to direct API/emoji