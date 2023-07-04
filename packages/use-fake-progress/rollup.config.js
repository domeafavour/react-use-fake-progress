const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const babel = require('@rollup/plugin-babel');

module.exports = {
  input: 'src/index.ts', // Update the entry file to .ts if it's named differently
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'use-fake-progress',
    globals: {
      react: 'React', // If you have any external dependencies, define them here
      'react-dom': 'ReactDOM',
    },
  },
  external: ['react', 'react-dom'], // List your external dependencies here
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      module: 'esnext',
      declaration: true,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
  ],
};
