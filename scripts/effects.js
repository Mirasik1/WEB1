
$(function () {
  
  const $toast = $('<div class="action-toast" role="status" aria-live="polite"></div>').hide().appendTo('body');

  $('.gallery-container').on('click', '.gallery-item', function (event) {
    event.stopPropagation();
    playRandomMp3Sound();
    $(this).stop(true).animate({ opacity: 0.65 }, 120).animate({ opacity: 1 }, 120);
    $toast.stop(true, true).text('Sound played!').fadeIn(200).delay(1800).fadeOut(500);
  });

  
  $('.faq-copy').on('click', async function () {
    const $button = $(this);
    const text = $button.siblings('p').text().trim();
    try {
      await navigator.clipboard.writeText(text);
      $button.trigger('copy');
    } catch (error) {
      $button.attr('data-tooltip', 'Copy failed').addClass('show-tooltip');
      setTimeout(() => $button.removeClass('show-tooltip'), 2000);
    }
  });

  $('.faq-copy').on('copy', function () {
    const $button = $(this);
    clearTimeout($button.data('resetTimer'));
    $button.find('span').text('✓');
    $button.attr('data-tooltip', 'Copied to clipboard!').addClass('show-tooltip');
    $button.data('resetTimer', setTimeout(() => {
      $button.find('span').text('⧉');
      $button.removeClass('show-tooltip');
    }, 2000));
  });

  
  function loadVisibleImages() {
    const viewportBottom = $(window).scrollTop() + $(window).height() + 150;
    $('.lazy-image[data-src]').each(function () {
      const $image = $(this);
      if ($image.offset().top <= viewportBottom) {
        $image.attr('src', $image.attr('data-src')).removeAttr('data-src');
      }
    });
  }
  $(window).on('scroll resize', loadVisibleImages);
  loadVisibleImages();

  /*Task 4: scroll progress*/
  const $bar = $(
    '<div class="scroll-progress is-idle" role="progressbar" aria-label="Page scroll progress" ' +
    'aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="scroll-progress__fill"></div></div>'
  ).prependTo('body');
  const $badge = $('<div class="scroll-badge" aria-hidden="true"><span>0%</span></div>').appendTo('body');

  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const percent = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    const hue = 20 + percent * 3.2;                       // orange -> blue -> pink while scrolling

    $bar.add($badge).each(function () {
      this.style.setProperty('--p', percent.toFixed(2));
      this.style.setProperty('--hue', hue.toFixed(0));
    });
    $bar.toggleClass('is-idle', percent < 0.5).attr('aria-valuenow', Math.round(percent));
    $badge.toggleClass('is-visible', window.scrollY > 120).find('span').text(Math.round(percent) + '%');
  }
  $(window).on('scroll resize', updateProgress);
  updateProgress();

  /*number counter*/
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function format($el, value) {
    const decimals = Number($el.data('decimals')) || 0;
    return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
      ($el.data('suffix') || '');
  }

  function countUp($el) {
    const target = Number($el.data('target')) || 0;
    if (reduceMotion) { $el.text(format($el, target)); return; }
    $({ n: 0 }).animate({ n: target }, {
      duration: Number($el.data('duration')) || 2000,
      easing: 'swing',                                    
      step: now => $el.text(format($el, now)),
      complete: () => $el.text(format($el, target))
    });
  }

  const $numbers = $('.stat-number');
  $numbers.each(function () { $(this).text(format($(this), 0)); });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countUp($(entry.target));
        obs.unobserve(entry.target);                      
      });
    }, { threshold: 0.4 });
    $numbers.each(function () { observer.observe(this); });
  } else {
    $numbers.each(function () { countUp($(this)); });
  }
});
