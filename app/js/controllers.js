'use strict';

/* Controllers */


function TrackController($scope, $timeout) {
	var t,track, m, player, note, model,
		i, j, k, l, loopLength, beat, done = false, max=50,
		activePatterns, scenes, activeScene;
	
	function keys(obj) {
		var i, objKeys = [];
		for(i in obj) {
				if (obj.hasOwnProperty(i)) {
				objKeys.push(i);
			}
		}
		return objKeys;
	}
	
	scenes = [[0,0],[0,0]];
	activeScene = 0;
	m = new MidiPlayer();
	beat=0;
	loopLength = 16;
	//activePatterns = {};
	
	
	function onPlayerLoad() {
		var patternID, trackKeys;
		$scope.play = function(){
			for(i=0; i <$scope.model.tracks.length; i++) {
				track = $scope.model.tracks[i];
				trackKeys = keys(track.activePatterns);
				for(j=0; j<trackKeys.length; j+=1) {
					patternID = trackKeys[j];
					var pattern = track.patterns[parseInt(patternID,10)]
					var trackBeat = pattern[beat];
					for(note in trackBeat) {
						m.playNote(max-parseInt(note),
							parseInt(track.voice),127); //Is this parsing performant?
					}
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
		if(!$scope.model.playing) {
			$scope.model.playing = true;
			player = $timeout($scope.play,100);
		}
	}
	
	function stop() {
		$scope.model.playing = false;
		$scope.stop()
	}
	
	
	m.init(onPlayerLoad);
	
	function newTrack(i,j) {
		var activePatterns = {0:true};
		if(typeof(i)==='undefined') {i = 16;}
		if(typeof(j)==='undefined') {j = 16;}
		var pattern = []
		var patterns = []
		
		function addPattern() {
			pattern  = []
			for(k=0;  k<i; k+=1) {
				pattern.push({});
			}
			this.patterns.push(pattern)
		}
		
		function switchActivePattern(i) {
			if(i in this.activePatterns) {
				delete this.activePatterns[i]
			}
			else {
				this.activePatterns[i] = true;
			}
		}
		
		function isActivePattern(i) {
			if(i in this.activePatterns) {
				return 'on';
			}
			else {
				return 'off';
			}
		}
		
		function getCoordinate(pattern, i,j) {
			if(j in pattern[i]) {
				return 'on'
			}
			else {
				return 'off';
			}
		}
		
		function switchCoordinate(pattern, i,j) {
			if(j in pattern[i]) {
				delete pattern[i][j]
			}
			else {
				pattern[i][j] = true;
			}
		}
		
		for(k=0;  k<i; k+=1) {
			pattern.push({});
		}
		patterns.push(pattern)
		//patterns.push(pattern)
		//pattern[0][50] = "true"
		return {
			'addPattern' : addPattern,
			'switchCoordinate' : switchCoordinate,
			'getCoordinate' : getCoordinate,
			'switchActivePattern' : switchActivePattern,
			'isActivePattern' : isActivePattern,
			'i': i,
			'j': j,
			'activePatterns' : activePatterns,
			'patterns' : patterns,
			'voice' : 0
 		};

	}

	function addTrack() {
		var t = newTrack();
		$scope.model.tracks.push(t);
	}

	$scope.model = {'play' : play,
					'stop' : stop,
					'playing' : false,
					'addTrack' : addTrack,
					'scenes' :  scenes,
					'activeScene' : activeScene};
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