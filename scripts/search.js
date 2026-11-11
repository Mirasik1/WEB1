
$(function () {
  const $input = $('#site-search');
  if (!$input.length) return;

  const $list = $('#suggestions');
  const $status = $('#search-status');
  const $items = $('.searchable');             
  const $scope = $('#search-scope');           
  let activeIndex = -1;

  const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapeHtml = s => s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* filter */
  function filterItems(query) {
    const q = query.toLowerCase();
    let shown = 0;
    $items.each(function () {
      const match = !q || $(this).text().toLowerCase().includes(q);
      $(this).toggleClass('is-hidden', !match);
      if (match) shown++;
    });
    $status.text(q ? (shown ? `${shown} result${shown === 1 ? '' : 's'} found` : 'No results found') : '');
  }

  /* highlighting */
  function clearHighlights() {
    $scope.find('mark.hl').each(function () {
      this.replaceWith(document.createTextNode(this.textContent));
    });
    $scope.each(function () { this.normalize(); });
  }

  function highlight(query) {
    clearHighlights();
    const term = query.trim();
    if (!term) return;
    const re = new RegExp(escapeRegex(term), 'gi');

    const walker = document.createTreeWalker($scope[0], NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (parent.closest('.is-hidden, script, style, .search-wrap')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      const text = node.nodeValue;
      re.lastIndex = 0;
      if (!re.test(text)) return;
      const frag = document.createDocumentFragment();
      let last = 0;
      text.replace(re, (m, offset) => {
        frag.append(text.slice(last, offset));
        const mark = document.createElement('mark');
        mark.className = 'hl';
        mark.textContent = m;
        frag.append(mark);
        last = offset + m.length;
        return m;
      });
      frag.append(text.slice(last));
      node.replaceWith(frag);
    });
  }

  /*autocomplete */
  const pool = [...new Set(
    $('.card-title, .faq-item h3, .card li').map(function () {
      return $(this).text().trim();
    }).get()
  )];

  function renderSuggestions(query) {
    const q = query.trim().toLowerCase();
    activeIndex = -1;
    if (!q) return closeSuggestions();

    const matches = pool
      .filter(s => s.toLowerCase().includes(q))
      .sort((a, b) => a.toLowerCase().indexOf(q) - b.toLowerCase().indexOf(q))
      .slice(0, 6);

    if (!matches.length) return closeSuggestions();

    const re = new RegExp(`(${escapeRegex(q)})`, 'gi');
    $list.html(matches.map((s, i) =>
      `<li role="option" id="sugg-${i}" data-value="${escapeHtml(s)}">${
        escapeHtml(s).replace(re, '<mark>$1</mark>')}</li>`).join('')
    ).prop('hidden', false);
    $input.attr('aria-expanded', 'true');
  }

  function closeSuggestions() {
    $list.prop('hidden', true).empty();
    $input.attr({ 'aria-expanded': 'false' }).removeAttr('aria-activedescendant');
    activeIndex = -1;
  }

  function setActive(i) {
    const $opts = $list.children();
    if (!$opts.length) return;
    activeIndex = (i + $opts.length) % $opts.length;
    $opts.attr('aria-selected', 'false').eq(activeIndex).attr('aria-selected', 'true');
    $input.attr('aria-activedescendant', $opts.eq(activeIndex).attr('id'));
  }

  function choose(value) {
    $input.val(value);
    closeSuggestions();
    runSearch(value);
  }

  function runSearch(value) {
    filterItems(value);
    highlight(value);
  }

  /*Events*/
  $input.on('keyup', function (e) {
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) return;
    const value = $(this).val();
    runSearch(value);
    renderSuggestions(value);
  });

  $input.on('keydown', function (e) {
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive(activeIndex + 1); break;
      case 'ArrowUp':   e.preventDefault(); setActive(activeIndex - 1); break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex > -1) choose($list.children().eq(activeIndex).data('value'));
        else closeSuggestions();
        break;
      case 'Escape': closeSuggestions(); break;
    }
  });

  $list.on('mousedown', 'li', function (e) { 
    e.preventDefault();
    choose($(this).data('value'));
  });

  $input.on('blur', closeSuggestions);
});