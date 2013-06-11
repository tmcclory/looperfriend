'use strict';

/* Controllers */


function TrackController($scope, $timeout) {
	var t,track, m, player, pattern, note,
		i, j, k, loopLength, beat, done = false;
	m = new MidiPlayer();
	//m.init();
	beat=0;
	loopLength = 16;
	
	function finish() {
		$scope.play = function(){
			for(i=0; i <$scope.tracks.length; i++) {
				track = $scope.tracks[i];
				//console.log(track.pattern);
				for(note in track.pattern[beat]) {
					m.playNote(parseInt(note),0,127); //Is this parsing performant?
				}
			}
			beat = (beat+1)%loopLength;
		    player = $timeout($scope.play,100);
		    
		};
		
		player = $timeout($scope.play,100);
	}
	
	m.init(finish);
	
	function newTrack(i,j) {
		if(typeof(i)==='undefined') {i = 16;}
		if(typeof(j)==='undefined') {j = 16;}
		
		pattern = [];
		for(k=0;  k<i; k+=1) {
			pattern.push({});
		}
		pattern[0][50]=true;
		return {
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