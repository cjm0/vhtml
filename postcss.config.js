// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {
        // browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
        browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead'] // default
    }
  }
}
