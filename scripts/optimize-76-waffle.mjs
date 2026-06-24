import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const source = path.join(root, '../../Website split/76 WAFFLE.svg')
const svgTemp = path.join(root, 'public/brand/products/.76-waffle-temp.svg')
const pngPath = path.join(root, 'public/brand/products/76-waffle.png')

if (!fs.existsSync(source)) {
  console.error('Source not found:', source)
  process.exit(1)
}

let s = fs.readFileSync(source, 'utf8')
s = s.replace(
  'width="4000" height="4000" viewBox="0 0 4000 4000"',
  'width="800" height="800" viewBox="950 520 1950 2480" preserveAspectRatio="xMidYMid meet"',
)
s = s.replace(/<text[\s\S]*?<\/text>/g, '')
fs.writeFileSync(svgTemp, s)

await sharp(fs.readFileSync(svgTemp), { density: 150 })
  .resize(900, 900, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9, palette: true })
  .toFile(pngPath)

fs.unlinkSync(svgTemp)
console.log('76-waffle.png', (fs.statSync(pngPath).size / 1024).toFixed(1) + 'KB')
