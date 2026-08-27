const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
let initialized = false;
let lastTrackedPath = '';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function initialize() {
  if (!measurementId || initialized) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });
  initialized = true;
}

export function trackPageView(path: string) {
  if (!measurementId || path === lastTrackedPath) return;

  initialize();
  window.gtag?.('event', 'page_view', {
    page_location: window.location.href,
    page_path: path,
    page_title: document.title,
  });
  lastTrackedPath = path;
}
