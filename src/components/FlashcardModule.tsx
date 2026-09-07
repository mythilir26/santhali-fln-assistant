import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  RotateCw, 
  Volume2, 
  Sparkles, 
  Eraser, 
  PenTool, 
  Trash2, 
  Check, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Home,
  User,
  Trees,
  Droplet,
  Sun,
  Compass,
  Feather,
  BookOpen,
  School,
  Hash,
  Utensils,
  Award
} from 'lucide-react';
import { FlashcardItem, UILang } from '../types';
import { UI_STRINGS } from '../utils/i18n';
import { playSpokenText, playChime } from '../utils/audioUtils';
import { OFFLINE_FLASHCARDS, OL_CHIKI_ALPHABET } from '../data/curriculumData';

interface Props {
  uiLang: UILang;
}

export const FlashcardModule: React.FC<Props> = ({ uiLang }) => {
  const t = UI_STRINGS[uiLang];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Digital Slate Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#0d9488'); // teal default
  const [penWidth, setPenWidth] = useState(6);
  const [selectedLetter, setSelectedLetter] = useState(OL_CHIKI_ALPHABET[0]);
  const [showCelebration, setShowCelebration] = useState(false);

  // Filter flashcards
  const filteredCards = selectedCategory === 'all'
    ? OFFLINE_FLASHCARDS
    : OFFLINE_FLASHCARDS.filter(c => c.category === selectedCategory);

  const currentCard = filteredCards[currentCardIndex] || OFFLINE_FLASHCARDS[0];

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % filteredCards.length);
    playChime('click');
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    playChime('click');
  };

  // Canvas drawing functions
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playChime('click');
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleCelebrateLetter = () => {
    playChime('success');
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
  };

  const renderIcon = (name: string) => {
    const props = { className: "w-10 h-10 text-teal-700" };
    switch (name) {
      case 'Heart': return <Heart {...props} />;
      case 'User': return <User {...props} />;
      case 'Home': return <Home {...props} />;
      case 'Trees': return <Trees {...props} />;
      case 'Droplet': return <Droplet {...props} />;
      case 'Sun': return <Sun {...props} />;
      case 'Feather': return <Feather {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'School': return <School {...props} />;
      case 'Hash': return <Hash {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span>Interactive Bilingual Cards & Digital Slate</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              {t.flashcardTitle}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              {t.flashcardDesc}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All / सभी' },
              { id: 'family', label: 'Family / परिवार' },
              { id: 'nature', label: 'Nature / प्रकृति' },
              { id: 'animals', label: 'Animals / पशु' },
              { id: 'classroom', label: 'Class / कक्षा' },
              { id: 'numbers', label: 'Numbers / अंक' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Left Flashcard, Right Tracing Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flashcard Section */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200 flex flex-col items-center">
            {/* Card Progress */}
            <div className="w-full flex items-center justify-between text-xs text-stone-500 font-semibold mb-3">
              <span>
                {uiLang === 'hi' ? 'कार्ड संख्या:' : 'Card'} {currentCardIndex + 1} / {filteredCards.length}
              </span>
              <span className="uppercase text-[11px] px-2 py-0.5 rounded bg-stone-100 font-bold text-teal-800">
                {currentCard.category}
              </span>
            </div>

            {/* Interactive Flip Card Container */}
            <div
              onClick={() => {
                setIsFlipped(!isFlipped);
                playChime('click');
              }}
              className="w-full h-80 cursor-pointer rounded-2xl p-6 bg-gradient-to-br from-teal-50/70 to-stone-50 border-2 border-teal-600/30 shadow-md flex flex-col items-center justify-between transition-all hover:border-teal-500 relative select-none"
            >
              {/* Flip indicator badge */}
              <div className="absolute top-4 right-4 text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>{t.flipCard}</span>
              </div>

              {/* Card Front vs Back */}
              {!isFlipped ? (
                <div className="my-auto text-center space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center">
                    {renderIcon(currentCard.iconName)}
                  </div>

                  {/* Hindi Main Word */}
                  <div className="text-3xl sm:text-4xl font-black text-stone-900">
                    {currentCard.hindi}
                  </div>

                  <div className="text-sm font-semibold text-stone-500">
                    {currentCard.english}
                  </div>

                  <div className="inline-block mt-3 px-3 py-1 bg-teal-100 text-teal-900 rounded-full text-xs font-bold">
                    {uiLang === 'hi' ? 'संथाली देखने के लिए कार्ड पर टैप करें' : 'Tap to flip for Santhali'}
                  </div>
                </div>
              ) : (
                <div className="my-auto text-center space-y-3">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    संथाली (Santali)
                  </span>

                  {/* Ol Chiki Script Big */}
                  <div className="text-4xl sm:text-5xl font-black text-teal-950 font-serif leading-tight">
                    {currentCard.olChiki}
                  </div>

                  {/* Devanagari & Roman Pronunciation */}
                  <div className="text-lg font-bold text-stone-800">
                    {currentCard.devanagariPhonetic} ({currentCard.roman})
                  </div>

                  {/* Example Sentence */}
                  {currentCard.exampleSentenceOlChiki && (
                    <div className="mt-4 p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-700">
                      <p className="font-serif font-bold text-teal-900 text-sm">
                        {currentCard.exampleSentenceOlChiki}
                      </p>
                      <p className="text-stone-500 mt-0.5">
                        {currentCard.exampleSentenceHindi}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Card Controls */}
              <div className="w-full pt-3 border-t border-teal-200/50 flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  {isFlipped ? 'Ol Chiki View' : 'Hindi View'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playSpokenText(currentCard.devanagariPhonetic || currentCard.hindi, 'sat');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-transform active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{t.playAudio}</span>
                </button>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="w-full flex items-center justify-between gap-3 mt-4">
              <button
                type="button"
                onClick={prevCard}
                className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला (Prev)</span>
              </button>
              <button
                type="button"
                onClick={nextCard}
                className="flex-1 py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
              >
                <span>अगला (Next)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tracing Canvas Section (Digital Slate) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-teal-700" />
                  <h3 className="font-bold text-base text-stone-900">
                    {t.tracingTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>{t.clearSlate}</span>
                </button>
              </div>

              {/* Letter selector carousel */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {OL_CHIKI_ALPHABET.slice(0, 15).map((alpha) => (
                  <button
                    key={alpha.letter}
                    type="button"
                    onClick={() => {
                      setSelectedLetter(alpha);
                      clearCanvas();
                    }}
                    className={`w-10 h-10 rounded-xl font-serif text-xl font-bold flex items-center justify-center shrink-0 transition-all ${
                      selectedLetter.letter === alpha.letter
                        ? 'bg-teal-800 text-white shadow-md scale-105'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    {alpha.letter}
                  </button>
                ))}
              </div>

              {/* Slate Canvas Area with Reference Letter watermark */}
              <div className="relative mt-3 rounded-2xl bg-stone-900 border-4 border-stone-800 h-72 shadow-inner overflow-hidden flex items-center justify-center">
                {/* Reference letter outline */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-stone-700/50 text-8xl font-black font-serif">
                    {selectedLetter.letter}
                  </span>
                  <span className="text-stone-500 text-xs font-medium mt-2">
                    {selectedLetter.name} • {selectedLetter.devanagari} ध्वनि
                  </span>
                </div>

                {/* HTML5 Canvas */}
                <canvas
                  ref={canvasRef}
                  width={450}
                  height={288}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full cursor-crosshair relative z-10 touch-none"
                />

                {/* Celebration Overlay */}
                {showCelebration && (
                  <div className="absolute inset-0 bg-teal-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 animate-fade-in">
                    <Award className="w-12 h-12 text-amber-300 animate-bounce" />
                    <span className="font-bold text-lg mt-2 font-serif">{selectedLetter.letter} ᱥᱟᱨᱦᱟᱣ!</span>
                    <span className="text-xs text-teal-200">बहुत बढ़िया! शाबाश!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Slate Controls Toolbar */}
            <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              {/* Color options */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500">{t.strokeColor}</span>
                {[
                  { color: '#0d9488', name: 'Teal' },
                  { color: '#f59e0b', name: 'Yellow' },
                  { color: '#ef4444', name: 'Red' },
                  { color: '#38bdf8', name: 'Sky' },
                  { color: '#ffffff', name: 'White' },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setPenColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      penColor === c.color ? 'scale-125 border-stone-900 ring-2 ring-teal-400' : 'border-stone-300'
                    }`}
                  />
                ))}
              </div>

              {/* Stroke width */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCelebrateLetter}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-100 hover:bg-teal-200 text-teal-900 text-xs font-bold transition-all active:scale-95"
                >
                  <Check className="w-3.5 h-3.5 text-teal-700" />
                  <span>जाँचें (Done)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
