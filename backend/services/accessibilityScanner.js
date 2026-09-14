import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// axe-core ships a prebuilt browser script we inject into the page
const axeSource = fs.readFileSync(
  path.join(__dirname, "../node_modules/axe-core/axe.min.js"),
  "utf8"
);

/**
 * Scans a live URL for accessibility issues using axe-core.
 * Returns a structured report: score, violations grouped by severity,
 * and human-readable explanations for each issue.
 */
export async function scanUrl(url) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Inject axe-core into the page and run it
    await page.evaluate(axeSource);
    const results = await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      return await axe.run(document, {
        runOnly: ["wcag2a", "wcag2aa", "best-practice"],
      });
    });

    // Take a screenshot for visual reference in the report
    const screenshot = await page.screenshot({ encoding: "base64", fullPage: false });

    return formatReport(results, screenshot, url);
  } finally {
    await browser.close();
  }
}

function formatReport(axeResults, screenshot, url) {
  const violations = axeResults.violations.map((v) => ({
    id: v.id,
    impact: v.impact, // 'minor' | 'moderate' | 'serious' | 'critical'
    description: v.description,
    help: v.help,
    helpUrl: v.helpUrl,
    whyItMatters: explainImpact(v.id, v.impact),
    nodesAffected: v.nodes.length,
    examples: v.nodes.slice(0, 3).map((n) => n.html),
  }));

  const severityCounts = violations.reduce((acc, v) => {
    acc[v.impact] = (acc[v.impact] || 0) + 1;
    return acc;
  }, {});

  // Simple scoring: start at 100, subtract weighted penalties
  const weights = { critical: 10, serious: 6, moderate: 3, minor: 1 };
  const penalty = violations.reduce(
    (sum, v) => sum + (weights[v.impact] || 1) * v.nodesAffected,
    0
  );
  const score = Math.max(0, 100 - penalty);

  return {
    url,
    scannedAt: new Date().toISOString(),
    score,
    totalIssues: violations.length,
    severityCounts,
    violations,
    passedChecks: axeResults.passes.length,
    screenshot: `data:image/png;base64,${screenshot}`,
  };
}

// Plain-English explanations so non-experts understand why each issue matters
function explainImpact(ruleId, impact) {
  const explanations = {
    "color-contrast":
      "People with low vision or color blindness may not be able to read this text.",
    "image-alt":
      "Screen reader users have no idea what this image shows or means.",
    label:
      "Screen reader users won't know what this form field is asking for.",
    "heading-order":
      "Screen reader users navigate by headings — skipping levels makes the page confusing to move through.",
    "link-name":
      "Screen reader users will hear 'link' with no indication of where it goes.",
  };
  return (
    explanations[ruleId] ||
    `This is a ${impact} issue that can make the page harder to use for people relying on assistive technology.`
  );
}
