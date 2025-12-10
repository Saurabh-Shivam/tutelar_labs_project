// script.js — includes map lazy-loading + go-to-top button logic + tabs + existing behavior

// mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
menuBtn && menuBtn.addEventListener('click', () => {
  const show = !mobileNav.classList.contains('show');
  mobileNav.classList.toggle('show', show);
  menuBtn.setAttribute('aria-expanded', show ? 'true' : 'false');
  mobileNav.setAttribute('aria-hidden', show ? 'false' : 'true');
});

// close mobile nav on link click
document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('show');
  menuBtn.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
}));

// smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile nav if open
      mobileNav.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });
});

// contact form (client side only)
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      statusEl.style.color = '#dc2626';
      statusEl.textContent = 'Please fill all fields.';
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      statusEl.style.color = '#dc2626';
      statusEl.textContent = 'Provide a valid email.';
      return;
    }

    statusEl.style.color = '#0ea5a4';
    statusEl.textContent = 'Sending...';
    form.querySelector('button').disabled = true;

    setTimeout(() => {
      statusEl.style.color = '#0ea5a4';
      statusEl.textContent = 'Thank you — we will get back to you soon.';
      form.reset();
      form.querySelector('button').disabled = false;
    }, 900);
  });
}

// fill current year
document.getElementById('year').textContent = new Date().getFullYear();

// CTA scroll actions
document.getElementById('getStarted')?.addEventListener('click', () => {
  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('talkBtn')?.addEventListener('click', () => {
  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
});

// STORY TABS functionality with animation
(function () {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function activateTab(tabName) {
    tabButtons.forEach(btn => {
      const isActive = btn.dataset.tab === tabName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    tabContents.forEach(tc => {
      const match = tc.id === tabName;
      if (match) {
        tc.classList.add('active');
        tc.setAttribute('aria-hidden', 'false');
      } else {
        tc.classList.remove('active');
        tc.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // default: show who
  activateTab('who');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      activateTab(tabName);
    });
  });
})();

// --- GO TO TOP button logic ---
const toTopBtn = document.getElementById('toTopBtn');
const showAfter = 200; // px scrolled before showing

function handleScroll() {
  const scrolled = window.scrollY || document.documentElement.scrollTop;
  if (scrolled > showAfter) {
    toTopBtn.classList.add('show');
  } else {
    toTopBtn.classList.remove('show');
  }
}

// debounce small helper to avoid too many repaint triggers
let scrollDebounce;
window.addEventListener('scroll', () => {
  clearTimeout(scrollDebounce);
  scrollDebounce = setTimeout(handleScroll, 50);
});

// click to scroll to top smoothly
toTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // optionally hide the button quickly after click
  setTimeout(() => toTopBtn.classList.remove('show'), 500);
});

// initialize state
handleScroll();

// --- MAP lazy-loading using IntersectionObserver ---
(function () {
  const mapWrap = document.getElementById('mapWrap');
  const iframe = document.getElementById('mapIframe');
  if (!iframe) return;

  function loadMap() {
    const src = iframe.getAttribute('data-src');
    if (src && !iframe.src) {
      iframe.src = src;
    }
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadMap();
          io.disconnect();
        }
      });
    }, { rootMargin: '200px' });

    io.observe(mapWrap);
  } else {
    // fallback - load immediately
    loadMap();
  }
})();
