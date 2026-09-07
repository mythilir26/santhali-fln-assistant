import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff, 
  Copy, 
  Check, 
  HardDrive, 
  Layers, 
  Share2, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { UILang } from '../types';
import { UI_STRINGS } from '../utils/i18n';
import { playChime } from '../utils/audioUtils';

interface Props {
  uiLang: UILang;
  isOnline: boolean;
}

export const OfflinePwaModal: React.FC<Props> = ({ uiLang, isOnline }) => {
  const t = UI_STRINGS[uiLang];
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        playChime('success');
      }
      setDeferredPrompt(null);
    } else {
      alert(
        uiLang === 'hi'
          ? 'अपने Chrome ब्राउज़र के मेनू (3 डॉट्स) पर जाएँ और "Add to Home screen" या "Install app" पर टैप करें।'
          : 'Please open your browser menu (3 dots) and tap "Add to Home screen" or "Install app".'
      );
    }
  };

  const copyCommand = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    playChime('click');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
              <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
              <span>Offline-First Architecture & Android Packaging</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              {uiLang === 'hi' ? 'ऑफ़लाइन उपयोग एवं Android (.APK) स्थापना' : 'Offline Mode & Android APK Distribution'}
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              {uiLang === 'hi'
                ? 'दूरदराज के ग्रामीण विद्यालयों में जहाँ इंटरनेट नहीं होता, यह ऐप पूरी तरह स्थानीय रूप से काम करता है।'
                : 'Engineered for remote rural schools with intermittent or zero internet connectivity.'}
            </p>
          </div>

          <button
            type="button"
            id="btn-install-pwa"
            onClick={handleInstallClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all active:scale-95 shrink-0"
          >
            <Smartphone className="w-4 h-4 text-teal-300" />
            <span>{installed ? '✓ Installed on Device' : 'Install as Android App'}</span>
          </button>
        </div>

        {/* Offline Cache Breakdown Row */}
        <div className="mt-6 pt-5 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ऑफ़लाइन संथाली शब्दकोश</span>
            </div>
            <div className="text-2xl font-black text-stone-900">
              60+ शब्द & अक्षर
            </div>
            <p className="text-xs text-stone-500 mt-1">
              ओल चिकी वर्णमाला, 1 से 10 तक संख्याएं, पारिवारिक एवं प्राकृतिक शब्दावली कैश्ड हैं।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>निपुण भारत पाठ्यक्रम डेटाबेस</span>
            </div>
            <div className="text-2xl font-black text-stone-900">
              बालवाटिका - कक्षा 3
            </div>
            <p className="text-xs text-stone-500 mt-1">
              समस्त FLN दक्षताएं, मानक लक्ष्य, एवं पाठ पत्रक बिना इंटरनेट लोड होते हैं।
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-700 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>स्थानीय छात्र रिकॉर्ड (SQLite / JSON)</span>
            </div>
            <div className="text-2xl font-black text-stone-900">
              100% सुरक्षित
            </div>
            <p className="text-xs text-stone-500 mt-1">
              पठन गति (WPM) एवं मूल्यांकन आपके फोन/टैबलेट की मेमोरी में सुरक्षित रहता है।
            </p>
          </div>
        </div>
      </div>

      {/* Guide 1: PWA Instant Add to Home Screen */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200">
        <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-teal-700" />
          <span>विधि 1: टैबलेट/स्मार्टफोन में 1-क्लिक PWA इंस्टॉल (सरलतम)</span>
        </h3>
        <p className="text-xs text-stone-600 mt-1">
          ग्रामीण शिक्षकों के फ़ोन में बिना किसी भारी ऐप स्टोर के सीधे इंस्टॉल करें:
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200">
            <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-bold inline-flex items-center justify-center mb-2">
              1
            </span>
            <h4 className="font-bold text-stone-900 text-sm">Chrome में खोलें</h4>
            <p className="text-stone-600 mt-1">
              इस वेब लिंक को विद्यालय के टैबलेट या शिक्षक के Android फ़ोन में Google Chrome में खोलें।
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200">
            <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-bold inline-flex items-center justify-center mb-2">
              2
            </span>
            <h4 className="font-bold text-stone-900 text-sm">Add to Home screen</h4>
            <p className="text-stone-600 mt-1">
              ब्राउज़र के ऊपर दाईं ओर 3-डॉट्स मेनू दबाकर <strong>"Add to Home screen"</strong> या <strong>"Install app"</strong> चुनें।
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-200">
            <span className="w-6 h-6 rounded-full bg-teal-700 text-white font-bold inline-flex items-center justify-center mb-2">
              3
            </span>
            <h4 className="font-bold text-stone-900 text-sm">बिना इंटरनेट चलाएँ</h4>
            <p className="text-stone-600 mt-1">
              फ़ोन की होम स्क्रीन पर एक सुंदर ऐप आइकॉन बन जाएगा जो पूर्ण-स्क्रीन देशी ऐप की तरह बिना नेट के काम करेगा।
            </p>
          </div>
        </div>
      </div>

      {/* Guide 2: Standalone .APK Creation with Bubblewrap or PWABuilder */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200">
        <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
          <Download className="w-5 h-5 text-teal-700" />
          <span>विधि 2: स्वतंत्र Android APK पैकेजिंग (PWABuilder / Bubblewrap)</span>
        </h3>
        <p className="text-xs text-stone-600 mt-1">
          यदि आप पूरे ब्लॉक/ज़िले के सभी शिक्षकों के टैबलेट्स में SD Card या Bluetooth द्वारा <strong>.apk</strong> फ़ाइल वितरित करना चाहते हैं:
        </p>

        <div className="mt-4 space-y-4">
          {/* PWABuilder Tool */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-stone-900">
                विकल्प A: नि:शुल्क ऑनलाइन वेब टूल (PWABuilder.com)
              </span>
              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-teal-700 font-bold text-xs hover:underline"
              >
                <span>pwabuilder.com पर जाएँ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <ol className="list-decimal list-inside text-xs text-stone-600 mt-2 space-y-1">
              <li>pwabuilder.com खोलें और इस ऐप का URL पेस्ट करें।</li>
              <li>"Start" दबाएँ — यह हमारे स्वचालित `manifest.json` और सर्विस वर्कर को वैलिडेट करेगा।</li>
              <li><strong>"Package for Android"</strong> पर क्लिक करें और बिना कोडिंग के सीधे <code>.apk</code> फ़ाइल डाउनलोड करें!</li>
            </ol>
          </div>

          {/* Bubblewrap CLI */}
          <div className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs">
            <div className="flex items-center justify-between text-stone-400 pb-2 border-b border-stone-800">
              <span>विकल्प B: Google Bubblewrap CLI कमान (डेवलपर / IT अधिकारी हेतु)</span>
              <button
                type="button"
                onClick={() =>
                  copyCommand(
                    'npm i -g @bubblewrap/cli\nbubblewrap init --manifest=https://YOUR-APP-URL/manifest.json\nbubblewrap build',
                    'bubblewrap'
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-teal-300 transition-colors"
              >
                {copiedCode === 'bubblewrap' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'bubblewrap' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="mt-2 text-teal-300 overflow-x-auto leading-relaxed">
{`# 1. Bubblewrap इंस्टॉल करें
npm i -g @bubblewrap/cli

# 2. PWA को Android TWA में इनिशियलाइज़ करें
bubblewrap init --manifest=/manifest.json

# 3. Android APK कंपाइल करें
bubblewrap build

# -> आउटपुट: app-release-signed.apk तैयार!`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
