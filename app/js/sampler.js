//var Context = new webkitAudioContext();//webkit browsers only
    //oscillator = oscContext.createOscillator();

drums = ["kick.ogg", "snare.ogg", "hihat.ogg"];
drumSources = []
drumBuffers = []
var requests = [];
var i = 0;
var drum;

for(i=0; i<drums.length; i+=1) {
	drum = drums[i];
	requests[i] = new XMLHttpRequest();
	requests[i].open('GET', './assets/samples/'+drum, true);
	requests[i].responseType = 'arraybuffer';
	requests[i].addEventListener('load', bufferSoundOfI(i), false);
	requests[i].send();
}

//var mySource;
function bufferSoundOfI(i) {
	return function bufferSound(event) {
	    var request = event.target;
	    var source = oscContext.createBufferSource();
	    source.buffer = oscContext.createBuffer(request.response, false);
	    drumSources[i] = source;
	    drumSources[i].connect(oscContext.destination);
	}
}

/*
var frequencyMap = [110];
var i;
for(i=1; i<64; i+=1) {
	frequencyMap.push(frequencyMap[i-1]* 1.0594);
}
for(i=0; i<63; i+=1) {
	frequencyMap[i] = Math.round(frequencyMap[i]);
}
*/

/*
oscillator.type = 0; // sine wave
oscillator.frequency.value = 2000;
oscillator.connect(oscContext.destination);
oscillator.noteOn && oscillator.noteOn(0);

*/

function playSample(i, startTime, stopTime) {
	console.log(i, startTime)
	var source = oscContext.createBufferSource();
	source.buffer = drumSources[i].buffer
	source.connect(oscContext.destination);
	//console.log("Playing note..." +note + " " +startTime+ " "+ stopTime)
	//oscillator = oscContext.createOscillator();
	//oscillator.type = type; // sine wave
	//oscillator.frequency.value = frequencyMap[note];
	
	//gainNode = oscContext.createGainNode();
    //oscillator.connect(gainNode);
    //gainNode.connect(oscContext.destination);
    //gainNode.gain.value = 0.1;
	source.start(startTime);
	source.stop(stopTime)
	
}

