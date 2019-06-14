const fs = require('fs');
const rimraf = require('rimraf');

const stripExtension = file => file.replace(/\.[^\.]+$/, '')
const hooks = fs
    .readdirSync('src')
    .filter(item => {
      return item[0] !== '.' && item.match(/^(use)[\w]+(\.)(js)$/i) !== null
    })
    .map(stripExtension)

rimraf.sync('use*');

hooks.forEach(hook => {
    fs.mkdirSync(hook);
    fs.writeFileSync(hook + '/package.json', JSON.stringify({
        name: '@inmagik/magik-react-hooks/' + hook,
        private: true,
        main: '../lib/' + hook + '.cjs.js',
        module: '../lib/' + hook + '.esm.js'
    }, null, 2))
})
