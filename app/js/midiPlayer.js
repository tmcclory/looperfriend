

function MidiPlayer() {
	this.playNote = function (note, voice, volume) {
		var delay = 0; 
		//var velocity = 127; // how hard the note hits
		// play the note
		MIDI.setVolume(voice, volume);
		MIDI.noteOn(voice, note+36, 127, delay);
	}
	
	this.queueNote = function (note, voice, volume, time) {
		var delay = 0; 
		//var velocity = 127; // how hard the note hits
		// play the note
		MIDI.setVolume(voice, volume);
		MIDI.noteOn(voice, note+36, 127, time);
	}
	
	this.init = function(cb) {
		MIDI.loadPlugin({
		soundfontUrl: "./soundfont/",
		instrument: [ "acoustic_grand_piano", "synth_drum", "percussive_organ", "clavinet"],
		callback: function() {
			MIDI.programChange(1, 118);
			MIDI.programChange(2, 17);
			MIDI.programChange(3, 7);
			var delay = 0; // play one note every quarter second
			var note = 50; // the MIDI note
			var note2 = 54; // the MIDI note
			var note3 = 57; // the MIDI note
			var velocity = 127; // how hard the note hits
			// play the note
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, note, velocity, delay);
			MIDI.noteOff(0, note, delay + 2.75);
			MIDI.noteOn(0, note2, velocity, delay);
			MIDI.noteOff(0, note2, delay + 3.75);
			MIDI.noteOn(0, note3, velocity, delay);
			MIDI.noteOff(0, note3, delay + 4.75);
			cb();
		}
	});
	}

}
