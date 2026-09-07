import React, { useState, useRef } from 'react';
import { 
  Printer, 
  Sparkles, 
  Download, 
  FileText, 
  RefreshCw, 
  CheckSquare, 
  HelpCircle,
  School,
  Calendar,
  User,
  Hash
} from 'lucide-react';
import { GradeLevel, UILang, WorksheetData } from '../types';
import { UI_STRINGS } from '../utils/i18n';
import { OFFLINE_SAMPLE_WORKSHEET } from '../data/curriculumData';
import { playChime } from '../utils/audioUtils';

interface Props {
  uiLang: UILang;
  isOnline: boolean;
}

export const WorksheetModule: React.FC<Props> = ({ uiLang, isOnline }) => {
  const t = UI_STRINGS[uiLang];

  const [grade, setGrade] = useState<GradeLevel>('Class 1');
  const [topic, setTopic] = useState('Family and Nature Words');
  const [schoolName, setSchoolName] = useState('प्राथमिक विद्यालय (Primary School)');
  const [teacherName, setTeacherName] = useState('शिक्षक (Teacher)');
  const [worksheet, setWorksheet] = useState<WorksheetData>(OFFLINE_SAMPLE_WORKSHEET);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    playChime('click');

    try {
      const response = await fetch('/api/generate-worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          topic,
        }),
      });

      if (!response.ok) throw new Error('Worksheet generation failed');

      const data = await response.json();
      if (data.success && data.worksheet) {
        setWorksheet(data.worksheet);
        playChime('success');
      } else {
        throw new Error('Invalid format');
      }
    } catch (e) {
      console.error(e);
      // fallback to offline sample
      setWorksheet({
        ...OFFLINE_SAMPLE_WORKSHEET,
        grade,
        topic,
      });
      alert(
        uiLang === 'hi'
          ? 'ऑफ़लाइन या नेटवर्क विलंब के कारण डिफ़ॉल्ट अभ्यास पत्रक लोड किया गया।'
          : 'Loaded default worksheet due to network/server delay.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    playChime('click');
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Panel (Hidden during print) */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              <span>A4 Printer-Friendly & PDF Export</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              {t.worksheetTitle}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              {t.worksheetDesc}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="btn-print-worksheet"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-sm transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{t.print}</span>
            </button>
          </div>
        </div>

        {/* Customization Fields */}
        <div className="mt-5 pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              {uiLang === 'hi' ? 'विद्यालय का नाम:' : 'School Name:'}
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:ring-1 focus:ring-teal-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              {uiLang === 'hi' ? 'शिक्षक का नाम:' : 'Teacher Name:'}
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:ring-1 focus:ring-teal-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              {uiLang === 'hi' ? 'कक्षा (Grade):' : 'Grade:'}
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as GradeLevel)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:ring-1 focus:ring-teal-600 outline-none"
            >
              <option value="Balvatika">Balvatika (बालवाटिका)</option>
              <option value="Class 1">Class 1 (कक्षा 1)</option>
              <option value="Class 2">Class 2 (कक्षा 2)</option>
              <option value="Class 3">Class 3 (कक्षा 3)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">
              {uiLang === 'hi' ? 'विषय / पाठ:' : 'Topic:'}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Village Haat, Animals"
              className="w-full text-xs px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 focus:bg-white focus:ring-1 focus:ring-teal-600 outline-none"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-stone-500">
            {t.worksheetPrintTip}
          </p>
          <button
            type="button"
            id="btn-generate-custom-worksheet"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 text-white text-xs font-bold transition-all active:scale-95"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.loading}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>{t.generateWorksheetBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Printable Sheet Area */}
      <div 
        id="printable-worksheet" 
        className="bg-white rounded-2xl p-8 sm:p-10 shadow-md border-2 border-stone-300 max-w-4xl mx-auto print:border-0 print:p-4 print:shadow-none print:max-w-none"
      >
        {/* School Header */}
        <div className="border-b-2 border-stone-800 pb-4 text-center">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 uppercase">
            {schoolName}
          </h1>
          <h2 className="text-base sm:text-lg font-bold text-teal-900 mt-0.5">
            {worksheet.worksheetTitle}
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            FLN / NIPUN Bharat मिशन • संथाली (ᱚᱞ ᱪᱤᱠᱤ) एवं हिंदी द्विभाषी कार्यपत्रक
          </p>
        </div>

        {/* Student Meta Row */}
        <div className="my-4 py-2 border-b border-stone-300 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium text-stone-800">
          <div>
            <span className="font-bold text-stone-600">छात्र/छात्रा: </span>
            <span className="border-b border-dotted border-stone-500 inline-block w-24"></span>
          </div>
          <div>
            <span className="font-bold text-stone-600">क्रमांक (Roll): </span>
            <span className="border-b border-dotted border-stone-500 inline-block w-12"></span>
          </div>
          <div>
            <span className="font-bold text-stone-600">कक्षा: </span>
            <span>{grade}</span>
          </div>
          <div>
            <span className="font-bold text-stone-600">दिनांक: </span>
            <span className="border-b border-dotted border-stone-500 inline-block w-20"></span>
          </div>
        </div>

        {/* Task 1: Matching Task */}
        <div className="my-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-stone-800 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-bold text-stone-900">
              {worksheet.instructionsHindi || 'सही जोड़ी मिलाइए (Match Hindi word to Santhali Ol Chiki):'}
            </h3>
          </div>

          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200 grid grid-cols-2 gap-6 text-sm">
            {/* Left Column: Hindi */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase">हिंदी शब्द:</span>
              {worksheet.matchingTask.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                  <span className="font-bold text-stone-800">({idx + 1}) {item.hindi}</span>
                  <span className="w-3 h-3 rounded-full border border-stone-400"></span>
                </div>
              ))}
            </div>

            {/* Right Column: Ol Chiki (Shuffled order simulation) */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase">संथाली (ᱚᱞ ᱪᱤᱠᱤ):</span>
              {[...worksheet.matchingTask].reverse().map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                  <span className="w-3 h-3 rounded-full border border-stone-400"></span>
                  <span className="font-extrabold text-teal-950 font-serif text-base">
                    {item.olChiki} <span className="text-xs font-normal text-stone-500">({item.devanagari})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task 2: Fill in the Blanks */}
        <div className="my-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-stone-800 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-bold text-stone-900">
              रिक्त स्थान भरिए (Fill in the blanks with correct word):
            </h3>
          </div>

          <div className="space-y-3">
            {worksheet.fillInTheBlanks.map((q, idx) => (
              <div key={idx} className="p-3 bg-stone-50/70 rounded-xl border border-stone-200 text-sm space-y-1">
                <p className="font-medium text-stone-800">
                  ({idx + 1}) {q.questionHindi}
                </p>
                <p className="font-bold text-teal-950 font-serif text-base">
                  {q.olChikiQuestion}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-stone-500">
                  <span>उत्तर (लिखें): </span>
                  <span className="border-b border-stone-400 inline-block w-40"></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task 3: Bilingual Math Problem */}
        {worksheet.mathTask && (
          <div className="my-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-stone-800 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                बुनियादी गणितीय समस्या (Foundational Word Problem):
              </h3>
            </div>

            <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-200 text-sm space-y-2">
              <p className="font-semibold text-stone-900">
                {worksheet.mathTask.problemHindi}
              </p>
              <p className="font-bold text-teal-950 font-serif text-base">
                {worksheet.mathTask.problemOlChiki}
              </p>
              <div className="pt-3 flex items-center justify-between border-t border-teal-200/80 text-xs font-medium">
                <span className="font-serif text-lg font-black text-teal-900">
                  {worksheet.mathTask.numberOlChiki}
                </span>
                <div className="flex items-center gap-2">
                  <span>उत्तर / Solution: </span>
                  <span className="w-24 h-8 border border-stone-400 bg-white rounded flex items-center justify-center font-bold"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task 4: Ol Chiki Handwriting Tracing Practice */}
        {worksheet.olChikiLetterPractice && worksheet.olChikiLetterPractice.length > 0 && (
          <div className="my-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 rounded-full bg-stone-800 text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="text-sm font-bold text-stone-900">
                सुलेख अभ्यास: ओल चिकी अक्षर लिखाई (Ol Chiki Letter Handwriting):
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {worksheet.olChikiLetterPractice.map((item, idx) => (
                <div key={idx} className="p-3 border border-stone-300 rounded-xl bg-white text-center">
                  <span className="text-3xl font-extrabold text-teal-950 font-serif block mb-1">
                    {item.letter}
                  </span>
                  <span className="text-[11px] font-bold text-stone-600 block">
                    {item.name} ({item.hindiEquivalent})
                  </span>
                  <div className="my-2 border-y border-stone-200 py-1 font-serif text-xs text-stone-500">
                    {item.practiceWord}
                  </div>
                  {/* Tracing lines box */}
                  <div className="h-10 border border-dashed border-stone-300 rounded bg-stone-50 flex items-center justify-center text-stone-300 text-2xl font-serif">
                    {item.letter}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Score & Signatures */}
        <div className="mt-8 pt-4 border-t-2 border-stone-800 flex items-center justify-between text-xs text-stone-700">
          <div>
            <span className="font-bold">प्राप्तांक (Marks Obtained): </span>
            <span className="border border-stone-400 px-3 py-1 font-bold inline-block">
              &nbsp;&nbsp;&nbsp;&nbsp; / 10
            </span>
          </div>
          <div>
            <span className="font-bold">शिक्षक हस्ताक्षर: </span>
            <span className="border-b border-stone-400 inline-block w-28"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
