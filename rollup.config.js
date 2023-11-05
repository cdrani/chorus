import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'

const TARGET = process.env.TARGET || 'chrome'

const INPUT = `src/manifest.${TARGET}.json`

export default {
    input: INPUT,
    output: {
        dir: 'dist',
        format: 'esm',
        // sourcemap: true
    },
    plugins: [
        chromeExtension(),
        simpleReloader()
    ],
}
