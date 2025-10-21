import { AudioPlayer } from "./audioPlayer.svelte";
import type { AudioTrack } from "./audioTrack.svelte";

export enum SourceStatus {
  "UNSTARTED",
  "PLAYING",
  "PAUSED",
  "ENDED"
}

export interface AudioSoruce {
  id: number;
  node: AudioNode;

  time: number
  readonly length: number

  start(): void
  pause(): void
  stop(): void

  status(): SourceStatus
}

export class AudioTrackSource implements AudioSoruce {
  id: number;
  source: AudioTrack;
  startedAt = 0;
  pausedAt = 0;
  private _status: SourceStatus = SourceStatus.UNSTARTED

  node: AudioBufferSourceNode;

  constructor(source: AudioTrack) {
    this.id = AudioPlayer.nextId()
    this.source = source;

    this.node = AudioPlayer.context.createBufferSource();
    this.init();
    AudioPlayer.sources.push(this);
  }

  init() {
    this.node = AudioPlayer.context.createBufferSource();
    this.node.buffer = this.source.data;
    this.node.connect(AudioPlayer.context.destination);

    this.node.addEventListener("ended", () => { if (this.status() !== SourceStatus.PAUSED) { this.stop() } })
  }

  start() {
    console.log("start...", this)
    switch (this.status()) {
      case SourceStatus.UNSTARTED:
        this.node.start();
        this._status = SourceStatus.PLAYING;
        this.startedAt = AudioPlayer.context.currentTime;
        break;

      case SourceStatus.PAUSED:
        this.init();
        this._status = SourceStatus.PLAYING;
        this.node.start(0, this.time);
        this.startedAt = AudioPlayer.context.currentTime - this.pausedAt;
        break;

      case SourceStatus.ENDED:
        throw Error("This track has stopped")
    }
  }

  pause() {
    console.log("pause...", this)
    this.pausedAt = this.time;
    this._status = SourceStatus.PAUSED
    this.node.stop()
  }

  stop() {
    console.log("stop...", this)
    if (this.status() !== SourceStatus.UNSTARTED) {
      this.node.stop()
    }
    this.pausedAt = this.time;
    this._status = SourceStatus.ENDED

    const index = AudioPlayer.sources.findIndex((val) => val.id === this.id)
    AudioPlayer.sources.splice(index, 1)
  }

  status() {
    return this._status
  }

  get time() {
    switch (this.status()) {
      case SourceStatus.PLAYING:
        return AudioPlayer.context.currentTime - this.startedAt;
      case SourceStatus.PAUSED:
        return this.pausedAt;
      case SourceStatus.ENDED:
        return this.pausedAt;
      case SourceStatus.UNSTARTED:
        return 0;
    }
  }

  set time(val) {
    throw Error("Not yet!")
  }

  get length() {
    return this.source.length
  }
}
