'use strict';

/* Controllers */


function TrackController($scope, $timeout) {
	
	/*
	function MidiPlayer() {
		this.playNote = function (note, voice, volume) {
			var delay = 0; 
			//var velocity = 127; // how hard the note hits
			// play the note
			MIDI.setVolume(voice, volume);
			MIDI.noteOn(voice, note+36, 127, delay);
		}
		
		this.init = function() {
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
			}
		});
		}
	
	}
	*/
	var m = new MidiPlayer();
	m.init();
	
    $scope.play = function(){
        m.playNote(50,0,128)
        player = $timeout($scope.play,1000);
    }
	
	var player = $timeout($scope.play,1000);
	
	function newTrack(i,j) {
		if(typeof(i)==='undefined') {i = 16;}
		if(typeof(j)==='undefined') {j = 16;}
		return {
			'i': i,
			'j': j,
			'pattern' : []
		};
	}
	var t = newTrack();
	$scope.tracks = [t];
}



angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }]).
  controller('TrackController',[function($scope) {		
		function newTrack(i,j) {
			if(typeof(i)==='undefined') {i = 16;}
			if(typeof(j)==='undefined') {j = 16;}
			return {
				'i': i,
				'j': j,
				'pattern' : []
			};
		}
		var t = newTrack();
		$scope.tracks = [t];
	}
  
  ]);