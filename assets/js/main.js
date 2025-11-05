// Main behaviors: language init, year, form handling
// Keeps logic simple and framework-free for easy maintenance.

(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n and language switcher
    if (window.I18N && typeof window.I18N.init === 'function') {
      window.I18N.init();
    }

    // Footer year
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());

    // Complaint form handling: show confirmation, keep client-side
    const form = document.getElementById('complaint-form');
    const success = document.getElementById('form-success');
    if (form) {
      // File list preview for complaints
      const compFiles = document.getElementById('complaintFiles');
      const compFileList = document.getElementById('complaint-file-list');
      if (compFiles && compFileList) {
        const maxFiles = 5;
        const maxSize = 5 * 1024 * 1024; // 5MB
        const render = (files) => {
          compFileList.innerHTML = '';
          if (!files || files.length === 0) return;
          const ul = document.createElement('ul');
          ul.style.listStyle = 'none';
          ul.style.padding = '0';
          Array.from(files).slice(0, maxFiles).forEach(f => {
            const li = document.createElement('li');
            li.textContent = `${f.name} — ${(f.size/1024/1024).toFixed(2)} MB`;
            if (f.size > maxSize) li.style.color = '#b91c1c';
            ul.appendChild(li);
          });
          compFileList.appendChild(ul);
        };
        compFiles.addEventListener('change', () => render(compFiles.files));
      }

      // Simulated real-time status updates
      const statusBox = document.getElementById('complaint-status');
      const statusItems = statusBox ? Array.from(statusBox.querySelectorAll('.status-list li')) : [];

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Basic, accessible confirmation without backend
        if (success) {
          success.hidden = false;
          success.focus?.();
        }
        if (statusBox && statusItems.length) {
          statusBox.hidden = false;
          // reset state
          statusItems.forEach(li => li.classList.remove('current', 'done'));
          // step through statuses
          let step = 0;
          const advance = () => {
            statusItems.forEach((li, idx) => {
              li.classList.toggle('current', idx === step);
              li.classList.toggle('done', idx < step);
            });
            step++;
            if (step <= statusItems.length) setTimeout(advance, 1200);
          };
          advance();
        }
        // Reset form fields after a brief delay for UX
        setTimeout(() => {
          form.reset();
          if (compFileList) compFileList.innerHTML = '';
        }, 150);
      });
    }

    // Medical documents upload: previews and confirmation
    const medForm = document.getElementById('medical-form');
    const medSuccess = document.getElementById('medical-success');
    const fileInput = document.getElementById('files');
    const fileList = document.getElementById('file-list');
    if (medForm) {
      const maxFiles = 10;
      const maxSize = 10 * 1024 * 1024; // 10MB
      function renderFiles(files){
        if (!fileList) return;
        fileList.innerHTML = '';
        if (!files || files.length === 0) return;
        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '0';
        Array.from(files).slice(0, maxFiles).forEach(f => {
          const li = document.createElement('li');
          li.textContent = `${f.name} — ${(f.size/1024/1024).toFixed(2)} MB`;
          if (f.size > maxSize) li.style.color = '#b91c1c';
          ul.appendChild(li);
        });
        fileList.appendChild(ul);
      }
      if (fileInput) {
        fileInput.addEventListener('change', () => renderFiles(fileInput.files));
      }
      medForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Basic validation: limit files and size
        const files = (fileInput && fileInput.files) ? Array.from(fileInput.files) : [];
        const tooMany = files.length > maxFiles;
        const tooLarge = files.some(f => f.size > maxSize);
        if (tooMany || tooLarge) {
          alert('Please ensure up to 10 files and each under 10MB.');
          return;
        }
        if (medSuccess) {
          medSuccess.hidden = false;
          medSuccess.focus?.();
        }
        setTimeout(() => {
          medForm.reset();
          if (fileList) fileList.innerHTML = '';
        }, 150);
      });
    }

    // Mobile navigation toggle
    const nav = document.querySelector('.nav-links');
    const toggle = document.querySelector('.nav-toggle');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        const opened = nav.classList.contains('open');
        toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
      });
      // Close menu when a link is clicked (useful on mobile)
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      }));
      // Ensure menu resets on resize to desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Accordion behavior
    document.querySelectorAll('[data-accordion] .accordion-item').forEach(item => {
      const btn = item.querySelector('.accordion-header');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const expanded = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
    });

    // Chips filter for economy grid
    const chipBar = document.querySelector('[data-filter]');
    const ecoGrid = document.getElementById('eco-grid');
    if (chipBar && ecoGrid) {
      chipBar.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
          chipBar.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          const val = chip.getAttribute('data-filter-value');
          ecoGrid.querySelectorAll('.card').forEach(card => {
            const type = card.getAttribute('data-type');
            card.style.display = (val === 'all' || val === type) ? '' : 'none';
          });
        });
      });
    }

    // Modal behavior
    function openModal(modal){ if(!modal) return; modal.setAttribute('aria-hidden','false'); }
    function closeModal(modal){ if(!modal) return; modal.setAttribute('aria-hidden','true'); }
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sel = btn.getAttribute('data-open-modal');
        const modal = document.querySelector(sel);
        openModal(modal);
      });
    });
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
    });
  });
})();
