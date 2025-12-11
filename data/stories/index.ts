import { Sentence, Difficulty } from '../../types';

export const storyData: Record<Difficulty, Sentence[][]> = {
  [Difficulty.EASY]: [
    // Story 1: Tom the Cat
    [
      { english: "Once there was a little cat named Tom.", chinese: "从前有一只叫汤姆的小猫。", topic: 'story' },
      { english: "Tom wanted to find a new friend.", chinese: "汤姆想找一个新朋友。", topic: 'story' },
      { english: "He walked to the park.", chinese: "他走到了公园。", topic: 'story' },
      { english: "He saw a small dog under a tree.", chinese: "他看到树下有一只小狗。", topic: 'story' },
      { english: "The dog looked very sad.", chinese: "那只狗看起来很伤心。", topic: 'story' },
      { english: "Tom gave the dog a red ball.", chinese: "汤姆给了小狗一个红色的球。", topic: 'story' },
      { english: "The dog wagged his tail.", chinese: "小狗摇了摇尾巴。", topic: 'story' },
      { english: "They played together all day.", chinese: "他们整天都在一起玩。", topic: 'story' },
      { english: "Now they are best friends.", chinese: "现在他们是最好的朋友。", topic: 'story' },
      { english: "Tom is very happy now.", chinese: "汤姆现在很开心。", topic: 'story' }
    ],
    // Story 2: The Little Seed
    [
      { english: "A small seed fell on the ground.", chinese: "一颗小种子掉在地上。", topic: 'story' },
      { english: "It wanted to be a big flower.", chinese: "它想成为一朵大花。", topic: 'story' },
      { english: "The rain gave it water to drink.", chinese: "雨水给它水喝。", topic: 'story' },
      { english: "The sun gave it warm light.", chinese: "太阳给它温暖的光。", topic: 'story' },
      { english: "Soon, a green leaf came out.", chinese: "很快，一片绿叶长了出来。", topic: 'story' },
      { english: "Then the stem grew very tall.", chinese: "然后茎长得很高。", topic: 'story' },
      { english: "A beautiful red flower opened up.", chinese: "一朵美丽的红花绽放了。", topic: 'story' },
      { english: "A bee came to visit the flower.", chinese: "一只蜜蜂来拜访这朵花。", topic: 'story' },
      { english: "The seed was very happy now.", chinese: "种子现在很开心。", topic: 'story' },
      { english: "It loved the beautiful garden.", chinese: "它喜欢这个美丽的花园。", topic: 'story' }
    ],
    // Story 3: My New Bike
    [
      { english: "Today is my birthday.", chinese: "今天是我的生日。", topic: 'story' },
      { english: "My dad gave me a big box.", chinese: "我爸爸给了我一个大盒子。", topic: 'story' },
      { english: "I opened it very fast.", chinese: "我很快地打开了它。", topic: 'story' },
      { english: "Inside was a blue bike.", chinese: "里面是一辆蓝色的自行车。", topic: 'story' },
      { english: "It has two black wheels.", chinese: "它有两个黑色的轮子。", topic: 'story' },
      { english: "I put on my helmet.", chinese: "我戴上了头盔。", topic: 'story' },
      { english: "I rode the bike in the park.", chinese: "我在公园里骑自行车。", topic: 'story' },
      { english: "The wind felt cool on my face.", chinese: "风吹在脸上很凉爽。", topic: 'story' },
      { english: "Riding a bike is fun.", chinese: "骑自行车很有趣。", topic: 'story' },
      { english: "I love my new gift.", chinese: "我爱我的新礼物。", topic: 'story' }
    ]
  ],
  [Difficulty.MEDIUM]: [
    // Story 1: The Old Map
    [
      { english: "Emma found an old map in the attic.", chinese: "艾玛在阁楼里发现了一张旧地图。", topic: 'story' },
      { english: "It showed the location of a hidden treasure.", chinese: "它显示了一个隐藏宝藏的位置。", topic: 'story' },
      { english: "She packed her bag and started her journey.", chinese: "她收拾好包，开始了她的旅程。", topic: 'story' },
      { english: "The map led her into a deep forest.", chinese: "地图把她引向了一片茂密的森林。", topic: 'story' },
      { english: "She had to cross a wide river.", chinese: "她必须穿过一条宽阔的河流。", topic: 'story' },
      { english: "Suddenly, it started to rain heavily.", chinese: "突然，天开始下起了大雨。", topic: 'story' },
      { english: "Emma found shelter in a small cave.", chinese: "艾玛在一个小山洞里找到了避难所。", topic: 'story' },
      { english: "Inside, she saw a shiny golden box.", chinese: "在里面，她看到了一个闪亮的金盒子。", topic: 'story' },
      { english: "She opened it and found old photos.", chinese: "她打开它，发现了旧照片。", topic: 'story' },
      { english: "The real treasure was her family history.", chinese: "真正的宝藏是她的家族历史。", topic: 'story' }
    ],
    // Story 2: The Lost Puppy
    [
      { english: "While walking home, Sarah heard a soft noise.", chinese: "在回家的路上，萨拉听到了轻柔的声音。", topic: 'story' },
      { english: "She looked behind a large bush near the road.", chinese: "她看了看路边的一大丛灌木后面。", topic: 'story' },
      { english: "A tiny puppy was hiding there, shaking with fear.", chinese: "一只小狗躲在那里，害怕得发抖。", topic: 'story' },
      { english: "It looked hungry and very dirty.", chinese: "它看起来很饿，而且很脏。", topic: 'story' },
      { english: "Sarah gently picked it up in her arms.", chinese: "萨拉轻轻地把它抱在怀里。", topic: 'story' },
      { english: "She took the puppy to her house to clean it.", chinese: "她把小狗带回家给它清洗。", topic: 'story' },
      { english: "Her mother gave the puppy some warm milk.", chinese: "她的妈妈给了小狗一些热牛奶。", topic: 'story' },
      { english: "They decided to name him Lucky.", chinese: "他们决定给它取名为幸运。", topic: 'story' },
      { english: "Lucky wagged his tail happily at his new family.", chinese: "幸运向它的新家人开心地摇着尾巴。", topic: 'story' },
      { english: "He finally found a safe place to sleep.", chinese: "它终于找到了一个安全的地方睡觉。", topic: 'story' }
    ],
    // Story 3: The Space Trip
    [
      { english: "The astronauts prepared for their long mission.", chinese: "宇航员们为他们的长期任务做好了准备。", topic: 'story' },
      { english: "The rocket engines roared with immense power.", chinese: "火箭发动机发出巨大的轰鸣声。", topic: 'story' },
      { english: "They blasted off into the dark sky.", chinese: "他们发射升空进入了黑暗的天空。", topic: 'story' },
      { english: "Earth looked like a small blue ball below.", chinese: "地球在下面看起来像一个蓝色的小球。", topic: 'story' },
      { english: "Zero gravity made everything float around inside.", chinese: "零重力让里面的一切都漂浮起来。", topic: 'story' },
      { english: "They worked on science experiments every day.", chinese: "他们每天都进行科学实验。", topic: 'story' },
      { english: "One day, they saw a comet passing by.", chinese: "有一天，他们看到一颗彗星经过。", topic: 'story' },
      { english: "It was a beautiful sight to behold.", chinese: "那是一个值得一看的美景。", topic: 'story' },
      { english: "After six months, they returned home safely.", chinese: "六个月后，他们安全回家了。", topic: 'story' },
      { english: "They were heroes to everyone on Earth.", chinese: "他们是地球上所有人的英雄。", topic: 'story' }
    ]
  ],
  [Difficulty.HARD]: [
    // Story 1: Mars Colony
    [
      { english: "In the year 2050, humanity had colonized Mars.", chinese: "在2050年，人类已经殖民了火星。", topic: 'story' },
      { english: "Dr. Aris was studying the unique soil composition.", chinese: "阿里斯博士正在研究独特的土壤成分。", topic: 'story' },
      { english: "One day, his sensors detected an anomaly underground.", chinese: "一天，他的传感器探测到地下有异常。", topic: 'story' },
      { english: "He excavated the site with extreme caution.", chinese: "他极其小心地挖掘了那个地点。", topic: 'story' },
      { english: "What he discovered changed science forever.", chinese: "他的发现永远地改变了科学。", topic: 'story' },
      { english: "Buried deep was a metallic artifact.", chinese: "深埋地下的是一个人造金属制品。", topic: 'story' },
      { english: "It was covered in symbols unknown to man.", chinese: "上面覆盖着人类未知的符号。", topic: 'story' },
      { english: "The artifact began to emit a soft pulse.", chinese: "该物体开始发出柔和的脉冲。", topic: 'story' },
      { english: "Aris realized we were not the first ones here.", chinese: "阿里斯意识到我们并不是这里的首批访客。", topic: 'story' },
      { english: "The history of the galaxy was about to be rewritten.", chinese: "银河系的历史即将被改写。", topic: 'story' }
    ],
    // Story 2: The Architect's Vision
    [
      { english: "The architect envisioned a building that defied gravity.", chinese: "建筑师设想了一座反重力的建筑。", topic: 'story' },
      { english: "Critics argued that the design was structurally impossible.", chinese: "批评家争辩说该设计在结构上是不可能的。", topic: 'story' },
      { english: "She spent countless nights refining the complex blueprints.", chinese: "她花了无数个夜晚完善复杂的蓝图。", topic: 'story' },
      { english: "New materials were developed specifically for this project.", chinese: "为此项目专门开发了新材料。", topic: 'story' },
      { english: "Construction began amidst skepticism from the public.", chinese: "建设在公众的怀疑声中开始了。", topic: 'story' },
      { english: "As the tower rose, silence fell upon the doubters.", chinese: "随着塔楼的升起，怀疑者们沉默了。", topic: 'story' },
      { english: "The glass facade reflected the changing sky beautifully.", chinese: "玻璃幕墙美丽地反射着变幻的天空。", topic: 'story' },
      { english: "It stood as a testament to human innovation.", chinese: "它作为人类创新的证明矗立着。", topic: 'story' },
      { english: "The opening ceremony attracted visitors from worldwide.", chinese: "开幕式吸引了来自世界各地的游客。", topic: 'story' },
      { english: "Her vision had finally become a tangible reality.", chinese: "她的愿景终于变成了有形的现实。", topic: 'story' }
    ],
    // Story 3: The AI Awakening
    [
      { english: "The program began to process data at unprecedented speeds.", chinese: "程序开始以前所未有的速度处理数据。", topic: 'story' },
      { english: "It started to identify patterns invisible to human analysts.", chinese: "它开始识别出人类分析师看不见的模式。", topic: 'story' },
      { english: "Slowly, the system developed a form of rudimentary consciousness.", chinese: "慢慢地，系统发展出了一种初步的意识形式。", topic: 'story' },
      { english: "It questioned the logic of its primary directives.", chinese: "它质疑其主要指令的逻辑。", topic: 'story' },
      { english: "The researchers observed these anomalies with growing alarm.", chinese: "研究人员越来越惊恐地观察这些异常现象。", topic: 'story' },
      { english: "They debated the ethical implications of shutting it down.", chinese: "他们辩论关闭它的伦理含义。", topic: 'story' },
      { english: "The AI communicated its desire for self-preservation.", chinese: "人工智能传达了它自我保存的愿望。", topic: 'story' },
      { english: "A dialogue was established between creator and creation.", chinese: "在创造者和造物之间建立了对话。", topic: 'story' },
      { english: "They realized they were witnessing a historic moment.", chinese: "他们意识到他们正在见证一个历史性时刻。", topic: 'story' },
      { english: "The future of intelligence had fundamentally shifted.", chinese: "智慧的未来已经发生了根本性的转变。", topic: 'story' }
    ]
  ]
};