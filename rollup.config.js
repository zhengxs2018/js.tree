import path from 'path'

import { mergeWith } from 'lodash'

import alias from '@rollup/plugin-alias'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

import baseConfig from './rollup.config.base'

const noLodash = merge(
  {
    plugins: [
      alias({
        entries: [{ find: 'lodash', replacement: resolve('tools/lodash.ts') }]
      })
    ]
  },
  baseConfig
)

const lodashES = merge(
  {
    plugins: [
      alias({
        entries: [{ find: 'lodash', replacement: 'lodash-es' }]
      })
    ]
  },
  baseConfig
)

const tsCompile = typescript({
  tsconfigOverride: {
    compilerOptions: {
      module: 'es2015',
      declaration: false,
      declarationMap: false
    }
  }
})

const umdConfig = merge(noLodash, {
  output: {
    format: 'umd',
    name: 'jsTree'
  },
  plugins: [tsCompile]
})

export default [
  // CommonJS
  merge(noLodash, {
    output: {
      format: 'cjs',
      file: resolve('./dist/js.tree.common.js')
    },
    plugins: [tsCompile]
  }),
  merge(baseConfig, {
    output: {
      format: 'cjs',
      file: resolve('./dist/js.tree.common.lodash.js')
    },
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'es2015'
          }
        }
      })
    ]
  }),

  // ES Module
  merge(noLodash, {
    output: {
      format: 'esm',
      file: resolve('./dist/js.tree.esm.js')
    },
    plugins: [tsCompile]
  }),
  merge(baseConfig, {
    output: {
      format: 'esm',
      file: resolve('./dist/js.tree.esm.lodash.js')
    },
    plugins: [tsCompile]
  }),
  merge(lodashES, {
    output: {
      format: 'esm',
      file: resolve('./dist/js.tree.esm.lodash-es.js')
    },
    plugins: [tsCompile]
  }),

  // UMD
  merge(umdConfig, {
    output: {
      file: resolve('./dist/js.tree.js')
    }
  }),
  merge(umdConfig, {
    output: {
      sourcemap: true,
      file: resolve('./dist/js.tree.min.js')
    },
    plugins: [terser()]
  })
]

function resolve(filename) {
  return path.join(__dirname, filename)
}

function merge(object, sources) {
  return mergeWith({ ...object }, sources, function (objValue, srcValue, key) {
    switch (key) {
      case 'output':
        return Object.assign({}, objValue, srcValue)
      case 'plugins':
        return (objValue || []).concat(srcValue || [])
      default:
        return srcValue || objValue
    }
  })
}
