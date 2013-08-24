//var Context = new webkitAudioContext();//webkit browsers only
    //oscillator = oscContext.createOscillator();

drumSources = []
pianoSources = []
var requests = [];
var i = 0;
var drum;

for(i=0; i<3; i+=1) {
	requests[i] = new XMLHttpRequest();
	requests[i].open('GET', './assets/samples/drums/'+i+".ogg", true);
	requests[i].responseType = 'arraybuffer';
	requests[i].addEventListener('load', bufferSoundOfI(i,drumSources), false);
	requests[i].send();
}

for(i=0; i<88; i+=1) {
	requests[i] = new XMLHttpRequest();
	requests[i].open('GET', './assets/samples/piano/'+(i)+".mp3", true);
	requests[i].responseType = 'arraybuffer';
	requests[i].addEventListener('load', bufferSoundOfI(i, pianoSources), false);
	requests[i].send();
}

function bufferSoundOfI(i,buffers ) {
	return function bufferSound(event) {
	    var request = event.target;
	    var source = oscContext.createBufferSource();
	    source.buffer = oscContext.createBuffer(request.response, false);
	    buffers[i] = source;
	    buffers[i].connect(oscContext.destination);
	}
}


function playSample(i, voice, startTime, stopTime) {

	var source = oscContext.createBufferSource();
	if(voice === 'piano') {
		source.buffer = pianoSources[i].buffer;
	}
	else {
		source.buffer = drumSources[i%3].buffer;
	}
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

