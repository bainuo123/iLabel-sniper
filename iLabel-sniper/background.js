console.log('[Background] Service Worker 启动');

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log('[Background] 标签页更新:', tabId, changeInfo.status, tab.url);
    
    // 检查是否是 Mission 页面
    if (tab.url && tab.url.includes('ilabel.weixin.qq.com/mission/')) {
        console.log('[Background] ✅ 检测到 Mission 页面，准备注入脚本');
        
        // 延迟注入，确保页面已加载
        setTimeout(() => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error('[Background] 注入失败:', chrome.runtime.lastError);
                } else {
                    console.log('[Background] ✅ 脚本注入成功');
                }
            });
        }, 500);
    }
});

// 监听标签页激活
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        console.log('[Background] 标签页激活:', tab.url);
        
        if (tab.url && tab.url.includes('ilabel.weixin.qq.com/mission/')) {
            console.log('[Background] ✅ 激活的是 Mission 页面，准备注入脚本');
            
            setTimeout(() => {
                chrome.scripting.executeScript({
                    target: { tabId: activeInfo.tabId },
                    files: ['content.js']
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('[Background] 注入失败:', chrome.runtime.lastError);
                    } else {
                        console.log('[Background] ✅ 脚本注入成功');
                    }
                });
            }, 500);
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Background] 收到消息:', message, '来自:', sender.tab?.url);
    sendResponse({ received: true });
});
