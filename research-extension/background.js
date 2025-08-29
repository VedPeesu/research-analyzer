chrome.runtime.onInstalled.addListener(() => {
    console.log('Research Assistant extension installed');
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openSidePanel') {
        chrome.sidePanel.open({ windowId: sender.tab.windowId });
    }
});