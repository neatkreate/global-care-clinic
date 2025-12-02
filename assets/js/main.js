// Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const overlay = document.querySelector('.menu-overlay');

// Modal elements
const modal = document.getElementById('reservationModal');
const openModalBtn = document.getElementById('openModal');
const closeBtn = document.querySelector('.close');
const form = document.getElementById('reservationForm');

// --- Mobile menu logic ---
function openMenu() {
  navLinks.classList.add('active');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  overlay.classList.add('active');
  // prevent body scroll when menu open
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('active');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (hamburger && navLinks && overlay) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
      closeModal();
    }
  });

  // Close when clicking any nav link (for smoother UX)
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

// --- Modal logic ---
function openModal() {
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

if (openModalBtn) openModalBtn.addEventListener('click', openModal);
if (closeBtn) closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// --- WhatsApp integration ---
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    const whatsappMessage =
      `Hello, my name is ${name}. Email: ${email}, Phone: ${phone}. ` +
      `Message: ${message}`;
    const whatsappURL = `https://wa.me/233502180586?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappURL, '_blank');
    closeModal();
  });
}

// --- Sticky Banner Scroll Detection ---
const stickyBanner = document.querySelector('.sticky-banner');

if (stickyBanner) {
  window.addEventListener('scroll', () => {
    // Calculate when to show banner (near bottom)
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Show banner when user is within 300px of the bottom
    const distanceFromBottom = scrollHeight - (scrollTop + windowHeight);
    
    if (distanceFromBottom < 300) {
      stickyBanner.classList.add('show');
    } else {
      stickyBanner.classList.remove('show');
    }
  });
}

// Open modal on page load if URL contains ?openModal=1
try {
  const params = new URLSearchParams(window.location.search);
  const openFlag = params.get('openModal');
  if (openFlag === '1' || openFlag === 'true') {
    if (typeof openModal === 'function') {
      openModal();
      // remove the query param without reloading
      if (history && history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete('openModal');
        history.replaceState(null, '', url.toString());
      }
    }
  }
} catch (err) {
  // ignore URL parsing errors
}

// --- Blog Read More toggles ---
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.read-more');
  if (!btn) return;
  const targetId = btn.getAttribute('data-target');
  if (!targetId) return;

  const article = document.getElementById(targetId);
  if (!article) return;

  const isOpen = article.classList.contains('open');
  if (isOpen) {
    article.classList.remove('open');
    article.setAttribute('aria-hidden', 'true');
    btn.textContent = 'Read More →';
  } else {
    article.classList.add('open');
    article.setAttribute('aria-hidden', 'false');
    btn.textContent = 'Show Less ←';
    // smooth scroll into view for the expanded content
    setTimeout(() => {
      article.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
});
// Chart.js setup
document.addEventListener("DOMContentLoaded", () => {
  // Appointments Chart
  const ctx1 = document.getElementById("appointmentsChart");
  if (ctx1) {
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: ["Nov 25", "Nov 26", "Nov 27", "Nov 28", "Nov 29", "Nov 30"],
        datasets: [{
          label: "Appointments per Day",
          data: [5, 8, 6, 10, 7, 12],
          borderColor: "#d4af37",
          backgroundColor: "rgba(212,175,55,0.2)",
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } }
      }
    });
  }

  // Services Chart
  const ctx2 = document.getElementById("servicesChart");
  if (ctx2) {
    new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: ["Consultation", "Diagnostics", "Emergency Care", "Surgery"],
        datasets: [{
          data: [40, 25, 20, 15],
          backgroundColor: ["#004d4d", "#d4af37", "#25D366", "#888"]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }
});