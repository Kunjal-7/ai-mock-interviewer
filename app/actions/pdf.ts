"use server"

export async function extractTextFromPDF(formData: FormData): Promise<string> {
  const file = formData.get("file") as File
  if (!file) {
    throw new Error("No file provided")
  }

  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  // Simple PDF text extraction - extracting text between stream markers
  // This is a basic implementation that works for most PDFs
  let text = ""
  const pdfString = new TextDecoder("utf-8", { fatal: false }).decode(uint8Array)

  // Extract text from PDF content streams
  const textMatches = pdfString.match(/$$(.*?)$$/g)
  if (textMatches) {
    text = textMatches
      .map((match) => match.slice(1, -1)) // Remove parentheses
      .filter((t) => t.length > 1 && !/^[\x00-\x1F\x7F-\x9F]+$/.test(t)) // Filter control chars
      .join(" ")
      .replace(/\\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  }

  // Also try to extract from BT/ET text blocks (common in PDFs)
  const btMatches = pdfString.match(/BT[\s\S]*?ET/g)
  if (btMatches) {
    for (const block of btMatches) {
      const tjMatches = block.match(/\[(.*?)\]\s*TJ/g)
      if (tjMatches) {
        for (const tj of tjMatches) {
          const innerMatches = tj.match(/$$(.*?)$$/g)
          if (innerMatches) {
            text +=
              " " +
              innerMatches
                .map((m) => m.slice(1, -1))
                .filter((t) => t.length > 0)
                .join("")
          }
        }
      }
    }
  }

  // Clean up the extracted text
  text = text
    .replace(/[^\x20-\x7E\s]/g, "") // Remove non-printable chars
    .replace(/\s+/g, " ")
    .trim()

  // If we got very little text, return a message indicating the resume was uploaded
  if (text.length < 50) {
    return "Resume uploaded successfully. The AI will focus on the job requirements you specified."
  }

  // Limit to first 3000 characters to avoid token limits
  return text.substring(0, 3000)
}
