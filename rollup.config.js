import process from 'node:process'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import run from '@rollup/plugin-run'

const dev = process.env.NODE_ENV != 'production'
const watch = process.env.ROLLUP_WATCH === 'true'

export default [
  {
    input: 'src/index.mjs',
    output: {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: dev
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      !dev && terser(),
      watch && run()
    ]
  }
]
