// lib/gtag.js
export const GA_MEASUREMENT_ID = 'G-7SBJ3PN329';

export const pageview = (url) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};