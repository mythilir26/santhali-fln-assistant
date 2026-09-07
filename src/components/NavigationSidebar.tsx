import React from 'react';
import { 
  Languages, 
  BookOpen, 
  FileText, 
  Layers, 
  BarChart3, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Volume2,
  Sparkles,
  School
} from 'lucide-react';
import { UILang } from '../types';
import { UI_STRINGS } from '../utils/i18n';

interface Props {
  activeTab: 'translate' | 'curriculum' | 'worksheets' | 'flashcards' | 'tracking' | 'offline';
  setActiveTab: (tab: 'translate' | 'curriculum' | 'worksheets' | 'flashcards' | 'tracking' | 'offline') => void;
  uiLang: UILang;
  setUiLang: (lang: UILang) => void;
  isOnline: boolean;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const NavigationSidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  uiLang,
  setUiLang,
  isOnline,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const t = UI_STRINGS[uiLang];

  const navItems = [
    {
      id: 'translate',
      label: t.navTranslate,
      sublabel: uiLang === 'sat' ? 'ᱨᱚᱲ ᱟᱨ ᱚᱞ' : 'Speech & Ol Chiki',
      icon: Languages,
      badge: 'Gemini AI',
    },
    {
      id: 'curriculum',
      label: t.navCurriculum,
      sublabel: 'NIPUN Bharat FLN',
      icon: BookOpen,
      badge: 'Balvatika - Cl 3',
    },
    {
      id: 'worksheets',
      label: t.navWorksheets,
      sublabel: uiLang === 'sat' ? 'ᱪᱷᱟᱯᱟ ᱥᱟᱠᱟᱢ' : 'Print / PDF',
      icon: FileText,
      badge: 'Print Ready',
    },
    {
      id: 'flashcards',
      label: t.navFlashcards,
      sublabel: uiLang === 'sat' ? 'ᱚᱞ ᱪᱮᱫᱚᱜ' : 'Visual & Slate',
      icon: Layers,
      badge: 'Interactive',
    },
    {
      id: 'tracking',
      label: t.navTracking,
      sublabel: 'Oral Reading WPM',
      icon: BarChart3,
      badge: 'Offline DB',
    },
    {
      id: 'offline',
      label: t.navOffline,
      sublabel: 'Android APK / PWA',
      icon: Smartphone,
      badge: 'Guide',
    },
  ] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 md:w-80 bg-stone-900 text-stone-100 flex flex-col transition-transform duration-200 ease-in-out shrink-0 border-r border-stone-800 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* App Branding */}
        <div className="p-5 border-b border-stone-800 bg-gradient-to-br from-stone-900 to-teal-950/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-xl shadow-inner">
              <span className="font-serif">ᱚ</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-lg text-white leading-tight truncate">
                {t.appTitle}
              </h1>
              <p className="text-xs text-teal-400/90 font-medium truncate">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Language Switcher Toggles */}
          <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-400">
              {t.language}
            </span>
            <div className="inline-flex bg-stone-800 p-0.5 rounded-lg border border-stone-700/60">
              <button
                type="button"
                onClick={() => setUiLang('hi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  uiLang === 'hi' 
                    ? 'bg-teal-600 text-white shadow-xs' 
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setUiLang('sat')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  uiLang === 'sat' 
                    ? 'bg-teal-600 text-white shadow-xs' 
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                ᱚᱞ ᱪᱤᱠᱤ
              </button>
              <button
                type="button"
                onClick={() => setUiLang('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  uiLang === 'en' 
                    ? 'bg-teal-600 text-white shadow-xs' 
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-start gap-3.5 p-3 rounded-xl text-left transition-all group relative ${
                  isActive
                    ? 'bg-teal-700/90 text-white font-semibold shadow-md shadow-teal-900/30 ring-1 ring-teal-500/40'
                    : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-lg shrink-0 ${
                  isActive ? 'bg-teal-600 text-white' : 'bg-stone-800 text-stone-400 group-hover:text-teal-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold truncate leading-tight">
                      {item.label}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-mono tracking-tight shrink-0 ${
                      isActive ? 'bg-teal-900/60 text-teal-200' : 'bg-stone-800 text-stone-400'
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className={`text-xs truncate mt-0.5 ${isActive ? 'text-teal-200' : 'text-stone-400'}`}>
                    {item.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer Status */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/80">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5" />
                    {t.onlineMode}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-amber-300 font-medium flex items-center gap-1">
                    <WifiOff className="w-3.5 h-3.5" />
                    {t.offlineMode}
                  </span>
                </>
              )}
            </div>
            <span className="text-stone-500 text-[11px]">FLN 2026</span>
          </div>

          <div className="mt-3 bg-stone-800/80 rounded-lg p-2.5 text-[11px] text-stone-300 flex items-center gap-2 border border-stone-700/50">
            <School className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="line-clamp-2">
              {uiLang === 'sat'
                ? 'ᱢᱟᱪᱮᱛ ᱠᱚ ᱞᱟᱹᱜᱤᱫ ᱵᱟᱨ-ᱯᱟᱹᱨᱥᱤ ᱥᱮᱪᱮᱫ ᱜᱚᱲᱚ'
                : 'ग्रामीण प्राथमिक शिक्षकों हेतु समर्पित द्विभाषी टूलकिट'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
