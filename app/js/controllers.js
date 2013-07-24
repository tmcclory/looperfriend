'use strict';

/* Controllers */


function TrackController($scope, $timeout) {
	var t,track, m, player, armedPlayer, note, model,
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
	scenes = {0: [{0:true},{0:true}]}; //Initial value
	var list = 'list'
	var arrangement = [0,1,0,1];
	var arrangement2 =  [ [ [[[0,2],[1,2]] ,2] , [ [[3,2],[4,2]] ,2] ] ,2];
	activeScene = 0;
	m = new MidiPlayer();
	beat=0;
	loopLength = 16;
	trackCount = 0;
	sceneCount = 2;
	var startTime = 0
	var totalBeats = 0;

	function addScene() {
		
		var tracks = $scope.model.tracks.length;
		for(i=0; i<$scope.model.tracks.length; i+=1) {
			$scope.model.scenes[i][$scope.model.sceneCount] = {};
		}
		$scope.model.sceneCount+=1;
		
	}
	
	function onPlayerLoad() {
		var patternID, trackKeys;
		
		$scope.playArmedPattern = function(beat) {			
			var track = $scope.model.tracks[$scope.model.armedPattern[0]];
			var patternID = $scope.model.armedPattern[1];
			var pattern = track.patterns[parseInt(patternID,10)];
			var trackBeat = pattern[beat];
			var t = oscContext.currentTime


			for(note in trackBeat) {

				var start = oscContext.currentTime;
				var stop = start + .1; // TODO remove fixed length
				playNote(max-parseInt(note),parseInt(track.voice), start, stop);
			}
			if(beat<=15) {
				armedPlayer = $timeout(function() {$scope.playArmedPattern(beat+1);},100);
			}
		};
		
		
		$scope.playArmed = function(){
			$scope.playScene($scope.model.activeScene)
			//beat = (beat+1)%loopLength;
		    armedPlayer = $timeout($scope.play,100);
		    
		};
		
		//var startTime;// = oscContext.currentTime;
		$scope.playScene = function(scene){
			var b =0;
			var numBeats = 16;
			
			startTime = oscContext.currentTime;
			var beatLength = .1;

			for(i=0; i <$scope.model.tracks.length; i+=1) {
				track = $scope.model.tracks[i];
				activeScene = scene;
				trackKeys = keys($scope.model.scenes[i][activeScene]);
				for(j=0; j<trackKeys.length; j+=1) {
					patternID = trackKeys[j];
					var beatCount = 0
					var pattern = track.patterns[parseInt(patternID,10)];
					if(!(i===$scope.model.armedPattern[0] && j===$scope.model.armedPattern[1])) {
						for(b=0; b<numBeats; b+=1) {
							//start 
							
							var stopTime = startTime + ((beatCount+1) * beatLength); //+ .1
							var thisStart = startTime + ((beatCount) * beatLength) + .1
							beatCount+=1;
							var trackBeat = pattern[b];
							for(note in trackBeat) {
								m.queueNote(max-parseInt(note),
							parseInt(track.voice),track.volume,thisStart); //Is this parsing performant?
							
								//console.log("Playing note..." + (max-note))
								//playNote(max-parseInt(note),parseInt(track.voice), thisStart, stopTime);
								//playSample((max-parseInt(note))%3, thisStart, stopTime);
							
							}
						}
					}
				}
			}
			armedPlayer = $timeout(function () {$scope.playArmedPattern(0);}, 100);
			//totalBeats+=numBeats
			//beat = (beat+1)%loopLength;
		    //player = $timeout($scope.playBar,1600);
		    
		};
		
		$scope.playBar = function(bar){ 
			$scope.playScene($scope.model.activeScene)
			//totalBeats+=numBeats
			//beat = (beat+1)%loopLength;
		    player = $timeout($scope.playBar,1600);
		};
		
		 $scope.stop = function(){
		 	//oscillator.stop(3);
			$timeout.cancel(player);
		}
	}
	
	
	function play() {
		if(!$scope.model.playing) {
			$scope.model.playing = true;
			startTime = oscContext.currentTime;
			totalBeats = 0;
			player = $timeout($scope.playBar,0);
		}
	}
	
	
	function stop() {
		$scope.model.playing = false;
		$scope.stop()
		$timeout.cancel(player);
		$timeout.cancel(armedPlayer);
	}
	
	
	function playArrangement(arrangement) {
		stop()
		var i =0;
			startTime = oscContext.currentTime;
		
		for(i=0; i<arrangement.length; i+=1) {
			var playFunction = (function (i) {
				return function () {$scope.playScene(arrangement[i])}})(i)
			player = $timeout(playFunction,1600*i);
			
		}
	}
	
	function playArrangementString(arrangementString) {
		arrangement = arrangementString.split("");
		// TODO sanity check
		playArrangement(arrangement);
	}
	
	function playMainArrangement() {
		playArrangementString($scope.model.arrangementString);
	}
	
	m.init(onPlayerLoad);
	
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
		for(i=0; i<$scope.model.scenes[0].length; i+=1) {
			$scope.model.scenes[trackCount].push({})
		}
		trackCount+=1;
		$scope.model.tracks.push(t);
	}
	
	$scope.model = {'play' : play,
					'playArrangement': playArrangement,
					'playMainArrangement': playMainArrangement,
					'arrangementString' : '1',
					'stop' : stop,
					'playing' : false,
					'addTrack' : addTrack,
					'scenes' :  scenes,
					'activeScene' : activeScene,
					'sceneCount' :  sceneCount,
					'addScene' : addScene,
					'armedPattern' : [0,0]};

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