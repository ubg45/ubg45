/* UBG45 configuration - the only file you need to edit to curate the homepage.
 *
 * The game catalog itself lives in index.html (the <template id="catalog"> block).
 * To add a game, append one card to the END of that block: the newest cards at the
 * end are automatically shown in "New Games". Titles below must match a catalog
 * title (case-insensitive); titles that don't exist are skipped safely.
 */
(function (root) {
  var U = (root.UBG45 = root.UBG45 || {});

  U.config = {
    NEW_COUNT: 12,        // newest N catalog cards are flagged "New" (row + badge)
    NEW_PAGE_COUNT: 36,   // "New" page lists this many recent additions
    RECENT_MAX: 16,       // recently played kept per browser
    ROW_MAX: 24,          // tiles per horizontal row on the homepage
    CATEGORY_ROWS: 5,     // category rows shown under New Games
    MIN_CATEGORY_SIZE: 3, // categories with fewer games are hidden

    // Badges only appear for titles listed here, so they always reflect real data.
    // ("New" is automatic.) Example: hot: ['Slope'], top: ['Moto X3M']
    badges: { hot: [], top: [] },

    // Collage on the homepage. The first two become the large tiles.
    featured: ['Level 67', 'Moto X3M', 'Slope', 'Geometry Dash', 'Subway Surfers', 'Drift Hunters', 'Cookie Clicker',
      'Among Us', 'Eggy Car', 'Block Blast', 'Retro Bowl', '1v1.lol', 'Tunnel Rush', 'Run 3', 'Tiny Fishing',
      'Steal a Brainrot', 'Basket Random', 'Stickman Hook', 'Temple Run 2', 'Crossy Road', 'Drive Mad',
      'Snow Rider 3D', 'Paper.io 2', 'OvO', 'Eaglercraft 1.12.2', 'Getting Over It', 'Monkey Mart', 'Fruit Ninja',
      'Steal an Egg', 'Survive Lava For Brainrots', 'Bloons Tower Defense', 'Penalty Shooters 2', 'Stack',
      'Red Ball 4', 'Wordle Unlimited', '2048', 'Raft Wars', 'Drift Boss', 'Soccer Legends 2021', 'Flappy Bird'],

    // Hand-picked favourites (not live player statistics). Trending row = first ROW_MAX.
    trending: ['Slope', 'Moto X3M', 'Subway Surfers', 'Geometry Dash', 'Drift Hunters', 'Cookie Clicker', 'Level 67',
      'Among Us', 'Block Blast', 'Eggy Car', 'Tunnel Rush', 'Retro Bowl', '1v1.lol', 'Run 3', 'Tiny Fishing',
      'Steal a Brainrot', 'Basket Random', 'Stickman Hook', 'Temple Run 2', 'Crossy Road', 'Drive Mad',
      'Snow Rider 3D', 'Paper.io 2', 'OvO', 'Eaglercraft 1.12.2', 'Getting Over It', 'Monkey Mart', 'Fruit Ninja'],
    popularMore: ['Flappy Bird', '8 Ball Pool', 'Stack', 'Bloons Tower Defense', 'Raft Wars', 'Drift Boss', 'Wordle Unlimited',
      '2048', 'Tetris', 'Pacman', 'Angry Birds', 'Plants Vs Zombies', "Friday Night Funkin'", 'Stickman Fight Ragdoll',
      'Learn To Fly', 'Penalty Shooters 2', 'Soccer Legends 2021', 'Basketball Stars', 'Super Smash Flash', 'Cluster Rush',
      'Red Ball 4', 'Level Devil - NOT A Troll Game', 'Bob The Robber', 'Duck Life 4', "Papa's Pizzeria", 'Super Mario 64',
      'Little Alchemy 2', 'Sandboxels', 'Kick the Buddy', "Baldi's Basics", 'Backrooms', 'Rooftop Snipers 2', 'Pixel Shooter',
      'Fortzone Battle Royale', 'Dino Game', 'Google Snake', 'Idle Mining Empire', 'Bottle Flip 3D', 'Escape Road', 'Dunk Shot',
      'Basketball Legends', 'Dadish', 'Stardew Valley | Web Port', 'Bad Piggies', 'Peggle', 'Geometry Dash Lite'],

    // Category rules are matched against game titles (a game can belong to several).
    // re = pattern, not = exact titles to exclude, add = exact titles to include.
    categories: [
      { id: 'shooting', name: 'Shooting', re: /shoot|\bgun|snip|1v1|recoil|bullet|fortzone|swat|raft wars|archer|tank stars|royale/i,
        not: ['penalty shooters 2'], add: ['Blumgi Paintball'] },
      { id: 'roblox', name: 'Roblox', re: /roblox|robux|\bobby\b|obby blox|brainrot|tsunami|steal an egg/i },
      { id: 'racing', name: 'Racing', re: /racing|\brace\b|racer|drift|kart|\bf1\b|top speed|burnout|moto|x3m|wheelie|bike|biker|motorcycle|rider|\bmx\b/i,
        not: ['line rider', 'free rider', 'f1 reaction test'] },
      { id: 'car', name: 'Car', re: /\bcars?\b|drift|derby|monster|taxi|jeep|truck|parking|eggy car|escape road|madalin/i },
      { id: 'driving', name: 'Driving', re: /driv|simulator|parking|traffic|highway|truck|\bbus\b|tram|loader|hover race/i },
      { id: 'clicker', name: 'Clicker', re: /clicker|idle|tycoon|merge|mining|miner|fishing|monkey mart|dogeminer|gold digger/i,
        not: ['gold miner', 'gold miner: special edition'] },
      { id: 'survival', name: 'Survival', re: /surviv|lava|backrooms|escaping|zombie|pandemic|death run|fortzone/i },
      { id: 'horror', name: 'Horror', re: /baldi|backrooms|granny|fnaf|horror|scary/i },
      { id: 'sports', name: 'Sports', re: /soccer|football|basket|baseball|cricket|golf|boxing|wrestle|penalty|retro bowl|fifa|dunk|rocket goal|4th and goal|bottle flip|8 ball/i },
      { id: 'puzzle', name: 'Puzzle', re: /puzzle|quiz|2048|tetris|stacktris|sandtris|wordle|maze|block|bloxorz|baba|simon|color match|snail bob|bob the robber|alchemy|fluid|compare|fox|appel|plonky|stretch|spiral|3dash|merge/i,
        not: ['blumgi bounce'] },
      { id: 'action', name: 'Action', re: /fight|battle|ragdoll|knockout|duel|smash|zombie|royale|ninja|boxing|wrestle|blade|kick the buddy|stick war|age of war/i },
      { id: 'adventure', name: 'Adventure', re: /pokemon|stardew|mario 64|portal|toca life|getting over it|escaping the prison|breaking the bank|stealing the diamond/i },
      { id: 'platform', name: 'Platform', re: /\brun [123]\b|\brun$|runner|jump|platform|mario|sonic|dash|geometry|parkour|\bovo\b|red ball|surf|crossy|hook|tomb of|temple run|dadish|devil|only level|hardest game|easyest|cluster rush|getting over|jetpack|pogo|swingo|elastic|space waves|sprinter|fowlst|penguin|penga|get on top|jelly|going balls|slope|tunnel rush|shell jump/i },
      { id: 'simulation', name: 'Simulation', re: /simulator|simulation|sandbox|sand game|papa's|bartender|toca|stardew|alchemy|pandemic|kick the buddy|fluid|tycoon/i },
      { id: 'strategy', name: 'Strategy', re: /tower|defen|age of war|stick war|plants vs|chess|poker|hold'em|black jack|deal or no|clash|battle cats|bloons|solitaire|pandemic/i },
      { id: 'arcade', name: 'Arcade', re: /pacman|flappy|snake|dino game|fruit ninja|angry birds|bad piggies|peggle|dunk shot|plonky|simon|swingo|gobble|duck life|money movers|wacky flip/i, fallback: true }
    ],

    // Sidebar order: the first group mirrors the reference; groups are separated by a divider.
    sidebarGroups: [
      ['shooting', 'roblox', 'racing', 'car', 'clicker', 'survival'],
      ['driving', 'sports', 'puzzle', 'horror', 'action', 'adventure', 'arcade', 'platform', 'simulation', 'strategy']
    ],

    // Links
    suggestUrl: 'https://forms.gle/GR9hhSAvZJXXrHX29',
    creatorUrl: 'https://ubg42.github.io/creator'
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
