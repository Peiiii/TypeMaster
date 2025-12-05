import { GameManager } from '../managers/GameManager';
import { AudioManager } from '../managers/AudioManager';

export class AppPresenter {
  gameManager: GameManager;
  audioManager: AudioManager;

  constructor() {
    this.audioManager = new AudioManager();
    this.gameManager = new GameManager(this.audioManager);
  }
}
