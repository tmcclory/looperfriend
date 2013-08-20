'use strict';

/* Controllers */


function TrackController($scope, $timeout) {
	var t,track, m, player, armedPlayer, note, model,
		i, j, k, l, loopLength, beat, done = false, max=24,
		activePatterns, scenes, activeScene, trackCount, sceneCount,
		list, arrangement, arrangement2, startTime, totalBeats;
	
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
	list = 'list';
	arrangement = [0,1,0,1];
	arrangement2 =  [ [ [[[0,2],[1,2]] ,2] , [ [[3,2],[4,2]] ,2] ] ,2];
	activeScene = 0;
	m = new MidiPlayer(); // m is externally defined
	beat=0;
	loopLength = 16;
	trackCount = 0;
	sceneCount = 2;
	startTime = 0;
	totalBeats = 0;

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
			var track, patternID, pattern, trackBeat, t, note, start, stop;
					
			track = $scope.model.tracks[$scope.model.armedPattern[0]];
			patternID = $scope.model.armedPattern[1];
			pattern = track.patterns[parseInt(patternID,10)];
			if (track.isActivePattern(patternID) === 'on') {
				trackBeat = pattern[beat];
				t = oscContext.currentTime; // oscContext is externally defined
	
	
				for(note in trackBeat) {
	
					start = oscContext.currentTime;
					stop = start + .1; // TODO remove fixed length
					playNote(max-parseInt(note),parseInt(track.voice), start, stop);
				}
			}
			if(beat<=15) {
				armedPlayer = $timeout(function() {$scope.playArmedPattern(beat+1);},
					$scope.model.millisPerBeat);
			}
			
		};
		
		
		$scope.playArmed = function(){
			$scope.playScene($scope.model.activeScene);
		    armedPlayer = $timeout($scope.play,$scope.model.millisPerBeat);
		    
		};
		
		$scope.playScene = function(scene){
			var b, numBeats, beatLength, beatCount, pattern, stopTime,
			thisStart, trackBeat, note;
			
			b =0;
			numBeats = 16;
			startTime = oscContext.currentTime;
			beatLength = $scope.model.millisPerBeat /1000;

			for(i=0; i <$scope.model.tracks.length; i+=1) {
				track = $scope.model.tracks[i];
				activeScene = scene;
				trackKeys = keys($scope.model.scenes[i][activeScene]);
				for(j=0; j<trackKeys.length; j+=1) {
					patternID = trackKeys[j];
					beatCount = 0;
					pattern = track.patterns[parseInt(patternID,10)];
					if(!(i===$scope.model.armedPattern[0] && parseInt(patternID,10)===$scope.model.armedPattern[1])) {  
						for(b=0; b<numBeats; b+=1) {
							//start 
							
							stopTime = startTime + ((beatCount+1) * beatLength); //+ .1
							thisStart = startTime + ((beatCount) * beatLength) + beatLength
							beatCount+=1;
							trackBeat = pattern[b];
							for(note in trackBeat) {
								m.queueNote(max-parseInt(note),
							        parseInt(track.voice),track.volume,thisStart);
							}
						}
					}
				}
			}
			if($scope.model.armedPattern) {
				armedPlayer = $timeout(function () {$scope.playArmedPattern(0);}, $scope.model.millisPerBeat);
		    }
		};
		
		$scope.playBar = function(bar){ 
			$scope.playScene($scope.model.activeScene)
		    player = $timeout($scope.playBar,16 * $scope.model.millisPerBeat); // TODO unfix 16
		};
		
		 $scope.stop = function(){
			$timeout.cancel(player);
		};
	}	
	
	function play() {
		if(!$scope.model.playing) {
			$scope.model.playing = true;
			startTime = oscContext.currentTime; //oscContext externally defined
			totalBeats = 0;
			player = $timeout($scope.playBar,0);
		}
	}
	
	
	function stop() {
		$scope.model.playing = false;
		$scope.stop();
		$timeout.cancel(player);
		$timeout.cancel(armedPlayer);
	}
	
	function playArrangementPosition(arrangement, i) {
		if(i<arrangement.length) { 
			$scope.playScene(arrangement[i]);
			
			var playFunction = (function (arrangement, j) {
				return function () {playArrangementPosition(arrangement, j);};} (arrangement, i+1));
			
			player = $timeout(playFunction,16* $scope.model.millisPerBeat);
		}
	}
	
	function playArrangement(arrangement) {
		stop();
		var i =0;
		startTime = oscContext.currentTime; //oscContext is externally defined
		playArrangementPosition(arrangement,0);
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
	
	
	//"tracks":[{"i":24,"j":16,"activePatterns":{"0":true},"patterns":[[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]],"voice":0,"trackID":0,"volume":127,"isCollapsed":false,"index":0,"$$hashKey":"008"}]}
	function newTrack(i,j, trackID, activePatterns, patterns, voice, volume, isCollapsed) {
		//TODO combine index/trackID
		if(typeof(i)==='undefined') {i = 16;}
		if(typeof(j)==='undefined') {j = 16;}
		if(typeof(trackID)==='undefined') {trackID = 0;}
		if(typeof(activePatterns)==='undefined') {
			var activePatterns = {0:true};
		}
		if(typeof(patterns)==='undefined') {
			var pattern, patterns;
			pattern = [];
			patterns = [];
			
			for(k=0;  k<i; k+=1) {
				pattern.push({});
			}
			patterns.push(pattern);
		}
		if(typeof(voice)==='undefined') {voice = 0;}
		if(typeof(volume)==='undefined') {volume = 127;}
		if(typeof(isCollapsed)==='undefined') {isCollapsed = false;}
		
		function addPattern() {
			var pattern  = [];
			for(k=0;  k<i; k+=1) {
				pattern.push({});
			}
			this.patterns.push(pattern);
		}
		
		function switchActivePattern(i) {
			var scene, patterns;
			
			scene = $scope.model.activeScene;
			patterns = $scope.model.scenes[this.trackID][scene];
			if(i in patterns) {
				delete patterns[i]
			}
			else {
				patterns[i] = true;
			}
		}
		
		function isActivePattern(i) {
			var scene, patterns;
			
			scene = $scope.model.activeScene;
			patterns = $scope.model.scenes[this.trackID][scene];
			if(i in patterns) {
				return 'on';
			}
			else {
				return 'off';
			}
		}
		
		function getCoordinate(pattern, i,j) {
			if(j in pattern[i]) {
				return 'on';
			}
			else {
				return 'off';
			}
		}
		
		function switchCoordinate(pattern, i,j) {
			if(j in pattern[i]) {
				delete pattern[i][j];
			}
			else {
				pattern[i][j] = true;
			}
		}
	
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
			'voice' : voice,
			'trackID' : trackID,
			'volume' : volume,
			'isCollapsed' : isCollapsed,
			'index' : trackID
		};

	}

	function addTrack() {
		var t = newTrack(24,16,trackCount);
		$scope.model.scenes[trackCount] = [];
		for(i=0; i<$scope.model.scenes[0].length; i+=1) {
			$scope.model.scenes[trackCount].push({});
		}
		trackCount+=1;
		$scope.model.tracks.push(t);
	}
	
	function armPattern(track, pattern) {
		$scope.model.armedPattern = [track, pattern];
	}
	
		function writeModel(projectName) {
		localStorage[projectName] = JSON.stringify($scope.model);
	}
	
	function readModel(projectName) {
		var inputModel = JSON.parse(localStorage[projectName]);
		$scope.model.armedPattern = inputModel.armedPattern;
		$scope.model.sceneCount = inputModel.sceneCount;
		$scope.model.activeScene = inputModel.activeScene;
		$scope.model.scenes = inputModel.scenes;
		$scope.model.playing = inputModel.playing;
		$scope.model.arrangementString = inputModel.arrangementString;
		$scope.model.millisPerBeat = inputModel.millisPerBeat;
		var newTracks = [];
		var i;
		for(i=0;i<inputModel.tracks.length; i++) {
			var track = inputModel.tracks[i]
			//console.log(track)
			var thisTrack = newTrack(track.i,track.j, track.trackID, track.activePatterns, track.patterns, track.voice, track.volume, track.isCollapsed) 
			newTracks.push(thisTrack)
		}
		$scope.model.tracks = newTracks;
	}
	
	function loadProject() {
		stop();
		readModel($scope.model.projectName);
	}
	
	function saveProject() {
		writeModel($scope.model.projectName)
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
					'armedPattern' : false,
					'armPattern' : armPattern,
					'projectName' : 'song1',
					'loadProject' : loadProject,
					'saveProject' : saveProject,
					'millisPerBeat' : 100};

	t = newTrack(24,16,trackCount);
	trackCount+=1
	$scope.model.tracks = [t]; 	
	//readModel("a")

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