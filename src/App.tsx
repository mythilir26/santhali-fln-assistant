/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Globe, 
  Languages,
  BookOpen,
  FileText,
  Layers,
  BarChart3,
  Smartphone,
  School
} from 'lucide-react';
import { UILang } from './types';
import { UI_STRINGS } from './utils/i18n';
import { NavigationSidebar } from './components/NavigationSidebar';
import { TranslationModule } from './components/TranslationModule';
import { CurriculumModule } from './components/CurriculumModule';
import { WorksheetModule } from './components/WorksheetModule';
import { FlashcardModule } from './components/FlashcardModule';
import { AssessmentModule } from './components/AssessmentModule';
import { OfflinePwaModal } from './components/OfflinePwaModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'translate' | 'curriculum' | 'worksheets' | 'flashcards' | 'tracking' | 'offline'>('translate');
  const [uiLang, setUiLang] = useState<UILang>('hi');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Track online/offline status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const t = UI_STRINGS[uiLang];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col lg:flex-row text-stone-900 font-sans">
      {/* Sidebar Navigation */}
      <NavigationSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        uiLang={uiLang}
        setUiLang={setUiLang}
        isOnline={isOnline}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Hidden during print) */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 print:hidden">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpenMobile(!isOpenMobile)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white font-serif font-bold text-sm">
                ᱚ
              </div>
              <span className="font-bold text-base text-stone-900 truncate">
                {t.appTitle}
              </span>
            </div>

            {/* Breadcrumb / Section indicator on Desktop */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-stone-600">
              <span className="text-teal-700 font-serif font-black text-sm">ᱚᱞ ᱪᱤᱠᱤ</span>
              <span>/</span>
              <span className="text-stone-900 capitalize font-bold">
                {activeTab === 'translate' && t.navTranslate}
                {activeTab === 'curriculum' && t.navCurriculum}
                {activeTab === 'worksheets' && t.navWorksheets}
                {activeTab === 'flashcards' && t.navFlashcards}
                {activeTab === 'tracking' && t.navTracking}
                {activeTab === 'offline' && t.navOffline}
              </span>
            </div>
          </div>

          {/* Quick Header Language & Status Controls */}
          <div className="flex items-center gap-2.5">
            {/* Quick Language Toggle */}
            <div className="inline-flex bg-stone-100 p-0.5 rounded-lg border border-stone-300/80">
              <button
                type="button"
                onClick={() => setUiLang('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  uiLang === 'hi' ? 'bg-teal-700 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setUiLang('sat')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  uiLang === 'sat' ? 'bg-teal-700 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                ᱚᱞ ᱪᱤᱠᱤ
              </button>
              <button
                type="button"
                onClick={() => setUiLang('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  uiLang === 'en' ? 'bg-teal-700 text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                EN
              </button>
            </div>

            {/* Network indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs">
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-700 font-semibold">{t.onlineMode}</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-amber-800 font-semibold">{t.offlineMode}</span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'translate' && (
            <TranslationModule uiLang={uiLang} isOnline={isOnline} />
          )}
          {activeTab === 'curriculum' && (
            <CurriculumModule uiLang={uiLang} isOnline={isOnline} />
          )}
          {activeTab === 'worksheets' && (
            <WorksheetModule uiLang={uiLang} isOnline={isOnline} />
          )}
          {activeTab === 'flashcards' && (
            <FlashcardModule uiLang={uiLang} />
          )}
          {activeTab === 'tracking' && (
            <AssessmentModule uiLang={uiLang} />
          )}
          {activeTab === 'offline' && (
            <OfflinePwaModal uiLang={uiLang} isOnline={isOnline} />
          )}
        </main>
      </div>
    </div>
  );
}
