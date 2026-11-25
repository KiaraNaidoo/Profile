/* =========================================================
   Kiara Naidoo — Multi-Page Shared Interactive Script
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year & Age
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const ageEl = document.getElementById('dynamicAge');
  if (ageEl) {
    const birthDate = new Date(2002, 4, 9); // 9 May 2002
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    ageEl.textContent = age;
  }

  // 2. Persistent Theme & Accent Color Switcher
  const savedAccent = localStorage.getItem('kiara_accent') || 'pink';
  const savedMode = localStorage.getItem('kiara_mode') || 'light';

  document.body.setAttribute('data-accent', savedAccent);
  if (savedMode === 'dark') document.body.classList.add('dark');

  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.color === savedAccent);
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      document.body.setAttribute('data-accent', color);
      localStorage.setItem('kiara_accent', color);
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.querySelectorAll('input[name="body-skin"]').forEach(radio => {
    radio.checked = radio.value === savedMode;
    radio.addEventListener('change', () => {
      const isDark = radio.value === 'dark';
      document.body.classList.toggle('dark', isDark);
      localStorage.setItem('kiara_mode', radio.value);
    });
  });

  const styleSwitcher = document.getElementById('styleSwitcher');
  const toggleSwitcherBtn = document.getElementById('toggleStyleSwitcher');
  if (toggleSwitcherBtn && styleSwitcher) {
    toggleSwitcherBtn.addEventListener('click', () => {
      styleSwitcher.classList.toggle('open');
    });
  }

  // 3. Mobile Navigation Drawer
  const navToggler = document.getElementById('navToggler');
  const aside = document.getElementById('aside');
  const overlay = document.getElementById('sidebarOverlay');

  function toggleMobileNav() {
    aside.classList.toggle('open');
    navToggler.classList.toggle('open');
    overlay.classList.toggle('active');
  }

  if (navToggler) navToggler.addEventListener('click', toggleMobileNav);
  if (overlay) overlay.addEventListener('click', toggleMobileNav);

  // 4. Toast Helper & Copy-to-Clipboard
  const toastEl = document.getElementById('toast');
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.copy).then(() => {
        showToast('Copied to clipboard: ' + btn.dataset.copy);
      });
    });
  });

  const copyEmailHero = document.getElementById('copyEmailHero');
  if (copyEmailHero) {
    copyEmailHero.addEventListener('click', () => {
      navigator.clipboard.writeText('naidookiara325is@gmail.com').then(() => {
        showToast('Email copied: naidookiara325is@gmail.com');
      });
    });
  }

  // 5. Home Page Typing Animation
  const typedTarget = document.getElementById('typedText');
  if (typedTarget) {
    const phrases = [
      'Software Engineer',
      'Full-Stack Web Developer',
      'SQL & AWS Data Enthusiast',
      'IT/OT Project Specialist'
    ];
    let pIndex = 0, cIndex = 0, deleting = false;

    function typeLoop() {
      const current = phrases[pIndex];
      if (!deleting) {
        typedTarget.textContent = current.slice(0, ++cIndex);
        if (cIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1600);
          return;
        }
      } else {
        typedTarget.textContent = current.slice(0, --cIndex);
        if (cIndex === 0) {
          deleting = false;
          pIndex = (pIndex + 1) % phrases.length;
        }
      }
      setTimeout(typeLoop, deleting ? 45 : 85);
    }
    typeLoop();
  }

  // 6. About Page: Skills Filter & CV Modal
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillItems = document.querySelectorAll('.skill-item');
  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.skillCat;
      skillItems.forEach(item => {
        item.classList.toggle('hidden', cat !== 'all' && item.dataset.cat !== cat);
      });
    });
  });

  const cvModal = document.getElementById('cvModal');
  const openCvBtn = document.getElementById('openCvModalBtn');
  const closeCvBtn = document.getElementById('closeCvModalBtn');
  if (cvModal && openCvBtn && closeCvBtn) {
    openCvBtn.addEventListener('click', () => cvModal.classList.add('open'));
    closeCvBtn.addEventListener('click', () => cvModal.classList.remove('open'));
    cvModal.addEventListener('click', e => {
      if (e.target === cvModal) cvModal.classList.remove('open');
    });
  }

  // 7. Portfolio Page: Category Filter & Project Lightbox
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = Array.from(document.querySelectorAll('.portfolio-card'));
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioCards.forEach(card => {
        card.classList.toggle('hide', filter !== 'all' && card.dataset.category !== filter);
      });
    });
  });

  const projectModal = document.getElementById('projectModal');
  if (projectModal && portfolioCards.length > 0) {
    let currentIdx = 0;
    const modalImg = document.getElementById('modalProjectImg');
    const modalCat = document.getElementById('modalProjectCategory');
    const modalCounter = document.getElementById('modalProjectCounter');
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalDesc = document.getElementById('modalProjectDesc');
    const modalStack = document.getElementById('modalProjectStack');

    function renderProjectModal(idx) {
      const card = portfolioCards[idx];
      modalImg.src = card.dataset.img;
      modalImg.alt = card.dataset.title;
      modalCat.textContent = card.dataset.categoryLabel;
      modalCounter.textContent = `${idx + 1} of ${portfolioCards.length}`;
      modalTitle.textContent = card.dataset.title;
      modalDesc.textContent = card.dataset.desc;
      modalStack.textContent = card.dataset.stack;
    }

    portfolioCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        currentIdx = idx;
        renderProjectModal(currentIdx);
        projectModal.classList.add('open');
      });
    });

    document.getElementById('closeProjectModalBtn').addEventListener('click', () => {
      projectModal.classList.remove('open');
    });

    document.getElementById('prevProjectBtn').addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + portfolioCards.length) % portfolioCards.length;
      renderProjectModal(currentIdx);
    });

    document.getElementById('nextProjectBtn').addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % portfolioCards.length;
      renderProjectModal(currentIdx);
    });

    projectModal.addEventListener('click', e => {
      if (e.target === projectModal) projectModal.classList.remove('open');
    });
  }

  // 8. Contact Page: Pre-select Service from URL & Form Submit
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const params = new URLSearchParams(window.location.search);
    const serviceParam = params.get('service');
    const serviceSelect = document.getElementById('serviceSelect');
    if (serviceParam && serviceSelect) {
      Array.from(serviceSelect.options).forEach(opt => {
        if (opt.value.toLowerCase() === serviceParam.toLowerCase()) {
          opt.selected = true;
        }
      });
    }

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const service = serviceSelect ? serviceSelect.value : 'Inquiry';
      const subject = document.getElementById('subjectInput').value.trim();
      const message = document.getElementById('messageInput').value.trim();
      const statusEl = document.getElementById('formStatus');

      if (!name || !email || !subject || !message) {
        statusEl.style.color = '#ec1839';
        statusEl.textContent = 'Please fill in all required fields.';
        return;
      }

      statusEl.style.color = '#28a745';
      statusEl.textContent = 'Opening your email client to send message...';
      showToast('Message ready! Opening email client...');

      const mailBody = `Hi Kiara,%0D%0A%0D%0AName: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0AService: ${encodeURIComponent(service)}%0D%0A%0D%0A${encodeURIComponent(message)}`;
      window.location.href = `mailto:naidookiara325is@gmail.com?subject=${encodeURIComponent('[' + service + '] ' + subject)}&body=${mailBody}`;
    });
  }
});
