import { GameManager } from '../managers/GameManager';
import { AudioManager } from '../managers/AudioManager';

export class AppPresenter {
  gameManager = new GameManager();
  audioManager = new AudioManager();
}