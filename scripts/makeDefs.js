const fs = require('fs');
const rimraf = require('rimraf');

const stripExtension = file => file.replace(/\.[^.]+$/, '')
const hooks = fs
  .readdirSync('src')
  .filter(item => {
    return item[0] !== '.' && item.match(/^(use)[\w]+(\.)(js)$/i) !== null
  })
  .map(stripExtension)

rimraf.sync('use*');
rimraf.sync('qpUtils')

hooks.forEach(hook => {
  fs.mkdirSync(hook);
  fs.writeFileSync(hook + '/package.json', JSON.stringify({
    name: 'magik-react-hooks/' + hook,
    private: true,
    main: '../lib/' + hook + '.cjs.js',
    module: '../lib/' + hook + '.esm.js'
  }, null, 2))
})

fs.mkdirSync('qpUtils');
fs.writeFileSync('qpUtils/package.json', JSON.stringify({
  name: 'magik-react-hooks/qpUtils',
  private: true,
  main: '../lib/qpUtils.cjs.js',
  module: '../lib/qpUtils.esm.js'
}, null, 2))
