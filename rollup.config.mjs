import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';



export default {
    input: 'src/index.ts',
    output: {
        file: 'example/bundle.js',
        format: 'iife',
        sourcemap: 'inline',
        inlineDynamicImports: true,
    },
    plugins: [
        nodeResolve(),
        typescript(),
        replace({
            preventAssignment: false,
            'process.env.NODE_ENV': '"development"'
        }),
        postcss({
            config: {
                path: './postcss.config.cjs',
            },
            extensions: ['.css'],
            minimize: true,
            inject: {
                insertAt: 'top',
            },
        }),
        commonjs(),
        copy({
            targets: [
                { src: 'node_modules/monaco-editor/min/vs/**/*', dest: 'dist/monaco-editor' },
            ],
            copyOnce: true,
        }),
        babel({
            babelHelpers: 'bundled',
            presets: ['@babel/preset-react'],
            extensions: ['.ts', '.tsx']
        }),
    ],
}
