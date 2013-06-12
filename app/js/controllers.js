'use strict';

/* Controllers */


function TrackController($scope, $timeout) {
	var t,track, m, player, note, model,
		i, j, k, l, loopLength, beat, done = false, max=50;
	m = new MidiPlayer();
	beat=0;
	loopLength = 16;
	
	function addTrack() {
		var t = newTrack();
		$scope.model.tracks.push(t);
	}
	
	function onPlayerLoad() {
		$scope.play = function(){
			for(i=0; i <$scope.model.tracks.length; i++) {
				track = $scope.model.tracks[i];
				var trackBeat = track.pattern[beat];
				
				for(note in track.pattern[beat]) {
					m.playNote(max-parseInt(note),
						parseInt(track.voice),127); //Is this parsing performant?
				}
				
			}
			beat = (beat+1)%loopLength;
		    player = $timeout($scope.play,100);
		    
		};
		
		 $scope.stop = function(){
			$timeout.cancel(player);
		}
	}
	
	function play() {
		player = $timeout($scope.play,100);
	}
	
	function stop() {
		$scope.stop()
	}
	
	
	m.init(onPlayerLoad);
	
	function newTrack(i,j) {
		if(typeof(i)==='undefined') {i = 16;}
		if(typeof(j)==='undefined') {j = 16;}
		var pattern = []
		
		function switchCoordinate(i,j) {
			if(j in pattern[i]) {
				console.log("deleting");
				delete this.pattern[i][j]
			}
			else {
				pattern[i][j] = true;
			}
		}
		
		for(k=0;  k<i; k+=1) {
			pattern.push({});
		}
		//pattern[0][50] = "true"
		console.log($scope.model);
		return {
			'switchCoordinate' : switchCoordinate,
			'i': i,
			'j': j,
			'pattern' : pattern
		};

	}

	$scope.model = {'play' : play,
					'stop' : stop,
					'addTrack' : addTrack};
	t = newTrack();
	$scope.model.tracks = [t]; 	
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
				'voice' : 0,
				'i': i,
				'j': j,
				'pattern' : []
			};
		}
		var t = newTrack();
		$scope.tracks = [t];
	}
  
  ]);