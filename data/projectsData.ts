interface Project {
  title: string
  description: string
  imgSrc?: string
  slug: string
  category: 'ai' | 'algorithm' | 'canvas' | 'game'
  tags?: string[]
}

const projectsData: Project[] = [
  {
    title: 'AI 智能助手',
    description: '基于 Deepseek 的智能对话助手，支持多轮对话、语音识别等功能',
    imgSrc: '/static/images/ai-assistant.png',
    slug: 'ai',
    category: 'ai',
    tags: ['AI', 'WebSocket', 'Speech Recognition']
  },
  {
    title: 'IP 地址复原算法可视化',
    description: '通过 Three.js 实现算法执行过程的 3D 可视化展示',
    imgSrc: '/static/images/ip-restore.png',
    slug: 'algorithm-visualization/restoreIPAddress',
    category: 'algorithm',
    tags: ['Three.js', '算法', '3D']
  },
  {
    title: '不同路径算法可视化',
    description: '动态展示带障碍物的路径规划算法执行过程',
    imgSrc: '/static/images/unique-path.png',
    slug: 'algorithm-visualization/uniquePathWithObstacles',
    category: 'algorithm',
    tags: ['Three.js', '算法', '动画']
  },
  {
    title: 'Canvas 图片处理',
    description: '使用 Canvas 实现图片灰度化、对比度调整等效果',
    imgSrc: '/static/images/canvas-image.png',
    slug: 'canvas/constract',
    category: 'canvas',
    tags: ['Canvas', '图像处理']
  },
  {
    title: '你画我猜',
    description: '基于 WebSocket 的多人实时互动游戏',
    imgSrc: '/static/images/draw-guess.png',
    slug: 'draw-and-guess',
    category: 'game',
    tags: ['WebSocket', 'Canvas', '多人游戏']
  },
]

export default projectsData
