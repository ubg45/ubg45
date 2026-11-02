# Turning on live Trending (5 minutes, free)

UBG45 records anonymous play statistics in a **Firebase Realtime Database** and builds the Trending tag from them.
Until you do this, nothing is recorded and the homepage row is honestly labelled "Popular".

1. Go to https://console.firebase.google.com and click **Add project** (name it anything, turn Google Analytics off).
2. In the project: **Build → Realtime Database → Create Database** (any location, start in **locked mode**).
3. Open the **Rules** tab, replace everything with the contents of `database.rules.json` from this repo, and click **Publish**.
   These rules let anyone read the counters, and only allow +1 open or up to +60 seconds of play per write, so the numbers can't be set to anything.
4. Copy the database URL shown at the top of the Data tab (like `https://your-project-default-rtdb.firebaseio.com`).
5. Paste it into `ubg45-config.js`:  `stats: { databaseUrl: 'https://your-project-default-rtdb.firebaseio.com', ... }` and commit.

## What is stored
`ubg45/days/<YYYY-MM-DD>/<game-id> = { o: opens, s: seconds played }`. Nothing about the person: no IP, name or device id.
Players can switch it off under Settings > Your data.

## Trending rule (edit in `ubg45-config.js` > `stats`)
Over the last `TRENDING_DAYS` (7) days a game trends when it has **a high number of opens OR a high amount of play time**:
at least `MIN_OPENS` (3) opens or `MIN_MINUTES` (15) minutes played, and always at least 2 opens (one tab left open can't trend).
The score is the better of "share of the busiest game's opens" and "share of the most-played game's minutes".
The top `TRENDING_MAX` (12) get the Trending tag and the Trending row.

## New tag (fully automatic)
`ubg45-added.js` holds the date each game first appeared. `.github/workflows/stamp-new-games.yml` runs
`tools/stamp-added.py` whenever `index.html` changes on `main`, stamps any game that wasn't there before with today's date,
and commits the file. A game shows the New tag for `NEW_DAYS` (14) days. You can run `python3 tools/stamp-added.py` yourself too.
