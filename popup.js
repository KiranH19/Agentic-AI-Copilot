(function () {
  const CARD_ID = "multi-agent-cybersecurity-copilot-card";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function closeExistingCard() {
    const existing = document.getElementById(CARD_ID);

    if (!existing) {
      return;
    }

    existing.classList.add("copilot-card-exit");
    window.setTimeout(() => existing.remove(), 150);
  }

  function render(result) {
    closeExistingCard();

    const card = document.createElement("section");
    card.id = CARD_ID;
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-live", "polite");
    card.setAttribute("aria-label", "Multi-Agent Cybersecurity Copilot result");

    const riskClass = `copilot-${String(result.riskLevel).toLowerCase()}`;

    card.innerHTML = `
      <div class="copilot-card-scroll">
        <header class="copilot-header">
          <div>
            <h2 class="copilot-title">Cybersecurity Copilot</h2>
            <p class="copilot-subtitle">Simulated local multi-agent verification</p>
          </div>
          <button class="copilot-close" type="button" aria-label="Close">×</button>
        </header>

        <section class="copilot-block">
          <span class="copilot-label">Input scanned</span>
          <div class="copilot-input">${escapeHtml(result.input)}</div>
        </section>

        <section class="copilot-block copilot-metrics" aria-label="Scan decision">
          <div class="copilot-metric">
            <span>Risk Level</span>
            <strong class="${riskClass}">${escapeHtml(result.riskLevel)}</strong>
          </div>
          <div class="copilot-metric">
            <span>Confidence</span>
            <strong>${escapeHtml(result.confidence)}%</strong>
          </div>
          <div class="copilot-metric">
            <span>Action</span>
            <strong>${escapeHtml(result.action)}</strong>
          </div>
        </section>

        <section class="copilot-block">
          <span class="copilot-label">Reasons</span>
          <ul class="copilot-reasons">
            ${result.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
          </ul>
        </section>

        <section class="copilot-block">
          <span class="copilot-label">Agent Trace</span>
          <div class="copilot-trace">
            ${result.trace
              .map(
                (step, index) => `
                  <article class="copilot-agent" style="animation-delay: ${index * 35}ms">
                    <b>${index + 1}. ${escapeHtml(step.agent)}</b>
                    <p>${escapeHtml(step.summary)}</p>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>

        <p class="copilot-footer">
          Demo only: this prototype uses local rules and does not make real AI, antivirus, malware-removal, or threat-intelligence claims.
        </p>
      </div>
    `;

    document.documentElement.append(card);
    card.querySelector(".copilot-close").addEventListener("click", closeExistingCard);
  }

  window.MultiAgentCybersecurityCopilotUI = { render };
})();
