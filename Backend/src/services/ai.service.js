const Groq = require("groq-sdk")
const puppeteer = require("puppeteer")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

const MODEL = "llama-3.3-70b-versatile"  // fast & free on Groq


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}

        Respond ONLY with a valid JSON object (no markdown, no backticks) with this exact structure:
        {
            "title": "Job title here",
            "matchScore": 85,
            "technicalQuestions": [
                {
                    "question": "...",
                    "intention": "...",
                    "answer": "..."
                }
            ],
            "behavioralQuestions": [
                {
                    "question": "...",
                    "intention": "...",
                    "answer": "..."
                }
            ],
            "skillGaps": [
                {
                    "skill": "...",
                    "severity": "low | medium | high"
                }
            ],
            "preparationPlan": [
                {
                    "day": 1,
                    "focus": "...",
                    "tasks": ["...", "..."]
                }
            ]
        }`

    const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
    })

    const content = response.choices[0].message.content
    return JSON.parse(content)
}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pdfBuffer
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate a resume for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}

        Respond ONLY with a valid JSON object (no markdown, no backticks) with this exact structure:
        {
            "html": "<full resume HTML here>"
        }

        Rules for the HTML resume:
        - Tailor it for the given job description
        - Should NOT sound AI-generated
        - Simple, professional design with subtle colors
        - ATS friendly
        - 1-2 pages when converted to PDF
        - Focus on quality over quantity`

    const response = await groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
    })

    const content = response.choices[0].message.content
    const jsonContent = JSON.parse(content)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }