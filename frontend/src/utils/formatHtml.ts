/**
 * Utility to process and format HTML / Markdown for Case Studies & Descriptions
 */

export function convertMarkdownToHtml(text: string): string {
  if (!text) return '';

  let html = text.trim();

  // Convert headings
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mt-3 mb-1.5">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm sm:text-base font-bold text-slate-900 mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-base sm:text-lg font-bold text-slate-900 mt-5 mb-2.5">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-lg sm:text-xl font-extrabold text-slate-900 mt-6 mb-3">$1</h1>');

  // Convert bold and italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-blue-600 font-mono text-xs">$1</code>');

  // Convert blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-3.5 py-1 my-3 bg-blue-50/50 rounded-r-lg text-slate-700 italic">$1</blockquote>');

  // Convert bullet lists
  const lines = html.split('\n');
  const result: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        result.push('<ul class="list-disc list-inside space-y-1 my-2.5 text-slate-600">');
        inList = true;
      }
      result.push(`  <li>${line.substring(2)}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(lines[i]);
    }
  }
  if (inList) {
    result.push('</ul>');
  }

  html = result.join('\n');

  // Group text paragraphs separated by double newlines if not already wrapped in html block tags
  const blocks = html.split(/\n\s*\n/);
  html = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    const isTagBlock = /^<(h[1-6]|ul|ol|li|div|blockquote|p|table|pre)/i.test(trimmed);
    if (isTagBlock) {
      return trimmed;
    }
    return `<p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">${trimmed.replace(/\n/g, '<br/>')}</p>`;
  }).filter(Boolean).join('\n\n');

  return html;
}

export function formatCaseStudyHtml(rawContent?: string): string {
  if (!rawContent || !rawContent.trim()) return '';

  const trimmed = rawContent.trim();
  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(trimmed);

  if (hasHtmlTags) {
    // If it has basic HTML tags, return as HTML, but ensure line breaks between non-tagged sections work
    return trimmed;
  }

  // Fallback / Auto-convert markdown or plain text to formatted HTML
  return convertMarkdownToHtml(trimmed);
}
