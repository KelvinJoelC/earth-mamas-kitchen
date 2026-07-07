import EmblaCarousel from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

const CAROUSEL_INITIALIZED_ATTR = 'data-carousel-initialized';

function initCarousel(emblaNode) {
  if (emblaNode.hasAttribute(CAROUSEL_INITIALIZED_ATTR)) return;

  const isAutoplay = emblaNode.classList.contains('autoplayCarousel');
  const options = { loop: isAutoplay };
  const plugins = isAutoplay
    ? [Autoplay({ playOnInit: true, delay: 3000 })]
    : [];

  EmblaCarousel(emblaNode, options, plugins);
  emblaNode.setAttribute(CAROUSEL_INITIALIZED_ATTR, 'true');
}

function initCarousels() {
  document.querySelectorAll('.embla').forEach(initCarousel);
}

if (!window.carouselInitialized) {
  document.addEventListener('astro:page-load', initCarousels);
  window.carouselInitialized = true;
}

initCarousels();
