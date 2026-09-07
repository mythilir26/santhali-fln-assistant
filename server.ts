import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 2. Real-time Hindi <-> Santhali Translation API
app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang = "hi", targetLang = "sat" } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required for translation" });
    }

    const isHindiToSanthali = sourceLang === "hi";

    const prompt = isHindiToSanthali
      ? `You are an expert bilingual education specialist in Indian languages, particularly Hindi and Santhali (Santali).
Translate the following Hindi text into Santhali:
"${text.trim()}"

Provide the translation in structured JSON format with the following keys:
- "original": the input text
- "olChiki": the Santhali translation written in authentic Ol Chiki script (ᱚᱞ ᱪᱤᱠᱤ).
- "devanagariPhonetic": the Santhali pronunciation written using Devanagari script so teachers fluent in Hindi can read it phonetically out loud to students.
- "romanPhonetic": standard Roman/Latin transliteration for pronunciation.
- "englishMeaning": simple English meaning or equivalent.
- "classroomTips": a brief 1-sentence note for rural primary teachers (e.g. usage in FLN classroom or contextual nuance).
- "wordBreakdown": an array of objects for key words in the sentence with:
    - "wordHindi": Hindi word
    - "wordOlChiki": Santhali Ol Chiki equivalent
    - "wordDevanagari": phonetic Devanagari
    - "meaning": brief meaning

Ensure authentic Santali vocabulary (e.g., "ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱪᱮᱫ?" for "तुम्हारा नाम क्या है?", "ᱫᱩᱲᱩᱵᱽ ᱢᱮ" for "बैठ जाओ", "ᱡᱚᱦᱟᱨ" for "नमस्ते/प्रणाम"). Return valid JSON only.`
      : `You are an expert bilingual education specialist in Indian languages, particularly Santhali (Santali) and Hindi.
Translate the following Santhali text (written in Ol Chiki or Devanagari/Roman) into Hindi:
"${text.trim()}"

Provide the translation in structured JSON format with the following keys:
- "original": the input text
- "hindi": clear, natural Hindi translation
- "olChiki": Ol Chiki script representation
- "devanagariPhonetic": phonetic reading guide
- "romanPhonetic": Roman transliteration
- "englishMeaning": simple English meaning
- "classroomTips": pedagogical tip for rural teachers
- "wordBreakdown": array of key vocabulary mapping

Return valid JSON only.`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text || "{}";
    const result = JSON.parse(outputText);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    console.error("Translation error:", err);
    return res.status(500).json({
      error: err.message || "Failed to translate text",
    });
  }
});

// 3. FLN / NIPUN Bharat Story Generator
app.post("/api/generate-story", async (req, res) => {
  try {
    const { grade = "Class 1", theme = "My Family", competency = "Reading fluency" } = req.body;

    const prompt = `You are a curriculum designer creating Foundational Literacy and Numeracy (FLN / NIPUN Bharat) reading material for rural primary school teachers teaching tribal Santhali children.
Create a short foundational reading story suitable for grade: ${grade}, based on theme: "${theme}", focusing on competency: "${competency}".
Length: 4 to 6 short, rhythmic, repetitive sentences ideal for early readers (Balvatika to Class 3).

Return ONLY a JSON object with this exact schema:
{
  "title": {
    "hindi": "Hindi Title (e.g. मेरा प्यारा परिवार)",
    "olChiki": "Ol Chiki Title (e.g. ᱤᱧᱟᱜ ᱫᱩᱞᱟᱹᱲ ᱜᱷᱟᱨᱚᱸᱡᱽ)",
    "devanagariPhonetic": "Devanagari phonetic title",
    "english": "English title"
  },
  "grade": "${grade}",
  "theme": "${theme}",
  "competency": "${competency}",
  "sentences": [
    {
      "id": 1,
      "hindi": "Hindi sentence (simple, foundational)",
      "olChiki": "Accurate Santhali translation in Ol Chiki script",
      "devanagariPhonetic": "Phonetic reading in Devanagari for teacher guidance",
      "romanPhonetic": "Roman pronunciation guide",
      "english": "Simple English translation"
    }
  ],
  "comprehensionQuestions": [
    {
      "questionHindi": "Hindi question based on story",
      "questionOlChiki": "Ol Chiki question",
      "expectedAnswerHindi": "Expected short answer"
    }
  ],
  "vocabularyList": [
    {
      "hindi": "Hindi word",
      "olChiki": "Ol Chiki word",
      "devanagari": "Phonetic guide",
      "meaning": "English meaning"
    }
  ],
  "nipunBharatPedagogyTip": "Actionable pedagogical tip for rural teachers to conduct oral reading and choral repetition in class."
}`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text || "{}";
    const result = JSON.parse(outputText);
    return res.json({ success: true, story: result });
  } catch (err: any) {
    console.error("Story generation error:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate FLN story",
    });
  }
});

// 4. Bilingual Worksheet Generator API
app.post("/api/generate-worksheet", async (req, res) => {
  try {
    const { grade = "Class 1", topic = "Family and Animals", difficulty = "Foundational" } = req.body;

    const prompt = `You are an educational worksheet creator for rural primary teachers under the NIPUN Bharat mission.
Generate a printable bilingual (Hindi & Santhali / Ol Chiki) activity worksheet for ${grade} on topic: "${topic}".
Include:
1. Matching task: 4-5 items (Match Hindi word to Ol Chiki word/meaning)
2. Fill in the missing letters or words: 3-4 items with hints
3. Simple bilingual foundational math or counting problem (e.g. counting cows, fruits, or trees with numbers in Devanagari and Ol Chiki)
4. Word tracing / handwriting prompt for Ol Chiki akshar

Return ONLY a JSON object:
{
  "worksheetTitle": "Title of the Worksheet (Bilingual)",
  "grade": "${grade}",
  "topic": "${topic}",
  "instructionsHindi": "छात्रों के लिए निर्देश",
  "instructionsEnglish": "Instructions in English",
  "matchingTask": [
    { "id": "m1", "hindi": "माँ (Mother)", "olChiki": "ᱟᱭᱳ (Ayo)", "devanagari": "आयो" },
    { "id": "m2", "hindi": "पेड़ (Tree)", "olChiki": "ᱫᱟᱨᱮ (Dare)", "devanagari": "दारे" },
    { "id": "m3", "hindi": "पानी (Water)", "olChiki": "ᱫᱟᱜ (Dak)", "devanagari": "दाक" },
    { "id": "m4", "hindi": "सूरज (Sun)", "olChiki": "ᱥᱤᱧ (Sinj)", "devanagari": "सिंज" }
  ],
  "fillInTheBlanks": [
    { "questionHindi": "हमारा घर ______ है। (सुंदर)", "olChikiQuestion": "ᱟᱞᱮᱭᱟᱜ ᱚᱲᱟᱜ ______ ᱠᱟᱱᱟ᱾", "answerHindi": "सुंदर / ᱱᱟᱯᱟᱭ" }
  ],
  "mathTask": {
    "problemHindi": "गाँव के बाज़ार में 3 बकरियाँ और 2 गायें थीं। कुल कितने जानवर थे?",
    "problemOlChiki": "ᱟᱹᱛᱩ ᱦᱟᱴ ᱨᱮ ᱓ ᱢᱮᱨᱚᱢ ᱟᱨ ᱒ ᱰᱟᱝᱜᱽᱨᱟ ᱠᱚ ᱛᱟᱦᱮᱸ ᱠᱟᱱᱟ᱾ ᱡᱚᱛᱚᱛᱮ ᱛᱤᱱᱟᱹᱜ?",
    "numberOlChiki": "᱓ + ᱒ = ᱕",
    "solution": "5 (ᱢᱚᱬᱮ / पाँच)"
  },
  "olChikiLetterPractice": [
    { "letter": "ᱚ", "name": "La", "hindiEquivalent": "ल / अ ध्वनी", "practiceWord": "ᱚᱲᱟᱜ (घर)" },
    { "letter": "ᱛ", "name": "At", "hindiEquivalent": "त ध्वनी", "practiceWord": "ᱛᱤ (हाथ)" }
  ]
}`;

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text || "{}";
    const result = JSON.parse(outputText);
    return res.json({ success: true, worksheet: result });
  } catch (err: any) {
    console.error("Worksheet generation error:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate worksheet",
    });
  }
});

// 5. Audio Transcription (Hindi Speech input using Gemini Multimodal)
app.post("/api/transcribe-audio", async (req, res) => {
  try {
    const { audioBase64, mimeType = "audio/webm" } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: "audioBase64 is required" });
    }

    const ai = getGeminiClient();
    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: audioBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        audioPart,
        {
          text: "Accurately transcribe the spoken Hindi speech in this audio clip. Output ONLY the transcribed Hindi text in Devanagari script without commentary.",
        },
      ],
    });

    const transcript = response.text ? response.text.trim() : "";
    return res.json({ success: true, transcript });
  } catch (err: any) {
    console.error("Audio transcription error:", err);
    return res.status(500).json({
      error: err.message || "Failed to transcribe audio",
    });
  }
});

// Production & Vite development server integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bilingual Santhali FLN Server running on port ${PORT}`);
  });
}

startServer();
