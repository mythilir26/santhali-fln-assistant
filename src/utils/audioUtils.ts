/**
 * Audio utility for bilingual Hindi-Santhali pronunciation and microphone recording
 */

export function playSpokenText(
  text: string, 
  lang: 'hi' | 'sat' | 'en' = 'hi',
  rate: number = 0.85
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported on this device');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate; // slower speed for early grade FLN learners
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();

  if (lang === 'hi' || lang === 'sat') {
    // For Santhali phonetics or Hindi, prioritize Indian Hindi or Indian English voice
    const indianVoice = voices.find(
      (v) => v.lang.startsWith('hi') || v.lang.includes('hi-IN') || v.lang.includes('hi_IN')
    ) || voices.find(
      (v) => v.lang.includes('en-IN') || v.lang.includes('ta-IN') || v.lang.includes('mr-IN')
    );

    if (indianVoice) {
      utterance.voice = indianVoice;
    }
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-US';
  }

  window.speechSynthesis.speak(utterance);
}

// Simple pleasant audio chime for classrooms using Web Audio API
export function playChime(type: 'success' | 'click' | 'bell') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'success') {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'click') {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else {
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    }
  } catch (e) {
    // AudioContext blocked or not supported
  }
}
