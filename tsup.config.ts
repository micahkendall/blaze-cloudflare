import { defineConfig } from 'tsup'
import * as fs from "fs"

export default defineConfig({
  platform: 'node',
  format: 'cjs',
  dts: false,
  entry: ['src/index.ts'],
  noExternal: [
    '@blaze-cardano/sdk',
    '@blaze-cardano/core',
    '@blaze-cardano/tx',
    "@blaze-cardano/query"
  ],
  external: ['events'],
  splitting: false,
  sourcemap: false,
  minify: false,
  bundle: true,
  treeshake: true,
  // shims: true,
  plugins: [
    {
      name: 'InjectBuffer',
      renderChunk: (code, chunkInfo) => {
        return {
          code: `import { Buffer } from "buffer";\n` + code,
        };
      },
    },
    {
      name: 'FixModule',
      renderChunk: (code, chunkInfo) => {
        console.log("fixing module")
        
        fs.writeFileSync('debug.js', code, 'utf8');
        console.log("Debug file written to debug.js");
        return {
          code: code.replaceAll(
            "module.exports = src_default;",
            `export default src_default`,
          ),
        }
      },
    },
  ],
})
