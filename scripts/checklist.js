/**
 * Web Accessibility Training Toolkit - Checklist Interactivity
 * Handles checkbox toggling, filtering, search, progress tracking, and export.
 */

document.addEventListener('DOMContentLoaded', function () {
  const STORAGE_KEY = 'toolkit-checklist-state';

  const container      = document.getElementById('checklist-container');
  const completedCount = document.getElementById('completed-count');
  const totalCount     = document.getElementById('total-count');
  const completionPct  = document.getElementById('completion-percentage');
  const progressBar    = document.getElementById('progress-bar');
  const levelFilter    = document.getElementById('level-filter');
  const statusFilter   = document.getElementById('status-filter');
  const searchInput    = document.getElementById('search-checklist');
  const exportBtn      = document.getElementById('export-btn');
  const resetBtn       = document.getElementById('reset-btn');
  const categoryPills  = document.querySelectorAll('.category-pill');
  const modalOverlay   = document.querySelector('.modal-overlay');
  const modalClose     = document.querySelector('.modal-close');

  if (!container) return;

  const items = Array.from(container.querySelectorAll('.checklist-item'));

  // In-memory state — single source of truth; flushed to localStorage on every mutation
  let state = loadState();
  // Track active category pill to avoid querying the DOM on every filter call
  let activeCategoryPill = document.querySelector('.category-pill.active') || categoryPills[0];

  // Restore saved state
  items.forEach(function (item, idx) {
    if (state[itemKey(item, idx)]) {
      setItemCompleted(item, true, false);
    }
  });

  // Wire up checkboxes
  items.forEach(function (item, idx) {
    const checkbox = item.querySelector('.custom-checkbox');
    if (!checkbox) return;
    checkbox.addEventListener('click', function () { toggleItem(item, idx); });
    checkbox.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleItem(item, idx);
      }
    });
  });

  // Wire up "Show details" toggles via delegation
  container.addEventListener('click', function (e) {
    const btn = e.target.closest('.toggle-details');
    if (!btn) return;
    const item    = btn.closest('.checklist-item');
    const details = item.querySelector('.item-details');
    const isOpen  = btn.getAttribute('aria-expanded') === 'true';

    btn.setAttribute('aria-expanded', !isOpen);
    btn.querySelector('span').textContent = isOpen ? 'Show details' : 'Hide details';
    details.classList.toggle('active', !isOpen);
    if (!isOpen) wireExampleTabs(item);
  });

  // Category pills
  categoryPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      categoryPills.forEach(function (p) {
        p.classList.remove('active');
        p.removeAttribute('aria-pressed');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-pressed', 'true');
      activeCategoryPill = pill;
      applyFilters();
    });
  });

  if (levelFilter)  levelFilter.addEventListener('change', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
  if (searchInput)  searchInput.addEventListener('input', applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (!confirm('Reset all checklist progress? This cannot be undone.')) return;
      items.forEach(function (item) { setItemCompleted(item, false, false); });
      state = {};
      saveState(state);
      updateProgress();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', exportCSV);
  }

  if (modalClose && modalOverlay) {
    modalClose.addEventListener('click', function () { modalOverlay.classList.remove('active'); });
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') modalOverlay.classList.remove('active');
    });
  }

  updateProgress();
  applyFilters();

  // ── Core functions ─────────────────────────────────────────────────────────

  function toggleItem(item, idx) {
    const checkbox     = item.querySelector('.custom-checkbox');
    const isNowComplete = !checkbox.classList.contains('checked');
    setItemCompleted(item, isNowComplete, true);
    updateProgress();
    applyFilters();
  }

  function setItemCompleted(item, complete, persist) {
    const checkbox = item.querySelector('.custom-checkbox');
    if (!checkbox) return;
    checkbox.classList.toggle('checked', complete);
    checkbox.setAttribute('aria-checked', complete ? 'true' : 'false');
    item.classList.toggle('completed', complete);

    if (persist) {
      const key = itemKey(item, items.indexOf(item));
      if (complete) {
        state[key] = true;
      } else {
        delete state[key];
      }
      saveState(state);
    }
  }

  function updateProgress() {
    const done  = items.filter(function (i) { return i.classList.contains('completed'); });
    const total = items.length;
    const pct   = total > 0 ? Math.round((done.length / total) * 100) : 0;

    if (completedCount) completedCount.textContent = done.length;
    if (totalCount)     totalCount.textContent     = total;
    if (completionPct)  completionPct.textContent  = pct + '%';
    if (progressBar) {
      progressBar.style.width = pct + '%';
      progressBar.setAttribute('aria-valuenow', pct);
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', '100');
    }
  }

  function applyFilters() {
    const category = activeCategoryPill ? activeCategoryPill.dataset.category : 'all';
    const level    = levelFilter  ? levelFilter.value  : 'all';
    const status   = statusFilter ? statusFilter.value : 'all';
    const query    = searchInput  ? searchInput.value.toLowerCase().trim() : '';

    let visibleCount = 0;

    items.forEach(function (item) {
      const matchCat    = category === 'all' || item.dataset.category === category;
      const matchLevel  = level    === 'all' || item.dataset.level    === level;
      const matchStatus = status   === 'all' ||
        (status === 'completed'  &&  item.classList.contains('completed')) ||
        (status === 'incomplete' && !item.classList.contains('completed'));
      const titleText   = (item.querySelector('.item-title')       || {}).textContent || '';
      const descText    = (item.querySelector('.item-description')  || {}).textContent || '';
      const matchSearch = !query || titleText.toLowerCase().includes(query) || descText.toLowerCase().includes(query);

      const show = matchCat && matchLevel && matchStatus && matchSearch;
      item.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    let noResults = container.querySelector('.no-results');
    if (visibleCount === 0) {
      if (!noResults) {
        noResults = document.createElement('p');
        noResults.className = 'no-results';
        noResults.textContent = 'No checklist items match your current filters.';
        container.appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  function wireExampleTabs(item) {
    const tabs     = item.querySelectorAll('.example-tab');
    const contents = item.querySelectorAll('.example-content');
    tabs.forEach(function (tab) {
      if (tab._wired) return;
      tab._wired = true;
      tab.addEventListener('click', function () {
        const target = tab.dataset.tab;
        tabs.forEach(function (t) { t.classList.remove('active'); });
        contents.forEach(function (c) { c.classList.remove('active'); });
        tab.classList.add('active');
        const el = item.querySelector('#' + target);
        if (el) el.classList.add('active');
      });
    });
  }

  function csvField(value) {
    return '"' + String(value).replace(/"/g, '""') + '"';
  }

  function exportCSV() {
    const rows = [['Title', 'Category', 'WCAG Level', 'Status']];
    items.forEach(function (item) {
      const title    = (item.querySelector('.item-title') || {}).textContent || '';
      const category = item.dataset.category || '';
      const level    = item.dataset.level || '';
      const status   = item.classList.contains('completed') ? 'Completed' : 'Incomplete';
      rows.push([csvField(title), csvField(category), csvField(level.toUpperCase()), csvField(status)]);
    });

    const csv  = rows.map(function (r) { return r.join(','); }).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'accessibility-checklist.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function itemKey(item, idx) {
    return 'item-' + (item.dataset.category || '') + '-' + idx;
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }

  function saveState(s) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (_) {}
  }
});
