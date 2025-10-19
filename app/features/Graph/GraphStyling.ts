// Clean, minimal styling for research paper graph

export const getNodeColor = (influence: number) => {
  // Simple gradient from light to dark blue based on influence
  const normalized = Math.min(influence / 100, 1)
  const lightness = 75 - normalized * 40 // 75% to 35%
  return `hsl(210, 100%, ${lightness}%)`
}

export const getLinkColor = (link: any) => {
  return 'rgba(0, 0, 0, 0.15)' // Simple gray
}

export const getLinkWidth = (link: any) => {
  return 1 // Keep all links same width for clean look
}

// Utilities for Three.js usage
export function hslaStringToRgba(hsla: string): { r: number; g: number; b: number; a: number } {
  // Expect formats like hsla(h, s%, l%, a) or hsl(h, s%, l%)
  const m = hsla.trim().match(/hsla?\(([^)]+)\)/i)
  if (!m) return { r: 0.59, g: 0.64, b: 0.7, a: 1 }
  const parts = m[1]
    .split(',')
    .map((p) => p.trim().replace('%', ''))
    .map(Number)
  const h = (parts[0] ?? 215) / 360
  const s = (parts[1] ?? 28) / 100
  const l = (parts[2] ?? 70) / 100
  const a = parts.length > 3 ? parts[3] : 1
  // Convert HSL to RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  let r: number, g: number, b: number
  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return { r, g, b, a }
}


