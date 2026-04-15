import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

// Inline all CSS into HTML to eliminate render-blocking request
function inlineCssPlugin() {
  return {
    name: 'inline-css',
    enforce: 'post',
    apply: 'build',
    generateBundle(_, bundle) {
      const cssKey = Object.keys(bundle).find(k => k.endsWith('.css'));
      const htmlKey = Object.keys(bundle).find(k => k.endsWith('.html'));
      if (!cssKey || !htmlKey) return;

      const css = bundle[cssKey].source;
      const html = bundle[htmlKey].source;
      // Match any <link> that references the generated CSS file (order-independent)
      const cssFileName = cssKey.replace(/^assets\//, '');
      const escaped = cssFileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const linkRegex = new RegExp(`<link[^>]*${escaped}[^>]*>`, 'i');

      if (linkRegex.test(html)) {
        bundle[htmlKey].source = html.replace(linkRegex, `<style>${css}</style>`);
        delete bundle[cssKey];
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://lucasnsnt.ink',
      dynamicRoutes: ['/'],
      lastmod: new Date(), 
    }),
    inlineCssPlugin(),
  ],
  base: "/",
})
