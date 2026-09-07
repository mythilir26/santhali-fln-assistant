import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowRightLeft, 
  BookOpen, 
  Lightbulb, 
  HelpCircle,
  Play,
  Volume1
} from 'lucide-react';
import { TranslationResult, UILang } from '../types';
import { UI_STRINGS } from '../utils/i18n';
import { playSpokenText, playChime } from '../utils/audioUtils';
import { TEACHER_QUICK_PHRASES } from '../data/curriculumData';

interface Props {
  uiLang: UILang;
  isOnline: boolean;
}

export const TranslationModule: React.FC<Props> = ({ uiLang, isOnline }) => {
  const t = UI_STRINGS[uiLang];

  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState<'hi' | 'sat'>('hi');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranslationResult | null>({
    original: 'अपनी किताब खोलो और पाठ पढ़ो।',
    olChiki: 'ᱟᱢᱟᱜ ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ ᱟᱨ ᱯᱟᱲᱦᱟᱣ ᱢᱮ᱾',
    devanagariPhonetic: 'आमाग पुथी झिज मे आर पाढ़हाव मे।',
    romanPhonetic: 'Amag puthi jhij me ar parhaw me.',
    englishMeaning: 'Open your book and read the lesson.',
    classroomTips: 'कक्षा में बच्चों को अपनी किताब दिखाने को कहें और "ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ" को अभिनय के साथ दोहराएँ।',
    wordBreakdown: [
      { wordHindi: 'अपनी', wordOlChiki: 'ᱟᱢᱟᱜ', wordDevanagari: 'आमाग', meaning: 'Your' },
      { wordHindi: 'किताब', wordOlChiki: 'ᱯᱩᱛᱷᱤ', wordDevanagari: 'पुथी', meaning: 'Book' },
      { wordHindi: 'खोलो', wordOlChiki: 'ᱡᱷᱤᱡᱽ ᱢᱮ', wordDevanagari: 'झिज मे', meaning: 'Open' },
      { wordHindi: 'पढ़ो', wordOlChiki: 'ᱯᱟᱲᱦᱟᱣ ᱢᱮ', wordDevanagari: 'पाढ़हाव मे', meaning: 'Read' },
    ],
  });

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = sourceLang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        playChime('click');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          playChime('success');
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [sourceLang]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(
        uiLang === 'hi'
          ? 'आपके ब्राउज़र में आवाज़ पहचान (Web Speech) उपलब्ध नहीं है। कृपया टाइप करें या Chrome ब्राउज़र का उपयोग करें।'
          : 'Microphone speech recognition is not supported in this browser. Please type or use Chrome.'
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTranslate = async (textToTranslate?: string) => {
    const query = (textToTranslate || inputText).trim();
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: query,
          sourceLang: sourceLang,
          targetLang: sourceLang === 'hi' ? 'sat' : 'hi',
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const resData = await response.json();
      if (resData.success && resData.data) {
        setResult(resData.data);
        playChime('success');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.error(err);
      setError(
        uiLang === 'hi'
          ? 'अनुवाद नहीं हो सका। कृपया पुनः प्रयास करें।'
          : 'Translation failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyOlChiki = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapLanguages = () => {
    setSourceLang(prev => (prev === 'hi' ? 'sat' : 'hi'));
    if (result && result.olChiki) {
      setInputText(sourceLang === 'hi' ? result.olChiki : result.original);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Google Gemini AI & Ol Chiki ᱚᱞ ᱪᱤᱠᱤ</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              {t.transTitle}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              {t.transDesc}
            </p>
          </div>

          {/* Direction Toggle */}
          <button
            type="button"
            id="btn-swap-language"
            onClick={swapLanguages}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold transition-all border border-stone-300 active:scale-95"
          >
            <span className="font-bold text-teal-800">
              {sourceLang === 'hi' ? 'हिन्दी (Hindi)' : 'संथाली (Santhali)'}
            </span>
            <ArrowRightLeft className="w-4 h-4 text-stone-500" />
            <span className="font-bold text-teal-800">
              {sourceLang === 'hi' ? 'संथाली (ᱚᱞ ᱪᱤᱠᱤ)' : 'हिन्दी (Hindi)'}
            </span>
          </button>
        </div>

        {/* Speech & Text Input Area */}
        <div className="mt-5 relative">
          <div className="relative rounded-2xl border-2 border-stone-200 focus-within:border-teal-600 transition-colors bg-stone-50/60 p-4">
            <textarea
              id="translation-input"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={sourceLang === 'hi' ? t.speakHint : 'ᱚᱞ ᱪᱤᱠᱤ ᱥᱮ ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱢᱮ...'}
              className="w-full bg-transparent border-0 focus:ring-0 text-base sm:text-lg text-stone-900 placeholder:text-stone-400 resize-none outline-none"
            />

            {/* Quick Voice & Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200/80">
              <div className="flex items-center gap-2">
                {/* Microphone Button */}
                <button
                  type="button"
                  id="btn-mic-record"
                  onClick={toggleRecording}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-xs ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                      : 'bg-teal-700 hover:bg-teal-800 text-white active:scale-95'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>{t.stopRecording}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>{t.micRecord}</span>
                    </>
                  )}
                </button>

                {/* Speak button for input text */}
                {inputText.trim() && (
                  <button
                    type="button"
                    onClick={() => playSpokenText(inputText, sourceLang === 'hi' ? 'hi' : 'sat')}
                    title={t.playAudio}
                    className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}

                {inputText.trim() && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    title={t.reset}
                    className="p-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Translate Submit Button */}
              <button
                type="button"
                id="btn-submit-translate"
                onClick={() => handleTranslate()}
                disabled={loading || !inputText.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 disabled:bg-stone-300 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t.loading}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-300" />
                    <span>{t.translateBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>
          )}

          {/* Quick preset chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">
              {uiLang === 'hi' ? 'त्वरित वाक्य:' : 'Quick sentences:'}
            </span>
            {[
              'तुम्हारा नाम क्या है?',
              'किताब खोलो और पढ़ो।',
              'बहुत अच्छा! शाबाश!',
              'आज सब बच्चे खुश हैं।',
              'गाँव में बहुत सारे पेड़ हैं।',
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(preset);
                  handleTranslate(preset);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-teal-50 text-stone-700 hover:text-teal-800 border border-stone-200 transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Translation Result Presentation Card */}
      {result && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border-2 border-teal-600/30 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-600" />
              <h3 className="font-bold text-lg text-stone-900">
                {t.olChikiScript}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Audio Listen Buttons */}
              <button
                type="button"
                id="btn-play-santhali-audio"
                onClick={() => {
                  // Speak phonetic Devanagari/Roman with Indian voice tuned slow
                  playSpokenText(result.devanagariPhonetic || result.romanPhonetic, 'sat', 0.8);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-900 text-xs font-bold transition-all active:scale-95"
              >
                <Volume2 className="w-4 h-4 text-teal-700" />
                <span>{t.playAudio}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSpokenText(result.devanagariPhonetic || result.romanPhonetic, 'sat', 0.65);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-all"
                title={t.slowAudio}
              >
                <Volume1 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">0.65x {t.slowAudio}</span>
              </button>

              {/* Copy Button */}
              <button
                type="button"
                onClick={() => copyOlChiki(result.olChiki)}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-all"
                title={t.copy}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Big Bold Ol Chiki Display */}
          <div className="py-6 px-4 bg-teal-50/50 rounded-xl my-4 border border-teal-100">
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-teal-950 tracking-wide font-serif leading-relaxed">
              {result.olChiki}
            </div>

            {/* Devanagari reading guide for teachers */}
            <div className="mt-4 pt-3 border-t border-teal-200/60 flex flex-wrap items-center gap-2 text-stone-700">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-200/60 px-2 py-0.5 rounded-md">
                {t.devanagariPhonetic}:
              </span>
              <span className="text-lg sm:text-xl font-bold text-stone-900">
                {result.devanagariPhonetic}
              </span>
            </div>

            {/* Roman pronunciation */}
            {result.romanPhonetic && (
              <div className="mt-1.5 text-xs text-stone-600 flex items-center gap-2">
                <span className="font-semibold text-stone-500">{t.romanPhonetic}:</span>
                <span className="font-mono">{result.romanPhonetic}</span>
              </div>
            )}
          </div>

          {/* English Meaning & Original */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-3">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                {uiLang === 'hi' ? 'मूल वाक्य (Hindi Original):' : 'Original Text:'}
              </span>
              <p className="mt-1 font-semibold text-stone-800">
                {result.original || result.hindi}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                {uiLang === 'hi' ? 'अंग्रेज़ी अर्थ (English Meaning):' : 'English Meaning:'}
              </span>
              <p className="mt-1 font-medium text-stone-800">
                {result.englishMeaning}
              </p>
            </div>
          </div>

          {/* Word-by-Word Breakdown */}
          {result.wordBreakdown && result.wordBreakdown.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-2.5">
                {t.wordBreakdown}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {result.wordBreakdown.map((wb, i) => (
                  <div 
                    key={i} 
                    className="p-3 rounded-xl bg-stone-100/80 border border-stone-200 text-center hover:bg-teal-50 transition-colors"
                  >
                    <div className="font-bold text-teal-900 text-base font-serif">
                      {wb.wordOlChiki}
                    </div>
                    <div className="text-xs font-semibold text-stone-700 mt-0.5">
                      {wb.wordDevanagari}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1 border-t border-stone-200 pt-1">
                      {wb.wordHindi} • {wb.meaning}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rural Classroom Pedagogy Tip */}
          {result.classroomTips && (
            <div className="mt-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">{t.classroomTip} </span>
                <span>{result.classroomTips}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Classroom Quick Phrases Carousel/List */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <h3 className="font-bold text-lg text-stone-900">
              {t.quickPhrasesTitle}
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {TEACHER_QUICK_PHRASES.length} {uiLang === 'hi' ? 'वाक्य उपलब्ध' : 'Phrases'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TEACHER_QUICK_PHRASES.map((phrase) => (
            <div
              key={phrase.id}
              className="p-4 rounded-xl border border-stone-200 hover:border-teal-400 bg-stone-50/50 hover:bg-teal-50/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-lg text-teal-950 font-serif leading-snug">
                    {phrase.olChiki}
                  </div>
                  <button
                    type="button"
                    onClick={() => playSpokenText(phrase.devanagari, 'sat')}
                    className="p-2 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-900 shrink-0 transition-transform active:scale-95"
                    title={t.playAudio}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs font-semibold text-stone-700 mt-1">
                  {phrase.devanagari} ({phrase.roman})
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
                <span className="font-medium text-stone-800">{phrase.hindi}</span>
                <button
                  type="button"
                  onClick={() => {
                    setInputText(phrase.hindi);
                    handleTranslate(phrase.hindi);
                  }}
                  className="text-teal-700 hover:underline font-semibold text-[11px]"
                >
                  {uiLang === 'hi' ? 'अनुवाद देखें' : 'Translate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
