import fs from 'node:fs/promises'
import path from 'node:path'
import pdfPkg from 'pdf-parse'

const pdfPath = path.resolve(process.cwd(), 'src/lib/blockchakkkin.pdf')
const outPath = path.resolve(process.cwd(), 'whitepaper.txt')

try {
  const data = await fs.readFile(pdfPath)
  const pdf = pdfPkg.default ?? pdfPkg
  const result = await pdf(data)
  await fs.writeFile(outPath, result.text, 'utf8')
  console.log('Extracted text ->', outPath)
} catch (err) {
  console.error('Failed to extract PDF:', err)
  process.exit(1)
}


