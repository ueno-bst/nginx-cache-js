import pluginNodeResolve from "@rollup/plugin-node-resolve";
import pluginBabel from "@rollup/plugin-babel";
import pluginTypescript from "@rollup/plugin-typescript";
import pluginAlias from "@rollup/plugin-alias";
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

export default <RollupOptions[]>[
    {
        input: './src/http/cache.ts',
        output: [
            {
                file: './dist/http/cache.js',
                format: "es",
                sourcemap: false,
                exports: "default",
                plugins: []
            }
        ],
        external: [
            ...Object.keys(pkg.devDependencies || {}),
        ],
        plugins: [
            fixExportDefault(),
            pluginNodeResolve({
                browser: false,
            }),
            pluginTypescript(),
            pluginBabel({
                babelHelpers: "bundled",
                configFile: "./.babelrc.js"
            }),
            pluginAlias({
                entries: {
                    '~': './src'
                }
            })
        ]
    }
];
