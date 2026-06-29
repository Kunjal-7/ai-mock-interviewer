"use server"

import { generateText } from "ai"
import type { InterviewAnswer, InterviewConfig, EvaluationResult, GeneratedQuestion } from "@/app/page"

export async function generateInterviewQuestions(config: InterviewConfig): Promise<GeneratedQuestion[]> {
  const resumeContext = config.resumeText ? `\n\nCandidate's Resume Summary:\n${config.resumeText}` : ""

  const prompt = `You are an expert technical interviewer. Generate exactly 5 interview questions for the following candidate profile:

Company: ${config.company}
Role: ${config.role}
Tech Stack: ${config.techStack}
Years of Experience: ${config.experience}
Interview Type: ${config.interviewType}
Difficulty Level: ${config.difficulty}
Interview Language: ${config.language}${resumeContext}

Generate questions that are:
1. Relevant to the role, tech stack, and interview type
2. Appropriate for the experience level and difficulty
3. ${config.interviewType === "technical" ? "Focused on technical knowledge and problem-solving" : config.interviewType === "behavioral" ? "Focused on past experiences and soft skills using STAR method" : config.interviewType === "system-design" ? "Focused on system architecture and scalability" : "A mix of technical, behavioral, and system design"}
4. Similar to what ${config.company} would ask
5. Include an estimated time in seconds for each answer (60-180 seconds depending on complexity)

Return ONLY a JSON array with objects containing "question" and "estimatedTime" fields:
[{"question": "Question 1?", "estimatedTime": 120}, {"question": "Question 2?", "estimatedTime": 90}]`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: prompt,
    })

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0])
      return questions.slice(0, 5).map((q: { question: string; estimatedTime?: number }) => ({
        question: q.question,
        estimatedTime: q.estimatedTime || 120,
      }))
    }

    return getDefaultQuestions(config)
  } catch (error) {
    console.error("Error generating questions:", error)
    return getDefaultQuestions(config)
  }
}

function getDefaultQuestions(config: InterviewConfig): GeneratedQuestion[] {
  return [
    {
      question: `Tell me about your experience with ${config.techStack}. What's the most challenging project you've worked on?`,
      estimatedTime: 120,
    },
    {
      question: `How would you design a scalable ${config.role.toLowerCase().includes("frontend") ? "frontend architecture" : "system"} for ${config.company}?`,
      estimatedTime: 180,
    },
    {
      question: `Describe a situation where you had to debug a complex issue in production. How did you approach it?`,
      estimatedTime: 120,
    },
    {
      question: `How do you stay updated with the latest trends in ${config.techStack}?`,
      estimatedTime: 90,
    },
    {
      question: `Where do you see yourself in 5 years, and how does this role at ${config.company} fit into that vision?`,
      estimatedTime: 90,
    },
  ]
}

export async function evaluateInterview(
  answers: InterviewAnswer[],
  config: InterviewConfig,
): Promise<EvaluationResult> {
  const resumeContext = config.resumeText ? `\nCandidate's Resume: ${config.resumeText.substring(0, 1000)}` : ""

  const prompt = `You are an expert technical interviewer at ${config.company}. Evaluate the following interview responses for a ${config.role} position with ${config.experience} years of experience in ${config.techStack}.
${resumeContext}

For each question and answer pair, provide:
1. An improved version of the answer (what an ideal candidate would say)
2. Specific strengths of the candidate's answer
3. Specific areas for improvement

Here are the questions and answers:

${answers
  .map(
    (a, i) => `
Question ${i + 1}: ${a.question}
Candidate's Answer: ${a.userAnswer || "(No response provided)"}
`,
  )
  .join("\n")}

Return your evaluation as a JSON object with this exact structure:
{
  "score": <number from 0-100 based on overall performance>,
  "questions": [
    {
      "id": "1",
      "question": "<the question>",
      "userAnswer": "<what the candidate said>",
      "improvedAnswer": "<an ideal answer to this question>",
      "strengths": ["<strength 1>", "<strength 2>"],
      "weaknesses": ["<area to improve 1>", "<area to improve 2>"]
    }
  ]
}

Be constructive but honest. Score generously for good communication even if technical details are missing.
Return ONLY the JSON object, no other text.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: prompt,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0])
      return result as EvaluationResult
    }

    return generateFallbackEvaluation(answers, config)
  } catch (error) {
    console.error("Error evaluating interview:", error)
    return generateFallbackEvaluation(answers, config)
  }
}

function generateFallbackEvaluation(answers: InterviewAnswer[], config: InterviewConfig): EvaluationResult {
  const questions = answers.map((answer, index) => {
    const hasContent = answer.userAnswer && answer.userAnswer.length > 20
    return {
      id: (index + 1).toString(),
      question: answer.question,
      userAnswer: answer.userAnswer || "(No response recorded)",
      improvedAnswer: `As a ${config.role} with ${config.experience} years of experience, I would approach this by first analyzing the requirements, then leveraging my expertise in ${config.techStack} to build a robust solution. At ${config.company}, I understand the importance of scalability and maintainability...`,
      strengths: hasContent
        ? ["Attempted to answer the question", "Showed willingness to engage"]
        : ["Participated in the interview"],
      weaknesses: hasContent
        ? ["Could provide more specific examples", "Add quantifiable metrics"]
        : ["No response provided - practice speaking your thoughts aloud"],
    }
  })

  const avgLength = answers.reduce((acc, a) => acc + (a.userAnswer?.length || 0), 0) / answers.length
  const score = Math.min(100, Math.max(30, Math.round(avgLength / 3 + 40)))

  return { score, questions }
}
