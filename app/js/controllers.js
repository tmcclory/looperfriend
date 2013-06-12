'use strict';

/* Controllers */


function TrackController($scope, $timeout) {
	var t,track, m, player, note,
		i, j, k, l, loopLength, beat, done = false, max=50;
	m = new MidiPlayer();
	beat=0;
	loopLength = 16;
	
	function onPlayerLoad() {
		$scope.play = function(){
			for(i=0; i <$scope.tracks.length; i++) {
				track = $scope.tracks[i];
				var trackBeat = track.pattern[beat];
				
				for(note in track.pattern[beat]) {
					m.playNote(max-parseInt(note),0,127); //Is this parsing performant?
				}
				
			}
			beat = (beat+1)%loopLength;
		    player = $timeout($scope.play,100);
		    
		};
		
		player = $timeout($scope.play,100);
	}
	

	
	m.init(onPlayerLoad);
	
	function newTrack(i,j) {
		if(typeof(i)==='undefined') {i = 16;}
		if(typeof(j)==='undefined') {j = 16;}
		var pattern = []
		
		function switchCoordinate(i,j) {
			if(j in pattern[i]) {
				delete track.pattern[i][j]
			}
			else {
				pattern[i][j] = true;
			}
		}
		
		for(k=0;  k<i; k+=1) {
			pattern.push({});
		}
		//pattern[0][50] = "true"
		return {
			'switchCoordinate' : switchCoordinate,
			'i': i,
			'j': j,
			'pattern' : pattern
		};
	}
	t = newTrack();
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