import EmblaCarousel from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

const CAROUSEL_INITIALIZED_ATTR = 'data-carousel-initialized';

const carouselInstances = new Map();
let lifecycleInitialized = false;

function initCarousel(emblaNode) {
  if (
    !(emblaNode instanceof HTMLElement) ||
    carouselInstances.has(emblaNode) ||
    emblaNode.hasAttribute(CAROUSEL_INITIALIZED_ATTR)
  ) {
    return;
  }

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
  const instance = {
    embla,
    toggleController: null,
  };

  carouselInstances.set(emblaNode, instance);
  emblaNode.setAttribute(CAROUSEL_INITIALIZED_ATTR, 'true');
  initAutoplayToggle(emblaNode, autoplay, reduceMotion);

  embla.on('reInit', () => {
    initAutoplayToggle(emblaNode, autoplay, reduceMotion);
  });
}

function initAutoplayToggle(emblaNode, autoplay, reduceMotion) {
  const section = emblaNode.closest('section');
  const toggle = section?.querySelector('[data-carousel-toggle]');
  const instance = carouselInstances.get(emblaNode);

  if (!(toggle instanceof HTMLButtonElement) || !autoplay || !instance) {
    return;
  }

  instance.toggleController?.abort();

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

  instance.toggleController = new AbortController();
  toggle.addEventListener(
    'click',
    () => {
      const isPlaying =
        typeof autoplay.isPlaying === 'function' ? autoplay.isPlaying() : false;

      if (isPlaying) {
        autoplay.stop();
      } else {
        autoplay.play();
      }

      updateToggle();
    },
    { signal: instance.toggleController.signal },
  );

  updateToggle();
}

function initCarousels() {
  document.querySelectorAll('.embla').forEach(initCarousel);
}

function cleanupCarousels() {
  carouselInstances.forEach(({ embla, toggleController }, emblaNode) => {
    toggleController?.abort();
    embla.destroy();
    emblaNode.removeAttribute(CAROUSEL_INITIALIZED_ATTR);
  });
  carouselInstances.clear();
}

function registerCarouselLifecycle() {
  if (lifecycleInitialized) return;

  lifecycleInitialized = true;
  document.addEventListener('DOMContentLoaded', initCarousels, { once: true });
  document.addEventListener('astro:page-load', initCarousels);
  document.addEventListener('astro:before-swap', cleanupCarousels);
}

registerCarouselLifecycle();
queueMicrotask(initCarousels);
