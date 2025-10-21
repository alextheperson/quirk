/**
  * Holds the information about a particular track, which might be played by a cue. It holds the metadata in addition to the track itself. Try to avoid copying these classes, as the uncompressed audio data is likely to be quite large.
  **/
export class AudioTrack {
  private _title;
  private _path;
  private _numberOfChannels;
  private _numberOfSamples;
  private _sampleRate;

  private _audiodata: AudioBuffer;

  constructor(title: string, path: string, data: AudioBuffer, context: AudioContext) {
    // Do some checks
    // if (data.length !== channels) {
    //   throw new Error(`The data should have the specified number of channels (expected ${channels}, got ${data.length}).`);
    // }
    // data.forEach((channel, i) => {
    //   if (channel.length !== numberOfSamples) {
    //     throw new Error(`Channel number ${i} should have the specified number of samples (expected ${numberOfSamples}, got ${channel.length}).`);
    //   }
    // })
    //
    // this._audiodata = context.createBuffer(channels, numberOfSamples, bitrate);
    //
    // for (let i = 0; i < data.length; i++) {
    //   let channel = this._audiodata.getChannelData(i);
    //   // Sadly, we have to set each sample by hand
    //   for (let j = 0; j < channel.length; j++) {
    //     channel[j] = data[i][j];
    //   }
    // }

    this._audiodata = data;

    this._title = title;
    this._path = path;
    this._numberOfChannels = data.numberOfChannels;
    this._numberOfSamples = data.length;
    this._sampleRate = data.sampleRate;
  }

  /**
    * Get the length of the track in seconds
    **/
  get length() { return this._numberOfSamples / this._sampleRate; }

  /**
   * Number of bits used to store the audio data (*just* the audio data)
   **/
  get size() { throw Error("It turns out finding the size is really hard.") }

  get title() { return this._title }
  set title(title) { this._title = title }

  get path() { return this._path }
  set path(path) { this._path = path }

  get numberOfChannels() { return this._numberOfChannels }
  set numberOfChannels(numberOfChannels) { this._numberOfChannels = numberOfChannels }

  get numberOfSamples() { return this._numberOfSamples }
  set numberOfSamples(numberOfSamples) { this._numberOfSamples = numberOfSamples }

  get bitrate() { return this._sampleRate }
  set bitrate(bitrate) { this._sampleRate = bitrate }

  /**
    * Be carful with this one!
    **/
  get data() { return this._audiodata }
  /**
    * Be carful with this one!
    **/
  set data(data) { this._audiodata = data }
}
