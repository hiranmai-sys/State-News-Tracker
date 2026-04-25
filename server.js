const express = require('express');
const cors = require('cors');
const RSSParser = require('rss-parser');
const path = require('path');

const app = express();
const parser = new RSSParser({
  timeout: 12000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; StateNewsTracker/1.0; +https://github.com/statenews)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── RSS FEED SOURCES ───────────────────────────────────────────────────────
const FEEDS = [
  // National - will be filtered by state keywords
  { url: 'https://feeds.feedburner.com/ndtvnews-top-stories', source: 'NDTV', type: 'national' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', source: 'Times of India', type: 'national' },
  { url: 'https://www.thehindu.com/news/national/feeder/default.rss', source: 'The Hindu', type: 'national' },
  { url: 'https://indianexpress.com/section/india/feed/', source: 'Indian Express', type: 'national' },
  { url: 'https://feeds.feedburner.com/zeenews/india', source: 'Zee News', type: 'national' },
  { url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', source: 'Hindustan Times', type: 'national' },
  { url: 'https://www.livemint.com/rss/politics', source: 'Mint Politics', type: 'national' },
  { url: 'https://www.business-standard.com/rss/politics-and-current-affairs-11.rss', source: 'Business Standard', type: 'national' },
  { url: 'https://scroll.in/feed', source: 'Scroll.in', type: 'national' },
  { url: 'https://thewire.in/feed', source: 'The Wire', type: 'national' },
  { url: 'https://www.deccanherald.com/rss/national-feed.xml', source: 'Deccan Herald', type: 'national' },
  // Regional
  { url: 'https://www.thehindu.com/news/national/andhra-pradesh/feeder/default.rss', source: 'The Hindu AP', type: 'ap' },
  { url: 'https://www.thehindu.com/news/national/telangana/feeder/default.rss', source: 'The Hindu Telangana', type: 'telangana' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1082732712.cms', source: 'TOI Hyderabad', type: 'telangana' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms', source: 'TOI Lucknow', type: 'up' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1376380821.cms', source: 'TOI Patna', type: 'bihar' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1070073553.cms', source: 'TOI Chandigarh', type: 'punjab' },
  // Google News RSS - very reliable, covers all states
  { url: 'https://news.google.com/rss/search?q=andhra+pradesh+politics&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=telangana+politics&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'telangana' },
  { url: 'https://news.google.com/rss/search?q=bihar+politics&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'bihar' },
  { url: 'https://news.google.com/rss/search?q=punjab+politics&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'punjab' },
  { url: 'https://news.google.com/rss/search?q=uttar+pradesh+politics&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'up' },
  { url: 'https://news.google.com/rss/search?q=andhra+pradesh+government&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=telangana+government&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'telangana' },
  { url: 'https://news.google.com/rss/search?q=yogi+adityanath+UP&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'up' },
  { url: 'https://news.google.com/rss/search?q=nitish+kumar+bihar&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'bihar' },
  { url: 'https://news.google.com/rss/search?q=bhagwant+mann+punjab&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'punjab' },
];

// ─── STATE KEYWORD CONFIG ────────────────────────────────────────────────────
const STATES = {
  ap: {
    name: 'Andhra Pradesh',
    short: 'AP',
    color: '#1a6b3c',
    keywords: [
      'andhra pradesh', 'andhra', 'amaravati', 'visakhapatnam', 'vizag',
      'vijayawada', 'tdp', 'ysrcp', 'ycp', 'jagan', 'chandrababu', 'naidu',
      'pawan kalyan', 'janasena', 'tirupati', 'guntur', 'kurnool', 'nellore',
      'rajahmundry', 'krishna district', 'ap government', 'ap cm'
    ]
  },
  telangana: {
    name: 'Telangana',
    short: 'TS',
    color: '#c0392b',
    keywords: [
      'telangana', 'hyderabad', 'brs', 'trs', 'congress telangana', 'revanth reddy',
      'kcr', 'ktr', 'bhrs', 'secunderabad', 'warangal', 'nizamabad', 'karimnagar',
      'khammam', 'ts government', 'telangana cm', 'hyd', 'cyberabad', 'musi'
    ]
  },
  bihar: {
    name: 'Bihar',
    short: 'BR',
    color: '#d35400',
    keywords: [
      'bihar', 'patna', 'nitish kumar', 'jdu', 'rjd', 'lalu prasad', 'tejashwi',
      'nda bihar', 'bjp bihar', 'muzaffarpur', 'gaya', 'bhagalpur', 'darbhanga',
      'bihar government', 'bihar cm', 'bihar election', 'mithila', 'seemanchal'
    ]
  },
  punjab: {
    name: 'Punjab',
    short: 'PB',
    color: '#8e44ad',
    keywords: [
      'punjab', 'chandigarh', 'aap punjab', 'bhagwant mann', 'congress punjab',
      'akali dal', 'ludhiana', 'amritsar', 'jalandhar', 'patiala', 'mohali',
      'punjab government', 'punjab cm', 'shiromani', 'sgpc', 'sikh', 'farmer punjab'
    ]
  },
  up: {
    name: 'Uttar Pradesh',
    short: 'UP',
    color: '#2471a3',
    keywords: [
      'uttar pradesh', 'lucknow', 'yogi adityanath', 'yogi', 'sp party', 'samajwadi',
      'akhilesh', 'bsp', 'mayawati', 'bjp up', 'kanpur', 'varanasi', 'agra',
      'allahabad', 'prayagraj', 'meerut', 'noida', 'ghaziabad', 'mathura', 'ayodhya',
      'up government', 'up cm', 'up election', 'gorakhpur', 'bareilly'
    ]
  }
};

// ─── CATEGORY DETECTION ──────────────────────────────────────────────────────
function detectCategory(text) {
  const t = text.toLowerCase();
  if (t.includes('election') || t.includes('vote') || t.includes('poll') || t.includes('campaign') || t.includes('candidate')) return 'election';
  if (t.includes('crime') || t.includes('arrest') || t.includes('police') || t.includes('murder') || t.includes('rape') || t.includes('scam') || t.includes('fraud')) return 'crime';
  if (t.includes('flood') || t.includes('rain') || t.includes('drought') || t.includes('earthquake') || t.includes('cyclone') || t.includes('disaster')) return 'disaster';
  if (t.includes('minister') || t.includes('government') || t.includes('cm ') || t.includes('chief minister') || t.includes('bjp') || t.includes('congress') || t.includes('party')) return 'politics';
  if (t.includes('hospital') || t.includes('health') || t.includes('doctor') || t.includes('disease') || t.includes('water') || t.includes('school') || t.includes('road')) return 'governance';
  if (t.includes('protest') || t.includes('agitation') || t.includes('strike') || t.includes('rally') || t.includes('demonstration')) return 'protest';
  return 'general';
}

function detectState(text) {
  const t = text.toLowerCase();
  for (const [stateKey, state] of Object.entries(STATES)) {
    if (state.keywords.some(kw => t.includes(kw))) return stateKey;
  }
  return null;
}

// ─── CACHE ───────────────────────────────────────────────────────────────────
let cache = {
  items: [],
  byState: { ap: [], telangana: [], bihar: [], punjab: [], up: [] },
  lastFetched: null,
  fetchCount: 0
};

async function fetchAllFeeds() {
  console.log(`[${new Date().toISOString()}] Fetching RSS feeds...`);
  const allRaw = [];

  await Promise.allSettled(
    FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        const items = (parsed.items || []).slice(0, 25).map(item => {
          const fullText = `${item.title || ''} ${item.contentSnippet || ''} ${item.content || ''}`;
          const stateKey = detectState(fullText);
          return {
            id: Buffer.from((item.link || item.title || '') + feed.source).toString('base64').slice(0, 20),
            title: (item.title || '').replace(/<[^>]*>/g, '').trim(),
            summary: (item.contentSnippet || item.content || '').replace(/<[^>]*>/g, '').slice(0, 220).trim(),
            link: item.link || '#',
            source: feed.source,
            pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
            state: stateKey || (feed.type !== 'national' ? feed.type : null),
            category: detectCategory(fullText),
          };
        }).filter(i => i.state && i.title.length > 10);
        allRaw.push(...items);
      } catch (err) {
        console.warn(`[WARN] ${feed.source}: ${err.message}`);
      }
    })
  );

  // Deduplicate by title prefix
  const seen = new Set();
  const deduped = allRaw
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .filter(item => {
      const key = item.title.slice(0, 50).toLowerCase().replace(/\s+/g, ' ');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  cache.items = deduped.slice(0, 200);
  cache.byState = {};
  for (const stateKey of Object.keys(STATES)) {
    cache.byState[stateKey] = deduped.filter(i => i.state === stateKey).slice(0, 50);
  }
  cache.lastFetched = new Date().toISOString();
  cache.fetchCount++;
  console.log(`[OK] Fetched ${deduped.length} items across states: ${Object.entries(cache.byState).map(([k,v]) => `${k}:${v.length}`).join(', ')}`);
}

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.get('/api/news', async (req, res) => {
  try {
    const state = req.query.state || 'all';
    const category = req.query.category || 'all';
    const age = cache.lastFetched ? Date.now() - new Date(cache.lastFetched).getTime() : Infinity;

    if (age > 4 * 60 * 1000 || cache.items.length === 0) await fetchAllFeeds();

    let items = state === 'all' ? cache.items : (cache.byState[state] || []);
    if (category !== 'all') items = items.filter(i => i.category === category);

    res.json({ items: items.slice(0, 50), lastFetched: cache.lastFetched, total: items.length });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message, items: [], lastFetched: null });
  }
});

app.get('/api/stats', async (req, res) => {
  const age = cache.lastFetched ? Date.now() - new Date(cache.lastFetched).getTime() : Infinity;
  if (age > 4 * 60 * 1000 || cache.items.length === 0) await fetchAllFeeds();

  const stats = {};
  for (const stateKey of Object.keys(STATES)) {
    const items = cache.byState[stateKey] || [];
    stats[stateKey] = {
      total: items.length,
      categories: {
        politics: items.filter(i => i.category === 'politics').length,
        election: items.filter(i => i.category === 'election').length,
        crime: items.filter(i => i.category === 'crime').length,
        governance: items.filter(i => i.category === 'governance').length,
        protest: items.filter(i => i.category === 'protest').length,
        disaster: items.filter(i => i.category === 'disaster').length,
        general: items.filter(i => i.category === 'general').length,
      },
      topSources: [...new Set(items.map(i => i.source))].slice(0, 4)
    };
  }
  res.json({ stats, lastFetched: cache.lastFetched, fetchCount: cache.fetchCount });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', lastFetched: cache.lastFetched, totalItems: cache.items.length });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`State News Tracker running on port ${PORT}`);
  fetchAllFeeds();
});

setInterval(fetchAllFeeds, 4 * 60 * 1000);
