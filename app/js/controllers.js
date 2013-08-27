'use strict';

/* Controllers */



function TrackController($scope, $timeout) {

	var t,track, m, player, armedPlayer, note, model,
		i, j, k, l, loopLength, beat, done = false, max=24,
		activePatterns, scenes, activeScene, trackCount, sceneCount,
		list, arrangement, arrangement2, startTime, totalBeats,
		currentBeat,highlighter, demo, voices;
		
	voices = [{name:'piano'},{name:'drum'}];
	
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
	//m = new MidiPlayer(); // m is externally defined
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
		
		$scope.highlightBeat = function(beat) {
			if(beat>0) {
				currentBeat = (currentBeat+1)%16
				highlighter = $timeout(function () {$scope.highlightBeat(beat-1);}, $scope.model.millisPerBeat);
			}
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
								playSample((track.lowKey+max-parseInt(note))-1, track.voiceName.name, thisStart, thisStart +$scope.model.millisPerBeat);
								
								//m.queueNote(max-parseInt(note),
							    //    parseInt(track.voice),track.volume,thisStart);
							        
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
			$scope.model.activeScene = arrangement[i]
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
	
	onPlayerLoad();
	
	//"tracks":[{"i":24,"j":16,"activePatterns":{"0":true},"patterns":[[{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]],"voice":0,"trackID":0,"volume":127,"isCollapsed":false,"index":0,"$$hashKey":"008"}]}
	function newTrack(i,j, trackID, activePatterns, patterns, voice, voiceName, volume, isCollapsed, lowKey) {
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
		if(typeof(voiceName)==='undefined') {voiceName ={name:'piano'};}
		if(typeof(volume)==='undefined') {volume = 127;}
		if(typeof(isCollapsed)==='undefined') {isCollapsed = false;}
		if(typeof(lowKey)==='undefined') {lowKey = 42;}
		
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
		
		function isHighlightedBeat(i) {
			if (currentBeat === i) {
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
			'isHighlightedBeat' : isHighlightedBeat,
			'i': i,
			'j': j,
			'activePatterns' : activePatterns,
			'patterns' : patterns,
			'voice' : voice,
			'voiceName' : voiceName,
			'trackID' : trackID,
			'volume' : volume,
			'isCollapsed' : isCollapsed,
			'index' : trackID,
			'lowKey' : lowKey
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
	
	function readModel(inputProject) {
		var inputModel, newTracks, i, track, thisTrack;
		
		if(typeof(inputProject)==="string") {
			inputModel = JSON.parse(localStorage[inputProject]);
		}
		else {
			inputModel = inputProject;
		}
		$scope.model.armedPattern = inputModel.armedPattern;
		$scope.model.sceneCount = inputModel.sceneCount;
		$scope.model.activeScene = inputModel.activeScene;
		$scope.model.scenes = inputModel.scenes;
		$scope.model.playing = inputModel.playing;
		$scope.model.arrangementString = inputModel.arrangementString;
		$scope.model.millisPerBeat = inputModel.millisPerBeat;
		newTracks = [];
		for(i=0;i<inputModel.tracks.length; i+=1) {
			track = inputModel.tracks[i];
			thisTrack = newTrack(track.i,track.j, track.trackID, track.activePatterns, track.patterns, track.voice, track.voiceName, track.volume, track.isCollapsed, track.lowKey); 
			newTracks.push(thisTrack);
		}
		$scope.model.tracks = newTracks;
	}
	
	function newModel() {
		stop();
		var newTracks, i, track, thisTrack;

		$scope.model.armedPattern = 0;
		$scope.model.sceneCount = 1;
		$scope.model.activeScene = 0;
		$scope.model.scenes = {0: [{0:true},{0:true}]};
		$scope.model.playing = false;
		$scope.model.arrangementString = "";
		$scope.model.millisPerBeat = 100;
		newTracks = [];
		//track = inputModel.tracks[i];
		thisTrack = newTrack(24,16,0);
		trackCount = 1;
		newTracks.push(thisTrack);
		
		$scope.model.tracks = newTracks;
	}
	
	function loadProject() {
		stop();
		readModel($scope.model.projectName);
	}
	
	function initialLoadProject(demo) {
		readModel(demo);
	}

	function saveProject() {
		writeModel($scope.model.projectName);
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
					'initialLoadProject' : initialLoadProject,
					'saveProject' : saveProject,
					'newModel' : newModel,
					'millisPerBeat' : 100,
					'voices' : voices};

	$scope.voiceName = {name:'piano'};
	$scope.voices = [{name:'piano'}];
	t = newTrack(24,16,trackCount);
	trackCount+=1;
	$scope.model.tracks = [t];
	demo = {"arrangementString":"0000111100002222333322224444","playing":false,"scenes":{"0":[{"0":true,"1":true},{"0":true},{"1":true,"2":true},{"1":true,"2":true,"3":true},{"1":true,"2":true,"4":true},{}],"1":[{"0":true},{"0":true,"1":true},{"0":true,"1":true},{"0":true,"1":true,"2":true},{"0":true,"1":true,"2":true},{"0":true,"1":true,"2":true}]},"activeScene":"1","sceneCount":6,"armedPattern":0,"projectName":"song1","millisPerBeat":100,"voices":[{"name":"piano"},{"name":"drum"}],"tracks":[{"i":24,"j":16,"activePatterns":{"0":true},"patterns":[[{"0":true,"9":true},{},{},{},{},{"4":true},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],[{"4":true,"12":true},{},{},{},{},{"19":true},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{},{"23":true},{"23":true},{},{},{"9":true},{"9":true},{"11":true},{},{},{},{},{},{},{},{},{}],[{},{},{"16":true},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],[{},{},{"0":true,"4":true,"9":true,"19":true},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]],"voice":0,"voiceName":{"name":"piano"},"trackID":0,"volume":127,"isCollapsed":true,"index":0,"lowKey":36,"$$hashKey":"004"},{"i":24,"j":16,"activePatterns":{"0":true},"patterns":[[{"2":true},{},{},{},{"2":true},{},{},{},{"2":true},{},{},{},{"2":true},{},{},{},{},{},{},{},{},{},{},{}],[{"0":true,"1":true},{},{},{},{},{},{"1":true},{},{},{},{},{},{"1":true},{},{},{},{},{},{},{},{},{},{},{}],[{"0":true},{},{},{},{"0":true},{"0":true},{},{},{},{},{},{"0":true},{},{},{},{},{},{},{},{},{},{},{},{}]],"voice":"1","voiceName":{"name":"drum"},"trackID":1,"volume":127,"isCollapsed":false,"index":1,"lowKey":42,"$$hashKey":"008"}]}
	$scope.model.initialLoadProject(demo);
	
}



angular.module('looperfriend.controllers', []).
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