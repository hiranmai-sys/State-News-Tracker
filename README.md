# State Intel Desk

Multi-state political intelligence dashboard covering **Andhra Pradesh, Telangana, Bihar, Punjab, and Uttar Pradesh**.

## Features
- Real-time RSS aggregation from 11+ national & regional sources
- State-level filtering (AP / TS / BR / PB / UP)
- Category filters: Politics, Elections, Governance, Crime, Protests, Disaster
- Live ticker with latest headlines
- State pulse sidebar with story counts
- Auto-refreshes every 4 minutes
- Dark editorial UI

## Sources
NDTV · The Hindu · Times of India · Indian Express · Hindustan Times · Mint · Business Standard · Scroll.in · The Wire · Deccan Herald · Zee News + regional TOI feeds

## Deploy on Render

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Deploy — done!

## Local Development
```bash
npm install
npm start
# Open http://localhost:3000
```
