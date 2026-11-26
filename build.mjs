// Генерира статичните страници на 4ngo.eu за всеки език от src/i18n/*.json.
// Употреба: node build.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';

const SITE = 'https://4ngo.eu';
// Редът на езиците в превключвателя. Нов език: добавете src/i18n/<код>.json и кода тук.
const LANGS = ['en', 'fr', 'de', 'bg'];
const DEFAULT_LANG = 'en';

const T = Object.fromEntries(
  LANGS.map((l) => [l, JSON.parse(readFileSync(`src/i18n/${l}.json`, 'utf8'))])
);
for (const f of readdirSync('src/i18n')) {
  const code = f.replace('.json', '');
  if (!LANGS.includes(code)) console.warn(`! src/i18n/${f} не е включен в LANGS`);
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Иконите са от Bootstrap Icons 1.11.3 (MIT)
const ICONS = {
  facebook: 'M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951',
  instagram: 'M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334',
  threads: 'M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161',
  linkedin: 'M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z',
  mail: 'M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z',
};
const icon = (name) => `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${ICONS[name]}"/></svg>`;

// Каналите на 4ngo – docs/organizatsiya.md в projectgaude
const SOCIAL = [
  { id: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/4ngoeu' },
  { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/4ngoeu/' },
  { id: 'threads', name: 'Threads', url: 'https://www.threads.com/@4ngoeu' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://www.linkedin.com/company/4ngoeu/' },
];
const EMAIL = 'hello@4ngo.eu';

const HERO_ART = `<svg class="hero-art" viewBox="0 0 120 120" aria-hidden="true" focusable="false"><rect x="4" y="4" width="112" height="112" rx="28" fill="rgba(255,255,255,.06)"/><g stroke="rgba(255,255,255,.35)" stroke-width="4" stroke-linecap="round"><line x1="72" y1="26" x2="30" y2="74"/><line x1="30" y1="74" x2="92" y2="74"/><line x1="72" y1="26" x2="72" y2="96"/></g><g fill="rgba(255,255,255,.5)"><circle cx="72" cy="26" r="7"/><circle cx="30" cy="74" r="7"/><circle cx="92" cy="74" r="7"/><circle cx="72" cy="96" r="7"/></g><circle cx="72" cy="74" r="9" fill="#F2994A"/></svg>`;

const pagePath = (lang, page) => `/${lang}/${page === 'privacy' ? 'privacy/' : ''}`;

function head(t, page) {
  const title = page === 'privacy' ? t.meta.privacyTitle : t.meta.title;
  const url = SITE + pagePath(t.lang, page);
  const alternates = LANGS.map(
    (l) => `<link rel="alternate" hreflang="${l}" href="${SITE}${pagePath(l, page)}">`
  ).join('\n  ');
  return `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(t.meta.description)}">
  <meta name="theme-color" content="#1B2B5E">
  <link rel="canonical" href="${url}">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${SITE}/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="4ngo">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(t.meta.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/assets/img/og-image.png">
  <meta property="og:locale" content="${t.lang}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/img/4ngo-favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/assets/img/4ngo-favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="/assets/img/4ngo-favicon-180.png">
  <link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/css/fonts.css">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>`;
}

function header(t, page) {
  const home = `/${t.lang}/`;
  const langs = LANGS.map((l) => {
    const cur = l === t.lang;
    return `<li><a href="${pagePath(l, page)}" hreflang="${l}" lang="${l}" title="${esc(T[l].label)}"${cur ? ' aria-current="true"' : ''}>${l.toUpperCase()}<span class="sr-only"> – ${esc(T[l].label)}</span></a></li>`;
  }).join('');
  const menu = page === 'home'
    ? `<nav aria-label="${esc(t.a11y.menu)}"><ul class="menu">
        <li><a href="#about">${esc(t.nav.about)}</a></li>
        <li><a href="#ecosystem">${esc(t.nav.ecosystem)}</a></li>
        <li><a href="#how">${esc(t.nav.how)}</a></li>
        <li><a href="#contact">${esc(t.nav.contact)}</a></li>
      </ul></nav>`
    : '';
  return `<body>
<a class="skip" href="#main">${esc(t.a11y.skip)}</a>
<header class="site-header">
  <div class="wrap nav">
    <a class="logo" href="${home}"><img src="/assets/img/4ngo-lockup.svg" alt="4ngo" width="111" height="40"></a>
    ${menu}
    <nav aria-label="${esc(t.a11y.language)}"><ul class="lang">${langs}<li class="more" title="${esc(t.moreLanguages)}">${esc(t.moreLanguagesShort)}</li></ul></nav>
  </div>
  <p class="more-note">${esc(t.moreLanguages)}</p>
</header>`;
}

function footer(t) {
  const social = SOCIAL.map(
    (s) => `<li><a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name} ${esc(t.a11y.newTab)}">${icon(s.id)}</a></li>`
  ).join('');
  return `<footer class="site-footer">
  <div class="wrap foot">
    <div class="initiative">
      <img src="/assets/img/prosveta-navy.png" alt="" width="44" height="48">
      <p>${esc(t.footer.initiative)} <b>${esc(t.footer.org)}</b>, ${esc(t.footer.country)}</p>
    </div>
    <div class="foot-links">
      <ul class="foot-social" aria-label="${esc(t.a11y.social)}">${social}</ul>
      <a href="/${t.lang}/privacy/">${esc(t.footer.privacy)}</a>
      <span>© 2026 4ngo</span>
    </div>
  </div>
</footer>
</body>
</html>
`;
}

function home(t) {
  const e = t.ecosystem;
  const doors = [
    { key: 'brand', cls: 'd-brand', img: '4ngo-mark.svg', sub: '', here: true },
    { key: 'portal', cls: 'd-portal', img: 'portal4ngo-mark.svg', sub: 'portal' },
    { key: 'hub', cls: 'd-hub', img: 'hub4ngo-mark.svg', sub: 'hub' },
  ].map((d) => `<li class="door">
          <img src="/assets/img/${d.img}" alt="" width="56" height="56">
          <h3 class="domain ${d.cls}">${d.sub ? `<span>${d.sub}</span>` : ''}4ngo.eu</h3>
          <p><b>${esc(e[d.key].verb)}</b> ${esc(e[d.key].text)}</p>
          <span class="status${d.here ? ' here' : ''}">${esc(e[d.key].status)}</span>
        </li>`).join('\n        ');

  const steps = t.how.steps.map((s, i) => `<li>
          <div class="num" aria-hidden="true">${i + 1}</div>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </li>`).join('\n        ');

  const audience = t.audience.items.map((a) => `<li><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></li>`).join('\n        ');

  const social = SOCIAL.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${icon(s.id)}<span>${s.name}<small>@4ngoeu</small></span><span class="sr-only"> ${esc(t.a11y.newTab)}</span></a></li>`).join('\n          ');

  return `${head(t, 'home')}
${header(t, 'home')}
<main id="main">
  <section class="hero">
    <div class="wrap">
      <p class="badge"><i aria-hidden="true"></i>${esc(t.hero.badge)}</p>
      <h1>${esc(t.hero.title)}</h1>
      <p>${esc(t.hero.text)}</p>
      <div class="actions">
        <a class="btn btn-accent" href="#contact">${esc(t.hero.ctaPrimary)}</a>
        <a class="btn btn-ghost" href="#how">${esc(t.hero.ctaSecondary)}</a>
      </div>
    </div>
    ${HERO_ART}
  </section>

  <section class="sec" id="about" aria-labelledby="about-h">
    <div class="wrap">
      <p class="eyebrow">${esc(t.about.eyebrow)}</p>
      <h2 id="about-h">${esc(t.about.title)}</h2>
      <p class="lead">${esc(t.about.text)}</p>
    </div>
  </section>

  <section class="sec sec-white" id="ecosystem" aria-labelledby="eco-h">
    <div class="wrap">
      <p class="eyebrow">${esc(e.eyebrow)}</p>
      <h2 id="eco-h">${esc(e.title)}</h2>
      <ul class="doors">
        ${doors}
      </ul>
    </div>
  </section>

  <section class="sec" id="how" aria-labelledby="how-h">
    <div class="wrap">
      <p class="eyebrow">${esc(t.how.eyebrow)}</p>
      <h2 id="how-h">${esc(t.how.title)}</h2>
      <ol class="steps">
        ${steps}
      </ol>
    </div>
  </section>

  <section class="sec sec-white" aria-labelledby="aud-h">
    <div class="wrap">
      <p class="eyebrow">${esc(t.audience.eyebrow)}</p>
      <h2 id="aud-h">${esc(t.audience.title)}</h2>
      <ul class="audience">
        ${audience}
      </ul>
    </div>
  </section>

  <section class="sec" id="contact" aria-labelledby="contact-h">
    <div class="wrap">
      <div class="connect">
        <div>
          <h2 id="contact-h">${esc(t.contact.title)}</h2>
          <p class="lead">${esc(t.contact.text)}</p>
        </div>
        <ul class="social" aria-label="${esc(t.a11y.social)}">
          ${social}
          <li class="mail"><a href="mailto:${EMAIL}">${icon('mail')}<span>${esc(t.contact.email)}<small>${EMAIL}</small></span></a></li>
        </ul>
      </div>
    </div>
  </section>
</main>
${footer(t)}`;
}

function privacy(t) {
  const p = t.privacy;
  const body = p.sections.map((s) => `<h2>${esc(s.h)}</h2>\n      <p>${esc(s.p)}</p>`).join('\n      ');
  return `${head(t, 'privacy')}
${header(t, 'privacy')}
<main id="main" class="sec">
  <div class="wrap doc">
    <h1>${esc(p.title)}</h1>
    <p class="updated">${esc(p.updated)}</p>
    ${body}
    <a class="back" href="/${t.lang}/">← ${esc(p.back)}</a>
  </div>
</main>
${footer(t)}`;
}

function rootRedirect() {
  const links = LANGS.map((l) => `<li><a href="/${l}/" hreflang="${l}" lang="${l}">${esc(T[l].label)}</a></li>`).join('');
  const alternates = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE}/${l}/">`).join('\n  ');
  return `<!doctype html>
<html lang="${DEFAULT_LANG}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(T[DEFAULT_LANG].meta.title)}</title>
  <meta name="description" content="${esc(T[DEFAULT_LANG].meta.description)}">
  <link rel="canonical" href="${SITE}/">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${SITE}/">
  <link rel="icon" href="/assets/img/4ngo-favicon.svg" type="image/svg+xml">
  <script>
    (function () {
      var supported = ${JSON.stringify(LANGS)};
      var prefs = navigator.languages || [navigator.language || ''];
      var pick = '${DEFAULT_LANG}';
      for (var i = 0; i < prefs.length; i++) {
        var code = String(prefs[i]).toLowerCase().split('-')[0];
        if (supported.indexOf(code) !== -1) { pick = code; break; }
      }
      location.replace('/' + pick + '/');
    })();
  </script>
  <noscript><meta http-equiv="refresh" content="0; url=/${DEFAULT_LANG}/"></noscript>
  <style>body{font-family:system-ui,sans-serif;background:#F6F7FA;color:#1B2B5E;display:grid;place-items:center;min-height:100vh;margin:0}ul{list-style:none;padding:0;display:flex;gap:16px}a{color:#1B2B5E;font-weight:600}</style>
</head>
<body>
  <ul>${links}</ul>
</body>
</html>
`;
}

function write(path, html) {
  mkdirSync(path.split('/').slice(0, -1).join('/') || '.', { recursive: true });
  writeFileSync(path, html);
  console.log('✓', path);
}

for (const l of LANGS) {
  write(`${l}/index.html`, home(T[l]));
  write(`${l}/privacy/index.html`, privacy(T[l]));
}
write('index.html', rootRedirect());

const urls = LANGS.flatMap((l) => [pagePath(l, 'home'), pagePath(l, 'privacy')]);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
