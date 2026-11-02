import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import path from 'path';
import postcssNested from 'postcss-nested';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import Sitemap from 'vite-plugin-sitemap';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react({}),
    Sitemap({
      hostname: 'https://purple-river-0ea856103.7.azurestaticapps.net/',
      dynamicRoutes: ['/all-resources', '/add-resource'],
      exclude: ['/login'],
      generateRobotsTxt: true,
    }),
    visualizer({ filename: 'stats.html', open: true }),
    viteStaticCopy({
      targets: [{ src: 'staticwebapp.config.json', dest: '' }],
    }),
  ],
  css: {
    postcss: {
      plugins: [
        postcssNested(),
        tailwindcss(),
        {
          postcssPlugin: 'move-responsive-queries',
          OnceExit(root) {
            const mediaRules = [];
            const containerRules = [];

            function extractMinWidth(params) {
              let match = params.match(/min-width:\s*([\d.]+)(px|rem)/);
              if (!match) {
                match = params.match(/width\s*>=\s*([\d.]+)(px|rem)/);
              }
              if (!match) return null;

              const value = parseFloat(match[1]);
              const unit = match[2];
              return unit === 'rem' ? value * 16 : value;
            }

            root.walkAtRules((rule) => {
              if (rule.name !== 'media' && rule.name !== 'container') return;

              const pxValue = extractMinWidth(rule.params);
              if (pxValue === null) return;

              const entry = {
                pxValue,
                rule: rule.clone(),
              };

              if (rule.name === 'media') {
                mediaRules.push(entry);
              } else {
                containerRules.push(entry);
              }

              rule.remove();
            });

            // 1. Append media first
            mediaRules
              .sort((a, b) => a.pxValue - b.pxValue)
              .forEach(({ rule }) => {
                root.append(rule);
              });

            // 2. Append container after
            containerRules
              .sort((a, b) => a.pxValue - b.pxValue)
              .forEach(({ rule }) => {
                root.append(rule);
              });
          },
        },
      ],
    },
  },
  build: {
    manifest: true,
    cssCodeSplit: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'react', test: /node_modules[\\/]react/ }],
        },
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name].[ext]',
        entryFileNames: '[name].js',
      },
      treeshake: true,
    },
  },
  server: {
    cors: {
      origin: '*',
      methods: ['GET'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  },
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
});
