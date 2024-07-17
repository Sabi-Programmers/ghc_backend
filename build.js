// build.js
const esbuild = require('esbuild')
const { copy } = require('esbuild-plugin-copy')

esbuild
    .build({
        entryPoints: ['./src/index.js'], // Entry point of your ES module code
        bundle: true,
        format: 'cjs', // Output format as CommonJS
        outfile: './dist/index.js', // Output file
        platform: 'node', // Platform target
        target: ['node18'], // Target environment
        plugins: [
            copy({
                resolveFrom: 'node_modules/.prisma/client',
                to: 'dist/node_modules/.prisma/client',
                assets: {
                    // Copy the specific binary for your environment
                    from: 'libquery_engine-debian-openssl-1.0.x.so.node',
                    to: 'libquery_engine-debian-openssl-1.0.x.so.node',
                },
            }),
        ],
    })
    .catch(() => process.exit(1))
