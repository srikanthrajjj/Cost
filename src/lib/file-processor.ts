// pdfjs-dist requires browser APIs (DOMMatrix) and cannot run during SSR.
// We load it entirely from CDN at runtime to prevent bundlers from including it.

export interface ExtractedFileContent {
  text: string;
  pages: number;
}

export async function extractTextFromFile(file: File): Promise<ExtractedFileContent> {
  if (typeof window === "undefined") {
    throw new Error("File processing is only available in the browser");
  }

  const fileType = file.type;

  console.log("[FILE PROCESSOR] Extracting text from file:", {
    name: file.name,
    type: fileType,
    size: file.size,
  });

  if (fileType === "application/pdf" || fileType === "application/octet-stream") {
    return extractTextFromPDF(file);
  }

  if (fileType === "image/jpeg" || fileType === "image/png" || fileType === "image/jpg") {
    return extractTextFromImage(file);
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

// Load pdfjs from CDN to completely avoid server-side bundling
async function loadPdfjs(): Promise<any> {
  // Check if already loaded
  if ((window as any).__pdfjsLib) return (window as any).__pdfjsLib;

  // Load the script from CDN
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs";
    script.type = "module";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load PDF.js from CDN"));
    document.head.appendChild(script);
  });

  // pdfjs loaded as ES module via import map won't attach to window, use dynamic import instead
  const pdfjsLib = await import(/* @vite-ignore */ "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";
  (window as any).__pdfjsLib = pdfjsLib;
  return pdfjsLib;
}

async function extractTextFromPDF(file: File): Promise<ExtractedFileContent> {
  try {
    const pdfjsLib = await loadPdfjs();

    const arrayBuffer = await file.arrayBuffer();
    console.log("[FILE PROCESSOR] PDF arrayBuffer size:", arrayBuffer.byteLength);

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      disableAutoFetch: true,
      disableStream: true,
    }).promise;

    console.log("[FILE PROCESSOR] PDF numPages:", pdf.numPages);

    let fullText = "";
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str || "").join(" ");
      pageTexts.push(pageText);
      fullText += pageText + " ";
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
    throw new Error(`Failed to extract PDF text: ${error instanceof Error ? error.message : String(error)}`);
  }
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
        text: text.length > 50 ? `${text.substring(0, 50)}... (Image preview - please paste text for accurate analysis)` : text,
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
