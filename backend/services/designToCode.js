import Vibrant from "node-vibrant";

/**
 * Phase 2 feature: takes an uploaded design image and extracts
 * a starting palette + generates a basic HTML/CSS scaffold.
 * This is intentionally simple for the MVP — layout detection
 * (headers, cards, buttons) can be added later, possibly using
 * a vision-capable AI model to interpret the image structure.
 */
export async function analyzeDesignImage(imageBuffer) {
  const palette = await Vibrant.from(imageBuffer).getPalette();

  const colors = Object.entries(palette)
    .filter(([, swatch]) => swatch)
    .map(([name, swatch]) => ({
      name,
      hex: swatch.getHex(),
      textColor: swatch.getBodyTextColor(),
    }));

  const generatedCss = colors
    .map((c) => `  --color-${c.name.toLowerCase()}: ${c.hex};`)
    .join("\n");

  const starterHtml = `<!-- Auto-generated starting point. Adjust structure to match your design. -->
<div class="hero">
  <h1>Your Heading Here</h1>
  <p>Supporting text goes here.</p>
  <button class="cta">Call to Action</button>
</div>`;

  const starterCss = `:root {\n${generatedCss}\n}\n\n.hero {\n  background: var(--color-lightvibrant, #fff);\n  padding: 3rem;\n  text-align: center;\n}\n\n.cta {\n  background: var(--color-vibrant, #333);\n  color: white;\n  padding: 0.75rem 1.5rem;\n  border: none;\n  border-radius: 6px;\n}`;

  return { colors, starterHtml, starterCss };
}
