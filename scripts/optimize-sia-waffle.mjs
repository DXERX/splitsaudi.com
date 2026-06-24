import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const p = path.join(__dirname, '../public/brand/products/sia-waffle.svg')

let s = fs.readFileSync(p, 'utf8')
s = s.replace(
  'width="4000" height="4000" viewBox="0 0 4000 4000"',
  'width="800" height="800" viewBox="950 520 1950 2480" preserveAspectRatio="xMidYMid meet"',
)
s = s.replace(/<text[\s\S]*?<\/text>/g, '')
fs.writeFileSync(p, s)
console.log('optimized', (fs.statSync(p).size / 1024).toFixed(1) + 'KB')
