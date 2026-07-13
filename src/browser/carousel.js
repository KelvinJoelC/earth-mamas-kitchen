import EmblaCarousel from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

const CAROUSEL_INITIALIZED_ATTR = 'data-carousel-initialized';
const CAROUSEL_TOGGLE_INITIALIZED_ATTR = 'data-carousel-toggle-initialized';

function initCarousel(emblaNode) {
  if (emblaNode.hasAttribute(CAROUSEL_INITIALIZED_ATTR)) return;

  const isAutoplay = emblaNode.classList.contains('autoplayCarousel');
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const options = { loop: isAutoplay };
  const autoplay = isAutoplay
    ? Autoplay({ playOnInit: !reduceMotion, delay: 3000 })
    : null;
  const plugins = autoplay ? [autoplay] : [];

  const embla = EmblaCarousel(emblaNode, options, plugins);
  emblaNode.setAttribute(CAROUSEL_INITIALIZED_ATTR, 'true');
  initAutoplayToggle(emblaNode, autoplay, reduceMotion);

  embla.on('reInit', () => {
    initAutoplayToggle(emblaNode, autoplay, reduceMotion);
  });
}

function initAutoplayToggle(emblaNode, autoplay, reduceMotion) {
  const section = emblaNode.closest('section');
  const toggle = section?.querySelector('[data-carousel-toggle]');

  if (
    !(toggle instanceof HTMLButtonElement) ||
    !autoplay ||
    toggle.hasAttribute(CAROUSEL_TOGGLE_INITIALIZED_ATTR)
  ) {
    return;
  }

  toggle.setAttribute(CAROUSEL_TOGGLE_INITIALIZED_ATTR, 'true');

  if (reduceMotion) {
    toggle.hidden = true;
    toggle.disabled = true;
    autoplay.stop();
    return;
  }

  function updateToggle() {
    const isPlaying =
      typeof autoplay.isPlaying === 'function' ? autoplay.isPlaying() : false;

    toggle.setAttribute('aria-pressed', String(!isPlaying));
    toggle.setAttribute(
      'aria-label',
      isPlaying ? 'Pause awards carousel' : 'Play awards carousel',
    );
    toggle.textContent = isPlaying
      ? 'Pause awards carousel'
      : 'Play awards carousel';
  }

  toggle.addEventListener('click', () => {
    const isPlaying =
      typeof autoplay.isPlaying === 'function' ? autoplay.isPlaying() : false;

    if (isPlaying) {
      autoplay.stop();
    } else {
      autoplay.play();
    }

    updateToggle();
  });

  updateToggle();
}

function initCarousels() {
  document.querySelectorAll('.embla').forEach(initCarousel);
}

if (!window.carouselInitialized) {
  document.addEventListener('DOMContentLoaded', initCarousels, { once: true });
  document.addEventListener('astro:page-load', initCarousels);
  window.addEventListener('load', initCarousels, { once: true });
  window.carouselInitialized = true;
}

queueMicrotask(initCarousels);
