import { resolve } from 'path'

import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

import externals from 'rollup-plugin-node-externals'

import pkg from './package.json'

export default {
  input: resolve(__dirname, 'src/index.ts'),
  output: {
    exports: 'named'
  },
  plugins: [
    externals({ deps: true }),
    nodeResolve(),
    commonjs(),
    replace({
      preventAssignment: true,
      __VERSION__: pkg.version,
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}
