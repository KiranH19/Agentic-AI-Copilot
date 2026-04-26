const MENU_ID = "verify-with-multi-agent-cybersecurity-copilot";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: "Verify with Multi-Agent Cybersecurity Copilot",
      contexts: ["selection", "link"]
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID || !tab?.id) {
    return;
  }

  const input = (info.linkUrl || info.selectionText || "").trim();
  const source = info.linkUrl ? "link" : "selection";

  if (!input) {
    return;
  }

  try {
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ["popup.css"]
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js", "popup.js"]
    });

    await chrome.tabs.sendMessage(tab.id, {
      type: "MULTI_AGENT_CYBER_SCAN",
      payload: {
        input,
        source,
        scannedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.info("Multi-Agent Cybersecurity Copilot could not run on this page.", error);
  }
});
