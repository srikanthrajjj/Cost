// pdfjs-dist requires browser APIs (DOMMatrix) and cannot run during SSR.
// Load it only in the browser via dynamic import (bundled, not CDN).

export interface ExtractedFileContent {
  text: string;
  pages: number;
}

type PdfTextItem = {
  str?: string;
  transform?: number[];
  width?: number;
  hasEOL?: boolean;
};

export async function extractTextFromFile(
  file: File,
  opts?: { maxPages?: number },
): Promise<ExtractedFileContent> {
  if (typeof window === "undefined") {
    throw new Error("File processing is only available in the browser");
  }

  const fileType = file.type;

  // Normalize and check file type more robustly
  const normalizedType = fileType.toLowerCase();
  const isPDF =
    normalizedType === "application/pdf" ||
    normalizedType === "application/octet-stream" ||
    file.name.toLowerCase().endsWith(".pdf");

  console.log("[FILE PROCESSOR] Extracting text from file:", {
    name: file.name,
    type: fileType,
    normalizedType,
    isPDF,
    size: file.size,
  });

  if (isPDF) {
    return extractTextFromPDF(file, { maxPages: opts?.maxPages ?? 3 });
  }

  if (
    normalizedType === "image/jpeg" ||
    normalizedType === "image/png" ||
    normalizedType === "image/jpg"
  ) {
    return extractTextFromImage(file);
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

/** Warm PDF.js so the first upload is not blocked on module download. */
export function preloadPdfjs(): void {
  if (typeof window === "undefined") return;
  void loadPdfjs().catch(() => {});
}

async function loadPdfjs(): Promise<any> {
  if ((window as any).__pdfjsLib) return (window as any).__pdfjsLib;

  const pdfjsLib = await import("pdfjs-dist");
  // Vite resolves the worker URL at build time (much faster than CDN on localhost)
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
  (window as any).__pdfjsLib = pdfjsLib;
  return pdfjsLib;
}

async function extractTextFromPDF(file: File, opts?: { maxPages?: number }): Promise<ExtractedFileContent> {
  try {
    const pdfjsLib = await loadPdfjs();

    const arrayBuffer = await file.arrayBuffer();
    console.log("[FILE PROCESSOR] PDF arrayBuffer size:", arrayBuffer.byteLength);

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      disableAutoFetch: true,
      disableStream: true,
    }).promise;

    const maxPages = Math.min(pdf.numPages, opts?.maxPages ?? pdf.numPages);
    console.log("[FILE PROCESSOR] PDF numPages:", pdf.numPages, "reading:", maxPages);

    let fullText = "";
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = rebuildPdfPageText(textContent.items as PdfTextItem[]);
      pageTexts.push(pageText);
      fullText += pageText + "\n";
    }

    if (pdf.destroy) {
      await pdf.destroy();
    }

    const result = {
      text: fullText.trim(),
      pages: pdf.numPages,
    };

    console.log("[FILE PROCESSOR] Extracted text length:", result.text.length);
    return result;
  } catch (error) {
    console.error("[FILE PROCESSOR] PDF extraction error:", error);
    throw new Error(
      `Failed to extract PDF text: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function rebuildPdfPageText(items: PdfTextItem[]): string {
  const positioned = items
    .map((item, index) => {
      const text = String(item?.str ?? "").replace(/\s+/g, " ").trim();
      const transform = item?.transform ?? [];
      return {
        text,
        x: Number(transform[4] ?? 0),
        y: Number(transform[5] ?? 0),
        hasEOL: Boolean(item?.hasEOL),
        index,
      };
    })
    .filter((item) => item.text.length > 0);

  if (positioned.length === 0) return "";

  const rows: Array<{ y: number; items: typeof positioned }> = [];

  for (const entry of positioned) {
    const row = rows.find((candidate) => Math.abs(candidate.y - entry.y) <= 2.5);
    if (row) {
      row.items.push(entry);
      if (entry.hasEOL) {
        row.y = entry.y;
      }
      continue;
    }

    rows.push({ y: entry.y, items: [entry] });
  }

  return rows
    .sort((a, b) => b.y - a.y)
    .map((row) =>
      row.items
        .sort((a, b) => (Math.abs(a.x - b.x) <= 2 ? a.index - b.index : a.x - b.x))
        .map((item) => item.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean)
    .join("\n");
}

async function extractTextFromImage(file: File): Promise<ExtractedFileContent> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to create canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const text = ocrSimple(imageData);

      resolve({
        text:
          text.length > 50
            ? `${text.substring(0, 50)}... (Image preview - please paste text for accurate analysis)`
            : text,
        pages: 1,
      });
    };

    img.onerror = (err) => {
      reject(new Error(`Failed to load image: ${err}`));
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function ocrSimple(imageData: ImageData): string {
  const { data, width, height } = imageData;
  const charWidth = 8;
  const charHeight = 12;

  const cells: string[][] = [];

  for (let y = 0; y < height; y += charHeight) {
    const row: string[] = [];
    for (let x = 0; x < width; x += charWidth) {
      let brightness = 0;
      for (let dy = 0; dy < charHeight && y + dy < height; dy++) {
        for (let dx = 0; dx < charWidth && x + dx < width; dx++) {
          const idx = (y + dy) * width * 4 + (x + dx) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          brightness += r * 0.299 + g * 0.587 + b * 0.114;
        }
      }
      brightness /= charWidth * charHeight;
      row.push(brightness > 128 ? " " : "#");
    }
    cells.push(row);
  }

  const text = cells.map((row) => row.join("")).join("\n");

  return text.length > 1000 ? text.substring(0, 1000) + "..." : text;
}
