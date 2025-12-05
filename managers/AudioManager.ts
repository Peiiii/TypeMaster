export class AudioManager {
  playSuccessSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'); 
    audio.volume = 0.2;
    audio.play().catch(() => {
      // Browsers may block auto-play without interaction
    });
  };

  speak = (text: string) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };
}
