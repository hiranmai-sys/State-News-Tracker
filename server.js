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

const FEEDS = [
  // NATIONAL
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
  { url: 'https://www.thehansindia.com/feeds/national/rss', source: 'The Hans India', type: 'national' },
  { url: 'https://www.thenewsminute.com/feed', source: 'The News Minute', type: 'national' },

  // ANDHRA PRADESH - Regional Media
  { url: 'https://www.thehindu.com/news/national/andhra-pradesh/feeder/default.rss', source: 'The Hindu AP', type: 'ap' },
  { url: 'https://www.thehansindia.com/feeds/andhra-pradesh/rss', source: 'The Hans India AP', type: 'ap' },
  { url: 'https://www.thenewsminute.com/andhra-pradesh/feed', source: 'The News Minute AP', type: 'ap' },
  { url: 'https://www.eenadu.net/andhra-pradesh/rss', source: 'Eenadu AP', type: 'ap' },
  { url: 'https://www.sakshi.com/rss/andhra-pradesh', source: 'Sakshi AP', type: 'ap' },
  { url: 'https://tv9telugu.com/andhra-pradesh/feed', source: 'TV9 Telugu AP', type: 'ap' },
  { url: 'https://ntvtelugu.com/andhra-pradesh-news/feed', source: 'NTV Telugu AP', type: 'ap' },
  { url: 'https://www.andhrajyothy.com/rss/andhra-pradesh', source: 'Andhrajyothy AP', type: 'ap' },
  { url: 'https://vaartha.com/category/andhra-pradesh/feed', source: 'Vaartha AP', type: 'ap' },
  { url: 'https://www.visalaandhra.com/feed', source: 'Visaalandhra', type: 'ap' },
  { url: 'https://www.greatandhra.com/andhra-news/feed', source: 'Great Andhra AP', type: 'ap' },

  // ANDHRA PRADESH - Political Parties
  { url: 'https://news.google.com/rss/search?q=Jana+Sena+Pawan+Kalyan+Andhra&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · Jana Sena', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=TDP+Chandrababu+Naidu+Andhra&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · TDP', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=YSRCP+Jagan+Mohan+Reddy+Andhra&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · YSRCP', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=BJP+Andhra+Pradesh+PVN+Madhav&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · BJP AP', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=BC+Yuvajanasena+Bode+Ramachandra+Andhra&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · BCY Party', type: 'ap' },

  // TELANGANA - Regional Media
  { url: 'https://www.thehindu.com/news/national/telangana/feeder/default.rss', source: 'The Hindu Telangana', type: 'telangana' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1082732712.cms', source: 'TOI Hyderabad', type: 'telangana' },
  { url: 'https://www.thehansindia.com/feeds/telangana/rss', source: 'The Hans India TS', type: 'telangana' },
  { url: 'https://www.thenewsminute.com/telangana/feed', source: 'The News Minute TS', type: 'telangana' },
  { url: 'https://www.eenadu.net/telangana/rss', source: 'Eenadu Telangana', type: 'telangana' },
  { url: 'https://www.sakshi.com/rss/telangana', source: 'Sakshi Telangana', type: 'telangana' },
  { url: 'https://tv9telugu.com/telangana/feed', source: 'TV9 Telugu TS', type: 'telangana' },
  { url: 'https://ntvtelugu.com/telangana-news/feed', source: 'NTV Telugu TS', type: 'telangana' },
  { url: 'https://www.andhrajyothy.com/rss/telangana', source: 'Andhrajyothy TS', type: 'telangana' },
  { url: 'https://telanganatoday.com/feed', source: 'Telangana Today', type: 'telangana' },
  { url: 'https://www.navatelangana.com/feed', source: 'Nava Telangana', type: 'telangana' },
  { url: 'https://www.manatelangana.news/feed', source: 'Mana Telangana', type: 'telangana' },
  { url: 'https://vaartha.com/category/telangana/feed', source: 'Vaartha Telangana', type: 'telangana' },
  { url: 'https://www.greatandhra.com/telangana-news/feed', source: 'Great Andhra TS', type: 'telangana' },
  { url: 'https://www.telugu360.com/category/politics/feed', source: 'Telugu360', type: 'telangana' },

  // TELANGANA - Political Parties
  { url: 'https://news.google.com/rss/search?q=BRS+KCR+Chandrasekhar+Rao+Telangana&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · BRS', type: 'telangana' },
  { url: 'https://news.google.com/rss/search?q=BJP+Telangana+Ramchander+Rao&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · BJP TS', type: 'telangana' },
  { url: 'https://news.google.com/rss/search?q=Congress+INC+Revanth+Reddy+Telangana&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · INC TS', type: 'telangana' },

  // AP + TS - Telugu TV Channels
  { url: 'https://news.google.com/rss/search?q=10TV+Telugu+news+Andhra&hl=en-IN&gl=IN&ceid=IN:en', source: '10TV News', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=10TV+Telugu+Telangana+news&hl=en-IN&gl=IN&ceid=IN:en', source: '10TV News', type: 'telangana' },
  { url: 'https://news.google.com/rss/search?q=BIG+TV+Telugu+Andhra+news&hl=en-IN&gl=IN&ceid=IN:en', source: 'BIG TV Telugu', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=BIG+TV+Telugu+Telangana+news&hl=en-IN&gl=IN&ceid=IN:en', source: 'BIG TV Telugu', type: 'telangana' },
  { url: 'https://news.google.com/rss/search?q=V6+Telugu+news+Telangana&hl=en-IN&gl=IN&ceid=IN:en', source: 'V6 News Telugu', type: 'telangana' },
  { url: 'https://news.google.com/rss/search?q=TV5+Telugu+news+Andhra+Pradesh&hl=en-IN&gl=IN&ceid=IN:en', source: 'TV5 Telugu', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=TV5+Telugu+news+Telangana&hl=en-IN&gl=IN&ceid=IN:en', source: 'TV5 Telugu', type: 'telangana' },

  // BIHAR - Regional Media
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1376380821.cms', source: 'TOI Patna', type: 'bihar' },
  { url: 'https://www.prabhatkhabar.com/state/bihar/feed', source: 'Prabhat Khabar Bihar', type: 'bihar' },
  { url: 'https://www.bhaskar.com/rss-feed/8424/', source: 'Dainik Bhaskar Bihar', type: 'bihar' },
  { url: 'https://www.livehindustan.com/rss/state/bihar.xml', source: 'Live Hindustan Bihar', type: 'bihar' },
  { url: 'https://www.etvbharat.com/hindi/bihar/feed', source: 'ETV Bharat Bihar', type: 'bihar' },
  { url: 'https://www.aajtak.in/rss/india/bihar.xml', source: 'Aaj Tak Bihar', type: 'bihar' },
  { url: 'https://zeenews.india.com/rss/bihar-jharkhand-news.xml', source: 'Zee Bihar Jharkhand', type: 'bihar' },
  { url: 'https://bharatlive.co.in/feed', source: 'News Bihar Live', type: 'bihar' },
  { url: 'https://news.google.com/rss/search?q=News18+Bihar+Jharkhand&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · News18 Bihar', type: 'bihar' },
  { url: 'https://news.google.com/rss/search?q=bihar+lalu+prasad+tejashwi+RJD&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · RJD Bihar', type: 'bihar' },
  { url: 'https://news.google.com/rss/search?q=chirag+paswan+LJP+bihar&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News · LJP Bihar', type: 'bihar' },

  // PUNJAB
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1070073553.cms', source: 'TOI Chandigarh', type: 'punjab' },
  { url: 'https://news.google.com/rss/search?q=punjab+politics&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'punjab' },
  { url: 'https://news.google.com/rss/search?q=bhagwant+mann+punjab&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'punjab' },

  // UTTAR PRADESH
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms', source: 'TOI Lucknow', type: 'up' },
  { url: 'https://news.google.com/rss/search?q=uttar+pradesh+politics&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'up' },
  { url: 'https://news.google.com/rss/search?q=yogi+adityanath+UP&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'up' },

  // GOOGLE NEWS - CORE STATE FEEDS
  { url: 'https://news.google.com/rss/search?q=andhra+pradesh+politics&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=telangana+politics&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'telangana' },
  { url: 'https://news.google.com/rss/search?q=bihar+politics&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'bihar' },
  { url: 'https://news.google.com/rss/search?q=andhra+pradesh+government&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'ap' },
  { url: 'https://news.google.com/rss/search?q=telangana+government&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'telangana' },
  { url: 'https://news.google.com/rss/search?q=nitish+kumar+bihar&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', type: 'bihar' },
];

const STATES = {
  ap: {
    name: 'Andhra Pradesh',
    short: 'AP',
    color: '#1a6b3c',
    keywords: [
      'andhra pradesh', 'andhra', 'amaravati', 'visakhapatnam', 'vizag',
      'vijayawada', 'tdp', 'ysrcp', 'ycp', 'jagan', 'chandrababu', 'naidu',
      'pawan kalyan', 'janasena', 'jana sena', 'tirupati', 'guntur', 'kurnool',
      'nellore', 'rajahmundry', 'krishna district', 'ap government', 'ap cm',
      'pvn madhav', 'bjp andhra', 'bc yuvajanasena', 'bcy party',
      'bode ramachandra', 'visaalandhra', 'eenadu ap', 'andhrajyothy',
      'tv9 telugu ap', 'ntv telugu ap', 'vaartha ap', 'great andhra ap'
    ]
  },
  telangana: {
    name: 'Telangana',
    short: 'TS',
    color: '#c0392b',
    keywords: [
      'telangana', 'hyderabad', 'brs', 'trs', 'congress telangana', 'revanth reddy',
      'kcr', 'ktr', 'bhrs', 'secunderabad', 'warangal', 'nizamabad', 'karimnagar',
      'khammam', 'ts government', 'telangana cm', 'hyd', 'cyberabad', 'musi',
      'bharat rashtra samithi', 'bjp telangana', 'ramchander rao', 'tpcc',
      'nava telangana', 'mana telangana', 'telangana today', 'telugu360',
      'adilabad', 'nalgonda', 'mahbubnagar'
    ]
  },
  bihar: {
    name: 'Bihar',
    short: 'BR',
    color: '#d35400',
    keywords: [
      'bihar', 'patna', 'nitish kumar', 'jdu', 'rjd', 'lalu prasad', 'tejashwi',
      'nda bihar', 'bjp bihar', 'muzaffarpur', 'gaya', 'bhagalpur', 'darbhanga',
      'bihar government', 'bihar cm', 'bihar election', 'mithila', 'seemanchal',
      'prabhat khabar', 'news18 bihar', 'zee bihar', 'etv bharat bihar',
      'aaj tak bihar', 'chirag paswan', 'ljp', 'jehanabad', 'ara', 'chhapra',
      'samastipur', 'begusarai', 'siwan', 'gopalganj'
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

  const seen = new Set();
  const deduped = allRaw
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    .filter(item => {
      const key = item.title.slice(0, 50).toLowerCase().replace(/\s+/g, ' ');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  cache.items = deduped.slice(0, 400);
  cache.byState = {};
  for (const stateKey of Object.keys(STATES)) {
    cache.byState[stateKey] = deduped.filter(i => i.state === stateKey).slice(0, 100);
  }
  cache.lastFetched = new Date().toISOString();
  cache.fetchCount++;
  console.log(`[OK] Fetched ${deduped.length} items across states: ${Object.entries(cache.byState).map(([k,v]) => `${k}:${v.length}`).join(', ')}`);
}

app.get('/api/news', async (req, res) => {
  try {
    const state = req.query.state || 'all';
    const category = req.query.category || 'all';
    const age = cache.lastFetched ? Date.now() - new Date(cache.lastFetched).getTime() : Infinity;
    if (age > 4 * 60 * 1000 || cache.items.length === 0) await fetchAllFeeds();
    let items = state === 'all' ? cache.items : (cache.byState[state] || []);
    if (category !== 'all') items = items.filter(i => i.category === category);
    res.json({ items: items.slice(0, 100), lastFetched: cache.lastFetched, total: items.length });
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
      topSources: [...new Set(items.map(i => i.source))].slice(0, 8)
    };
  }
  res.json({ stats, lastFetched: cache.lastFetched, fetchCount: cache.fetchCount });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', lastFetched: cache.lastFetched, totalItems: cache.items.length });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`State News Tracker running on port ${PORT}`);
  fetchAllFeeds();
});

setInterval(fetchAllFeeds, 4 * 60 * 1000);
