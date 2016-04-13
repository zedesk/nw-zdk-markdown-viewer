"use strict";

/* jshint node:true */

module.exports = function(grunt) {
	grunt.initConfig({
		nodewebkit: {
			options: {
				version: '0.13.2',
				buildDir:"./dist",
				buildType:"versioned",
				appVersion:"0.2.2",
				// choose what platforms to compile for here
				platforms:['osx64', 'linux64'],
				//platforms:['osx'],
				macIcns: './icns/MMD.icns',
				macPlist:'./Info.plist',
				winIco:'./icns/MMD.ico'
			},
			src: ['./src/**/*']
		}
	});

	grunt.loadNpmTasks('grunt-node-webkit-builder');
	grunt.registerTask('default', ['nodewebkit']);
};
