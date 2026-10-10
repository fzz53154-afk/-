# 恬梨预览发布包

## 小程序自动打印版本

[下载完整小程序与云打印项目](https://raw.githubusercontent.com/fzz53154-afk/-/preview-download/tianli-miniprogram-cloud-print-20261010.zip)

已提供云开发订单、服务端价格和库存校验、打印任务、飞鹅云适配器以及顾客 / 门店订单页面。[配置说明](CLOUD-PRINTING.md)。当前采用提交自提订单后打印、到店付款；需要门店真实 AppID、云开发环境和联网打印机才能运行。网页预览不会下单或打印，尚未完成实物联调。

## 手机网页预览

[打开手机网页预览](https://htmlpreview.github.io/?https://raw.githubusercontent.com/fzz53154-afk/-/preview-download/tianli-mobile-preview-20261009.html)

新版 Logo 使用“面包 · 甜品”文字。首页新增 3 秒品牌开屏广告，可立即跳过或点击进入产品页；同一浏览器标签页会话只展示一次。

新版采用用户提供的恬梨 Logo，整体使用奶油白、可可棕和手作风格。电脑上显示居中的手机宽度，手机上铺满屏幕。保留海报轮播、产品、购物袋、会员充值入口、门店地址和到店自提信息确认。

`tianli-mobile-preview.html` 已内嵌 Logo、图片、样式与交互代码，下载后可在普通浏览器里打开。

`tianli-preview-20261008.zip` 是恬梨面包店网页预览的静态发布包。

下载并解压后，将包含 `index.html` 的整个文件夹上传至 Netlify Drop 或其他静态网站托管平台。

包含首页海报、轮播、产品展示与购物袋、自提信息确认、会员充值页面、门店地址及电话。会员充值与自提下单尚未接入真实后端，不会收款或创建订单。产品信息和照片为演示资料。
