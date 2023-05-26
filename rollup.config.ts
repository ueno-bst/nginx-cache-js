import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import commonJS from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import teaser from "@rollup/plugin-terser";
import pkg from "./package.json" assert {type: "json"};
import {RollupOptions} from "rollup";

/**
 * Plugin to fix syntax of the default export to be compatible with njs.
 * (https://github.com/rollup/rollup/pull/4182#issuecomment-1002241017)
 *
 * If you use njs >=0.7.12, you can remove this.
 *
 * @return {import('rollup').OutputPlugin}
 * @see https://github.com/jirutka/njs-typescript-starter
 */
const fixExportDefault = () => ({
    name: 'fix-export-default',
    renderChunk: (code: string) => ({
        code: code.replace(/\bexport { (\S+) as default };/, 'export default $1;'),
        map: null,
    }),
})

const buildOption = (input: string, output: string): RollupOptions => ({
    input: input,
    output: [
        {
            file: output,
            format: "es",
            sourcemap: false,
            exports: "default",
            plugins: [
                teaser({
                    format: {
                        comments: false,
                    },
                    compress: true,
                })
            ]
        }
    ],
    external: [
        ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
        fixExportDefault(),
        nodeResolve({
            browser: false,
        }),
        typescript(),
        babel({
            babelHelpers: "bundled",
            configFile: "./.babelrc.js"
        }),
        commonJS({
            extensions: [
                ".js", ".ts"
            ]
        }),
        alias({
            entries: {
                '~': './src'
            }
        })
    ]
});

export default <RollupOptions[]>[
    buildOption('./src/http.ts', './dist/http.js'),
    buildOption('./src/http/config.ts', './dist/http/config.js'),
    buildOption('./src/http/cache.ts', './dist/http/cache.js'),
    buildOption('./src/http/header.ts', './dist/http/header.js'),
];
