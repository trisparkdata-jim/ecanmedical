/**
 * ECAN Medical CMS - 云端同步版
 * 数据存储在 JSONBin.io，无需手动部署
 */

const CMS = {
    dataPath: 'data/',
    
    // 检查是否配置了云端（使用 config.js 中的配置）
    isCloudConfigured() {
        return window.isCloudConfigured ? window.isCloudConfigured() : false;
    },
    
    // 获取云端配置
    getCloudConfig() {
        return window.CLOUD_CONFIG || { apiKey: '', binId: '' };
    },
    
    // 从云端加载数据
    async loadFromCloud() {
        if (!this.isCloudConfigured()) return null;
        
        try {
            const config = this.getCloudConfig();
            const response = await fetch(
                `https://api.jsonbin.io/v3/b/${config.binId}/latest`,
                {
                    headers: {
                        'X-Access-Key': config.apiKey
                    }
                }
            );
            const data = await response.json();
            return data.record;
        } catch (error) {
            console.error('云端加载失败:', error);
            return null;
        }
    },
    
    // 加载JSON数据（本地备用）
    async loadData(filename) {
        try {
            const response = await fetch(this.dataPath + filename);
            return await response.json();
        } catch (error) {
            console.error('加载本地数据失败:', error);
            return null;
        }
    },
    
    // 兼容旧版：保存到JSON文件（导出下载）
    async saveDataLocal(filename, data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    // 渲染首页
    async renderHome() {
        // 优先尝试从云端加载，否则用本地数据
        let siteData, productsData;
        
        if (this.isCloudConfigured()) {
            const cloudData = await this.loadFromCloud();
            if (cloudData) {
                siteData = cloudData.site;
                productsData = cloudData.products;
            }
        }
        
        // 回退到本地数据
        if (!siteData) siteData = await this.loadData('site.json');
        if (!productsData) productsData = await this.loadData('products.json');
        
        if (!siteData || !productsData) return;
        
        // 渲染导航
        document.getElementById('site-logo').textContent = siteData.site.name;
        
        // 渲染Hero
        document.getElementById('hero-title').textContent = siteData.hero.title;
        document.getElementById('hero-subtitle').textContent = siteData.hero.subtitle;
        document.getElementById('hero-cta').textContent = siteData.hero.ctaText;
        document.getElementById('hero-secondary').textContent = siteData.hero.secondaryText;
        
        // 渲染统计数据
        const statsGrid = document.getElementById('stats-grid');
        if (statsGrid && siteData.stats) {
            statsGrid.innerHTML = siteData.stats.map(stat => `
                <div class="stat-item">
                    <h3>${stat.number}</h3>
                    <p>${stat.label}</p>
                </div>
            `).join('');
        }
        
        // 渲染产品
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid && productsData) {
            const enabledProducts = productsData.products.filter(p => p.enabled);
            productsGrid.innerHTML = enabledProducts.map(product => {
                let imageHtml = '';
                if (product.image && product.image.startsWith('data:')) {
                    imageHtml = `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">`;
                } else if (product.image) {
                    imageHtml = `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;">`;
                } else {
                    imageHtml = product.icon;
                }
                
                return `
                <div class="product-card">
                    <div class="product-img">${imageHtml}</div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.shortDesc}</p>
                        <div class="product-btns">
                            <a href="#contact" class="btn-sm btn-outline-primary">Orçamento</a>
                            <a href="produto-${product.id}.html" class="btn-sm btn-outline-primary">Detalhes</a>
                        </div>
                    </div>
                </div>
            `}).join('');
        }
        
        // 渲染Features
        const featuresGrid = document.getElementById('features-grid');
        if (featuresGrid && siteData.features) {
            featuresGrid.innerHTML = siteData.features.map(feature => `
                <div class="feature-card">
                    <div class="feature-icon">${feature.icon}</div>
                    <h3>${feature.title}</h3>
                    <p>${feature.desc}</p>
                </div>
            `).join('');
        }
        
        // 渲染About
        const aboutTitle = document.getElementById('about-title');
        if (aboutTitle && siteData.about) {
            aboutTitle.textContent = siteData.about.title;
            const aboutContent = document.getElementById('about-content');
            if (aboutContent && siteData.about.content) {
                aboutContent.innerHTML = siteData.about.content.map(p => `<p>${p}</p>`).join('');
            }
        }
        
        // 渲染Certifications
        const certifications = document.getElementById('certifications');
        if (certifications && siteData.about && siteData.about.certifications) {
            certifications.innerHTML = siteData.about.certifications
                .map(cert => `<span class="cert">${cert}</span>`).join('');
        }
        
        // 渲染Footer
        const footerAbout = document.getElementById('footer-about');
        if (footerAbout && siteData.footer) {
            footerAbout.textContent = siteData.footer.about;
        }
        
        // 渲染Contact
        const contactTitle = document.getElementById('contact-title');
        if (contactTitle && siteData.contact) {
            contactTitle.textContent = siteData.contact.title;
            const contactSubtitle = document.getElementById('contact-subtitle');
            if (contactSubtitle) contactSubtitle.textContent = siteData.contact.subtitle;
        }
    },
    
    // 渲染产品详情页
    async renderProductPage(productId) {
        let productsData;
        
        if (this.isCloudConfigured()) {
            const cloudData = await this.loadFromCloud();
            if (cloudData && cloudData.products) {
                productsData = cloudData;
            }
        }
        
        if (!productsData) productsData = await this.loadData('products.json');
        
        const product = productsData.products.find(p => p.id === productId);
        
        if (!product) {
            document.body.innerHTML = '<h1>产品未找到</h1>';
            return;
        }
        
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-icon').textContent = product.icon;
        document.getElementById('product-desc').textContent = product.details.description;
        
        // 渲染特性
        document.getElementById('product-features').innerHTML = product.details.features
            .map(f => `<li>${f}</li>`).join('');
        
        // 渲染规格
        document.getElementById('product-specs').innerHTML = product.details.specs
            .map(spec => `
                <tr>
                    <td><strong>${spec.label}</strong></td>
                    <td>${spec.value}</td>
                </tr>
            `).join('');
    },
    
    // 初始化Google Analytics
    async initAnalytics() {
        let siteData;
        
        if (this.isCloudConfigured()) {
            const cloudData = await this.loadFromCloud();
            if (cloudData) siteData = cloudData.site;
        }
        
        if (!siteData) siteData = await this.loadData('site.json');
        if (!siteData || !siteData.analytics || !siteData.analytics.gaId) return;
        
        const gaId = siteData.analytics.gaId;
        
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
        document.head.appendChild(script1);
        
        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
        `;
        document.head.appendChild(script2);
    },
    
    trackFormSubmit(formType) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'lead',
                'event_label': formType,
                'value': 1
            });
        }
    }
};

// 导出供其他地方使用
window.CMS = CMS;