var oscContext = new webkitAudioContext();//webkit browsers only
    //oscillator = oscContext.createOscillator();

var frequencyMap = [110];
var i;
for(i=1; i<64; i+=1) {
	frequencyMap.push(frequencyMap[i-1]* 1.0594);
}
for(i=0; i<63; i+=1) {
	frequencyMap[i] = Math.round(frequencyMap[i]);
}

/*
oscillator.type = 0; // sine wave
oscillator.frequency.value = 2000;
oscillator.connect(oscContext.destination);
oscillator.noteOn && oscillator.noteOn(0);

*/

function playNote(note, type, startTime, stopTime) {
	console.log("Playing note..." +note + " " +startTime+ " "+ stopTime)
	oscillator = oscContext.createOscillator();
	oscillator.type = type; // sine wave
	oscillator.frequency.value = frequencyMap[note];
	oscillator.connect(oscContext.destination);
	gainNode = oscContext.createGainNode();
    oscillator.connect(gainNode);
    gainNode.connect(oscContext.destination);
    gainNode.gain.value = 0.1;
	oscillator.start(startTime);
	oscillator.stop(stopTime)
	
}
