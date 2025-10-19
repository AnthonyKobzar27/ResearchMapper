// 2D Canvas-based renderer for the graph visualization

import { GraphNode, GraphLink, GraphConfig } from './types'
import { GRAPH_CONFIG } from './utils/GraphConfig'
import { calculateNodeSize } from './GraphProcessor'
import { getNodeColor, getLinkColor, getLinkWidth } from './GraphStyling'

export class GraphRenderer2D {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private config: GraphConfig
  private nodes: GraphNode[] = []
  private links: GraphLink[] = []
  private camera = { x: 0, y: 0, zoom: 1 }
  private isDragging = false
  private dragStart = { x: 0, y: 0 }
  private hoveredNode: GraphNode | null = null
  private animationId: number | null = null
  
  // Compute the on-screen radius of a node. Nodes grow when zooming out
  // so they remain prominent, and shrink when zooming in to give room for text.
  private getScreenRadius(node: GraphNode): number {
    const base = calculateNodeSize(node.influence)
    const zoom = Math.max(0.1, this.camera.zoom || 1)
    // Grow modestly when zooming out, shrink when zooming in
    const scale = Math.pow(1 / zoom, 0.5)
    const raw = base * scale
    // Cap by viewport: at most ~3% of min dimension, and a hard cap
    const viewportCap = Math.min(this.canvas.width, this.canvas.height) * 0.03
    const hardCap = 26
    return Math.max(2, Math.min(raw, viewportCap, hardCap))
  }

  // Word-wrap helper using canvas measureText, capped at maxLines
  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    maxLines: number
  ): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let current = ''
    for (const word of words) {
      const test = current ? current + ' ' + word : word
      if (ctx.measureText(test).width <= maxWidth) {
        current = test
      } else {
        if (current) lines.push(current)
        current = word
        if (lines.length === maxLines - 1) {
          // Ellipsize last line if needed
          while (ctx.measureText(current + '…').width > maxWidth && current.length > 1) {
            current = current.slice(0, -1)
          }
          lines.push(current + '…')
          return lines
        }
      }
    }
    if (current) lines.push(current)
    return lines.slice(0, maxLines)
  }

  constructor(config: GraphConfig) {
    this.config = config
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.background = '#ffffff'
  }
  
  mount(container: HTMLDivElement) {
    const { width, height } = container.getBoundingClientRect()
    console.log('2D Renderer mount - container size:', width, height)
    
    this.canvas.width = width
    this.canvas.height = height
    this.camera.x = width / 2
    this.camera.y = height / 2
    
    // Ensure canvas takes full size but stays behind UI
    this.canvas.style.display = 'block'
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
    this.canvas.style.zIndex = '0'
    this.canvas.style.pointerEvents = 'auto'
    
    container.appendChild(this.canvas)
    this.setupEventListeners()
    this.animate()
  }
  
  private setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e))
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e))
    this.canvas.addEventListener('mouseup', () => this.onMouseUp())
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e))
    this.canvas.addEventListener('click', (e) => this.onClick(e))
  }
  
  private onMouseDown(e: MouseEvent) {
    this.isDragging = true
    this.dragStart = { x: e.offsetX, y: e.offsetY }
  }
  
  private onMouseMove(e: MouseEvent) {
    if (this.isDragging) {
      const dx = e.offsetX - this.dragStart.x
      const dy = e.offsetY - this.dragStart.y
      this.camera.x += dx
      this.camera.y += dy
      this.dragStart = { x: e.offsetX, y: e.offsetY }
    } else {
      this.checkHover(e.offsetX, e.offsetY)
    }
  }
  
  private onMouseUp() {
    this.isDragging = false
  }
  
  private onWheel(e: WheelEvent) {
    e.preventDefault()
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    this.camera.zoom *= zoomFactor
    this.camera.zoom = Math.max(0.1, Math.min(5, this.camera.zoom))
  }
  
  private onClick(e: MouseEvent) {
    const node = this.getNodeAt(e.offsetX, e.offsetY)
    if (node && this.config.onNodeClick) {
      this.config.onNodeClick(node)
    }
  }
  
  private checkHover(x: number, y: number) {
    const node = this.getNodeAt(x, y)
    if (node !== this.hoveredNode) {
      this.hoveredNode = node
      if (this.config.onNodeHover) {
        this.config.onNodeHover(node)
      }
    }
  }
  
  private getNodeAt(x: number, y: number): GraphNode | null {
    for (const node of this.nodes) {
      const screenX = node.x * this.camera.zoom + this.camera.x
      const screenY = node.y * this.camera.zoom + this.camera.y
      const size = this.getScreenRadius(node)
      const dist = Math.sqrt((x - screenX) ** 2 + (y - screenY) ** 2)
      if (dist < size) return node
    }
    return null
  }
  
  renderGraph(nodes: GraphNode[], links: GraphLink[]) {
    this.nodes = nodes
    this.links = links
  }
  
  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate)
    this.render()
  }
  
  private render() {
    const { canvas, ctx, camera, nodes, links, hoveredNode } = this
    
    // Clear with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw links
    ctx.globalAlpha = 1
    
    const nodeMap = new Map(nodes.map(n => [n.id, n]))
    
    links.forEach(link => {
      const source = nodeMap.get(link.source)
      const target = nodeMap.get(link.target)
      
      if (source && target) {
        ctx.beginPath()
        ctx.strokeStyle = getLinkColor(link)
        ctx.lineWidth = getLinkWidth(link)
        ctx.moveTo(source.x * camera.zoom + camera.x, source.y * camera.zoom + camera.y)
        ctx.lineTo(target.x * camera.zoom + camera.x, target.y * camera.zoom + camera.y)
        ctx.stroke()
      }
    })
    
    // Draw nodes
    ctx.globalAlpha = 1
    nodes.forEach(node => {
      const x = node.x * camera.zoom + camera.x
      const y = node.y * camera.zoom + camera.y
      const size = this.getScreenRadius(node)
      
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = node === hoveredNode ? '#3b82f6' : getNodeColor(node.influence)
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Draw title below the node
      // Only show when zoomed in enough; keeps labels from cluttering when zoomed out
      if (camera.zoom >= 0.9) {
        // Font scales with zoom but clamped to a friendly range
        const fontSize = Math.max(9, Math.min(18, 11 * camera.zoom))
        ctx.font = `${fontSize}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'

        // Label width relative to node size so nodes remain dominant
        const maxWidth = Math.max(80, size * 2.4)
        const lines = this.wrapText(ctx, node.title, maxWidth, 2)

        const lineHeight = fontSize * 1.25
        const startY = y + size + 6
        ctx.shadowColor = 'rgba(255,255,255,0.9)'
        ctx.shadowBlur = 2
        for (let i = 0; i < lines.length; i += 1) {
          ctx.fillText(lines[i], x, startY + i * lineHeight)
        }
        ctx.shadowBlur = 0
      }
    })
  }
  
  focusNode(node: GraphNode) {
    const w = this.canvas.width
    const h = this.canvas.height
    const targetZoom = 1.5
    
    // Calculate camera position to center the node
    // screenX = node.x * zoom + camera.x
    // For node to be at center: w/2 = node.x * zoom + camera.x
    // So: camera.x = w/2 - node.x * zoom
    const targetCameraX = w / 2 - node.x * targetZoom
    const targetCameraY = h / 2 - node.y * targetZoom
    
    const duration = 800
    const startTime = Date.now()
    const startX = this.camera.x
    const startY = this.camera.y
    const startZoom = this.camera.zoom
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
      
      this.camera.x = startX + (targetCameraX - startX) * ease
      this.camera.y = startY + (targetCameraY - startY) * ease
      this.camera.zoom = startZoom + (targetZoom - startZoom) * ease
      
      if (progress < 1) requestAnimationFrame(animate)
    }
    
    animate()
  }
  
  dispose() {
    if (this.animationId) cancelAnimationFrame(this.animationId)
    if (this.canvas.parentElement) this.canvas.parentElement.removeChild(this.canvas)
  }
  
  resize(width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height
  }
}

