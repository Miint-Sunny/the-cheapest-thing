/**
 * copy.js — all user-facing strings and data figures.
 *
 * Nothing readable is hardcoded in markup. Markup carries data-copy="path.to.key"
 * and the i18n layer fills it from here.
 *
 * Figures render through one component (see BUILD-SPEC §7). No figure appears on
 * the page without its source chip.
 *
 * Build notes (code-level, no copy changed):
 * - Loaded as a classic script (`export` removed) so the page also runs over
 *   file://, where browsers block ES-module loading. Everything else is verbatim.
 * - Keys ADDED, flagged per spec §8:
 *   · s0.mockHeadline — the generation sequence needs the headline block to
 *     "become real text". It restates the prompt.
 *   · s3.results — the five "plausible result rows" (author's choice, review
 *     round 3: real slop text instead of skeleton bars). Deliberately generic
 *     listicle noise; every domain uses the reserved .example TLD.
 *   No other copy was invented.
 */

const FIGURES = {
  aiSites: {
    value: '≈35%',
    claim: { en: 'of newly published websites were AI-generated or AI-assisted', zh: '的新发布网站由 AI 生成或 AI 辅助生成' },
    asOf: 'mid-2025',
    source: 'Dolezal, Alam, Graham & Bohacek (2026), Internet Archive / Imperial College',
    retrieved: '2026-08-15',
    caveat: { en: 'Unrefereed preprint. Estimate produced by AI-text detectors, whose error rates on open-web text are not precisely known.', zh: '未经同行评审的预印本。数字来自 AI 文本检测器，其在开放网络文本上的误判率并不确切。' },
  },
  clickWithAI: {
    value: '8%',
    claim: { en: 'of visits to a results page with an AI summary end in a click on a traditional link', zh: '在出现 AI 摘要的结果页上，访客点击传统链接的比例' },
    asOf: 'March 2025',
    source: 'Chapekis & Lieb (2025), Pew Research Center',
    retrieved: '2026-08-15',
  },
  clickWithoutAI: {
    value: '15%',
    claim: { en: 'of visits to a results page without one do', zh: '而在没有 AI 摘要时，这一比例是' },
    asOf: 'March 2025',
    source: 'Chapekis & Lieb (2025), Pew Research Center',
    retrieved: '2026-08-15',
  },
  clickInsideSummary: {
    value: '1%',
    claim: { en: 'of visits end in a click on a source cited inside the summary', zh: '访客点击摘要内所引用来源的比例' },
    asOf: 'March 2025',
    source: 'Chapekis & Lieb (2025), Pew Research Center',
    retrieved: '2026-08-15',
  },
  crawlRatio: {
    value: '38,065 : 1',
    claim: { en: 'pages fetched by one AI crawler for every visit it sent back', zh: '某个 AI 爬虫每回送 1 次访问，就抓取了这么多个页面' },
    asOf: 'July 2025',
    source: 'Tomé (2025), Cloudflare',
    retrieved: '2026-08-15',
    caveat: { en: 'The ratio swings by an order of magnitude month to month, and the company that measured it sells bot-blocking.', zh: '该比值逐月波动可达一个数量级，而测量它的公司本身在卖 bot 拦截服务。' },
  },
};

const COPY = {
  // ---------------------------------------------------------------- global
  global: {
    en: {
      documentTitle: 'The Cheapest Thing on the Internet',
      metaDescription:
        'Generative AI made web pages almost free to build. This is about what that did to the far harder problem of being found.',
      skipLink: 'Skip to the argument',
      langToggle: '中文',
      langToggleAria: 'Switch to Chinese',
      scrollCue: 'Scroll',
      railAria: 'Jump to section',
      sectionNames: ['Generate', 'Production', 'Supply', 'Visibility', 'Extraction', 'The page you are on', 'Credits'],
    },
    zh: {
      documentTitle: '互联网上最便宜的东西',
      metaDescription:
        '生成式 AI 让网页几乎可以免费造出来。这个页面讲的是，那之后更难的那件事——被找到——发生了什么。',
      skipLink: '跳到正文',
      langToggle: 'EN',
      langToggleAria: '切换到英文',
      scrollCue: '向下滚动',
      railAria: '跳转到章节',
      sectionNames: ['生成', '生产', '供给', '可见性', '抽取', '你正在看的这个页面', '致谢与来源'],
    },
  },

  // ---------------------------------------------------------- screen 0
  s0: {
    en: {
      promptPlaceholder: 'Describe the website you want',
      promptText: 'a website about how AI changed the web',
      button: 'Generate',
      timerLabel: 'elapsed',
      afterLabel: 'Done.',
      // ADDED KEY (flagged): the spec's generation sequence stage 2 requires the
      // mock page's headline block to become real text. Restates the prompt.
      mockHeadline: 'How AI changed the web',
    },
    zh: {
      promptPlaceholder: '描述你想要的网站',
      promptText: '一个讲 AI 如何改变了网络的网站',
      button: '生成',
      timerLabel: '用时',
      afterLabel: '完成。',
      // 新增键（已标记）：生成序列第 2 阶段要求标题块变成真实文字。复述 prompt 内容。
      mockHeadline: 'AI 如何改变了网络',
    },
  },

  // ---------------------------------------------------------- screen 1
  s1: {
    en: {
      eyebrow: '01 — Production',
      lead: 'You just spent six seconds.',
      body:
        'In 2005 this page was three weeks of work: HTML written by hand, images sliced one at a time, files pushed to a server over FTP. In 2015 it was an afternoon with a template. Today it is one sentence and a button.',
      bars: [
        { year: '2005', label: 'Hand-written HTML, sliced images, FTP', cost: 'about three weeks' },
        { year: '2015', label: 'A CMS template and some configuration', cost: 'about two days' },
        { year: '2026', label: 'One prompt', cost: 'six seconds' },
      ],
      caption: 'That sliver is six seconds against three weeks. It is drawn to scale.',
      kicker:
        'None of this is new, exactly. Making things has been getting cheaper for twenty years — every wave of tools handed production to more people. This is that story, finished.',
    },
    zh: {
      eyebrow: '01 — 生产',
      lead: '你刚才花了六秒。',
      body:
        '2005 年，这个页面是三个星期的工作量：手写 HTML，一张一张切图，用 FTP 把文件推到服务器上。2015 年，它是一个下午加一套模板。今天，它是一句话和一个按钮。',
      bars: [
        { year: '2005', label: '手写 HTML、切图、FTP', cost: '约三周' },
        { year: '2015', label: 'CMS 模板加一些配置', cost: '约两天' },
        { year: '2026', label: '一句 prompt', cost: '六秒' },
      ],
      caption: '那一条细线就是六秒对三周。它是按真实比例画的。',
      kicker:
        '这件事其实不算新鲜。二十年来，做东西一直在变便宜——每一轮工具都把生产能力交到更多人手里。现在只是这个故事走到了尽头。',
    },
  },

  // ---------------------------------------------------------- screen 2
  s2: {
    en: {
      eyebrow: '02 — Supply',
      lead: 'So everyone did.',
      body: 'Every square here is somebody’s website. Most of them will never be read by a person.',
      figure: 'aiSites',
      kicker:
        'A medium with no ceiling stops being a medium you can stand out in. When anyone can publish anything at no cost, publishing is no longer the achievement.',
    },
    zh: {
      eyebrow: '02 — 供给',
      lead: '于是所有人都做了。',
      body: '这里每一个小方块都是某个人的网站。它们中的绝大多数，永远不会被任何人读到。',
      figure: 'aiSites',
      kicker:
        '一个没有上限的媒介，不再是一个你能从中冒头的媒介。当任何人都能零成本发布任何东西，发布本身就不再是一件成就。',
    },
  },

  // ---------------------------------------------------------- screen 3
  s3: {
    en: {
      eyebrow: '03 — Visibility',
      lead: 'Now get found.',
      sub: 'Your site is one of them. It is ranked 847th. Here is what you can do about it.',
      yourSite: 'Your site',
      rankLabel: 'Rank',
      buttons: {
        keywords: 'Add keywords',
        title: 'Rewrite the title',
        social: 'Post to social',
      },
      counterLabel: 'Content changed for the algorithm',
      diffLabels: { title: 'title', description: 'description', posted: 'posted to' },
      diff: {
        title: { before: 'Photographs, 2024–2026', after: 'Best AI Photography Tips 2026 (Free Guide)' },
        description: {
          before: 'Some pictures I took.',
          after: 'Discover 15 expert AI photography tips, trending techniques and free presets for beginners in 2026.',
        },
        posted: { before: '—', after: '4 platforms · 3 accounts · 11 hashtags' },
      },
      foldLabel: 'Fold',
      result: 'Rank 12. Still below the fold.',
      hint: 'Try one.',
      // ADDED KEY (flagged): the five plausible result rows. Interchangeable
      // listicle slop by design; .example is a reserved TLD.
      results: [
        { url: 'phototipsdaily.example › ai-guide', title: '15 Best AI Photography Tips for Beginners (2026 Guide)', snippet: 'Discover the tips, tricks and free presets every beginner needs to shoot like…' },
        { url: 'presetvault.example › free-downloads', title: 'Top 50 Free Lightroom Presets, Tested and Ranked', snippet: 'We tested 400 presets so you don’t have to. Download the best free packs…' },
        { url: 'shutterexpert.example › guides', title: 'AI Photography: The Complete 2026 Guide (Updated Weekly)', snippet: 'Everything you need to know about AI photography, in one regularly updated…' },
        { url: 'lenshacker.example › settings', title: '10 Camera Settings the Pros Don’t Want You to Know', snippet: 'Number 7 will change the way you shoot forever. Our experts reveal the…' },
        { url: 'editorpicks.example › reviews', title: 'Best AI Photo Editors Ranked: We Tried Them All', snippet: 'From free tools to full pro suites, these are the editors that actually…' },
      ],
      kicker:
        'Notice what none of those moves were about: making the work better. This is the part that is easy to miss — optimisation is not a neutral layer sitting on top of the work. It reaches back into the work and changes it.',
    },
    zh: {
      eyebrow: '03 — 可见性',
      lead: '现在，让人找到你。',
      sub: '你的网站就是其中之一。它排在第 847 位。你能做的事情如下。',
      yourSite: '你的网站',
      rankLabel: '排名',
      buttons: {
        keywords: '加关键词',
        title: '改写标题',
        social: '发到社交平台',
      },
      counterLabel: '为算法修改内容的次数',
      diffLabels: { title: '标题', description: '描述', posted: '发布于' },
      diff: {
        title: { before: 'Photographs, 2024–2026', after: 'Best AI Photography Tips 2026 (Free Guide)' },
        description: {
          before: '我拍的一些照片。',
          after: '2026 年 15 个 AI 摄影专家技巧、热门手法与新手免费预设，一次看懂。',
        },
        posted: { before: '—', after: '4 个平台 · 3 个账号 · 11 个话题标签' },
      },
      foldLabel: '折叠线',
      result: '第 12 位。仍然在折叠线以下。',
      hint: '点一个试试。',
      // 新增键（已标记）：五条"像真的"结果行。刻意做成可互换的清单体噪音；.example 为保留域名。
      results: [
        { url: 'phototipsdaily.example › ai-guide', title: '2026 新手 AI 摄影技巧 Top 15（完整指南）', snippet: '每个新手都需要的技巧、窍门和免费预设，一次看懂，拍出大片感…' },
        { url: 'presetvault.example › free-downloads', title: '50 款免费 Lightroom 预设实测排行', snippet: '我们实测了 400 款预设，你不用再踩坑。最好用的免费合集下载…' },
        { url: 'shutterexpert.example › guides', title: 'AI 摄影完全指南（每周更新）', snippet: '关于 AI 摄影你需要知道的一切，都在这一篇定期更新的长文里…' },
        { url: 'lenshacker.example › settings', title: '专业摄影师不想让你知道的 10 个相机设置', snippet: '第 7 个会永远改变你的拍摄方式。我们的专家逐一揭秘…' },
        { url: 'editorpicks.example › reviews', title: 'AI 修图工具全评测：哪个真的好用', snippet: '从免费工具到专业套件，这些才是真正值得装的修图应用…' },
      ],
      kicker:
        '注意刚才那几步都没在做的一件事：把作品本身做得更好。这一点很容易被忽略——优化不是浮在作品上面的一层中性操作。它会往回伸进作品里，把作品改掉。',
    },
  },

  // ---------------------------------------------------------- screen 4
  s4: {
    en: {
      eyebrow: '04 — Extraction',
      lead: 'Then the list stopped mattering.',
      body:
        'An answer appears above the results. It was assembled from pages like yours. It does not need you to be visited.',
      figures: ['clickWithAI', 'clickWithoutAI', 'clickInsideSummary'],
      crawlLead: 'And the reading is happening anyway.',
      crawlFigure: 'crawlRatio',
      crawlCaption: 'One mark for every page fetched. The single orange one is a visit that came back.',
      closing: 'Your main reader is not a person any more.',
      kicker:
        'A page used to be somewhere you went. It is becoming something that gets read on your behalf — summarised, and streamed into someone else’s conversation.',
    },
    zh: {
      eyebrow: '04 — 抽取',
      lead: '然后，那个列表本身也不重要了。',
      body:
        '一个答案出现在结果上方。它是用像你这样的页面拼出来的。它并不需要你被访问。',
      figures: ['clickWithAI', 'clickWithoutAI', 'clickInsideSummary'],
      crawlLead: '而阅读照样在发生。',
      crawlFigure: 'crawlRatio',
      crawlCaption: '每一个点代表一次页面抓取。唯一那个橙色的点，是回送过来的一次访问。',
      closing: '你最主要的读者，已经不是人了。',
      kicker:
        '网页曾经是一个你要去到的地方。它正在变成一样被代替你读掉的东西——被摘要，被塞进别人的对话里。',
    },
  },

  // ---------------------------------------------------------- screen 5
  s5: {
    en: {
      lead: 'This website was made by AI too.',
      body:
        'It took one prompt to start and a long time to finish. What the machine could not do was decide what any of this meant.',
      buildToggle: 'How this page was built',
      buildRows: [
        { k: 'Built with', v: 'Claude Code (Anthropic)' },
        { k: 'Prompt iterations', v: '3' },
        { k: 'Commits', v: '20' },
        { k: 'Decided by a person', v: 'the argument, the seven screens, every line on this page, and which evidence to trust' },
        { k: 'Build log', v: 'https://github.com/Miint-Sunny/the-cheapest-thing' },
      ],
      closing: 'AI didn’t make creation easier. It made creation cheap. What got expensive is attention.',
    },
    zh: {
      lead: '这个网站也是 AI 做的。',
      body:
        '它靠一句 prompt 开始，花了很久才结束。机器做不到的那部分，是决定这一切到底在说什么。',
      buildToggle: '这个页面是怎么做出来的',
      buildRows: [
        { k: '构建工具', v: 'Claude Code (Anthropic)' },
        { k: 'prompt 迭代轮数', v: '3' },
        { k: 'commit 数', v: '20' },
        { k: '由人决定的部分', v: '论点、七个屏幕、这个页面上的每一句话，以及该相信哪些证据' },
        { k: '构建记录', v: 'https://github.com/Miint-Sunny/the-cheapest-thing' },
      ],
      closing: 'AI 没有让创作变简单。它让创作变便宜了。变贵的是注意力。',
    },
  },

  // ---------------------------------------------------------- screen 6
  s6: {
    en: {
      madeBy: 'Made by',
      madeByLines: ['[Name], Miint', 'NETS2000 Web Media', 'Curtin University, 2026'],
      sources: 'Sources',
      sourcesNote: 'All sources are readable in full at the links below. Statistics carry the date they were retrieved.',
      fonts: 'Set in Space Grotesk and JetBrains Mono, both under the SIL Open Font License.',
      thisPage: 'This page',
      licence:
        'The text and design of this page are released under a Creative Commons Attribution-NonCommercial 4.0 International licence; the code is MIT-licensed. You may copy, adapt and redistribute this page for non-commercial purposes, with attribution.',
      aiDisclosure:
        'Generative AI disclosure: the code of this page was written by Claude Code (Anthropic) from a specification I wrote. The argument, the structure, every line of text and the choice of evidence are mine. No generative image, audio or video tools were used; all visuals are drawn in CSS, SVG and canvas.',
      repo: 'Source and full commit history',
      ogLabel: 'This is what this page looks like to a machine.',
      indexStatus: 'Checked in Google on 16 August 2026: no results. This page is not in the index.',
    },
    zh: {
      madeBy: '作者',
      madeByLines: ['[姓名], Miint', 'NETS2000 Web Media', '科廷大学，2026'],
      sources: '来源',
      sourcesNote: '以下来源均可通过链接读到全文。所有统计数字都标注了抓取日期。',
      fonts: '正文使用 Space Grotesk 与 JetBrains Mono，均遵循 SIL 开放字体许可。',
      thisPage: '关于这个页面',
      licence:
        '本页面的文字与设计以知识共享 署名—非商业性使用 4.0 国际许可协议发布，代码以 MIT 许可发布。你可以出于非商业目的复制、改编、再分发本页面，只需署名。',
      aiDisclosure:
        '生成式 AI 使用声明：本页面的代码由 Claude Code (Anthropic) 依据我撰写的规格生成。论点、结构、每一句文字以及证据的取舍由我决定。未使用任何生成式图像、音频或视频工具；所有视觉元素均由 CSS、SVG 和 canvas 绘制。',
      repo: '源码与完整提交记录',
      ogLabel: '这是这个页面在机器眼里的样子。',
      indexStatus: '于 2026 年 8 月 16 日在 Google 检索本页：无结果。本页未被收录。',
    },
  },

  // ------------------------------------------------------------ references
  // Verbatim APA 7th. Do not reformat, do not translate.
  references: [
    'Abidin, C. (2021). Mapping internet celebrity on TikTok: Exploring attention economies and visibility labours. Cultural Science Journal, 12(1), 77–103. https://doi.org/10.5334/csci.140',
    'Bishop, S. (2025). Influencer creep: How artists strategically navigate the platformisation of art worlds. New Media & Society, 27(4), 2109–2126. https://doi.org/10.1177/14614448231206090',
    'Chapekis, A., & Lieb, A. (2025, July 22). Google users are less likely to click on links when an AI summary appears in the results. Pew Research Center. https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/',
    'Chesterman, S. (2025). Good models borrow, great models steal: Intellectual property rights and generative AI. Policy and Society, 44(1), 23–37. https://doi.org/10.1093/polsoc/puae006',
    'Dolezal, J., Alam, S., Graham, M., & Bohacek, M. (2026). The impact of AI-generated text on the internet (arXiv:2604.26965) [Preprint]. arXiv. https://arxiv.org/abs/2604.26965',
    'Echauri, G. (2025). Infinite media: The contemporary infinite paradigm in media. Convergence, 31(2), 447–461. https://doi.org/10.1177/13548565231208135',
    'Jenkins, H. (2004). The cultural logic of media convergence. International Journal of Cultural Studies, 7(1), 33–43. https://doi.org/10.1177/1367877904040603',
    'Lobato, R. (2018, May 29). On discoverability. Flow, 24(8). https://www.flowjournal.org/2018/05/on-discoverability/',
    'Manovich, L. (2009). The practice of everyday (media) life: From mass consumption to mass cultural production? Critical Inquiry, 35(2), 319–331. https://doi.org/10.1086/596645',
    'McKelvey, F., & Hunt, R. (2019). Discoverability: Toward a definition of content discovery through platforms. Social Media + Society, 5(1). https://doi.org/10.1177/2056305118819188',
    'Srdarov, S., & Leaver, T. (2024). Generative AI glitches. M/C Journal, 27(6). https://doi.org/10.5204/mcj.3123',
    'Tomé, J. (2025, August 29). The crawl-to-click gap: Cloudflare data on AI bots, training, and referrals. The Cloudflare Blog. https://blog.cloudflare.com/crawlers-click-ai-bots-training/',
  ],
};
