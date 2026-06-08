import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filepath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    // Load PDF
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    // Clean text
    resumeText = resumeText.replace(/\s+/g, " ").trim();

    // AI prompt for structured data
    const messages = [
      {
        role: "system",
        content: `
Extract structured data from resume.
Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
        `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    // Call AI service
    const aiResponse = await askAi(messages);

    // Parse AI response safely
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (err) {
      parsed = { role: "", experience: "", projects: [], skills: [] };
    }

    // Delete uploaded file after processing
    fs.unlinkSync(filepath);

    // Send structured JSON response
    return res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    console.error(error);

    // Ensure file cleanup on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ message: error.message });
  }
};
