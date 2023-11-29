'use client';

import JSConfetti from 'js-confetti';
import { create } from 'zustand';

const jsConfetti = new JSConfetti();

interface ConfettiState {
  confetti: JSConfetti;
  fireConfetti: () => void;
}

export const useConfetti = create<ConfettiState>()((set, get) => ({
  confetti: new JSConfetti(),
  fireConfetti: () => {
    get().confetti.addConfetti({
      emojis: ['✨', '💫', '🌈', '💸', '💰', '💵', '🤑', '💴', '💷', '🅿️'],
      emojiSize: 60,
      confettiNumber: 200,
    });
    // enable vibration support
    navigator.vibrate =
      navigator.vibrate ||
      (navigator as any).webkitVibrate ||
      (navigator as any).mozVibrate ||
      (navigator as any).msVibrate;

    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    console.log('Yay!', '✨', '💫', '🌈', '🍉');
  },
}));
