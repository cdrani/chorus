import path from 'path'
import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'

export default {
    input: 'src/manifest.chrome.json',
    output: {
        dir: 'dist',
        format: 'esm',
        chunkFileNames: path.join('chunks', '[name]-[hash].js')

        // sourcemap: true
    },
    plugins: [chromeExtension(), simpleReloader()]
}
