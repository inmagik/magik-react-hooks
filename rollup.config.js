import fs from 'fs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'

const extensions = ['.ts', '.tsx', '.js', '.jsx']

const hooks = fs
  .readdirSync('src')
  .filter(item => {
    return item[0] !== '.' && item.match(/^(use)[\w]+(\.)(ts)$/i) !== null
  })

const stripExtension = file => file.replace(/\.[^.]+$/, '')

const vendors = []
  // Make all external dependencies to be exclude from rollup
  .concat(
    Object.keys(pkg.dependencies || []),
    Object.keys(pkg.peerDependencies || []),
  )

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
  return (id) => pattern.test(id)
}

export default ['esm', 'cjs'].map(format => ({
  input: {
    ...hooks.reduce((all, hook) => ({
      ...all,
      [stripExtension(hook)]: 'src/' + hook
    }), {}),
  },
  output: [
    {
      dir: 'lib',
      entryFileNames: '[name].[format].js',
      chunkFileNames: '[name].[format].js',
      exports: 'named',
      format
    }
  ],
  external: makeExternalPredicate(vendors),
  plugins: [
    resolve({ extensions }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      extensions,
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: format === 'esm',
            // NOTE: Sometimes js world is a pain
            // see: https://github.com/babel/babel/issues/10261
            version: pkg['dependencies']['@babel/runtime'],
          },
        ],
      ],
    }),
  ]
}))
