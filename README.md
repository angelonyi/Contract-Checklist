# Contract Checklist Generator

## Overview
Contract Checklist Generator is a professional, polished web application designed to help users create a structured checklist for reviewing a contract before signing. It breaks down complex legal concepts into manageable, easy-to-understand checklist items to track review progress.

**Important:** This tool provides general informational guidance and is NOT legal advice. Always consult a qualified legal professional for your specific situation.

## Problem Being Solved
Many individuals and small business owners feel overwhelmed when reviewing contracts. They often don't know what to look for, missing critical elements like limitation of liability, payment terms, or intellectual property rights. This tool solves that by providing a structured, contract-type-aware checklist.

## Goals
- Provide an intuitive, step-by-step contract review guide.
- Simplify complex legal concepts into practical checks.
- Keep users organized with progress tracking.
- Deliver a fast, responsive, and trustworthy user experience.

## Features
- **Contract-Type Awareness**: Generates tailored checklists based on the contract type (e.g., Freelance, NDA, Employment).
- **Progress Tracking**: Visual progress bar and completion counts.
- **Local Persistence**: Saves your progress in the browser so you don't lose your work if you refresh.
- **Clipboard Export**: Copy a clean text version of your checklist to easily share or save.
- **Responsive Design**: Works flawlessly on mobile, tablet, and desktop.

## How it works
1. **Landing Page**: Explains the value proposition.
2. **Form**: Collects basic contract details (Type, Role, Other Party, Jurisdiction).
3. **Generation**: An algorithmic logic engine builds a checklist merging core contract essentials with type-specific additions.
4. **Review**: Users interact with a categorized list of high/medium/low priority items, checking them off as they verify the contract.

## Technology Stack
- **HTML5**: Semantic structure.
- **Vanilla CSS3**: Modern styling with CSS variables, flexbox/grid, and zero external dependencies.
- **Vanilla JavaScript (ES6)**: Application logic, DOM manipulation, and LocalStorage state management.

## Project Structure
- `index.html` - The single-page application structure containing all views.
- `style.css` - The styles governing the design system and responsive layout.
- `script.js` - The core logic for routing, form handling, and checklist generation.
- `README.md` - Project documentation.
- `PROJECT-JOURNAL.md` - Development journal detailing the build process and decisions.

## How to Install/Run
This is a purely client-side web application. No build steps or server are required.
1. Download or clone the repository.
2. Open `index.html` in any modern web browser.
3. Done!

## Design Decisions
- **Single Page Application (SPA)**: To provide a fast, seamless experience without page reloads.
- **Color Palette**: Selected a professional blue and slate color scheme to build trust and ensure high readability.
- **No External Dependencies**: Built using vanilla web technologies for maximum portability and zero setup time.
- **Priority Badges**: Added visual indicators for high/medium/low priority items to help users focus on critical clauses first.

## Limitations
- **No Backend**: Checklists are not saved to a database; they live in the browser's local storage.
- **Static Intelligence**: The checklist variations are hardcoded rules rather than a live AI backend (by design, to avoid paid API dependencies for the MVP).
- **Not Legal Advice**: The checklist items are broad and generalized.

## Future Improvements
- Integrate an AI API (like Gemini) for deeper, real-time contract text analysis.
- Add PDF export functionality for completed checklists.
- Support user accounts for cloud-syncing multiple contract reviews.
- Add a jurisdiction-specific database for more precise legal checks.

## Author
Developed as an MVP for contract review productivity. 
