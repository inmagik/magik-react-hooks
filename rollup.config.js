import fs from 'fs'
import pkg from './package.json'
import babel from 'rollup-plugin-babel'

const hooks = fs
  .readdirSync('src')
  .filter(item => {
    return item[0] !== '.' && item.match(/^(use)[\w]+(\.)(js)$/i) !== null
  })

const stripExtension = file => file.replace(/\.[^\.]+$/, '')

const vendors = []
  // Make all external dependencies to be exclude from rollup
  .concat(
    Object.keys(pkg.dependencies || []),
    Object.keys(pkg.peerDependencies || []),
  )

export default ['esm', 'cjs'].map(format => ({
  input: {
    ...hooks.reduce((all, hook) => ({
      ...all,
      [stripExtension(hook)]: 'src/' + hook
    }), {})
  },
  output: [
    {
      dir: 'lib',
      entryFileNames: '[name].[format].js',
      exports: 'named',
      format
    }
  ],
  external: vendors,
  plugins: [babel({ exclude: 'node_modules/**' })]
}))
