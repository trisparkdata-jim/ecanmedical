/**
 * ECAN Medical - Cloud Configuration
 * 
 * 客户只需要在这里配置一次，然后所有页面自动同步！
 * 
 * 如何获取配置：
 * 1. 访问 https://jsonbin.io 注册免费账号
 * 2. 创建一个 Private Bin
 * 3. 复制 Bin ID 填入下方
 * 4. 在 "Master Key" 中复制 API Key 填入下方
 */

const CLOUD_CONFIG = {
    // ===== 在这里配置 =====
    apiKey: '',      // 你的 API Key
    binId: ''        // 你的 Bin ID
    
    // ===== 不要修改下方 =====
};

// 检查是否已配置云端
const isCloudConfigured = () => {
    return CLOUD_CONFIG.apiKey && CLOUD_CONFIG.binId;
};

// 从云端加载数据
async function loadFromCloud() {
    if (!isCloudConfigured()) return null;
    
    try {
        const response = await fetch(
            `https://api.jsonbin.io/v3/b/${CLOUD_CONFIG.binId}/latest`,
            {
                headers: {
                    'X-Access-Key': CLOUD_CONFIG.apiKey
                }
            }
        );
        
        if (response.ok) {
            const data = await response.json();
            return data.record;
        }
    } catch (error) {
        console.error('Cloud load error:', error);
    }
    return null;
}

// 导出供 CMS 使用
window.CLOUD_CONFIG = CLOUD_CONFIG;
window.isCloudConfigured = isCloudConfigured;
window.loadFromCloud = loadFromCloud;