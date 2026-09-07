import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  Filter, 
  HelpCircle, 
  ChevronRight,
  GraduationCap,
  Play,
  RotateCcw
} from 'lucide-react';
import { FLNCompetency, FLNStory, GradeLevel, UILang } from '../types';
import { UI_STRINGS } from '../utils/i18n';
import { playSpokenText, playChime } from '../utils/audioUtils';
import { 
  FLN_COMPETENCIES, 
  NIPUN_THEMES, 
  OFFLINE_SAMPLE_STORY 
} from '../data/curriculumData';

interface Props {
  uiLang: UILang;
  isOnline: boolean;
}

export const CurriculumModule: React.FC<Props> = ({ uiLang, isOnline }) => {
  const t = UI_STRINGS[uiLang];

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Class 1');
  const [selectedCompetency, setSelectedCompetency] = useState<FLNCompetency>('reading_fluency');
  const [selectedTheme, setSelectedTheme] = useState('My Family (मेरा परिवार)');
  const [customTheme, setCustomTheme] = useState('');
  const [loadingStory, setLoadingStory] = useState(false);
  const [activeStory, setActiveStory] = useState<FLNStory>(OFFLINE_SAMPLE_STORY);
  const [activeSentenceId, setActiveSentenceId] = useState<number | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);

  // Filter competencies based on selected grade
  const availableCompetencies = FLN_COMPETENCIES.filter(c => 
    c.applicableGrades.includes(selectedGrade)
  );

  const handleGenerateStory = async () => {
    setLoadingStory(true);
    playChime('click');

    const themePrompt = customTheme.trim() || selectedTheme;
    const competencyObj = FLN_COMPETENCIES.find(c => c.id === selectedCompetency);
    const compTitle = competencyObj ? competencyObj.titleHindi : 'Reading fluency';

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: selectedGrade,
          theme: themePrompt,
          competency: compTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Story generation failed');
      }

      const data = await response.json();
      if (data.success && data.story) {
        setActiveStory(data.story);
        setActiveSentenceId(null);
        playChime('success');
      } else {
        throw new Error('Invalid story payload');
      }
    } catch (err) {
      console.error('Error generating story:', err);
      // Fallback gracefully to offline sample story
      setActiveStory({
        ...OFFLINE_SAMPLE_STORY,
        grade: selectedGrade,
        theme: themePrompt,
      });
      alert(
        uiLang === 'hi'
          ? 'नेटवर्क समस्या या ऑफ़लाइन होने के कारण नमूना कहानी लोड की गई है।'
          : 'Loaded offline sample story due to network/server timeout.'
      );
    } finally {
      setLoadingStory(false);
    }
  };

  const handlePlaySentence = (sentence: any) => {
    setActiveSentenceId(sentence.id);
    playSpokenText(sentence.devanagariPhonetic || sentence.hindi, 'sat', 0.8);
  };

  const handlePlayFullStory = () => {
    if (!activeStory || !activeStory.sentences) return;
    const fullText = activeStory.sentences.map(s => s.devanagariPhonetic || s.hindi).join('. ');
    playSpokenText(fullText, 'sat', 0.8);
  };

  return (
    <div className="space-y-6">
      {/* Module Intro Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
              <span>NIPUN Bharat Guidelines (Balvatika - Class 3)</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              {t.currTitle}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              {t.currDesc}
            </p>
          </div>

          {/* Grade Selector Pills */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-300 shrink-0">
            {(['Balvatika', 'Class 1', 'Class 2', 'Class 3'] as GradeLevel[]).map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedGrade === grade
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/70'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* NIPUN Competencies Row */}
        <div className="mt-6 pt-5 border-t border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {uiLang === 'hi' ? `${selectedGrade} के मुख्य लक्ष्य एवं दक्षताएं:` : `Key Competencies for ${selectedGrade}:`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableCompetencies.map((comp) => {
              const isSelected = selectedCompetency === comp.id;
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setSelectedCompetency(comp.id)}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/50 ring-1 ring-teal-500 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-sm text-stone-900 leading-snug">
                      {uiLang === 'sat' ? comp.titleOlChiki : comp.titleHindi}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-xs text-stone-600 mt-1.5 line-clamp-2">
                    {comp.descriptionHindi}
                  </p>
                  <div className="mt-2 text-[11px] font-medium text-teal-800 bg-white/80 px-2 py-0.5 rounded border border-teal-100">
                    🎯 {comp.benchmark}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Story Generation Controls */}
        <div className="mt-6 pt-5 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5">
                {t.theme}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {NIPUN_THEMES.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      setSelectedTheme(th.nameHindi);
                      setCustomTheme('');
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      selectedTheme === th.nameHindi && !customTheme
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                    }`}
                  >
                    {uiLang === 'sat' ? th.nameOlChiki : th.nameHindi}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Story Button */}
            <button
              type="button"
              id="btn-generate-fln-story"
              onClick={handleGenerateStory}
              disabled={loadingStory}
              className="w-full sm:w-auto self-end inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 disabled:bg-stone-300 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              {loadingStory ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.loading}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>{t.generateStoryBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Story Reader Component */}
      {activeStory && (
        <div className="bg-white rounded-2xl p-6 shadow-xs border-2 border-teal-600/30">
          {/* Story Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 mb-1">
                <span className="px-2 py-0.5 rounded bg-teal-100">{activeStory.grade}</span>
                <span>•</span>
                <span>{activeStory.theme}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
                {activeStory.title.olChiki}
              </h3>
              <p className="text-base font-bold text-stone-700 mt-1">
                {activeStory.title.hindi} ({activeStory.title.devanagariPhonetic})
              </p>
            </div>

            {/* Listen to Full Story */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayFullStory}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.readAloudStory}</span>
              </button>
            </div>
          </div>

          {/* Bilingual Sentences Presentation */}
          <div className="my-6 space-y-3">
            {activeStory.sentences.map((sent) => {
              const isActive = activeSentenceId === sent.id;
              return (
                <div
                  key={sent.id}
                  onClick={() => handlePlaySentence(sent)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    isActive
                      ? 'bg-teal-50 border-teal-500 shadow-xs ring-1 ring-teal-400'
                      : 'bg-stone-50/60 border-stone-200 hover:border-teal-300 hover:bg-teal-50/20'
                  }`}
                >
                  <div className="flex-1 space-y-1">
                    {/* Big Ol Chiki sentence */}
                    <div className="text-xl sm:text-2xl font-extrabold text-teal-950 font-serif leading-relaxed">
                      {sent.olChiki}
                    </div>
                    {/* Devanagari pronunciation guide */}
                    <div className="text-sm font-semibold text-stone-700">
                      {sent.devanagariPhonetic}
                    </div>
                    {/* Hindi equivalent */}
                    <div className="text-xs text-stone-500 pt-1">
                      {sent.hindi}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySentence(sent);
                    }}
                    className={`p-2 rounded-lg transition-transform active:scale-95 shrink-0 ${
                      isActive ? 'bg-teal-700 text-white' : 'bg-stone-200 hover:bg-teal-100 text-stone-700'
                    }`}
                    title={t.playAudio}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Key Vocabulary Pills */}
          {activeStory.vocabularyList && activeStory.vocabularyList.length > 0 && (
            <div className="pt-4 border-t border-stone-200">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-3">
                {t.vocabHeader}:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {activeStory.vocabularyList.map((vocab, i) => (
                  <div 
                    key={i} 
                    className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-center"
                  >
                    <div className="font-bold text-teal-950 text-base font-serif">
                      {vocab.olChiki}
                    </div>
                    <div className="text-xs font-semibold text-stone-800">
                      {vocab.devanagari}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {vocab.hindi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comprehension Questions Toggle */}
          {activeStory.comprehensionQuestions && activeStory.comprehensionQuestions.length > 0 && (
            <div className="mt-5 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowQuestions(!showQuestions)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors"
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  <span>{t.comprehensionQ} ({activeStory.comprehensionQuestions.length})</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${showQuestions ? 'rotate-90' : ''}`} />
              </button>

              {showQuestions && (
                <div className="mt-3 space-y-2.5 pl-2">
                  {activeStory.comprehensionQuestions.map((cq, qIdx) => (
                    <div key={qIdx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-sm">
                      <p className="font-bold text-teal-950 font-serif">
                        {qIdx + 1}. {cq.questionOlChiki}
                      </p>
                      <p className="text-stone-700 text-xs mt-0.5">
                        {cq.questionHindi}
                      </p>
                      <p className="text-emerald-700 text-xs font-semibold mt-1">
                        उत्तर (Answer): {cq.expectedAnswerHindi}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pedagogy tip */}
          {activeStory.nipunBharatPedagogyTip && (
            <div className="mt-5 p-3.5 bg-teal-50 rounded-xl border border-teal-200 text-teal-950 text-xs">
              <span className="font-bold">💡 NIPUN Bharat Pedagogy Note: </span>
              <span>{activeStory.nipunBharatPedagogyTip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
