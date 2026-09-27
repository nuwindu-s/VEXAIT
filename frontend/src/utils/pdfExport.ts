// ============================================================================
// VEXA IT (www.vexait.xyz) - PDF Generator & Print Engine
// ============================================================================

/**
 * Downloads a high-resolution, pixel-perfect A4 PDF directly using html2pdf.js
 */
export async function downloadDocumentAsPdf(
  elementId: string,
  filename: string,
  onProgress?: (loading: boolean) => void
): Promise<void> {
  if (onProgress) onProgress(true);

  try {
    // Dynamically load html2pdf.js CDN if not present
    if (!(window as any).html2pdf) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load PDF generation library'));
        document.head.appendChild(script);
      });
    }

    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Element #${elementId} not found`);

    const opt = {
      margin: [6, 8, 6, 8],
      filename: `${filename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    await (window as any).html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  } finally {
    if (onProgress) onProgress(false);
  }
}

/**
 * Prints the document in an isolated sandbox iframe to prevent modal or page cutoffs
 */
export function printDocumentIsolated(elementId: string, title: string): void {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
  if (!frameDoc) {
    window.print();
    return;
  }

  // Extract all stylesheets and font links
  let stylesHtml = '';
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    stylesHtml += node.outerHTML;
  });

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        ${stylesHtml}
        <style>
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          }
          #printable-document {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        <div id="printable-document">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  frameDoc.close();

  // Wait for images to load before printing
  setTimeout(() => {
    try {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
    } catch (e) {
      console.error('Iframe print error, falling back to window.print():', e);
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(printFrame)) {
          document.body.removeChild(printFrame);
        }
      }, 1500);
    }
  }, 400);
}
