import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

const version = process.env.DPS_RUNTIME_VERSION || '1.1.1'
const base = `https://github.com/Alumopper/DatapackSandbox/releases/download/${version}`
const output = resolve(import.meta.dirname, '../public/dps-manifest.schema.json')
await mkdir(resolve(import.meta.dirname, '../public'), { recursive: true })

if (version === '1.1.0') {
  const [asset, sums] = await Promise.all([fetch(`${base}/datapack-sandbox-cli.jar`), fetch(`${base}/SHA256SUMS.txt`)])
  if (!asset.ok || !sums.ok) throw new Error(`CLI release asset unavailable: ${base}`)
  const jar = Buffer.from(await asset.arrayBuffer())
  const line = (await sums.text()).split(/\r?\n/).find((entry) => entry.trim().endsWith('  datapack-sandbox-cli.jar'))
  if (!line || createHash('sha256').update(jar).digest('hex') !== line.trim().split(/\s+/)[0]) throw new Error('CLI SHA-256 mismatch')
  const file = resolve(import.meta.dirname, '../.cache/datapack-sandbox-cli.jar')
  await mkdir(resolve(import.meta.dirname, '../.cache'), { recursive: true })
  await writeFile(file, jar)
  execFileSync(process.env.JAVA || (process.env.JAVA_HOME ? resolve(process.env.JAVA_HOME, 'bin', process.platform === 'win32' ? 'java.exe' : 'java') : 'java'), ['-jar', file, 'schema', '--output', output], { stdio: 'inherit' })
} else {
  const [asset, sums] = await Promise.all([fetch(`${base}/dps-manifest.schema.json`), fetch(`${base}/SHA256SUMS.txt`)])
  if (!asset.ok || !sums.ok) throw new Error(`Schema release asset unavailable: ${base}`)
  const data = Buffer.from(await asset.arrayBuffer())
  const line = (await sums.text()).split(/\r?\n/).find((entry) => entry.trim().endsWith('  dps-manifest.schema.json'))
  if (!line || createHash('sha256').update(data).digest('hex') !== line.trim().split(/\s+/)[0]) throw new Error('Schema SHA-256 mismatch')
  await writeFile(output, data)
}
