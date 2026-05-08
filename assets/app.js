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
      const ans = item.querySelector('[data-faq-a]');
      if (ans) ans.style.maxHeight = item.classList.contains('open') ? ans.scrollHeight + 'px' : '0px';
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

document.addEventListener('DOMContentLoaded', () => {
  AAH.initFadeIn();
  AAH.initFaq();
  AAH.initLeadForm();
});
