# ECAN Medical CMS 管理指南

## 访问后台
访问: `https://ecanmedical.com/admin/`

## 首次登录设置（Netlify Identity）

### 方法1：如果已配置Netlify Identity
1. 访问 `/admin/` 后点击 "Login with Netlify Identity"
2. 使用管理员账号登录
3. 登录后即可管理内容

### 方法2：本地开发模式
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 启动本地开发服务器
netlify dev
# 访问 http://localhost:1313/admin/
```

## 功能说明

### 1. 网站基础设置
- 公司名称、邮箱、电话、地址
- 首页Hero区域（标题、副标题、按钮文字）
- 统计数据（数字+标签）
- 特性介绍（图标+标题+描述）
- 关于我们（标题、内容段落、认证资质）
- 联系方式
- 页脚内容

### 2. 产品管理
- 产品代码、名称、描述
- 产品分类
- 产品图标（emoji）
- 产品图片上传
- 启用/禁用开关
- 详细信息：
  - 产品描述
  - 功能特点列表
  - 规格参数表

## 保存发布
点击 "Publish" 按钮后，内容会自动：
1. 提交到GitHub仓库
2. 触发Netlify自动构建
3. 约1-2分钟后生效到网站

## 客户权限管理
如需给客户员工开通账号：
1. 登录Netlify → 进入Identity
2. Invite users → 输入客户邮箱
3. 客户收到邀请后设置密码即可登录