# COMP3851A Study Companion

An AI-powered study companion web application developed for the COMP3851A group project.

## Project Overview

The project provides separate student and administrator interfaces. Students can organise study projects, upload learning materials, review summaries and use the Q&A interface. Administrators can review users, materials, accounts, reports and system activity.

## Main Features

### Student interface

- Student dashboard and project workspace
- File upload interface
- Study material summary page
- AI-supported Q&A interface
- Project-based organisation of learning materials

### Administrator interface

- Administrator dashboard
- User and account management
- Material management
- Reports and activity review
- Privacy-focused administration views

## Requirements

Install a recent LTS version of Node.js before running the project.

## Quick Start on Windows

### 1. Download the project

Download the repository as a ZIP file and extract it to a local folder.

### 2. Configure the Gemini API key

The real API key is not included in the public repository.

Copy `.env.example` and rename the copy to `.env.local`.

Open `.env.local` and replace the placeholder value:

```text
VITE_GEMINI_API_KEY=replace_with_your_own_temporary_key
```

Save the file after entering a valid Gemini API key.

### 3. Start the project

Double-click:

```text
start-demo.bat
```

On the first run, the script automatically installs the required npm packages. When the terminal displays the local address, open:

```text
http://localhost:5173
```

## Manual Start

Open PowerShell or Command Prompt in the project folder and run:

```powershell
npm install
npm run dev
```

Then open the local address shown in the terminal.

## Demo Accounts

This prototype currently uses frontend demonstration authentication.

- Administrator email: `admin@system.edu`
- Student email: `alex@student.edu`
- Password: any non-empty value

An email address containing `admin` opens the administrator interface. Other email addresses open the student interface.

## Gemini Configuration

The Q&A interface reads the Gemini API key from:

```text
.env.local
```

If the key is missing, the website interface can still be reviewed, but live Gemini responses will not be available. Restart the development server after adding or changing the key.

## Repository Notes

The following generated or private files are intentionally excluded from GitHub:

- `.env.local` — contains the private Gemini API key
- `node_modules` — recreated automatically with `npm install`
- `dist` — recreated automatically with `npm run build`

The repository includes `package.json` and `package-lock.json`, so all required dependencies can be restored after downloading the project.

## Build the Project

To create a production build, run:

```powershell
npm run build
```

The generated build will appear in the `dist` folder.

## Current Prototype Scope

The project demonstrates the intended student and administrator workflows. Some data is stored in temporary frontend state and may reset when the page is refreshed. A production version would connect these workflows to a persistent backend and database.
