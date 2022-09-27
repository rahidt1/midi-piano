const audioContext = new AudioContext();

const NOTE_DETAILS = [
  { note: "C", key: "Z", frequency: 261.626 },
  { note: "Db", key: "S", frequency: 277.183 },
  { note: "D", key: "X", frequency: 293.665 },
  { note: "Eb", key: "D", frequency: 311.127 },
  { note: "E", key: "C", frequency: 329.628 },
  { note: "F", key: "V", frequency: 349.228 },
  { note: "Gb", key: "G", frequency: 369.994 },
  { note: "G", key: "B", frequency: 391.995 },
  { note: "Ab", key: "H", frequency: 415.305 },
  { note: "A", key: "N", frequency: 440 },
  { note: "Bb", key: "J", frequency: 466.164 },
  { note: "B", key: "M", frequency: 493.883 },
];

// Get specific note based on pressed key
const getNoteDetail = function (keyboardKey) {
  return NOTE_DETAILS.find((note) => `Key${note.key}` === keyboardKey);
};

// Play note
const playNote = function () {
  NOTE_DETAILS.forEach((n) => {
    const keyElement = document.querySelector(`[data-note = "${n.note}"]`);

    // Change key color when active
    /*
    if (n.active) keyElement.classList.add("active");
    else keyElement.classList.remove("active");
    */

    // Second parameter in toggle is 'force' parameter. It adds class if true, removes class if false
    // Using OR because undefined does not work in toggle. Only true/false
    keyElement.classList.toggle("active", n.active || false);

    // Initially we stop all oscillator when key is pressed (keydown) (though there is none)
    // Then we startNote for active notes
    // Then stop all oscillator when keyup. This way note is played as long as key is pressed
    if (n.oscillator) {
      n.oscillator.stop();
      n.oscillator.disconnect();
    }
  });

  // Filter only active notes
  const activeNotes = NOTE_DETAILS.filter((n) => n.active);

  // Determines volume percentage. 1 note, 100% volume, 2 note 50% volume
  const gain = 1 / activeNotes.length;

  activeNotes.forEach((n) => {
    startNote(n, gain);
  });
};

// Play note based on frequency
const startNote = function (noteDetail, gain) {
  const gainNode = audioContext.createGain(); // Determine volume of output (Always remain on 100%, while playing multiple note)

  gainNode.gain.value = gain;

  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = noteDetail.frequency;
  oscillator.type = "sine";
  oscillator.connect(gainNode).connect(audioContext.destination); //connect to speaker
  oscillator.start();
  noteDetail.oscillator = oscillator;
};

// Set note as active/inactive on keydown/keyup
const checkNoteDetail = function (event) {
  const noteDetail = getNoteDetail(event.code);

  if (!noteDetail) return;

  event.type === "keydown"
    ? (noteDetail.active = true)
    : (noteDetail.active = false);

  playNote();
};

///////////////////////////////////////////////////
document.addEventListener("keydown", function (e) {
  if (e.repeat) return; // Prevent repeatedly calling the event, if key is hold

  checkNoteDetail(e);
});
document.addEventListener("keyup", function (e) {
  checkNoteDetail(e);
});
