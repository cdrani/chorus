import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'

export default {
    input: 'src/manifest.chrome.json',
    output: {
        dir: 'dist',
        format: 'esm'
        // sourcemap: true
    },
    plugins: [chromeExtension(), simpleReloader()]
}
