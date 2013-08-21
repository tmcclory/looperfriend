# Looperfriend

Looperfriend is a music sequencer using the Web Audio API. This application is 
intended to serve as the frontend 

A live demo of the project can be found [here](http://ns6029.hostgator.com/~tmcclory/looperfriend/app/index.html)
# Usage

The beat duration setting controls the length of time per beat. The sounds that
are generated are 'one-shot' samples, meaning that the samples will be played
in their entirety, regardless of the beat duration. If the beat length is set 
to a duration that is very short relative to the sample length, playback of the 
samples may overlap in an undesirable fashion.

The project name field allows users to name their projects, save these projects,
and load them in later sessions. The projects are saved locally using the HTML5
localStorage facility. Users can safely name the projects however they would 
like without concern of a remote record of the project. Users should also be
aware that clearing their browser cache may result in the loss of their 
Looperfriend projects.

The tracks section contains one or more tracks. Each track contains one or more 
patterns. The patterns contain a matrix of 24 rows by 16 columns. Each column 
corresponds to a beat in time. Time advances from left to right.

Each row corresponds to a sound sample to be played. The sounds are determined by
the voice parameter of the track. This feature is to be greatly expanded but
currently users use a radio button to select one of four voice choices:

0 - Piano
1 - Percussion
2 - Organ (These samples are of long duration and will frequently overlap)
3 - Synth 

The slider beneath the voice selector controls the volume of the track.

Below the volume slider is a set of tabs corresponding to each pattern
of the track. New patterns can be created using the Add Pattern button.
Navigating through the tabs enables the user to edit each pattern individually.
The patterns are played when they are active. To activate a pattern, click on the
corresponding pattern button on the top of the track. Multiple patterns can be 
active simultaneously.

Scenes are units used to group patterns into desired song sections.
A scene is a subset of the set of patterns across all tracks. New scenes
are created using the add scene button. To edit a scene, select the 
appropriate radio button and then activate the desired patterns. Now when you
return to this scene, this exact set of patterns will be set activated. Use the
play scene button to listen preview the scenes. Playback will loop until the 
stop button is pressed. Playback will change with the selection of different 
scenes or any changes to the underlying patterns. 

Playback for a pattern is queued completely at the beginning of the pattern.
Therefore any changes that are made to the pattern or scene selection will not
be reflected in playback until the current pass through the pattern completes and
the next pass begins.

The arrangement view is used to arrange sequences of scene for playback.
The format of an arrangement is simply a string of numbers with no spaces.
Each digit corresponds to the scene in that position. A limitation of this 
current implementation is that arrangments are restricted to 10 scenes. Use
the play arrangement button to listen to an arrangement.

# Design and Implementation

Looperfriend uses the Web Audio API to play sounds.
AngularJS 
