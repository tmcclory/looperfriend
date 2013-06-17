'use strict';

/* Controllers */


function TrackController($scope, $timeout) {
	var t,track, m, player, note, model,
		i, j, k, l, loopLength, beat, done = false, max=24,
		activePatterns, scenes, activeScene, trackCount, sceneCount;
	
	function keys(obj) {
		var i, objKeys = [];
		for(i in obj) {
				if (obj.hasOwnProperty(i)) {
				objKeys.push(i);
			}
		}
		return objKeys;
	}
	//scenes[track][scene] = activePatterns
	scenes = {0: [{0:true},{0:true}]}; //Initial value
	//scenes = [[0,0],[0,0]];
	activeScene = 0;
	//m = new MidiPlayer();
	beat=0;
	loopLength = 16;
	trackCount = 0;
	sceneCount = 2;
	//activePatterns = {};
	
	function addScene() {
		
		var tracks = $scope.model.tracks.length;
		for(i=0; i<$scope.model.tracks.length; i+=1) {
			$scope.model[i][$scope.model.sceneCount] = {};
		}
		$scope.model.sceneCount+=1;
		
	}
	
	function onPlayerLoad() {
		var patternID, trackKeys;
		
		$scope.play = function(){
			for(i=0; i <$scope.model.tracks.length; i+=1) {
				track = $scope.model.tracks[i];
				activeScene = $scope.model.activeScene;
				trackKeys = keys($scope.model.scenes[i][activeScene]);
				for(j=0; j<trackKeys.length; j+=1) {
					patternID = trackKeys[j];
					var pattern = track.patterns[parseInt(patternID,10)];
					var trackBeat = pattern[beat];
					for(note in trackBeat) {
					/*	m.playNote(max-parseInt(note),
							parseInt(track.voice),track.volume); //Is this parsing performant?
					*/
						//console.log("Playing note..." + (max-note))
						playNote(max-parseInt(note),parseInt(track.voice));
					}
				}
			}
			beat = (beat+1)%loopLength;
		    player = $timeout($scope.play,100);
		    
		};
		
		$scope.playBar = function(bar){
			var b =0;
			var numBeats = 16;
			var startTime = oscContext.currentTime;
			//console.log(startTime)
			var beatLength = .1;
			for(b=0; b<numBeats; b+=1) {
				//start
				var stopTime = startTime + ((b+1) * beatLength)
				var thisStart = startTime + ((b) * beatLength)
				//console.log(stopTime)
				for(i=0; i <$scope.model.tracks.length; i+=1) {
					track = $scope.model.tracks[i];
					activeScene = $scope.model.activeScene;
					trackKeys = keys($scope.model.scenes[i][activeScene]);
					for(j=0; j<trackKeys.length; j+=1) {
						patternID = trackKeys[j];
						var pattern = track.patterns[parseInt(patternID,10)];
						var trackBeat = pattern[b];
						for(note in trackBeat) {
						/*	m.playNote(max-parseInt(note),
								parseInt(track.voice),track.volume); //Is this parsing performant?
						*/
							//console.log("Playing note..." + (max-note))
							playNote(max-parseInt(note),parseInt(track.voice), thisStart, stopTime);
						}
					}
				}
			}
			//beat = (beat+1)%loopLength;
		    player = $timeout($scope.playBar,1000);
		    
		};
		
		 $scope.stop = function(){
		 	//oscillator.stop(3);
			$timeout.cancel(player);
		}
	}
	
	function play() {
		if(!$scope.model.playing) {
			$scope.model.playing = true;
			player = $timeout($scope.playBar,1000);
		}
	}
	
	function stop() {
		$scope.model.playing = false;
		$scope.stop()
	}
	
	
	//m.init(onPlayerLoad);
	onPlayerLoad();
	
	function newTrack(i,j, trackID) {
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
			var scene = $scope.model.activeScene
			var patterns = $scope.model.scenes[this.trackID][scene]
			if(i in patterns) {
				delete patterns[i]
			}
			else {
				patterns[i] = true;
			}
		}
		
		function isActivePattern(i) {
			var scene = $scope.model.activeScene;
			var patterns = $scope.model.scenes[this.trackID][scene];
			if(i in patterns) {
				return 'on';
			}
			else {
				return 'off';
			}
		}
		
		function getCoordinate(pattern, i,j) {
			if(i===0) {
				
			}
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
			'voice' : 0,
			'trackID' : trackID,
			'volume' : 127,
			'isCollapsed' : false
 		};

	}

	function addTrack() {
		var t = newTrack(24,16,trackCount);
		$scope.model.scenes[trackCount] = []
		for(i=0; i<$scope.model.scenes[0].length; i++) {
			$scope.model.scenes[trackCount].push({})
		}
		trackCount+=1;
		$scope.model.tracks.push(t);
	}

	$scope.model = {'play' : play,
					'stop' : stop,
					'playing' : false,
					'addTrack' : addTrack,
					'scenes' :  scenes,
					'activeScene' : activeScene,
					'sceneCount' :  sceneCount};
	t = newTrack(24,16,trackCount);
	trackCount+=1
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
		var t = newTrack(16,16,trackCount);
		trackCount+=1;
		$scope.tracks = [t];
	}
  
  ]);