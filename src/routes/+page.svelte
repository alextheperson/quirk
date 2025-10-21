<script lang="ts">
  import { AudioPlayer } from "$lib/audioPlayer.svelte";
  import { AudioTrackSource, SourceStatus } from "$lib/AudioSource.svelte";
  import { AudioTrack } from "$lib/audioTrack.svelte";

  let track: AudioTrackSource;

  function decodeFile() {
    const files = (document.getElementById("file-input") as HTMLInputElement)
      .files;

    if (files?.length !== 1) {
      alert("One file please.");
      return;
    }

    // Get the raw contents of the first file
    const file = files[0].arrayBuffer();
    file.then((data) => {
      AudioPlayer.context.decodeAudioData(data).then((parsed) => {
        const buffer = new AudioTrack("abc", "", parsed, AudioPlayer.context);
        track = new AudioTrackSource(buffer);
      });
    });
  }

  let times: number[] = [];
  let lengths: number[] = [];

  setInterval(() => {
    AudioPlayer.sources.forEach((val, i) => {
      times[i] = val.time;
      lengths[i] = val.length;
    });
  }, 10);
</script>

<div>
  <h1>Quirk</h1>
  <label for="file-input">Audio File</label>
  <input id="file-input" type="file" /><br />
  <button onclick={decodeFile}> Decode</button> <br />

  <table>
    <thead>
      <tr>
        <th colspan="4">Tracks</th>
      </tr>
      <tr>
        <th>ID</th>
        <th>Status</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      {#key AudioPlayer.sources}
        {#each AudioPlayer.sources as source, i}
          <tr>
            <td>
              {source.id}
            </td>
            <td>
              {SourceStatus[source.status()]}
            </td>
            <td>
              <div
                class="guage"
                style="--amount: {(times[i] / lengths[i]) * 100}%"
              >
                <span>{(times[i] ?? 0).toFixed(1)}</span>
                <span>{(lengths[i] ?? 0).toFixed(1)}</span>
              </div>
            </td>
            <td>
              <button
                onclick={() => {
                  source.start();
                }}>Play</button
              >
              <button
                onclick={() => {
                  source.pause();
                }}>Pause</button
              >
              <button
                onclick={() => {
                  source.stop();
                }}>Stop</button
              >
            </td>
          </tr>
        {/each}
      {/key}
    </tbody>
  </table>
</div>

<style>
  div {
    background-color: #101112;
    color: white;
  }

  table,
  tr,
  td,
  th {
    border: 1px solid white;
    border-collapse: collapse;
    padding: 3px;
  }

  .guage {
    background: linear-gradient(
      to right,
      #fff 0%,
      #fff var(--amount),
      #000 var(--amount),
      #000 100%
    );
    position: relative;
    width: 100px;
    height: 1em;
  }

  .guage > span:nth-child(1) {
    position: absolute;
    left: 0;
    mix-blend-mode: difference;
  }

  .guage > span:nth-child(2) {
    position: absolute;
    right: 0;
    mix-blend-mode: difference;
  }
</style>
