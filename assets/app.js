// ANTI AGE HACK – Shared client logic
// Eshopsys integration stub – swap API_BASE before production
window.AAH = window.AAH || {};
AAH.config = {
  API_BASE: 'https://api.eshopsys.com', // TODO: confirm production endpoint
  TENANT_ID: 'anti-age-hack',
};

// ---- Storage helpers ----
AAH.storage = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  remove: (k) => localStorage.removeItem(k),
};

// ---- API helper ----
AAH.api = async function (path, options = {}) {
  const token = AAH.storage.get('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    'X-Tenant-ID': AAH.config.TENANT_ID,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${AAH.config.API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
};

// ---- Auth ----
AAH.auth = {
  isLoggedIn: () => !!AAH.storage.get('auth_token'),
  logout: () => {
    AAH.storage.remove('auth_token');
    AAH.storage.remove('customer');
    window.location.href = '/login.html';
  },
  requireLogin: () => {
    if (!AAH.auth.isLoggedIn()) {
      window.location.href = '/login.html';
    }
  },
};

// ---- Lead capture (landing → eshopsys) ----
AAH.captureLeadAndRegister = async function ({ name, email, gdpr, marketing }) {
  // Generate temporary password – user sets real one via magic link / next step
  const tempPassword = crypto.randomUUID() + 'A1!';
  const data = await AAH.api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password: tempPassword,
      first_name: name,
      gdpr_consent: !!gdpr,
      marketing_consent: !!marketing,
      newsletter_consent: !!marketing,
      source: 'landing-anti-age-hack',
    }),
  });
  AAH.storage.set('auth_token', data.access_token);
  AAH.storage.set('customer', data.customer);
  return data;
};

// ---- Fade-in observer ----
AAH.initFadeIn = function () {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach((el) => io.observe(el));
};

// ---- FAQ accordion ----
AAH.initFaq = function () {
  document.querySelectorAll('[data-faq] [data-faq-q]').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('[data-faq-item]');
      item.classList.toggle('open');
      const isOpen = item.classList.contains('open');
      q.setAttribute('aria-expanded', String(isOpen));
      const ans = item.querySelector('[data-faq-a]');
      if (ans) ans.style.maxHeight = isOpen ? ans.scrollHeight + 'px' : '0px';
    });
  });
};

// ---- Lead form ----
AAH.initLeadForm = function () {
  const form = document.querySelector('[data-lead-form]');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const btn = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[data-form-status]');
    btn.disabled = true;
    btn.textContent = 'Odesílám…';
    try {
      // For demo: store locally and redirect to onboarding
      AAH.storage.set('lead', data);
      // In production, swap for real API call:
      // await AAH.captureLeadAndRegister(data);
      window.location.href = '/onboarding.html';
    } catch (err) {
      status.textContent = 'Něco se pokazilo, zkuste to prosím znovu.';
      status.className = 'text-error text-sm mt-2';
      btn.disabled = false;
      btn.textContent = 'Získat dotazník zdarma →';
    }
  });
};

// ---- Cookie consent ----
AAH.cookies = {
  KEY: 'aah_cookie_consent_v1',
  defaults: { necessary: true, analytics: false, marketing: false, ts: null },
  get: () => AAH.storage.get('aah_cookie_consent_v1') || null,
  set: (consent) => {
    AAH.storage.set('aah_cookie_consent_v1', { ...consent, ts: new Date().toISOString() });
    // Hook for downstream tools (GA4, Meta Pixel, etc.) – initialise only after consent
    document.dispatchEvent(new CustomEvent('aah:consent', { detail: consent }));
  },
  reset: () => AAH.storage.remove('aah_cookie_consent_v1'),
};

AAH.initCookieBanner = function () {
  // Skip on legal pages – we are already on the policy page
  if (window.location.pathname.startsWith('/legal/')) return;
  if (AAH.cookies.get()) return;

  const html = `
    <div class="cookie-banner" role="dialog" aria-live="polite" aria-label="Souhlas s cookies">
      <h3>Cookies a soukromí</h3>
      <p>Používáme nezbytné cookies pro fungování webu. S vaším souhlasem také analytické a marketingové, abychom mohli web vylepšovat. Více v <a href="/legal/privacy.html">zásadách ochrany osobních údajů</a>.</p>
      <div class="cookie-banner-categories">
        <div class="cookie-cat">
          <div class="cookie-cat-info">
            <strong>Nezbytné</strong>
            <small>Přihlášení, nastavení, bezpečnost. Nejde vypnout.</small>
          </div>
          <label class="cookie-toggle"><input type="checkbox" checked disabled><span class="slider"></span></label>
        </div>
        <div class="cookie-cat">
          <div class="cookie-cat-info">
            <strong>Analytické</strong>
            <small>Anonymní statistiky návštěvnosti pro zlepšení obsahu.</small>
          </div>
          <label class="cookie-toggle"><input type="checkbox" data-cat="analytics"><span class="slider"></span></label>
        </div>
        <div class="cookie-cat">
          <div class="cookie-cat-info">
            <strong>Marketingové</strong>
            <small>Personalizace reklam a měření kampaní.</small>
          </div>
          <label class="cookie-toggle"><input type="checkbox" data-cat="marketing"><span class="slider"></span></label>
        </div>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" class="cookie-btn-settings" data-action="toggle-settings">Nastavení</button>
        <button type="button" class="cookie-btn-reject" data-action="reject">Jen nezbytné</button>
        <button type="button" class="cookie-btn-accept" data-action="accept">Přijmout vše</button>
      </div>
    </div>`;
  const wrap = document.createElement('div');
  wrap.innerHTML = html.trim();
  const banner = wrap.firstElementChild;
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('visible'));

  banner.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;
    if (action === 'toggle-settings') {
      banner.classList.toggle('show-categories');
      return;
    }
    let consent = { ...AAH.cookies.defaults };
    if (action === 'accept') {
      consent.analytics = true;
      consent.marketing = true;
    }
    // Honour individual toggles when settings are open
    if (banner.classList.contains('show-categories')) {
      banner.querySelectorAll('input[data-cat]').forEach((cb) => {
        consent[cb.dataset.cat] = cb.checked;
      });
    }
    AAH.cookies.set(consent);
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 600);
  });
};


  // Plausible analytics – load lazily after consent (GDPR-safe)
  document.addEventListener('aah:consent', (e) => {
    if (e.detail && e.detail.analytics) {
      const s = document.createElement('script');
      s.defer = true; s.dataset.domain = 'antiagehack.cz';
      s.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(s);
    }
  });
  // If consent was granted previously, initialise now
  (function() {
    const c = (function(){ try { return JSON.parse(localStorage.getItem('aah_cookie_consent_v1')); } catch { return null; } })();
    if (c && c.analytics) {
      const s = document.createElement('script');
      s.defer = true; s.dataset.domain = 'antiagehack.cz';
      s.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(s);
    }
  })();

document.addEventListener('DOMContentLoaded', () => {
  AAH.initFadeIn();
  AAH.initFaq();
  AAH.initLeadForm();
  AAH.initCookieBanner();
});
