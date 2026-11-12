import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');

function getAllHtmlFiles(dir) {
  const results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name !== 'pagefind') results.push(...getAllHtmlFiles(full));
    } else if (item.name.endsWith('.html')) results.push(full);
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(DIST);

// 1. Robots & Sitemap
const robotsTxt = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');
const sitemap0 = fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8');
const sitemapUrls = [...sitemap0.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// 2. Canonical Check on 32 core pages
const corePages = [
  'index.html',
  'about/index.html',
  'services/index.html',
  'brands/index.html',
  'contact/index.html',
  'disclaimer/index.html',
  'editorial-policy/index.html',
  'privacy/index.html',
  'airport/index.html',
  'airport/ranking/index.html',
  'airport/budget/index.html',
  'airport/iepl/index.html',
  'airport/chatgpt/index.html',
  'airport/streaming/index.html',
  'airport/clash/index.html',
  'airport/unlimited/index.html',
  'airport/coupon/index.html',
  'airport/quiet-airports-guide/index.html',
  'ai/index.html',
  'ai/chatgpt/index.html',
  'ai/chatgpt/network-guide/index.html',
  'network/index.html',
  'network/what-is-iplc/index.html',
  'protocols/index.html',
  'protocols/vless-vs-vmess/index.html',
  'troubleshooting/index.html',
  'troubleshooting/clash-subscription-update-failed/index.html',
  'tutorials/index.html',
  'tutorials/clash/getting-started/index.html',
  'reviews/gsycloud/index.html',
  'reviews/muguang/index.html',
  'reviews/weifeng/index.html'
];

const canonicalAudit = [];
for (const p of corePages) {
  const full = path.join(DIST, p);
  const exists = fs.existsSync(full);
  if (!exists) {
    canonicalAudit.push({ page: p, pass: false, error: 'File does not exist' });
    continue;
  }
  const html = fs.readFileSync(full, 'utf8');
  const m = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const rel = '/' + (p === 'index.html' ? '' : p.replace('/index.html', '/'));
  const expected = 'https://gsycloud.com' + rel;
  const canonical = m ? m[1] : null;
  canonicalAudit.push({
    page: p,
    pass: canonical === expected,
    canonical,
    expected
  });
}

// 3. 全局页面审计
const audit = {
  totalPages: htmlFiles.length,
  sitemapUrlCount: sitemapUrls.length,
  sitemapNoindexOverlap: [],
  soft404Pages: [],
  emptyAnchorTags: [],
  externalAffiliateAudit: {
    totalExternalCommercial: 0,
    compliant: 0,
    nonCompliant: []
  },
  wordCountDistribution: {
    under500: [],
    between500And1000: [],
    between1000And2000: [],
    above2000: []
  },
  reviewWordCounts: [],
  geoStructure: {
    missingAnswerFirst: [],
    missingTableOrFaq: []
  },
  schemaAudit: {
    syntaxErrors: [],
    hiddenSchemaDeceptions: []
  },
  metaAudit: {
    titleLengthExceeded: [],
    descLengthExceeded: [],
    descLengthTooShort: []
  }
};

for (const file of htmlFiles) {
  const relPath = path.relative(DIST, file).replace(/\\/g, '/');
  const pagePath = '/' + (relPath.endsWith('index.html') ? relPath.slice(0, -'index.html'.length) : relPath);
  const html = fs.readFileSync(file, 'utf8');

  // Check noindex in sitemap
  const isNoindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
  if (isNoindex) {
    const rawUrl = `https://gsycloud.com${pagePath}`;
    const encUrl = `https://gsycloud.com${encodeURI(pagePath)}`;
    if (sitemapUrls.includes(rawUrl) || sitemapUrls.includes(encUrl)) {
      audit.sitemapNoindexOverlap.push({ page: pagePath, sitemapLoc: sitemapUrls.includes(rawUrl) ? rawUrl : encUrl });
    }
  }

  // Word count & text extraction
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let charCount = 0;
  let bodyText = '';
  if (bodyMatch) {
    bodyText = bodyMatch[1]
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<svg[\s\S]*?<\/svg>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');
    charCount = (bodyText.match(/[\u4e00-\u9fa5]/g) || []).length;

    if (charCount < 500) audit.wordCountDistribution.under500.push({ page: pagePath, charCount });
    else if (charCount < 1000) audit.wordCountDistribution.between500And1000.push({ page: pagePath, charCount });
    else if (charCount < 2000) audit.wordCountDistribution.between1000And2000.push({ page: pagePath, charCount });
    else audit.wordCountDistribution.above2000.push({ page: pagePath, charCount });

    if (pagePath.startsWith('/reviews/')) {
      audit.reviewWordCounts.push({ page: pagePath, charCount });
    }

    if (charCount < 200 && pagePath !== '/404.html') {
      audit.soft404Pages.push({ page: pagePath, charCount });
    }
  }

  // GEO Structure checks for content pages
  if (pagePath.startsWith('/reviews/') || pagePath.startsWith('/airport/') || pagePath.startsWith('/network/') || pagePath.startsWith('/tutorials/') || pagePath.startsWith('/troubleshooting/')) {
    // Check if main element has an intro paragraph before first h2
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (mainMatch) {
      const mainContent = mainMatch[1];
      const h2Index = mainContent.indexOf('<h2');
      if (h2Index !== -1) {
        const introSection = mainContent.slice(0, h2Index);
        const hasIntroP = /<p[^>]*>[\s\S]*?<\/p>/i.test(introSection);
        if (!hasIntroP) audit.geoStructure.missingAnswerFirst.push(pagePath);
      }
    }

    // Check table or FAQ
    if (pagePath.startsWith('/reviews/')) {
      const hasTable = html.includes('<table');
      const hasFaq = html.includes('itemtype="https://schema.org/Question"') || html.includes('FAQ') || html.includes('常见问题');
      if (!hasTable || !hasFaq) audit.geoStructure.missingTableOrFaq.push({ page: pagePath, hasTable, hasFaq });
    }
  }

  // External affiliate link compliance
  const extAnchors = [...html.matchAll(/<a\s+[^>]*?href=["'](https?:\/\/[^"']+)["'][^>]*>/gi)];
  for (const a of extAnchors) {
    const tag = a[0];
    const url = a[1];
    if (!url.startsWith('https://gsycloud.com') && !url.startsWith('http://localhost')) {
      const isAff = url.includes('aff') || url.includes('code=') || url.includes('register') || url.includes('invite');
      if (isAff) {
        audit.externalAffiliateAudit.totalExternalCommercial++;
        const hasRel = /rel=["'][^"']*nofollow[^"']*["']/i.test(tag) && /sponsored/i.test(tag) && /noopener/i.test(tag);
        if (hasRel) {
          audit.externalAffiliateAudit.compliant++;
        } else {
          audit.externalAffiliateAudit.nonCompliant.push({ page: pagePath, url, tag });
        }
      }
    }
  }

  // Meta lengths
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    const t = titleMatch[1].trim();
    if (t.length > 70) audit.metaAudit.titleLengthExceeded.push({ page: pagePath, title: t, len: t.length });
  }

  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (descMatch) {
    const d = descMatch[1].trim();
    if (d.length > 160) audit.metaAudit.descLengthExceeded.push({ page: pagePath, desc: d, len: d.length });
    if (d.length < 40 && !isNoindex) audit.metaAudit.descLengthTooShort.push({ page: pagePath, desc: d, len: d.length });
  }

  // JSON-LD
  const jsonLds = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  for (const j of jsonLds) {
    try {
      const parsed = JSON.parse(j[1]);
      // Compare schema data with visible body text
      if (parsed['@graph']) {
        for (const item of parsed['@graph']) {
          if (item['@type'] === 'Article') {
            if (item.headline && !html.includes(item.headline.slice(0, 20))) {
              audit.schemaAudit.hiddenSchemaDeceptions.push({ page: pagePath, issue: 'Headline not in HTML', headline: item.headline });
            }
          }
        }
      }
    } catch (e) {
      audit.schemaAudit.syntaxErrors.push({ page: pagePath, error: e.message });
    }
  }
}

console.log('=== AUDIT RESULTS SUMMARY ===');
console.log('Total pages in dist:', audit.totalPages);
console.log('Sitemap URL count:', audit.sitemapUrlCount);
console.log('Sitemap Noindex Overlap Count:', audit.sitemapNoindexOverlap.length);
console.log('Canonical Audit Core Pages Pass Rate:', canonicalAudit.filter((c) => c.pass).length, '/', canonicalAudit.length);
console.log('External Commercial Links Total:', audit.externalAffiliateAudit.totalExternalCommercial);
console.log('External Commercial Links Compliant:', audit.externalAffiliateAudit.compliant);
console.log('External Commercial Links Non-Compliant (Missing Nofollow/Sponsored):', audit.externalAffiliateAudit.nonCompliant.length);
console.log('Soft 404 Pages (<200 chars):', audit.soft404Pages.length);
console.log('Title Length Exceeded (>70 chars):', audit.metaAudit.titleLengthExceeded.length);
console.log('Desc Length Exceeded (>160 chars):', audit.metaAudit.descLengthExceeded.length);
console.log('Desc Length Too Short (<40 chars on indexable):', audit.metaAudit.descLengthTooShort.length);
console.log('Schema Syntax Errors:', audit.schemaAudit.syntaxErrors.length);
console.log('Schema Deceptions / Mismatches:', audit.schemaAudit.hiddenSchemaDeceptions.length);
console.log('Reviews Word Counts Average:', Math.round(audit.reviewWordCounts.reduce((acc, r) => acc + r.charCount, 0) / audit.reviewWordCounts.length), 'chars');
console.log('Pages Above 2000 chars:', audit.wordCountDistribution.above2000.length);
console.log('Pages 1000-2000 chars:', audit.wordCountDistribution.between1000And2000.length);
console.log('Pages 500-1000 chars:', audit.wordCountDistribution.between500And1000.length);
console.log('Pages <500 chars (primarily tag archives / search / 404):', audit.wordCountDistribution.under500.length);

fs.writeFileSync('scripts/audit-results.json', JSON.stringify({ canonicalAudit, audit }, null, 2), 'utf8');
console.log('Full audit saved to scripts/audit-results.json');
