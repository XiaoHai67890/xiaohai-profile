# XiaoHai 个人网站

这是一个轻量级静态个人网站雏形，内容来自现有简历素材，适合先快速发布，再逐步升级成博客、作品集或 Next.js 版本。

## 个人网站怎么做

1. 明确定位：一句话说明你是谁、解决什么问题、适合什么合作场景。
2. 整理内容：从简历里抽出个人简介、核心能力、经历、代表项目、写作影响力、联系方式。
3. 设计结构：首页首屏展示身份和关键成果，下面依次放经历、项目、写作、联系。
4. 先做静态版：HTML + CSS + 少量 JavaScript 就能上线，加载快、维护成本低。
5. 再考虑升级：需要博客、MDX、数据接口或多页面时，再迁移到 Astro、Next.js 或 Nuxt。
6. 发布部署：可以上传到 GitHub Pages、Vercel、Netlify 或 Cloudflare Pages，再绑定个人域名。

## 文件结构

```text
XiaoHai/
  index.html
  styles.css
  script.js
  assets/
    avatar.jpg
    XiaoHai-ZH.pdf
    XiaoHai-EN.pdf
```

## 本地打开

直接双击 `index.html`，或在浏览器打开：

```text
/Users/Zhuanz/Desktop/XiaoHai/index.html
```

## 后续可以继续做

- 接入真实项目链接和文章链接
- 添加博客列表或 Paragraph 文章同步
- 增加英文默认版本和 SEO 结构化数据
- 发布到 GitHub Pages 并绑定域名
