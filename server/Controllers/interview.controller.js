import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import User from "../Models/user.model.js";
import Interview from "../Models/interview.model.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filepath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText.replace(/\s+/g, " ").trim();

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
      { role: "user", content: resumeText },
    ];

    const aiResponse = await askAi(messages);

    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (err) {
      parsed = { role: "", experience: "", projects: [], skills: [] };
    }

    fs.unlinkSync(filepath);

    return res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      resumeText,
    });
  } catch (error) {
    console.error(error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: error.message });
  }
};

// ✅ fix: added export, changed const to let, fixed askAi typo, fixed user.credits typo
export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    if (role) role = role.trim();
    if (experience) experience = experience.trim();
    if (mode) mode = mode.trim();

    if (!role || !experience || !mode) {
      return res
        .status(400)
        .json({ message: "Role, Experience and Mode are required." });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required.",
      });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
Role:${role}
Experience:${experience}
InterviewMode:${mode}
Projects:${projectText}
Skills:${skillsText}
Resume:${safeResume}
`;

    if (!userPrompt.trim()) {
      return res.status(400).json({ message: "Prompt content is empty" });
    }

    const messages = [
      {
        role: "system",
        content: `You are an interviewer. Act like a real human conducting a professional interview. 
Use simple, natural English. Generate exactly five interview questions.

Strict rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do not number the questions.
- Do not include explanations.
- Do not add extra text before or after.
- One question per line.
- Use simple, conversational language.
- Questions should feel practical and realistic.

Difficulty progression:
Question 1 → easy
Question 2 → easy
Question 3 → medium
Question 4 → medium
Question 5 → hard

Make questions based on the candidate's role, experience, projects, skills, and resume details.`,
      },
      { role: "user", content: userPrompt },
    ];

    // ✅ fix: was "message" (undefined variable), should be "messages"
    const aiResponse = await askAi(messages);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({ message: "AI returned empty response." });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .slice(0, 5);

    if (questionsArray.length === 0) {
      return res
        .status(500)
        .json({ message: "AI failed to generate questions." });
    }

    // ✅ fix: was "user.credit" (typo), should be "user.credits"
    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: ["easy", "easy", "medium", "medium", "hard"][index],
        timeLimit: [60, 60, 90, 90, 120][index],
      })),
    });

    return res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const question = interview.questions[questionIndex];

    if (!answer) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";
      await interview.save();
      return res.json({ feedback: question.feedback });
    }

    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;
      await interview.save();
      return res.json({ feedback: question.feedback });
    }

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence — Does the answer sound clear, confident, and well-presented?
2. Communication — Is the language simple, clear, and easy to understand?
3. Correctness — Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "string"
}
`,
      },
      {
        role: "user",
        content: `Question: ${question.question}\nAnswer: ${answer}`,
      },
    ];

    // ✅ fix: was "askAI" (wrong casing), should be "askAi"
    const aiResponse = await askAi(messages);

    if (!aiResponse || !aiResponse.trim()) {
      return res.status(500).json({ message: "AI returned empty response." });
    }

    let evaluation;
    try {
      // ✅ fix: strip markdown code blocks before parsing
      const cleaned = aiResponse.replace(/```json|```/g, "").trim();
      evaluation = JSON.parse(cleaned);
    } catch (err) {
      return res.status(500).json({ message: "AI returned invalid JSON." });
    }

    question.answer = answer;
    question.confidence = evaluation.confidence;
    question.communication = evaluation.communication;
    question.correctness = evaluation.correctness;
    question.score =
      evaluation.finalScore ||
      Math.round(
        (evaluation.confidence +
          evaluation.communication +
          evaluation.correctness) /
          3,
      );
    question.feedback = evaluation.feedback;

    const answered = interview.questions.filter(
      (q) => q.answer && q.answer.length > 0,
    );
    if (answered.length > 0) {
      interview.finalScore = Math.round(
        answered.reduce((sum, q) => sum + q.score, 0) / answered.length,
      );
    }

    await interview.save();

    return res.json({
      feedback: question.feedback,
      confidence: question.confidence,
      communication: question.communication,
      correctness: question.correctness,
      score: question.score,
      finalScore: interview.finalScore,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(400).json({ message: "Failed to find Interview" });
    }

    interview.status = "completed";

    const answered = interview.questions.filter(
      (q) => q.answer && q.answer.length > 0,
    );
    if (answered.length > 0) {
      interview.finalScore = Math.round(
        answered.reduce((sum, q) => sum + q.score, 0) / answered.length,
      );
    }

    await interview.save();

    return res.json({
      message: "Interview finished successfully.",
      finalScore: interview.finalScore,
      status: interview.status,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};
