AI-Powered Vernacular Pedagogy & Real-Time Translation Tool
​Mother Tongue-Based Primary Education (MTB-MLE)
​Smart India Hackathon 2026 Submission | Problem Statement ID: 26042
Theme: Smart Education | PS Category: Software
Team Name: CipherSphere
  
​📌 Problem Statement
​Mother-tongue education is difficult to scale in tribal-area schools due to a severe shortage of teachers proficient in local languages. Hindi-medium trained teachers often lack the linguistic tools to teach students who primarily understand regional dialects like Santhali, creating a heavy communication gap in foundational learning.  
​💡 Our Proposed Solution
​An offline-first AI teaching assistant designed for Hindi-speaking teachers in low-connectivity rural classrooms.  
​Hindi to Santhali Translation: Converts Hindi speech/text into Santhali (Ol Chiki script) with synthesized audio feedback.  
​Voice-to-Voice Communication: Enables interactive, real-time classroom dialogue between teacher and students.  
​NIPUN Bharat FLN Alignment: Automatically generates bilingual worksheets, visual flashcards, and practice/assessment materials aligned with Foundational Literacy and Numeracy goals.  
​100% Offline Capability: Runs smoothly on low-cost Android tablets without relying on continuous internet connectivity.  
​🛠️ Technical Architecture & Tech Stack
​Workflow Pipeline
​Teacher Input: Hindi Speech or Text  
​ASR: IndicConformer (Hindi Speech Recognition)  
​Optimization: Local Phrase Cache & SQLite database for frequent terms  
​Translation Engine: IndicTrans2 (Hindi \rightarrow Santhali / Ol Chiki)  
​Text-to-Speech: Indic Parler-TTS (Santhali Text \rightarrow Audio)  
​Output: Bilingual Text + Synthesized Audio delivered to the student  
​Technology Stack
​Mobile Application: Android (Kotlin / Python)  
​AI / NLP Models: IndicConformer, IndicTrans2, Indic Parler-TTS  
​Edge / Offline Execution: ONNX Runtime Mobile, Model Quantization  
​Database & Caching: SQLite, Local Audio & Content Cache  
​🚀 Feasibility & Innovation
​Edge Optimization: Uses model quantization and sequential model loading to fit low-end Android devices (~2 GB RAM).  
​Zero Bandwidth Dependency: Designed for remote, zero-connectivity tribal schools using local asset caching.  
​Scalable Architecture: Built on a modular framework that can easily expand from Santhali to other tribal languages like Ho and Mundari.  
​📊 Impact & Benefits
​For Teachers: Empowers non-native speakers to teach effectively in tribal-language classrooms with instant translation aids.  
​For Students: Delivers crucial foundational primary education in their familiar mother tongue using multi-modal learning (audio, text, visuals).  
​For Schools: Eliminates high cloud-API operational costs and reliance on scarce multilingual teaching staff.
