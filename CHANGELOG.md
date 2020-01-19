# 0.1.0 (2020-01-19)


### Bug Fixes

* cdn 引入 react ([8a76ac8](https://github.com/xiaxiazheng/reactblog/commit/8a76ac84d5f7c9668da5a59074e8d80bcd1fbb25))
* require 出了问题，改用 import 吧 ([07b2f69](https://github.com/xiaxiazheng/reactblog/commit/07b2f69501777acf5f146982a4a2c3e6c2a3a69d))
* require() 中不能用 @ ([0f26f80](https://github.com/xiaxiazheng/reactblog/commit/0f26f80501303e68ad91f96448e2003e161cf0c9))
* 修复了在点开了三级树节点的情况下修改它的名字，treecont 的标题没有变化的问题 ([4f1a969](https://github.com/xiaxiazheng/reactblog/commit/4f1a9695ea0024a515b52e216481e6f99e559b35))
* 修复了日志不能分享给别人的问题，会报错 edittype 不存在。修改为在 showLog 的时候自己获取数据判断类型，并且合并了两种日志的 show ([44adebe](https://github.com/xiaxiazheng/reactblog/commit/44adebe5ff3acf1db921fce15995a3548c6c6160))
* 修复导航栏搜索框样式问题，修改逻辑：每次重新 focus 都要重新发请求 ([a7d3390](https://github.com/xiaxiazheng/reactblog/commit/a7d339049c4f68c2ab5f5258c579dbd9bec73282))
* 修复日志编辑的时候标题没有跟随主题变化的问题 ([b43bf2e](https://github.com/xiaxiazheng/reactblog/commit/b43bf2ea8ddedd1afd671757a077025f1b061b89))
* 修复点击过多个 tab 的时候，再次切换 tab 结果所有 tab 都会初始化发一遍请求的 bug ([614e404](https://github.com/xiaxiazheng/reactblog/commit/614e40473e7d555ce28d786f735fd5bf482a3a51))
* 修复知识树里的图片点开没有名字的问题 ([b3e9d9d](https://github.com/xiaxiazheng/reactblog/commit/b3e9d9dbdc492ece03314348ea97ac7fc10b4dd0))
* 修复默认展开的 bug，修复日志标题样式 ([6003ffe](https://github.com/xiaxiazheng/reactblog/commit/6003ffe1ed852a7311049cf61dde6b2f86c4728a))
* 修改成功删除节点之后的路由和树展开逻辑，新增仅剩一个节点则无法删除！数据库和后台设计问题，会出错的 ([520c910](https://github.com/xiaxiazheng/reactblog/commit/520c91095ed34f56f8e2de3d5a6fc754968abeff))
* 修改编辑树内容的 loading 方式，原先那种会默认回到头部，改成了遮罩层loading的方式；修复了树的路由问题 ([c38abb4](https://github.com/xiaxiazheng/reactblog/commit/c38abb42078e9db06634b571c7835d7f5adf8f9b))
* 完善皮肤切换 ([a9a967b](https://github.com/xiaxiazheng/reactblog/commit/a9a967b54ea8241bf693326562bfb27515e7a42d))
* 忘了改端口 ([0576968](https://github.com/xiaxiazheng/reactblog/commit/0576968a0efaa866179010784376161b3d31c13d))
* 打包不支持scss文件里的data-url ([ad73309](https://github.com/xiaxiazheng/reactblog/commit/ad733093fae683e29f9644a285becacf57193f7f))
* 改 html 属性 ([2426b29](https://github.com/xiaxiazheng/reactblog/commit/2426b29fc9ec0cedf0ef2a915013b6dd7bb062ca))
* 漏了个 icon ([3c99874](https://github.com/xiaxiazheng/reactblog/commit/3c99874612dd5ca9cb3f0afdcf4d4ea322a4812e))
* 解决 hooks 下使用 addEventListener 触发执行保存函数时，里面的字段会是初始值的 bug ([238abb9](https://github.com/xiaxiazheng/reactblog/commit/238abb9b38eadb7fa590e8718a8d009ec5d16c6c))


### Features

* 优化打包体积，砍了ant-design的全量icons引入，从cdn引入react和react-dom ([e42807b](https://github.com/xiaxiazheng/reactblog/commit/e42807b6866fedcd4468dd0937d2e6ad56d992d7))
* 使用 css 变量的方式替换之前的每个组件切换类覆盖样式的方式实现主题切换，以后就不需要写两套样式切换颜色了 ([e6b559d](https://github.com/xiaxiazheng/reactblog/commit/e6b559d2b8dd53dc2529f9124b9edbf4f4a945bf))
* 保存上一次选择的主题到 localStorage ([06b2c34](https://github.com/xiaxiazheng/reactblog/commit/06b2c344960d4bc5099ee09f44e2c43cb9ee960e))
* 修改上传图片接口 ([4bf4cca](https://github.com/xiaxiazheng/reactblog/commit/4bf4cca0057c975d19bee36d7fca4cd424578198))
* 修改后台接口为5180 ([b254c7c](https://github.com/xiaxiazheng/reactblog/commit/b254c7c0d85f60b371bd9ef8ed8228952bbf5285))
* 前端访问接口地址改为 https ([39545ec](https://github.com/xiaxiazheng/reactblog/commit/39545ec18c8a8296a2790ee32a0850b39a7d57ea))
* 去掉了首页的轮播图，改成了一张背景图，默认只显示第一张 ([f015369](https://github.com/xiaxiazheng/reactblog/commit/f01536967c9672f5d4ab2de6f53e18925c7282de))
* 尝试封装进一步封装 axios 并添加拦截器 ([acdee37](https://github.com/xiaxiazheng/reactblog/commit/acdee3797a3b5ac9036d64baea3baffd2b6cb78e))
* 引入 markdown 编辑器 ([1b6d6a4](https://github.com/xiaxiazheng/reactblog/commit/1b6d6a430679bc93f978768a48d722bad3db05bb))
* 支持日志切换 tab 时保存页面信息 ([2b5b0e1](https://github.com/xiaxiazheng/reactblog/commit/2b5b0e1a4c49f4f2f416b483bb8cbee527aa99a9))
* 新增 axios 拦截器，打算做超时重连，还没搞定 ([3616ee0](https://github.com/xiaxiazheng/reactblog/commit/3616ee0d1f6558ff71b65521518c0cda2eb501c5))
* 新增图片懒加载，有待优化 ([dc191f6](https://github.com/xiaxiazheng/reactblog/commit/dc191f6e5e1051347e67d0196c4ba80119841f56))
* 新增控制台顶部显示跟老猪在一起的时间 ([64c7f2d](https://github.com/xiaxiazheng/reactblog/commit/64c7f2da1ed24a3b7ed50cc6d13af27ceda51759))
* 新增日志空列表提示 ([3276b4f](https://github.com/xiaxiazheng/reactblog/commit/3276b4fcd739c57e6f1e2da786fd7958993d7ebd))
* 新增比较好看的 markdown 样式 ([d9132cc](https://github.com/xiaxiazheng/reactblog/commit/d9132ccbbd33812101358f91969cf90fe6bde3a0))
* 日志新建成功直接跳转 ([db9a637](https://github.com/xiaxiazheng/reactblog/commit/db9a637f44c3f5b0070b096e57368894db571b73))
* 更换 cdn 地址，改点小问题 ([3e52e1a](https://github.com/xiaxiazheng/reactblog/commit/3e52e1ae50b39c244b3780fed83df57e7265874d))
* 添加模块热替换HMR的功能 ([d3b5b9c](https://github.com/xiaxiazheng/reactblog/commit/d3b5b9c5b158b1baeb96816d0fc91ec9562420f3))
* 给树内容编辑添加了 loading ([098855f](https://github.com/xiaxiazheng/reactblog/commit/098855f8d51409062ba85511d67e268b1951d12d))
* 转换思路，改用将 svg 转成了 dataUrl ([0c3b334](https://github.com/xiaxiazheng/reactblog/commit/0c3b334bf66e7de9aa70b0c51017ce44a03895fb))
* 配置@别名，并修改过长的../ ([22d7878](https://github.com/xiaxiazheng/reactblog/commit/22d78783590b6dd31a7275fe8e616ff6c1a602bf))



