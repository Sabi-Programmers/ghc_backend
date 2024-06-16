// build.js
const esbuild = require('esbuild')

esbuild
    .build({
        entryPoints: ['./src/index.js'], // Entry point of your ES module code
        bundle: true,
        format: 'cjs', // Output format as CommonJS
        outfile: './dist/index.js', // Output file
        platform: 'node', // Platform target
        target: ['node18'], // Target environment
    })
    .catch(() => process.exit(1))
