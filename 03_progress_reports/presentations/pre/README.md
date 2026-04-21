# 课题进度汇报幻灯片

基于 React + Material UI 创建的网页版幻灯片，可部署在 GitHub Pages 上用于课题组汇报。

## 特性

- 简约浅色主题，Material Design 风格
- 支持键盘导航（左右箭头、空格、PageUp/PageDown）
- 响应式设计，支持移动端
- 16:9 标准幻灯片比例
- 易于自定义内容

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署到 GitHub Pages

1. 修改 `package.json` 中的 `homepage` 字段，将 `yourusername` 替换为你的 GitHub 用户名：
   ```json
   "homepage": "https://yourusername.github.io/research-slides"
   ```

2. 修改 `vite.config.js` 中的 `base` 字段为你的仓库名称：
   ```javascript
   base: '/research-slides/'
   ```

3. 将代码推送到 GitHub 仓库。

4. 运行部署命令：
   ```bash
   npm run deploy
   ```

5. 在 GitHub 仓库设置中，将 GitHub Pages 的 source 设置为 `gh-pages` 分支。

## 自定义内容

在 `src/slides/` 目录下修改各幻灯片组件的内容：

- `TitleSlide.jsx` - 标题页
- `BackgroundSlide.jsx` - 研究背景
- `ProgressSlide.jsx` - 工作进展
- `ResultsSlide.jsx` - 实验结果
- `NextStepsSlide.jsx` - 下一步计划
- `SummarySlide.jsx` - 总结
- `QASlide.jsx` - Q&A 页

你也可以在 `src/slides/index.js` 中添加或删除幻灯片。
