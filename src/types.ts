export type UILang = 'hi' | 'sat' | 'en';

export type GradeLevel = 'Balvatika' | 'Class 1' | 'Class 2' | 'Class 3';

export type FLNCompetency = 
  | 'letter_recognition'
  | 'decoding_syllables'
  | 'reading_fluency'
  | 'oral_language'
  | 'number_sense'
  | 'addition_subtraction'
  | 'word_problems';

export interface TranslationResult {
  original: string;
  olChiki: string;
  devanagariPhonetic: string;
  romanPhonetic: string;
  englishMeaning: string;
  classroomTips?: string;
  wordBreakdown?: {
    wordHindi: string;
    wordOlChiki: string;
    wordDevanagari: string;
    meaning: string;
  }[];
  hindi?: string;
}

export interface StorySentence {
  id: number;
  hindi: string;
  olChiki: string;
  devanagariPhonetic: string;
  romanPhonetic?: string;
  english?: string;
}

export interface FLNStory {
  title: {
    hindi: string;
    olChiki: string;
    devanagariPhonetic: string;
    english: string;
  };
  grade: GradeLevel;
  theme: string;
  competency: string;
  sentences: StorySentence[];
  comprehensionQuestions: {
    questionHindi: string;
    questionOlChiki: string;
    expectedAnswerHindi: string;
  }[];
  vocabularyList: {
    hindi: string;
    olChiki: string;
    devanagari: string;
    meaning: string;
  }[];
  nipunBharatPedagogyTip?: string;
}

export interface FlashcardItem {
  id: string;
  hindi: string;
  olChiki: string;
  devanagariPhonetic: string;
  roman: string;
  english: string;
  category: 'family' | 'animals' | 'classroom' | 'nature' | 'numbers' | 'food' | 'body';
  iconName: string;
  exampleSentenceHindi?: string;
  exampleSentenceOlChiki?: string;
}

export interface WorksheetData {
  worksheetTitle: string;
  grade: GradeLevel;
  topic: string;
  instructionsHindi: string;
  instructionsEnglish: string;
  matchingTask: {
    id: string;
    hindi: string;
    olChiki: string;
    devanagari: string;
  }[];
  fillInTheBlanks: {
    questionHindi: string;
    olChikiQuestion: string;
    answerHindi: string;
  }[];
  mathTask?: {
    problemHindi: string;
    problemOlChiki: string;
    numberOlChiki: string;
    solution: string;
  };
  olChikiLetterPractice: {
    letter: string;
    name: string;
    hindiEquivalent: string;
    practiceWord: string;
  }[];
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  grade: GradeLevel;
  villageSchool?: string;
  gender?: 'Boy' | 'Girl';
}

export interface AssessmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  date: string;
  type: 'oral_reading_fluency' | 'formative_quiz';
  textTitle?: string;
  wordsReadTotal?: number;
  timeSeconds?: number;
  wordsPerMinute?: number;
  accuracyPercentage?: number;
  comprehensionScore?: number; // out of 3 or 5
  fluencyLevel?: 'Beginning (प्रारंभिक)' | 'Developing (प्रगतिशील)' | 'Proficient (प्रवीण)';
  notes?: string;
  competencyTested?: FLNCompetency;
  quizScore?: {
    letterRecognition: number; // /5
    wordReading: number; // /5
    numberSense: number; // /5
  };
}

export interface QuickPhrase {
  id: string;
  category: 'greetings' | 'classroom' | 'praise' | 'questions';
  hindi: string;
  olChiki: string;
  devanagari: string;
  roman: string;
  english: string;
}
