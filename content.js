(function () {
if (window.MultiAgentCybersecurityCopilot?.initialized) {
  return;
}

const CYBER_COPILOT_RULES = {
  fileExtensions: [".exe", ".bat", ".cmd", ".apk", ".scr", ".zip"],
  keywords: ["urgent", "verify now", "account blocked", "claim prize", "free gift", "password reset"],
  domains: [".xyz", ".top", ".ru", ".tk"],
  brands: ["sbi", "hdfc", "icici", "paypal", "google", "microsoft"],
  shortLinks: ["bit.ly", "tinyurl", "t.co"]
};

function asUrl(value) {
  try {
    return new URL(value);
  } catch (_error) {
    try {
      return new URL(`https://${value}`);
    } catch (_fallbackError) {
      return null;
    }
  }
}

function addPattern(patterns, type, label, points, detail) {
  patterns.push({ type, label, points, detail });
}

function inputAgent(data) {
  const rawInput = String(data.input || "").trim();
  const url = asUrl(rawInput);
  const normalizedInput = rawInput.replace(/\s+/g, " ");

  return {
    rawInput,
    normalizedInput,
    source: data.source || "selection",
    scannedAt: data.scannedAt || new Date().toISOString(),
    inputType: url ? "url" : "text",
    urlParts: url
      ? {
          hostname: url.hostname.toLowerCase(),
          pathname: url.pathname.toLowerCase(),
          href: url.href.toLowerCase()
        }
      : null,
    trace: [
      {
        agent: "Input Agent",
        summary: `Captured ${url ? "URL" : "selected text"} locally and normalized it for rule checks.`
      }
    ]
  };
}

function patternAgent(data) {
  const patterns = [];
  const input = data.normalizedInput.toLowerCase();
  const host = data.urlParts?.hostname || "";
  const href = data.urlParts?.href || input;
  const path = data.urlParts?.pathname || input;

  CYBER_COPILOT_RULES.fileExtensions.forEach((extension) => {
    if (path.includes(extension)) {
      addPattern(patterns, "file", `Suspicious file extension: ${extension}`, 20, "Executable or archive delivery can be risky.");
    }
  });

  CYBER_COPILOT_RULES.keywords.forEach((keyword) => {
    if (input.includes(keyword)) {
      addPattern(patterns, "keyword", `Pressure keyword: "${keyword}"`, 15, "Urgent or reward-focused language is common in phishing prompts.");
    }
  });

  CYBER_COPILOT_RULES.domains.forEach((domain) => {
    if (host.endsWith(domain) || input.includes(domain)) {
      addPattern(patterns, "domain", `Risky top-level domain: ${domain}`, 15, "This domain pattern appears in many disposable campaigns.");
    }
  });

  CYBER_COPILOT_RULES.shortLinks.forEach((shortLink) => {
    if (host === shortLink || host.endsWith(`.${shortLink}`) || input.includes(shortLink)) {
      addPattern(patterns, "short-link", `Short link service detected: ${shortLink}`, 25, "Short links hide the final destination.");
    }
  });

  CYBER_COPILOT_RULES.brands.forEach((brand) => {
    const mentionsBrand = input.includes(brand);
    const hostContainsBrand = host.includes(brand);
    const isOfficialHost = host === `${brand}.com` || host.endsWith(`.${brand}.com`);

    if (mentionsBrand && (!host || !isOfficialHost || !hostContainsBrand)) {
      addPattern(patterns, "brand", `Possible brand spoofing signal: ${brand}`, 20, "Brand names outside an expected official domain can indicate impersonation.");
    }
  });

  const hyphenCount = (host.match(/-/g) || []).length;
  const numberCount = (href.match(/\d/g) || []).length;

  if (hyphenCount >= 3) {
    addPattern(patterns, "url-shape", "Too many hyphens in URL host", 10, "Highly segmented hosts are harder to visually verify.");
  }

  if (numberCount >= 8) {
    addPattern(patterns, "url-shape", "Excessive numbers in URL", 10, "Long numeric runs often appear in tracking or generated phishing links.");
  }

  if (href.length >= 90) {
    addPattern(patterns, "url-shape", "Very long URL length", 10, "Long URLs can conceal destination or payload details.");
  }

  return {
    ...data,
    patterns,
    trace: [
      ...data.trace,
      {
        agent: "Pattern Analysis Agent",
        summary: `Matched ${patterns.length} local rule${patterns.length === 1 ? "" : "s"} across keywords, domains, files, brands, and URL shape.`
      }
    ]
  };
}

function reasoningAgent(patternData) {
  const score = patternData.patterns.reduce((total, pattern) => total + pattern.points, 0);
  const reasons = patternData.patterns
    .sort((a, b) => b.points - a.points)
    .slice(0, 5)
    .map((pattern) => `${pattern.label}. ${pattern.detail}`);

  const baselineReasons = [
    "No external API, backend, or AI model was used; this is a local rule-based simulation.",
    "No confirmed malware verdict is claimed; the score only reflects demo heuristics.",
    "Final decision is based on accumulated pattern weight, not live threat intelligence."
  ];

  return {
    ...patternData,
    score,
    reasons: [...reasons, ...baselineReasons].slice(0, 5),
    trace: [
      ...patternData.trace,
      {
        agent: "Reasoning Agent",
        summary: `Converted rule matches into a weighted score of ${Math.min(score, 100)} out of 100.`
      }
    ]
  };
}

function decisionAgent(scoreData) {
  let riskLevel = "Low";
  let action = "ALLOW";

  if (scoreData.score >= 61) {
    riskLevel = "High";
    action = "BLOCK";
  } else if (scoreData.score >= 31) {
    riskLevel = "Medium";
    action = "WARN";
  }

  return {
    ...scoreData,
    decision: {
      riskLevel,
      confidence: Math.min(100, Math.max(5, scoreData.score)),
      action
    },
    trace: [
      ...scoreData.trace,
      {
        agent: "Decision Agent",
        summary: `Mapped score ${scoreData.score} to ${riskLevel} risk with recommended action ${action}.`
      }
    ]
  };
}

function responseAgent(output) {
  return {
    input: output.normalizedInput,
    source: output.source,
    inputType: output.inputType,
    riskLevel: output.decision.riskLevel,
    confidence: output.decision.confidence,
    action: output.decision.action,
    score: output.score,
    reasons: output.reasons,
    trace: [
      ...output.trace,
      {
        agent: "Response Agent",
        summary: "Prepared the page overlay with input, risk, confidence, reasons, and the simulated agent trace."
      }
    ],
    scannedAt: output.scannedAt
  };
}

function runLocalCyberScan(payload) {
  const input = inputAgent(payload);
  const patterns = patternAgent(input);
  const reasoning = reasoningAgent(patterns);
  const decision = decisionAgent(reasoning);
  return responseAgent(decision);
}

window.MultiAgentCybersecurityCopilot = {
  initialized: true,
  inputAgent,
  patternAgent,
  reasoningAgent,
  decisionAgent,
  responseAgent,
  runLocalCyberScan
};

window.inputAgent = inputAgent;
window.patternAgent = patternAgent;
window.reasoningAgent = reasoningAgent;
window.decisionAgent = decisionAgent;
window.responseAgent = responseAgent;

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "MULTI_AGENT_CYBER_SCAN") {
    return;
  }

  const result = runLocalCyberScan(message.payload);
  window.MultiAgentCybersecurityCopilotUI?.render(result);
});
})();
