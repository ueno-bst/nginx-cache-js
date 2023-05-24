let mix = require('laravel-mix');

const path = require('path');

mix
    .ts('src/http/cache/key.ts', 'dist/http/cache/key.js', {projectReferences: true})
    .ts('src/http/cache/purge_key.ts', 'dist/http/cache/purge_key.js')
    .webpackConfig({
        resolve: {
            fallback: {
                fs: false,
            }
        }
    })
    .alias({
        '~': path.join(__dirname, 'njs')
    });
