import { type AudioSoruce } from "./AudioSource.svelte";

/**
  * Maintains an `AudioContext`, and serves as the audio sync
  **/
export class AudioPlayer {
  private static _shared = new AudioPlayer()

  private _context: AudioContext = new AudioContext();

  private _sources: AudioSoruce[] = $state([]);

  private _currentId: number = 0;

  static get sources() { return AudioPlayer._shared._sources }
  static set sources(val) { AudioPlayer._shared._sources = val }

  private static get currentId() { return AudioPlayer._shared._currentId }
  private static set currentId(val) { AudioPlayer._shared._currentId = val }

  /**
    * Generate a unique (to this audio player) ID
    */
  static nextId() {
    AudioPlayer.currentId += 1;
    return AudioPlayer.currentId;
  }

  static get context() { return AudioPlayer._shared._context }
}
