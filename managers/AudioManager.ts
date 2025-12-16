export class AudioManager {
  private typeSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2364/2364-preview.mp3'); // Soft click
  private successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'); // Success chime
  private errorSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'); // Error thud

  constructor() {
    this.typeSound.volume = 0.3;
    this.successSound.volume = 0.2;
    this.errorSound.volume = 0.1;
  }

  playTypeSound = () => {
    // Clone node to allow rapid overlapping sounds
    const sound = this.typeSound.cloneNode() as HTMLAudioElement;
    sound.volume = 0.2; 
    sound.play().catch(() => {});
  };

  playErrorSound = () => {
    this.errorSound.currentTime = 0;
    this.errorSound.play().catch(() => {});
  };

  playSuccessSound = () => {
    this.successSound.currentTime = 0;
    this.successSound.play().catch(() => {});
  };

  speak = (text: string) => {
    if (!text) return;
    // Cancel any current speech to prevent queue buildup
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  };
}