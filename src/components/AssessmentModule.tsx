import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  UserPlus, 
  Timer, 
  Play, 
  Square, 
  CheckCircle, 
  Download, 
  Upload, 
  Trash2, 
  Award, 
  Users, 
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { AssessmentRecord, GradeLevel, Student, UILang } from '../types';
import { UI_STRINGS } from '../utils/i18n';
import { playChime } from '../utils/audioUtils';

interface Props {
  uiLang: UILang;
}

const INITIAL_STUDENTS: Student[] = [
  { id: 's1', name: 'बासंती मुर्मू (Basanti Murmu)', rollNo: '01', grade: 'Class 2', villageSchool: 'पीएस कुइली (PS Kuili)' },
  { id: 's2', name: 'सोम हेम्ब्रम (Som Hembram)', rollNo: '02', grade: 'Class 2', villageSchool: 'पीएस कुइली (PS Kuili)' },
  { id: 's3', name: 'सुनीता सोरेन (Sunita Soren)', rollNo: '03', grade: 'Class 3', villageSchool: 'पीएस कुइली (PS Kuili)' },
  { id: 's4', name: 'मंगरा बेसरा (Mangra Besra)', rollNo: '04', grade: 'Class 1', villageSchool: 'पीएस कुइली (PS Kuili)' },
];

const INITIAL_RECORDS: AssessmentRecord[] = [
  {
    id: 'r1',
    studentId: 's1',
    studentName: 'बासंती मुर्मू (Basanti Murmu)',
    grade: 'Class 2',
    date: '2026-09-05',
    type: 'oral_reading_fluency',
    textTitle: 'हमारा गाँव और स्कूल (ᱟᱵᱚᱣᱟᱜ ᱟᱹᱛᱩ)',
    wordsReadTotal: 38,
    timeSeconds: 60,
    wordsPerMinute: 38,
    accuracyPercentage: 92,
    fluencyLevel: 'Developing (प्रगतिशील)',
    notes: 'ओल चिकी वर्णों की अच्छी पहचान, वाक्य प्रवाह में सुधार हो रहा है।',
  },
  {
    id: 'r2',
    studentId: 's2',
    studentName: 'सोम हेम्ब्रम (Som Hembram)',
    grade: 'Class 2',
    date: '2026-09-06',
    type: 'oral_reading_fluency',
    textTitle: 'हमारा गाँव और स्कूल (ᱟᱵᱚᱣᱟᱜ ᱟᱹᱛᱩ)',
    wordsReadTotal: 46,
    timeSeconds: 60,
    wordsPerMinute: 46,
    accuracyPercentage: 96,
    fluencyLevel: 'Proficient (प्रवीण)',
    notes: 'निपुण भारत कक्षा 2 के 45 WPM लक्ष्य को प्राप्त किया!',
  },
  {
    id: 'r3',
    studentId: 's3',
    studentName: 'सुनीता सोरेन (Sunita Soren)',
    grade: 'Class 3',
    date: '2026-09-06',
    type: 'oral_reading_fluency',
    textTitle: 'गाँव का हाट (ᱟᱹᱛᱩ ᱦᱟᱴ)',
    wordsReadTotal: 52,
    timeSeconds: 60,
    wordsPerMinute: 52,
    accuracyPercentage: 94,
    fluencyLevel: 'Proficient (प्रवीण)',
    notes: 'स्पष्ट उच्चारण के साथ अर्थबोध प्रश्नों का सही उत्तर दिया।',
  },
];

export const AssessmentModule: React.FC<Props> = ({ uiLang }) => {
  const t = UI_STRINGS[uiLang];

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('santhali_fln_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [records, setRecords] = useState<AssessmentRecord[]>(() => {
    const saved = localStorage.getItem('santhali_fln_records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  // Save to localStorage (Offline DB)
  useEffect(() => {
    localStorage.setItem('santhali_fln_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('santhali_fln_records', JSON.stringify(records));
  }, [records]);

  // Modal / Form states
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState<GradeLevel>('Class 1');

  // Fluency Test Stopwatch State
  const [showFluencyForm, setShowFluencyForm] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [wordsCount, setWordsCount] = useState<number>(35);
  const [errorsCount, setErrorsCount] = useState<number>(2);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState<any>(null);

  // Timer controls
  useEffect(() => {
    if (isTimerRunning) {
      const id = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            setIsTimerRunning(false);
            playChime('bell');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerIntervalId(id);
      return () => clearInterval(id);
    } else if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
  }, [isTimerRunning]);

  const startStopwatch = () => {
    setTimerSeconds(60);
    setIsTimerRunning(true);
    playChime('click');
  };

  const stopStopwatch = () => {
    setIsTimerRunning(false);
    playChime('click');
  };

  const resetStopwatch = () => {
    setIsTimerRunning(false);
    setTimerSeconds(60);
  };

  // Add new student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newStudent: Student = {
      id: `s_${Date.now()}`,
      name: newStudentName.trim(),
      rollNo: newStudentRoll.trim() || `${students.length + 1}`,
      grade: newStudentGrade,
    };

    setStudents([...students, newStudent]);
    setNewStudentName('');
    setNewStudentRoll('');
    setShowAddStudent(false);
    playChime('success');
  };

  // Save new assessment record
  const handleSaveRecord = () => {
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    const timeSpent = 60 - timerSeconds || 60;
    const effectiveMinutes = timeSpent / 60;
    const wpm = Math.round(wordsCount / effectiveMinutes);
    const accuracy = Math.max(0, Math.round(((wordsCount - errorsCount) / wordsCount) * 100));

    let level: 'Beginning (प्रारंभिक)' | 'Developing (प्रगतिशील)' | 'Proficient (प्रवीण)' = 'Developing (प्रगतिशील)';
    if (wpm < 30) {
      level = 'Beginning (प्रारंभिक)';
    } else if (wpm >= 45) {
      level = 'Proficient (प्रवीण)';
    }

    const newRecord: AssessmentRecord = {
      id: `r_${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      grade: student.grade,
      date: new Date().toISOString().split('T')[0],
      type: 'oral_reading_fluency',
      textTitle: 'NIPUN Bharat FLN Reading Passage',
      wordsReadTotal: wordsCount,
      timeSeconds: timeSpent,
      wordsPerMinute: wpm,
      accuracyPercentage: accuracy,
      fluencyLevel: level,
      notes: `${wpm} WPM • ${accuracy}% accuracy`,
    };

    setRecords([newRecord, ...records]);
    setShowFluencyForm(false);
    playChime('success');
  };

  // Calculate Metrics (Streamlit st.metric equivalent)
  const totalStudents = students.length;
  const avgWpm = records.length > 0
    ? Math.round(records.reduce((acc, r) => acc + (r.wordsPerMinute || 0), 0) / records.length)
    : 0;
  const proficientCount = records.filter(r => r.fluencyLevel?.includes('Proficient')).length;
  const masteryRate = records.length > 0 ? Math.round((proficientCount / records.length) * 100) : 0;

  // Export JSON for offline backup
  const handleExport = () => {
    const exportData = {
      students,
      records,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `santhali_fln_assessment_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    playChime('click');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-teal-700" />
              <span>Offline First • Local SQLite / JSON Storage</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              {t.trackingTitle}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              {t.trackingDesc}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="btn-add-student-modal"
              onClick={() => setShowAddStudent(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-stone-600" />
              <span>{t.addStudent}</span>
            </button>

            <button
              type="button"
              id="btn-record-fluency-modal"
              onClick={() => setShowFluencyForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <Timer className="w-4 h-4 text-teal-300" />
              <span>{t.recordFluency}</span>
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all"
              title={t.exportData}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric Cards Row (Native st.metric equivalent) */}
        <div className="mt-6 pt-5 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
              <span>{t.totalStudents}</span>
              <Users className="w-4 h-4 text-stone-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-stone-900">
              {totalStudents}
            </div>
            <p className="text-xs text-stone-500 mt-1">ग्रामीण प्राथमिक कक्षा</p>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
            <div className="flex items-center justify-between text-xs font-bold text-teal-800 uppercase">
              <span>{t.avgWpm}</span>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <div className="mt-2 text-3xl font-black text-teal-950">
              {avgWpm} <span className="text-sm font-normal text-stone-600">WPM</span>
            </div>
            <p className="text-xs text-teal-700 mt-1">औसत पठन गति (शब्द/मिनट)</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase">
              <span>{t.targetWpm}</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-3xl font-black text-amber-950">
              45-60 <span className="text-sm font-normal text-stone-600">WPM</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">निपुण भारत बुनियादी मानक</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 uppercase">
              <span>दक्षता दर (Mastery)</span>
              <FileCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-3xl font-black text-emerald-950">
              {masteryRate}%
            </div>
            <p className="text-xs text-emerald-700 mt-1">प्रवीण स्तर के छात्र</p>
          </div>
        </div>
      </div>

      {/* Visual Fluency Chart (st.bar_chart equivalent) */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200">
        <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-700" />
          <span>छात्र पठन प्रवाह तुलना चार्ट (Student Reading Fluency WPM vs 45 Target)</span>
        </h3>

        <div className="space-y-3">
          {records.map((rec) => {
            const wpm = rec.wordsPerMinute || 0;
            const target = 45;
            const percentage = Math.min(100, Math.round((wpm / 60) * 100));
            const isTargetMet = wpm >= target;

            return (
              <div key={rec.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-bold text-stone-800">{rec.studentName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                      {rec.grade}
                    </span>
                    <span className={`text-xs font-bold ${isTargetMet ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {wpm} WPM ({rec.fluencyLevel})
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-200 h-3.5 rounded-full overflow-hidden relative">
                  {/* Benchmark 45 WPM indicator line */}
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10" 
                    style={{ left: `${(45 / 60) * 100}%` }}
                    title="NIPUN Target: 45 WPM"
                  />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTargetMet ? 'bg-teal-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-stone-500">
                  <span>0 WPM</span>
                  <span className="text-rose-600 font-bold">निपुण लक्ष्य: 45 WPM</span>
                  <span>60 WPM</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Oral Fluency Assessment Stopwatch Modal */}
      {showFluencyForm && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
                <Timer className="w-5 h-5 text-teal-700" />
                <span>मौखिक पठन प्रवाह (ORF) मापन</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowFluencyForm(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-4">
              {/* Select Student */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  छात्र/छात्रा चुनें:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Roll: {s.rollNo} • {s.grade})
                    </option>
                  ))}
                </select>
              </div>

              {/* 60-Second Classroom Stopwatch */}
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-center">
                <span className="text-xs font-bold text-teal-800 uppercase">
                  60-सेकंड पठन घड़ी (Stopwatch)
                </span>
                <div className="text-5xl font-black font-mono text-teal-950 my-2">
                  00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {!isTimerRunning ? (
                    <button
                      type="button"
                      onClick={startStopwatch}
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>शुरू करें (Start)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopStopwatch}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>रोकें (Pause)</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={resetStopwatch}
                    className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold"
                  >
                    रीसेट (Reset)
                  </button>
                </div>
              </div>

              {/* Word counts and error entry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    कुल पढ़े गए शब्द:
                  </label>
                  <input
                    type="number"
                    value={wordsCount}
                    onChange={(e) => setWordsCount(Number(e.target.value))}
                    className="w-full text-base font-bold p-2 rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    अशुद्धियाँ (Errors):
                  </label>
                  <input
                    type="number"
                    value={errorsCount}
                    onChange={(e) => setErrorsCount(Number(e.target.value))}
                    className="w-full text-base font-bold p-2 rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              {/* Quick Calculated Preview */}
              <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-700 flex items-center justify-between">
                <span>गणना WPM: <strong>{wordsCount} WPM</strong></span>
                <span>सटीकता: <strong>{Math.max(0, Math.round(((wordsCount - errorsCount) / wordsCount) * 100))}%</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFluencyForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={handleSaveRecord}
                className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold"
              >
                स्कोर सहेजें (Save Score)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="font-bold text-lg text-stone-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal-700" />
              <span>नया छात्र/छात्रा जोड़ें</span>
            </h3>

            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  छात्र का नाम (Name):
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. बिरसा मुर्मू (Birsa Murmu)"
                  className="w-full text-sm p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    क्रमांक (Roll No):
                  </label>
                  <input
                    type="text"
                    value={newStudentRoll}
                    onChange={(e) => setNewStudentRoll(e.target.value)}
                    placeholder="05"
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    कक्षा (Grade):
                  </label>
                  <select
                    value={newStudentGrade}
                    onChange={(e) => setNewStudentGrade(e.target.value as GradeLevel)}
                    className="w-full text-sm p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                  >
                    <option value="Balvatika">Balvatika</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudent(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold"
                >
                  जोड़ें (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
