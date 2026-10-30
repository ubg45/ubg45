/* UBG45 settings core: tab cloak + panic key.
 *
 * One small, dependency-free module used in two places:
 *   - the UBG45 home page (loaded in <head>), and
 *   - every game tab that openGame()/openRandom() create (window.UBG45_ROLE = 'game'),
 *     so the disguise and the panic key follow you into the game.
 * The settings UI (ubg45.js) only reads and writes through this API.
 */
(function core() {
  'use strict';

  var U = (window.UBG45 = window.UBG45 || {});
  var KEY = 'ubg45.settings';
  var IS_GAME = window.UBG45_ROLE === 'game';
  var script = document.currentScript;
  var BASE = window.UBG45_BASE || (function () {
    try { return new URL('./', script && script.src ? script.src : location.href).href; } catch (e) { return ''; }
  })();

  var DEFAULTS = {
    cloak: 'default',                         // 'default' | a CLOAKS id | 'custom'
    customTitle: '',
    customIcon: '',
    panicEnabled: true,
    panicKey: 'k',
    panicRedirect: true,
    panicUrl: 'https://classroom.google.com/'
  };

  var CLOAKS = {
    google: { label: 'Google', title: 'Google', icon: 'https://www.google.com/favicon.ico' },
    vocab:  { label: 'Vocabulary.com', title: 'My Learning | Vocabulary.com', icon: 'https://www.vocabulary.com/favicon.ico' },
    canvas: { label: 'Canvas', title: 'Canvas', icon: 'https://canvas.instructure.com/favicon.ico' },
    drive:  { label: 'Google Drive', title: 'Google Drive', icon: 'https://drive.google.com/favicon.ico' },
    docs:   { label: 'Google Docs', title: 'Google Docs', icon: BASE + 'Docs.ico' },
    classroom: { label: 'Google Classroom', title: 'Classroom', icon: 'https://ssl.gstatic.com/classroom/favicon.png' },
    khan:   { label: 'Khan Academy', title: 'Khan Academy', icon: 'https://www.khanacademy.org/favicon.ico' },
    desmos: { label: 'Desmos', title: 'Desmos | Graphing Calculator', icon: 'https://www.desmos.com/favicon.ico' },
    wiki:   { label: 'Wikipedia', title: 'Wikipedia, the free encyclopedia', icon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico' }
  };

  // Quick picks for the panic redirect (the box still accepts any address).
  var REDIRECTS = [
    { label: 'Google Classroom', url: 'https://classroom.google.com/' },
    { label: 'Google', url: 'https://www.google.com/' },
    { label: 'Google Drive', url: 'https://drive.google.com/' },
    { label: 'Google Docs', url: 'https://docs.google.com/' },
    { label: 'Khan Academy', url: 'https://www.khanacademy.org/' },
    { label: 'Wikipedia', url: 'https://en.wikipedia.org/' }
  ];

  // Keys that cannot be the panic key (they are needed for normal use of the site / browser).
  var RESERVED = ['/', 'Escape', 'Tab', 'Enter', ' ', 'Backspace', 'Delete', 'Shift', 'Control', 'Alt', 'Meta',
    'CapsLock', 'Dead', 'Unidentified', 'Process', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  /* ---------------------------------------------------------------- helpers */
  function normKey(k) { k = String(k == null ? '' : k); return k.length === 1 ? k.toLowerCase() : k; }
  function keyLabel(k) { return !k ? 'None' : k.length === 1 ? k.toUpperCase() : k; }
  function isReserved(k) { return !k || RESERVED.indexOf(k) > -1 || RESERVED.indexOf(k.toLowerCase()) > -1; }

  // Accepts "example.com", "https://example.com/x"; rejects javascript:, data:, file:, etc. Returns '' if unusable.
  function normUrl(v) {
    v = String(v == null ? '' : v).trim();
    if (!v || v.length > 2000) return '';
    if (/^(javascript|data|vbscript|file|blob|about|chrome)\s*:/i.test(v)) return '';
    if (!/^https?:\/\//i.test(v)) v = 'https://' + v.replace(/^\/+/, '');
    try {
      var u = new URL(v);
      if ((u.protocol !== 'https:' && u.protocol !== 'http:') || !u.hostname || u.hostname.indexOf('.') < 0 && u.hostname !== 'localhost') return '';
      return u.href;
    } catch (e) { return ''; }
  }
  function normIcon(v) {
    v = String(v == null ? '' : v).trim();
    if (/^data:image\/(png|x-icon|vnd\.microsoft\.icon|svg\+xml|gif|jpeg|webp);/i.test(v) && v.length < 20000) return v;
    return normUrl(v);
  }
  function clampTitle(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, 80); }

  /* ---------------------------------------------------------------- storage */
  function get() {
    var s = {}, raw = null, k;
    for (k in DEFAULTS) s[k] = DEFAULTS[k];
    try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { raw = null; }
    if (raw && typeof raw === 'object') {
      if (typeof raw.cloak === 'string' && (raw.cloak === 'default' || raw.cloak === 'custom' || CLOAKS[raw.cloak])) s.cloak = raw.cloak;
      if (typeof raw.customTitle === 'string') s.customTitle = clampTitle(raw.customTitle);
      if (typeof raw.customIcon === 'string') s.customIcon = normIcon(raw.customIcon);
      if (typeof raw.panicEnabled === 'boolean') s.panicEnabled = raw.panicEnabled;
      if (typeof raw.panicKey === 'string' && !isReserved(raw.panicKey)) s.panicKey = normKey(raw.panicKey);
      else if (typeof raw.panicKey === 'string' && raw.panicKey === '') s.panicKey = '';
      if (typeof raw.panicRedirect === 'boolean') s.panicRedirect = raw.panicRedirect;
      if (typeof raw.panicUrl === 'string' && normUrl(raw.panicUrl)) s.panicUrl = normUrl(raw.panicUrl);
    }
    return s;
  }
  function set(patch) {
    var s = get(), k;
    for (k in patch) if (k in DEFAULTS) s[k] = patch[k];
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage unavailable: still applies for this page view */ }
    applyCloak(s);
    return get();
  }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} applyCloak(); return get(); }

  /* ---------------------------------------------------------------- cloak */
  var originalTitle = null, originalIcon = null;
  function captureOriginal() {
    if (originalTitle !== null) return;
    originalTitle = document.title || 'UBG45';
    var l = document.querySelector('link[rel~="icon"]');   // also matches rel="shortcut icon" used by older pages
    originalIcon = l ? l.href : BASE + 'favicon.svg';
  }

  // The title/icon a given settings object produces (the "default" look differs in a game tab).
  function look(s) {
    s = s || get();
    if (document.readyState !== 'loading') captureOriginal();   // the settings page can ask before the first applyCloak()
    if (s.cloak === 'custom') {
      var t = clampTitle(s.customTitle);
      if (t || s.customIcon) return { title: t || (IS_GAME ? 'Google Docs' : originalTitle), icon: s.customIcon || (IS_GAME ? BASE + 'Docs.ico' : originalIcon) };
    }
    if (CLOAKS[s.cloak]) return { title: CLOAKS[s.cloak].title, icon: CLOAKS[s.cloak].icon };
    return IS_GAME ? { title: 'Google Docs', icon: BASE + 'Docs.ico' } : { title: originalTitle, icon: originalIcon };
  }
  function setIcon(href) {
    var olds = [].slice.call(document.querySelectorAll('link[rel~="icon"]'));
    var l = document.createElement('link');
    l.rel = 'icon'; l.href = href;
    if (/\.svg(\?|$)/i.test(href)) l.type = 'image/svg+xml';
    if (olds.length && olds[0].parentNode) olds[0].parentNode.replaceChild(l, olds[0]); else document.head.appendChild(l);   // replacing forces browsers to refresh the tab icon
    olds.slice(1).forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });   // leave exactly one icon so no stale one wins
  }
  function paint(l) { document.title = l.title; setIcon(l.icon); }
  function applyCloak(s) {
    if (!document.head) return;
    captureOriginal();
    paint(look(s));
  }

  /* ---------------------------------------------------------------- panic */
  var GOOGLE = { title: CLOAKS.google.title, icon: CLOAKS.google.icon };
  function panic() {
    var s = get();
    // Always end up looking harmless: keep a cloak the user chose, otherwise become Google.
    captureOriginal();
    paint(s.cloak === 'default' ? GOOGLE : look(s));
    if (s.panicRedirect) {
      var u = normUrl(s.panicUrl);
      if (u) { try { location.replace(u); } catch (e) { location.href = u; } }   // replace(): Back does not return to the game
    }
  }

  U.capturingKey = false;     // the settings UI sets this while the user picks a key
  document.addEventListener('keydown', function (e) {
    if (U.capturingKey) return;
    var s = get();
    if (!s.panicEnabled || !s.panicKey) return;
    if (e.ctrlKey || e.altKey || e.metaKey || e.isComposing) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;   // never fire while typing
    if (normKey(e.key) !== s.panicKey) return;
    e.preventDefault();
    e.stopImmediatePropagation();     // the panic key wins over any other shortcut (e.g. "F" to favourite)
    panic();
  }, true);

  window.addEventListener('storage', function (e) { if (e.key === KEY || e.key === null) applyCloak(); });   // keep other open tabs in sync

  /* ---------------------------------------------------------------- game tabs */
  // Markup for the head of a tab built with document.write(): this module's own source as an inline script,
  // flagged as a game tab, so the cloak and panic key also work there. (No eval and no extra requests;
  // external scripts are not reliably run in a freshly opened tab.)
  function gameHead() {
    var src = core.toString().replace(/<\/script/gi, '<\\/script');
    return '<script>window.UBG45_ROLE="game";window.UBG45_BASE=' + JSON.stringify(BASE) + ';(' + src + ')();<\/script>';
  }

  U.settings = {
    KEY: KEY, DEFAULTS: DEFAULTS, CLOAKS: CLOAKS, REDIRECTS: REDIRECTS, RESERVED: RESERVED, BASE: BASE,
    get: get, set: set, reset: reset, look: look, applyCloak: applyCloak, panic: panic,
    normUrl: normUrl, normIcon: normIcon, normKey: normKey, keyLabel: keyLabel, isReserved: isReserved, clampTitle: clampTitle
  };
  U.gameHead = gameHead;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { applyCloak(); });
  else applyCloak();
})();
