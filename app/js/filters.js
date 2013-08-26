'use strict';

/* Filters */

angular.module('looperfriend.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).
  filter('range', function() {
		return function(input,total) {
			var i=0;
			total = parseInt(total,10);
			for ( i=0; i<total; i+=1) {
				input.push(i);
			} 
			return input;
		};
  });
