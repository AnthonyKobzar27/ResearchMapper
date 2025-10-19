export const getNodeColor = (citations: string | number) => {
  if (typeof citations === 'number') {
    // Minimalistic grey scale - sleek and clean
    // 0 citations = light grey (85% lightness)
    // 100+ citations = dark grey (30% lightness)
    const normalized = Math.min(citations / 100, 1)
    const lightness = 85 - normalized * 55
    return `hsl(0, 0%, ${lightness}%)`
  }
  return 'hsl(0, 0%, 70%)'
}

export const getLinkColor = (link: any) => {
  // Color based on connection strength - stronger = more black
  if (link.type === 'similar') {
    const strength = link.strength || 0.3
    // Strong connections (0.8-1.0) = very dark grey/black
    // Weak connections (0.1-0.3) = light grey
    const opacity = 0.15 + strength * 0.4 // Range: 0.15 - 0.55
    const greyValue = Math.floor(200 - strength * 150) // Range: 200 (light) - 50 (dark)
    return `rgba(${greyValue}, ${greyValue}, ${greyValue}, ${opacity})`
  }
  if (link.type === 'reference') {
    // Citation links = medium grey
    return 'rgba(120, 120, 120, 0.3)'
  }
  // Default
  return 'rgba(0, 0, 0, 0.15)'
}

export const getLinkWidth = (link: any) => {
  // Similar papers get thicker links
  if (link.type === 'similar') {
    return 2
  }
  return 1
}
