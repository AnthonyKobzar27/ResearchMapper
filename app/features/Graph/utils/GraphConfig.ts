// Configuration constants for 2D graph visualization

export const GRAPH_CONFIG = {
  NODE_SIZE: {
    MIN: 6,
    MAX: 15,
    BASE: 8,
  },
  
  COLORS: {
    BACKGROUND: 'hsl(0, 0%, 98%)',
    NODE_BASE: 'hsl(210, 100%, 55%)',
    LINK: 'rgba(0, 0, 0, 0.1)',
    GRID: 'hsl(215, 28%, 92%)',
  },
  
  FORCE: {
    COOLDOWN_TIME: 2000,
    ALPHA_DECAY: 0.02,
    VELOCITY_DECAY: 0.3,
  },
  
  MAX_NODES: 5000,
  ANIMATION_ENABLED: true,
}
