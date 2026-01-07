
import { Highlight, TeamMember, Achievement, HeroVideo, AIConfig } from './types';
import { MapPin, Layers, User } from 'lucide-react';

export const PROJECT_INFO = {
  name: "金融岛站周边一体化项目",
  description: "本项目旨在打造集交通、商业、景观于一体的城市新地标。通过全生命周期的BIM技术应用，实现了从设计优化、施工模拟到智慧运维的数字化转型，显著提升了工程质量与管理效率。",
  location: "金融岛核心区域",
  totalArea: "150,000 m²",
  investment: "25 亿 RMB",
  // Branding Configuration
  logoUrl: "", // If empty, uses the default Building2 icon. Put a URL here to override.
  navTitle: "金融岛",
  navSubtitle: "BIM",
  // Organization Chart Image
  orgChartUrl: "",
  // Team Photo / 3rd Slide Image
  teamPhotoUrl: "",
  // External BIM Model Viewer URL
  bimModelUrl: ""
};

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'deepseek',
  providerName: 'DeepSeek (深度求索)',
  apiKey: '', // User must input this
  baseUrl: 'https://api.deepseek.com',
  model: 'deepseek-chat',
  systemPrompt: `你是一个专业的BIM项目咨询助手，服务于"金融岛站周边一体化项目"。
请根据以下项目背景信息回答用户的问题。
如果是关于项目团队、亮点、成效的问题，请严格基于上下文回答。
如果用户问候，请热情专业地回应。
请使用中文回答，保持简洁（100字以内），除非用户要求详细解释。`
};

export const HERO_VIDEOS: HeroVideo[] = [
  {
    id: "v1",
    title: "项目整体漫游展示",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    coverUrl: "https://picsum.photos/id/122/600/400"
  },
  {
    id: "v2",
    title: "地下空间管线综合",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    coverUrl: "https://picsum.photos/id/133/600/400"
  },
  {
    id: "v3",
    title: "主体结构施工模拟",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    coverUrl: "https://picsum.photos/id/104/600/400"
  },
  {
    id: "v4",
    title: "智慧工地平台演示",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    coverUrl: "https://picsum.photos/id/142/600/400"
  }
];

export const HIGHLIGHTS: Highlight[] = [
  {
    id: "1",
    title: "复杂节点深化设计",
    summary: "利用BIM技术对钢结构与混凝土连接节点进行三维可视化深化，解决碰撞问题。",
    fullDescription: "针对金融岛站地下空间复杂的管线综合与结构节点，项目团队利用Revit和Tekla软件进行了深度建模。通过三维可视化，提前发现了500+处硬碰撞，并优化了钢筋排布，确保了现场施工的一次成型率。主要成果包括节点详图自动化生成及三维技术交底视频。",
    thumbnail: "https://picsum.photos/id/101/600/400",
    images: ["https://picsum.photos/id/102/800/600", "https://picsum.photos/id/103/800/600"],
    files: [
      { id: "f1", name: "节点深化报告.pdf", type: "pdf", size: "12MB", url: "#" },
      { id: "f2", name: "关键节点模型.rvt", type: "rvt", size: "45MB", url: "#" }
    ],
    technicalSpecs: {
      "软件平台": "Revit 2023, Tekla Structures",
      "碰撞检测": "Navisworks Manage",
      "深化精度": "LOD 400"
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "2",
    title: "4D施工进度模拟",
    summary: "结合时间维度，模拟主要施工工序，优化工期安排与资源配置。",
    fullDescription: "项目采用Fuzor软件进行4D施工模拟，将Project进度计划与BIM模型关联。重点模拟了深基坑开挖、大型钢结构吊装等关键路径。通过模拟，优化了场地布置，减少了大型机械的闲置时间，不仅缩短了工期20天，还显著降低了施工安全风险。",
    thumbnail: "https://picsum.photos/id/104/600/400",
    images: ["https://picsum.photos/id/106/800/600", "https://picsum.photos/id/107/800/600"],
    files: [
      { id: "f3", name: "施工模拟动画.mp4", type: "jpg", size: "120MB", url: "#" },
      { id: "f4", name: "进度优化对比表.xlsx", type: "doc", size: "1.5MB", url: "#" }
    ],
    technicalSpecs: {
      "模拟软件": "Fuzor, Synchro 4D",
      "关键路径": "基坑支护, 主体结构封顶"
    },
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: "3",
    title: "机电管线综合优化",
    summary: "实现净高控制与管线排布的最优解，提升地下空间使用品质。",
    fullDescription: "地下商业区管线错综复杂。团队利用BIM技术进行MEC（机电综合）分析，重点解决了走廊净高不足的问题。通过调整风管截面、优化桥架走向，最终将平均净高提升了15cm，极大地改善了空间体验，并输出了综合管线图（CSD）和综合留洞图（CBWD）。",
    thumbnail: "https://picsum.photos/id/133/600/400",
    images: ["https://picsum.photos/id/134/800/600"],
    files: [
      { id: "f5", name: "机电综合管线图.dwg", type: "dwg", size: "8MB", url: "#" }
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "4",
    title: "智慧工地集成平台",
    summary: "集成BIM、物联网(IoT)数据，实现现场人员、物料、环境的实时监控。",
    fullDescription: "开发了基于Web的BIM+GIS智慧工地管理平台。集成塔吊监测、环境监测、劳务实名制系统。管理人员可通过大屏实时查看现场情况，实现了数据的互联互通，打破了信息孤岛，为项目决策提供了有力的数据支撑。",
    thumbnail: "https://picsum.photos/id/142/600/400",
    images: ["https://picsum.photos/id/143/800/600"],
    files: [
      { id: "f6", name: "平台操作手册.pdf", type: "pdf", size: "5MB", url: "#" }
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  },
  {
    id: "5",
    title: "数字化运维交付",
    summary: "构建数字孪生底座，为后期物业管理提供包含丰富信息的资产模型。",
    fullDescription: "项目不仅关注建设期，更着眼于运营期。建立了COBie标准的数据交付体系，将设备厂家、保修期、维护手册等信息挂接至BIM模型。交付的运维模型直接对接IBMS系统，实现了设施设备的快速定位与智能化维护。",
    thumbnail: "https://picsum.photos/id/180/600/400",
    images: ["https://picsum.photos/id/181/800/600"],
    files: []
  },
  {
    id: "6",
    title: "异形幕墙参数化设计",
    summary: "运用Rhino+Grasshopper对双曲面幕墙进行板块划分与优化。",
    fullDescription: "金融岛中心建筑拥有独特的流线型外观。利用参数化设计工具，对数千块幕墙玻璃进行逻辑划分，最大限度地减少了异形板数量，降低了加工成本，并确保了建筑外观的完美呈现。",
    thumbnail: "https://picsum.photos/id/192/600/400",
    images: ["https://picsum.photos/id/195/800/600"],
    files: [
      { id: "f7", name: "幕墙展开图.dwg", type: "dwg", size: "15MB", url: "#" }
    ]
  },
  {
    id: "7",
    title: "无人机倾斜摄影实景建模",
    summary: "快速获取周边环境现状，辅助总平面布置与交通疏解方案制定。",
    fullDescription: "项目团队利用无人机搭载高清相机，对施工现场及周边2平方公里范围进行了倾斜摄影。通过ContextCapture软件处理，生成了高精度的三维实景模型。该模型被广泛应用于前期的场地规划、临建布置以及施工期间的土方平衡计算，确保了施工方案与现场实际的精准贴合。",
    thumbnail: "https://picsum.photos/id/238/600/400",
    images: ["https://picsum.photos/id/239/800/600"],
    files: []
  },
  {
    id: "8",
    title: "VR安全教育体验",
    summary: "沉浸式虚拟现实体验，提升工人的安全意识与应急处置能力。",
    fullDescription: "为了提高工人的安全意识，项目部建立了VR安全教育体验馆。基于BIM模型制作了高空坠落、物体打击、火灾逃生等10余个虚拟场景。工人佩戴VR眼镜即可身临其境地体验违规操作带来的严重后果，这种体验式的教育方式比传统的说教更为深刻有效，显著降低了现场的安全事故率。",
    thumbnail: "https://picsum.photos/id/251/600/400",
    images: ["https://picsum.photos/id/252/800/600"],
    files: []
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  // Awards
  {
    id: "a1",
    title: "全球工程建设业卓越BIM大赛 最佳实践奖",
    type: "award",
    date: "2023-11",
    description: "表彰项目在多专业协同与施工模拟方面的杰出应用。",
    imageUrl: "https://picsum.photos/id/200/400/300"
  },
  {
    id: "a4",
    title: "国家优质工程奖",
    type: "award",
    date: "2024-01",
    description: "荣获工程建设质量方面的最高荣誉，肯定了数字化建造的质量管控成果。",
    imageUrl: "https://picsum.photos/id/203/400/300"
  },
  {
    id: "a5",
    title: "建设工程BIM大赛 一等奖",
    type: "award",
    date: "2023-06",
    description: "在复杂节点深化设计专项比赛中脱颖而出。",
    imageUrl: "https://picsum.photos/id/204/400/300"
  },

  // Publications
  {
    id: "a2",
    title: "《土木建筑工程信息技术》期刊发表",
    type: "publication",
    date: "2024-02",
    description: "发表论文《复杂城市综合体BIM全过程应用实践与探索》。",
    imageUrl: "https://picsum.photos/id/201/400/300"
  },
  {
    id: "a6",
    title: "《施工技术》核心期刊收录",
    type: "publication",
    date: "2023-12",
    description: "论文《基于BIM+GIS的智慧工地管理平台开发与应用》获行业高度关注。",
    imageUrl: "https://picsum.photos/id/206/400/300"
  },
  {
    id: "a7",
    title: "国际BIM学术研讨会 特邀报告",
    type: "publication",
    date: "2023-10",
    description: "项目总工受邀分享数字化转型经验，获得与会专家一致好评。",
    imageUrl: "https://picsum.photos/id/208/400/300"
  },

  // Visits
  {
    id: "a3",
    title: "住建部专家组莅临观摩指导",
    type: "visit",
    date: "2023-09",
    description: "专家组高度评价了项目的数字化管理水平。",
    imageUrl: "https://picsum.photos/id/202/400/300"
  },
  {
    id: "a8",
    title: "省市领导现场调研",
    type: "visit",
    date: "2023-11",
    description: "重点考察了智慧工地指挥中心，对安全文明施工给予肯定。",
    imageUrl: "https://picsum.photos/id/209/400/300"
  },
  {
    id: "a9",
    title: "高校师生研学交流",
    type: "visit",
    date: "2023-05",
    description: "接待某建筑大学师生团，开展BIM技术产学研交流活动。",
    imageUrl: "https://picsum.photos/id/211/400/300"
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "t1", name: "张伟", role: "项目经理", contact: "138-0000-1111", parentId: "" },
  { id: "t2", name: "李娜", role: "BIM总监", contact: "139-1111-2222", parentId: "t1" },
  { id: "t3", name: "王强", role: "土建BIM负责人", contact: "137-2222-3333", parentId: "t2" },
  { id: "t4", name: "赵敏", role: "机电BIM负责人", contact: "136-3333-4444", parentId: "t2" },
  { id: "t5", name: "陈诚", role: "平台开发工程师", contact: "135-4444-5555", parentId: "t2" },
];

export const LOCATION_SLIDES = [
  {
    id: 1,
    image: "https://picsum.photos/id/1053/800/400?grayscale",
    title: "金融岛核心区",
    description: "位于城市新中心，链接主要商业动脉",
    icon: MapPin
  },
  {
    id: 2,
    image: "https://picsum.photos/id/122/800/400",
    title: "立体交通网络",
    description: "地铁、公交与地下环路无缝衔接",
    icon: Layers
  },
  {
    id: 3,
    image: "https://picsum.photos/id/193/800/400",
    title: "景观资源分布",
    description: "滨河公园与城市绿带环绕",
    icon: User // Placeholder for general public/user focus
  }
];

export const SITE_SLIDES = [
  {
    id: 1,
    image: "https://picsum.photos/id/250/800/400",
    tag: "施工进度",
    title: "底板钢筋绑扎",
    desc: "采用BIM技术优化钢筋排布，施工效率提升15%"
  },
  {
    id: 2,
    image: "https://picsum.photos/id/175/800/400",
    tag: "现场实况",
    title: "土方作业阶段",
    desc: "基坑开挖深度达24米，土方外运有序进行"
  },
  {
    id: 3,
    image: "https://picsum.photos/id/296/800/400",
    tag: "智慧监管",
    title: "AI视频监控",
    desc: "全覆盖监控系统，保障现场安全文明施工"
  }
];