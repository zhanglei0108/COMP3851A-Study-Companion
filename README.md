# Study Companion React Demo

## Start the demo

### Option 1: Double-click

Run `start-demo.bat`.

The first run installs the project dependencies. When Vite prints the local
address, open:

```text
http://localhost:5173
```

### Option 2: PowerShell

```powershell
cd D:\COMP3851A
npm.cmd install
npm.cmd run dev
```

Use `npm.cmd` on Windows if PowerShell blocks `npm.ps1`.

## Demo accounts

There is no real authentication yet. This version uses frontend mock logic.

- Student: `alex@student.edu`
- Admin: `admin@system.edu`
- Password: any non-empty value

An email containing `admin` opens the admin area. Other emails open the
student area.

## Suggested presentation flow

1. Log in as a student.
2. Search and open a project on the Dashboard.
3. Select a project and choose multiple files on Upload.
4. Generate a mock Summary from one file or all project files.
5. Ask a question in Q&A and generate a mock Quiz.
6. Log out and log in with the admin email.
7. Search users, filter materials, retry a failed file, review AI outputs,
   and create, disable, change permission, reset, or delete an account.

## Important

- Data is temporary React state and resets after refreshing the browser.
- The AI answers are mock responses.
- A future backend can replace `src/state/AppDataContext.jsx` without
  redesigning the pages.

## Run from a fresh GitHub download

```powershell
npm install
copy .env.example .env.local
# Open .env.local and add a temporary Gemini key if live AI is required.
npm run dev
```

The interface can still be reviewed without the key, but live Gemini requests
require `VITE_GEMINI_API_KEY` in the local `.env.local` file.

Do not commit `.env.local`, `node_modules`, or `dist`. Dependencies are restored
from `package.json` and `package-lock.json`, while `dist` is recreated with:

```powershell
npm run build
```
