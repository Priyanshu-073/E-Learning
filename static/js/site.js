// Site-wide JS for small interactivity: search/filter, modal preview, small UI touches
(function () {
  'use strict';

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  // search/filter for list cards (works for courses and tests)
  function initCardSearch() {
    qsa('[data-search-input]').forEach(function (input) {
      var containerSelector = input.getAttribute('data-target');
      var container = document.querySelector(containerSelector);
      if (!container) return;
      var cards = qsa(container + ' [data-searchable]');
      var noMatch = document.createElement('div');
      noMatch.className = 'text-muted py-4';
      noMatch.innerText = 'No items match your search.';
      function filter() {
        var v = input.value.trim().toLowerCase();
        var any = false;
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-search-text') || '').toLowerCase();
          var match = v === '' || text.indexOf(v) !== -1;
          card.style.display = match ? '' : 'none';
          if (match) any = true;
        });
        // show noMatch
        if (!any) {
          if (!container.querySelector('.no-match-placeholder')) {
            noMatch.classList.add('no-match-placeholder');
            container.appendChild(noMatch);
          }
        } else {
          var placeholder = container.querySelector('.no-match-placeholder');
          if (placeholder) placeholder.remove();
        }
      }
      input.addEventListener('input', debounce(filter, 150));
    });
  }

  // debounce helper
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait);
    };
  }

  // Test preview modal (shows description quickly)
  function initTestPreviewModal() {
    var modal = qs('#testPreviewModal');
    if (!modal) return;
    var modalTitle = qs('#testPreviewModalLabel', modal);
    var modalBody = qs('.modal-body', modal);

    qsa('[data-preview-test]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var title = btn.getAttribute('data-title') || '';
        var desc = btn.getAttribute('data-description') || '';
        modalTitle.textContent = title;
        modalBody.innerHTML = '<p>' + escapeHtml(desc) + '</p>';
        // bootstrap modal show
        var bsModal = new bootstrap.Modal(modal);
        bsModal.show();
      });
    });
  }

  // instructor profile modal
  function initInstructorView() {
    var modalEl = qs('#instructorModal');
    if (!modalEl) return;
    var modalTitle = qs('#instructorName', modalEl);
    var modalBio = qs('#instructorBio', modalEl);
    var modalAvatar = qs('.instructor-avatar-lg', modalEl);
    qsa('.view-profile-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var name = btn.getAttribute('data-name') || '';
        var bio = btn.getAttribute('data-bio') || '';
        modalTitle.textContent = name;
        modalBio.textContent = bio;
        // set avatar initials
        var initials = (name || '').trim().charAt(0).toUpperCase();
        if (modalAvatar) modalAvatar.textContent = initials;
        var bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
      });
    });
  }

  // reveal fade-up elements with a small stagger
  function revealFadeUp() {
    var els = qsa('.fade-up');
    els.forEach(function (el, idx) {
      setTimeout(function () { el.classList.add('in-view'); }, idx * 60);
    });
  }

  function escapeHtml(s) {
    return (s+'').replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];
    });
  }

  // small micro-interactions: button press animation
  function initButtonEffects() {
    qsa('.btn').forEach(function (b) {
      b.addEventListener('mousedown', function () { b.classList.add('pressed'); });
      ['mouseup','mouseleave'].forEach(function (ev) { b.addEventListener(ev, function () { b.classList.remove('pressed'); }); });
    });
  }

  // password visibility toggles
  function initPasswordToggles() {
    qsa('.password-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var wrapper = btn.closest('.input-group');
        if (!wrapper) return;
        var field = wrapper.querySelector('.password-field');
        if (!field) return;
        if (field.type === 'password') {
          field.type = 'text';
          btn.classList.add('active');
        } else {
          field.type = 'password';
          btn.classList.remove('active');
        }
      });
    });
  }

  // Add classes/placeholders to simple auth forms to improve styling
  function enhanceAuthForms() {
    qsa('form.enhance-form').forEach(function (form) {
      qsa('input', form).forEach(function (input) {
        // add form-control if missing
        if (!input.classList.contains('form-control')) input.classList.add('form-control');
        // set placeholders if not present
        if (!input.placeholder) {
          if (input.name === 'username') input.placeholder = 'Email or Username';
          if (input.name === 'password') input.placeholder = 'Password';
        }
        // mark password fields for toggle
        if (input.type === 'password' && !input.classList.contains('password-field')) input.classList.add('password-field');
      });
    });
  }

  // initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    initCardSearch();
    initTestPreviewModal();
    initButtonEffects();
    initPasswordToggles();
    enhanceAuthForms();
    initInstructorView();
    revealFadeUp();
  });

})();
