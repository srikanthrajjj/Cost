// pdfjs-dist is loaded dynamically to avoid SSR issues (DOMMatrix not available in Node.js)
let pdfjsLib: typeof import("pdfjs-dist") | null = null;

async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).href;
  return pdfjsLib;
}

export interface ExtractedFileContent {
  text: string;
  pages: number;
}

export async function extractTextFromFile(file: File): Promise<ExtractedFileContent> {
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

async function extractTextFromPDF(file: File): Promise<ExtractedFileContent> {
  try {
    const pdfjs = await getPdfjs();
    const arrayBuffer = await file.arrayBuffer();
    console.log("[FILE PROCESSOR] PDF arrayBuffer size:", arrayBuffer.byteLength);

    const pdf = await pdfjs.getDocument({
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
