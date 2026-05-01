export const categories = [
  { id: 0, name: '全部', icon: '📚' },
  { id: 1, name: '科学', icon: '🔬' },
  { id: 2, name: '历史', icon: '🏛️' },
  { id: 3, name: '动物', icon: '🐾' },
  { id: 4, name: '植物', icon: '🌿' },
  { id: 5, name: '人体', icon: '🧑' },
  { id: 6, name: '宇宙', icon: '🌌' },
  { id: 7, name: '美食', icon: '🍔' },
  { id: 8, name: '艺术', icon: '🎨' }
]

export const coldKnowledgeList = [
  {
    id: 1,
    title: '你知道吗？蜜蜂会识别人类面孔',
    intro: '研究表明，蜜蜂具有惊人的面部识别能力，能够记住并区分不同的人类面孔。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=honeybee%20flying%20near%20colorful%20flower%20close%20up%20macro%20photography&image_size=landscape_4_3',
    categoryId: 3,
    categoryName: '动物',
    views: 12580,
    likes: 3420,
    createTime: '2026-04-28 14:30:00',
    author: {
      id: 101,
      nickname: '科普小达人',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20girl%20avatar%20round%20face%20big%20eyes%20brown%20hair&image_size=square'
    },
    content: `蜜蜂是一种令人惊叹的昆虫。最新的科学研究发现，蜜蜂不仅能够识别不同花朵的颜色和形状，还能识别人类的面孔。

研究人员通过训练蜜蜂将特定的人脸图像与糖水奖励联系起来，结果发现蜜蜂能够准确地从多张人脸图像中识别出它们"认识"的那张脸。

这种能力在昆虫界是非常罕见的。蜜蜂的大脑只有芝麻粒大小，却能完成如此复杂的识别任务，这让科学家们对昆虫的认知能力有了全新的认识。

蜜蜂的视觉系统与人类不同，但它们的大脑能够处理复杂的视觉信息。这项研究不仅揭示了蜜蜂惊人的认知能力，也为人工智能的面部识别技术提供了新的思路。

下次你看到蜜蜂在花丛中飞舞时，不妨想想：它们可能正在"记住"你的面孔呢！`
  },
  {
    id: 2,
    title: '历史上最短的战争只持续了38分钟',
    intro: '英桑战争是历史上有记录的最短战争，从开始到结束仅用了38分钟。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=historical%20warship%20naval%20battle%2019th%20century%20painting%20style&image_size=landscape_4_3',
    categoryId: 2,
    categoryName: '历史',
    views: 28900,
    likes: 7650,
    createTime: '2026-04-27 09:15:00',
    author: {
      id: 102,
      nickname: '历史迷',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wise%20old%20man%20avatar%20with%20glasses%20gray%20beard%20scholar%20look&image_size=square'
    },
    content: `英桑战争（Anglo-Zanzibar War）发生在1896年8月27日，是英国与桑给巴尔苏丹国之间的一场战争。

这场战争的起因是桑给巴尔苏丹哈立德·本·巴伽什拒绝了英国的要求，没有退位给英国支持的候选人。英国于是派遣了三艘巡洋舰和两艘炮艇前往桑给巴尔港。

战争于上午9点02分开始，英国军舰开始炮击苏丹的宫殿。苏丹的军队虽然进行了抵抗，但实力悬殊。到9点40分，炮击停止，苏丹已经逃离宫殿。

这场战争总共持续了38分钟，是历史上有记录的最短战争。战争造成了约500名桑给巴尔士兵伤亡，而英国方面只有一名水手受伤。

战争结束后，桑给巴尔成为英国的保护国，直到1963年独立。这场短暂的战争也成为了军事史上一个有趣的注脚。

有趣的是，由于战争时间太短，当时甚至没有来得及进行正式的宣战仪式。`
  },
  {
    id: 3,
    title: '人类DNA中有8%来自病毒',
    intro: '科学家发现，人类基因组中约有8%的DNA来自古老的病毒感染。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dna%20double%20helix%20structure%20blue%20glow%20scientific%203d%20render&image_size=landscape_4_3',
    categoryId: 5,
    categoryName: '人体',
    views: 45600,
    likes: 12300,
    createTime: '2026-04-26 16:45:00',
    author: {
      id: 103,
      nickname: '生命科学研究者',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20scientist%20avatar%20in%20lab%20coat%20curly%20hair%20friendly%20smile&image_size=square'
    },
    content: `你知道吗？你的DNA中大约有8%不是人类自己的，而是来自古老的病毒。

这些病毒DNA片段被称为内源性逆转录病毒（Endogenous Retroviruses，简称ERVs）。它们是数百万年前感染我们祖先的病毒留下的"化石"。

逆转录病毒有一种特殊的能力：它们能够将自己的遗传物质插入到宿主细胞的DNA中。在极少数情况下，这种插入发生在生殖细胞中，病毒DNA就会被传递给后代。

经过数百万年的进化，这些病毒DNA中的大部分已经失去了活性，成为了我们基因组中的"垃圾DNA"。但有趣的是，研究发现其中一些片段实际上对人类有益。

例如，一种名为合胞素（syncytin）的蛋白质就是由古老的病毒基因编码的。这种蛋白质在胎盘形成中起着关键作用，帮助胎儿从母体获取营养。

这意味着，如果没有这些古老的病毒感染，人类可能根本无法进化出胎生的能力。我们的进化历史与病毒紧密相连，这真是一个令人惊叹的事实！

所以下次有人说你"像病毒一样"时，你可以自豪地说："没错，我的DNA里就有8%的病毒！"`
  },
  {
    id: 4,
    title: '金星上的一天比一年还长',
    intro: '由于自转速度极慢，金星上的一个昼夜相当于地球的243天，而它的公转周期只有225天。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=planet%20venus%20in%20space%20yellowish%20orange%20clouds%20stars%20background&image_size=landscape_4_3',
    categoryId: 6,
    categoryName: '宇宙',
    views: 32100,
    likes: 8900,
    createTime: '2026-04-25 11:20:00',
    author: {
      id: 104,
      nickname: '星空探索者',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=astronomer%20avatar%20with%20telescope%20curious%20eyes%20night%20sky%20theme&image_size=square'
    },
    content: `金星是太阳系中最奇特的行星之一，它有一个非常有趣的特点：一天比一年还长。

让我们来做个比较：
- 地球的自转周期（一天）：约24小时
- 地球的公转周期（一年）：约365天

而金星：
- 自转周期（一天）：约243地球日
- 公转周期（一年）：约225地球日

这意味着，在金星上，你等待"日出日落"的时间比等待"四季更替"的时间还要长。

更有趣的是，金星是太阳系中少数逆向自转的行星之一。也就是说，如果你站在金星表面，会看到太阳从西边升起，从东边落下。

金星的自转速度为什么这么慢呢？科学家认为这可能与金星浓厚的大气层有关。金星的大气密度是地球的90倍，大气压力相当于地球海底900米处的压力。这种浓厚的大气可能与行星表面产生了巨大的摩擦，减缓了自转速度。

此外，金星的逆向自转也可能是早期一次巨大撞击的结果。一个火星大小的天体可能曾经撞击过金星，改变了它的自转方向。

虽然金星是地球的"姐妹行星"（大小和质量相似），但它的环境却截然不同。金星表面温度高达460°C，足以熔化铅。大气中充满了硫酸云，温室效应失控。

所以，如果你计划去金星旅行，记得带上防晒霜（虽然可能没用），以及足够的耐心等待日出。`
  },
  {
    id: 5,
    title: '章鱼有三颗心脏和蓝色的血液',
    intro: '章鱼的 circulatory system 非常独特，它们有三颗心脏，血液因含铜而呈蓝色。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=octopus%20in%20deep%20blue%20ocean%20colorful%20tentacles%20coral%20reef%20underwater&image_size=landscape_4_3',
    categoryId: 3,
    categoryName: '动物',
    views: 56700,
    likes: 15600,
    createTime: '2026-04-24 08:30:00',
    author: {
      id: 105,
      nickname: '海洋生物爱好者',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=marine%20biologist%20avatar%20diving%20gear%20smiling%20underwater%20theme&image_size=square'
    },
    content: `章鱼是地球上最神奇的生物之一，它们的生理结构令人惊叹。

首先，章鱼有三颗心脏：
- 两颗心脏专门负责将血液输送到鳃部，用于气体交换
- 第三颗心脏则负责将含氧血液输送到身体其他部位

当章鱼游泳时，负责全身循环的那颗心脏会暂时停止跳动，这就是为什么章鱼更喜欢爬行而不是游泳——游泳太累了！

其次，章鱼的血液是蓝色的。这是因为它们的血液中含有血蓝蛋白（hemocyanin），而不是人类血液中的血红蛋白。血蓝蛋白含有铜离子，在氧化状态下呈现蓝色。

血蓝蛋白在低温和低氧环境下比血红蛋白更有效，这使得章鱼能够在深海环境中生存。

章鱼还有其他令人惊叹的特点：
- 它们有八条触手，每条触手都有自己的"迷你大脑"
- 它们能够瞬间改变皮肤颜色和纹理，用于伪装和交流
- 它们具有出色的问题解决能力，能够打开罐子、穿越迷宫
- 它们有三个记忆系统：一个中央大脑，两个视神经叶

章鱼的智力水平在无脊椎动物中是最高的。研究表明，章鱼能够识别人类面孔，使用工具，甚至会"玩耍"——它们会用喷水推动水中的物体，就像在玩游戏一样。

有趣的是，章鱼是独居动物，它们的智力是独立发展的，与群居动物（如人类、海豚）的智力进化路径完全不同。

下次你在水族馆看到章鱼时，不妨和它打个招呼——它可能正在用那双蓝色血液的眼睛"思考"着你呢！`
  },
  {
    id: 6,
    title: '竹子其实是草不是树',
    intro: '虽然竹子看起来很高大，但从植物学分类来说，它属于禾本科，和小麦、水稻是近亲。',
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bamboo%20forest%20green%20sunlight%20filtering%20peaceful%20asian%20nature&image_size=landscape_4_3',
    categoryId: 4,
    categoryName: '植物',
    views: 18900,
    likes: 5200,
    createTime: '2026-04-23 15:00:00',
    author: {
      id: 106,
      nickname: '植物达人',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=gardener%20avatar%20with%20plants%20green%20thumbs%20loving%20nature&image_size=square'
    },
    content: `你可能见过高大挺拔的竹林，觉得竹子应该是一种树。但实际上，竹子是草，而且是世界上生长最快的草。

让我们来看看竹子和树的区别：

**树的特点：**
- 有形成层，能够逐年增粗
- 茎内有木质部和韧皮部
- 寿命通常很长
- 开花结果后不会死亡

**竹子的特点：**
- 没有形成层，茎的粗细由竹笋决定
- 茎中空，有节
- 属于禾本科，和水稻、小麦、玉米是近亲
- 开花后通常会整株死亡

竹子的生长速度非常惊人。在适宜的条件下，有些竹子每天可以生长近1米！这是因为竹子的生长点在节部，而不是顶端。

竹子有一个非常特殊的生命周期。大多数竹子物种会在生长几十年甚至上百年后才开花，而且同一地区的同种竹子往往会同时开花。开花后，竹子会产生种子，然后整株死亡。

这种集体开花和死亡的现象至今还是一个科学谜团。有理论认为，这是竹子的一种繁殖策略——大量种子同时产生，捕食者无法全部吃掉，从而保证了下一代的存活。

竹子在人类生活中扮演着重要角色：
- 竹笋是美味的食材
- 竹竿可以用于建筑、制作家具和工艺品
- 竹叶可以用于包裹食物
- 竹纤维可以用于制作纺织品

在中国文化中，竹子有着特殊的地位，象征着坚韧、正直和谦虚。竹子与梅、兰、菊并称为"四君子"。

所以下次你看到竹子时，记住：它不是树，而是一种超级大的草！`
  }
]

export const commentsData = {
  1: [
    {
      id: 1001,
      userId: 201,
      nickname: '好奇宝宝',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20child%20avatar%20big%20eyes%20curious%20expression%20cartoon%20style&image_size=square',
      content: '太神奇了！原来蜜蜂这么聪明！',
      createTime: '2026-04-29 10:23:00',
      likes: 45
    },
    {
      id: 1002,
      userId: 202,
      nickname: '昆虫研究者',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=scientist%20avatar%20with%20microscope%20serious%20but%20friendly&image_size=square',
      content: '补充一下：蜜蜂不仅能识别人脸，还能记住花朵的位置和颜色，甚至能通过"舞蹈"告诉同伴花蜜的位置。',
      createTime: '2026-04-29 11:05:00',
      likes: 128
    },
    {
      id: 1003,
      userId: 203,
      nickname: '怕虫人士',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=person%20with%20worried%20expression%20holding%20insect%20repellent&image_size=square',
      content: '那以后是不是不能随便打蜜蜂了...它会记仇吗😱',
      createTime: '2026-04-29 14:30:00',
      likes: 89
    }
  ],
  2: [
    {
      id: 2001,
      userId: 204,
      nickname: '战争史爱好者',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=history%20buff%20avatar%20reading%20old%20books%20vintage%20style&image_size=square',
      content: '这场战争我知道！其实桑给巴尔的军队根本没有还手之力，英国的军舰一开火就结束了。',
      createTime: '2026-04-28 09:15:00',
      likes: 67
    },
    {
      id: 2002,
      userId: 205,
      nickname: '国际关系专家',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=diplomat%20avatar%20suit%20and%20tie%20confident%20look&image_size=square',
      content: '这其实是殖民主义的典型案例。当时英国在东非扩张势力范围，桑给巴尔只是众多牺牲品之一。',
      createTime: '2026-04-28 10:30:00',
      likes: 234
    }
  ],
  3: [
    {
      id: 3001,
      userId: 206,
      nickname: '遗传学学生',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20with%2 textbooks%20studious%20expression&image_size=square',
      content: '这个知识点上课学过！内源性逆转录病毒确实占了人类基因组的很大比例。更有趣的是，有些ERV可能与某些疾病有关。',
      createTime: '2026-04-27 16:00:00',
      likes: 156
    },
    {
      id: 3002,
      userId: 207,
      nickname: '科幻迷',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sci-fi%20fan%20avatar%20space%20helmet%20futuristic%20look&image_size=square',
      content: '所以人类其实是"半人半病毒"的存在？这设定太适合写科幻小说了！🤖',
      createTime: '2026-04-27 18:45:00',
      likes: 312
    }
  ],
  4: [
    {
      id: 4001,
      userId: 208,
      nickname: '天文爱好者',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=astronomy%20enthusiast%20avatar%20stargazing%20night%20sky&image_size=square',
      content: '金星真是个神奇的星球！除了一天比一年长，它还是太阳系中最热的行星，表面温度能熔化铅。',
      createTime: '2026-04-26 12:30:00',
      likes: 98
    },
    {
      id: 4002,
      userId: 209,
      nickname: '航天工程师',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rocket%20scientist%20avatar%20spacecraft%20background&image_size=square',
      content: '实际上，苏联曾经成功着陆过金星探测器。但由于环境太恶劣，探测器只工作了几十分钟就报废了。',
      createTime: '2026-04-26 14:15:00',
      likes: 187
    }
  ],
  5: [
    {
      id: 5001,
      userId: 210,
      nickname: '潜水爱好者',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=scuba%20diver%20avatar%20underwater%20adventure&image_size=square',
      content: '我在潜水时见过章鱼！它们真的很聪明，会观察你，甚至会和你互动。',
      createTime: '2026-04-25 09:30:00',
      likes: 245
    },
    {
      id: 5002,
      userId: 211,
      nickname: '动物行为学家',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=animal%20behaviorist%20avatar%20studying%20octopus&image_size=square',
      content: '章鱼的智力确实令人惊叹。有研究表明，章鱼具有"个性"，不同的个体有不同的行为模式。它们甚至会表现出好奇心、玩耍行为和情绪反应。',
      createTime: '2026-04-25 11:00:00',
      likes: 378
    },
    {
      id: 5003,
      userId: 212,
      nickname: '美食爱好者',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=foodie%20avatar%20eating%20delicious%20food%20happy%20look&image_size=square',
      content: '看完这个...我以后还能安心吃章鱼小丸子吗😅',
      createTime: '2026-04-25 13:20:00',
      likes: 523
    }
  ],
  6: [
    {
      id: 6001,
      userId: 213,
      nickname: '植物学教授',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=botany%20professor%20avatar%20elderly%20wise%20with%20plants&image_size=square',
      content: '说得对！竹子确实是禾本科植物。区分草和树的关键特征是：树有次生生长（形成层），能够逐年增粗；而草没有形成层，茎的粗细是固定的。',
      createTime: '2026-04-24 16:30:00',
      likes: 167
    },
    {
      id: 6002,
      userId: 214,
      nickname: '中国文化爱好者',
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20culture%20enthusiast%20avatar%20traditional%20style&image_size=square',
      content: '在中国文化中，竹子象征着君子的品格：宁折不弯、虚怀若谷、四季常青。难怪古代文人墨客都爱画竹！',
      createTime: '2026-04-24 18:00:00',
      likes: 234
    }
  ]
}

export const defaultUser = {
  id: 999,
  nickname: '游客',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar%20gray%20silhouette%20simple%20design&image_size=square',
  isLoggedIn: false
}

export const testUser = {
  id: 1000,
  nickname: '知识探索者',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20user%20avatar%20smiling%20face%20warm%20colors%20modern%20style&image_size=square',
  isLoggedIn: true
}
