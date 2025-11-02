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
    var videoWrapper = qs('#instructorVideoWrapper', modalEl);
    var videoFrame = qs('#instructorVideo', modalEl);
    qsa('.view-profile-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var name = btn.getAttribute('data-name') || '';
        var bio = btn.getAttribute('data-bio') || '';
        var video = btn.getAttribute('data-video') || '';
        modalTitle.textContent = name;
        modalBio.textContent = bio;
        // set avatar initials
        var initials = (name || '').trim().charAt(0).toUpperCase();
        if (modalAvatar) modalAvatar.textContent = initials;
        // if a video url is present, try to embed (YouTube/Vimeo simple transforms)
        if(video && video.length){
          // naive embed handling: convert youtube watch?v= to embed URL, otherwise set src directly
          var src = video;
          if(video.indexOf('youtube.com/watch') !== -1) src = video.replace('watch?v=', 'embed/');
          if(video.indexOf('youtu.be/') !== -1) src = video.replace('youtu.be/', 'www.youtube.com/embed/');
          // set iframe src and show wrapper
          if(videoFrame){ videoFrame.setAttribute('src', src); }
          if(videoWrapper) videoWrapper.style.display = '';
        } else {
          if(videoFrame){ videoFrame.setAttribute('src', ''); }
          if(videoWrapper) videoWrapper.style.display = 'none';
        }
        var bsModal = new bootstrap.Modal(modalEl);
        bsModal.show();
      });
    });
    // clear video on hide to stop playback
    modalEl.addEventListener('hidden.bs.modal', function(){
      if(videoFrame) videoFrame.setAttribute('src','');
      if(videoWrapper) videoWrapper.style.display = 'none';
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
    initParallax();
    initDashboardCheckboxProgress();
    initThemeToggle();
  });

  // Parallax for remedial classes background
  function initParallax(){
    var container = qs('.remedial-classes-bg');
    if(!container) return;
    // don't run on touch devices or small screens
    if(('ontouchstart' in window) || window.innerWidth < 768) return;
    // create a parallax layer if not present
    if(!qs('.bg-parallax-layer', container)){
      var layer = document.createElement('div');
      layer.className = 'bg-parallax-layer';
      container.insertBefore(layer, container.firstChild);
    }
    var layerEl = qs('.bg-parallax-layer', container);
    var ticking = false;
    function onScroll(){
      if(!ticking){
        window.requestAnimationFrame(function(){
          var rect = container.getBoundingClientRect();
          var winH = window.innerHeight;
          // when in view, move the background slightly
          var pct = (rect.top) / (winH + rect.height);
          // clamp and invert a bit for nicer effect
          var offset = Math.max(-0.25, Math.min(0.25, -pct * 0.2));
          layerEl.style.transform = 'translateY(' + (offset * 100) + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    // initial position
    onScroll();
  }

  // theme switching removed — site uses default/light variables only
  // Theme toggle: light / dark with persistence (re-added)
  function getStoredTheme(){
    try{ return localStorage.getItem('theme'); }catch(e){ return null; }
  }
  function storeTheme(t){ try{ localStorage.setItem('theme', t); }catch(e){} }

  function applyTheme(t){
    try {
      if (t === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');
    } catch (e) { console.warn('applyTheme: could not set attribute', e); }
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      btn.textContent = t === 'dark' ? '☀️' : '🌙';
    }
  }

  function detectPreferredTheme(){
    var stored = getStoredTheme();
    if(stored) return stored;
    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function initThemeToggle(){
    var btn = document.getElementById('theme-toggle');
    if(!btn) return;
    var theme = detectPreferredTheme();
    applyTheme(theme);
    try{ console.debug('[theme] initThemeToggle: applied theme=', theme, 'stored=', getStoredTheme()); }catch(e){}
    btn.addEventListener('click', function(){
      var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
      try{ console.debug('[theme] toggled from', current, 'to', next, 'localStorage=', localStorage.getItem('theme')); }catch(e){}
    });
  }

  // Dashboard: checkbox-driven per-instructor progress bars
  function initDashboardCheckboxProgress(){
    var dashboard = qs('.dashboard-container');
    if(!dashboard) return;
    // attach listeners to lesson checkboxes
    qsa('.lesson-checkbox', dashboard).forEach(function(cb){
      cb.addEventListener('change', function(){
        var block = cb.closest('.instructor-progress-block');
        if(!block) return;
        var boxes = qsa('.lesson-checkbox', block);
        var total = boxes.length;
        var checked = boxes.filter(function(b){ return b.checked; }).length;
        var pct = total ? Math.round((checked/total)*100) : 0;
        var bar = qs('.progress-bar', block);
        if(bar){
          bar.style.width = pct + '%';
          bar.setAttribute('aria-valuenow', pct);
        }
        var label = qs('.lessons-completed-label', block);
        if(label) label.textContent = checked + ' / ' + total + ' units';
        // persist simple state per page using localStorage keyed by instructor name (if available)
        try{
          var key = 'dashboard_progress_' + (block.getAttribute('data-instructor') || block.querySelector('strong')?.textContent || 'unknown');
          var state = boxes.map(function(b){ return b.checked ? '1' : '0'; }).join('');
          localStorage.setItem(key, state);
        }catch(e){}
      });
    });
    // restore any persisted state
    qsa('.instructor-progress-block', dashboard).forEach(function(block){
      try{
        var key = 'dashboard_progress_' + (block.getAttribute('data-instructor') || block.querySelector('strong')?.textContent || 'unknown');
        var state = localStorage.getItem(key);
        if(state){
          var boxes = qsa('.lesson-checkbox', block);
          for(var i=0;i<boxes.length && i<state.length;i++) boxes[i].checked = state.charAt(i) === '1';
          // trigger a change to update UI
          boxes.forEach(function(b){ b.dispatchEvent(new Event('change')); });
        }
      }catch(e){}
    });
  }

})();
