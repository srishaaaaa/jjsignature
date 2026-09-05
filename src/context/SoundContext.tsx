import React, { createContext, useContext, useState, useEffect } from 'react';

type SoundType = 'success' | 'error' | 'alert' | 'bell' | 'buzzer';

interface SoundContextType {
  play: (type: SoundType) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// A single shared AudioContext, created lazily on first use and reused for
// every beep thereafter. Browsers cap the number of concurrent AudioContexts
// (Chrome allows only a handful); the low-stock alarm alone calls play()
// every ~1.4s while it's showing, so creating a fresh one per call would
// exhaust that limit within seconds and make sounds (and eventually the
// tab) stutter.
let sharedAudioCtx: AudioContext | null = null
const getAudioContext = (): AudioContext | null => {
  try {
    if (!sharedAudioCtx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
      sharedAudioCtx = new Ctor()
    }
    if (sharedAudioCtx.state === 'suspended') void sharedAudioCtx.resume()
    return sharedAudioCtx
  } catch {
    return null
  }
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('jj_signature_sounds');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('jj_signature_sounds', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const play = (type: SoundType) => {
    if (!soundEnabled) return;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'alert') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(800, now + 0.1);
        osc.frequency.setValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'bell') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gain.gain.setValueAtTime(0.3, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'buzzer') {
        // Urgent two-tone siren, loud and unmistakable — used for the
        // persistent low-stock alarm, distinct from the short 'alert' beep.
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(660, now + 0.15);
        osc.frequency.setValueAtTime(880, now + 0.3);
        osc.frequency.setValueAtTime(660, now + 0.45);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.03);
        gain.gain.setValueAtTime(0.35, now + 0.55);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
        osc.start(now);
        osc.stop(now + 0.65);
      }
    } catch (e) {
      console.warn('Audio API not supported or user not interacted yet.', e);
    }
  };

  return (
    <SoundContext.Provider value={{ play, soundEnabled, setSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- provider + hook co-located by design
export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
