"use strict";

/* jshint node:true */

module.exports = function(grunt) {
	grunt.initConfig({
		nodewebkit: {
			options: {
				version: '0.11.6',
				buildDir:"./dist",
				buildType:"versioned",
				appVersion:"0.2.0-pre",
				// choose what platforms to compile for here
				platforms:['osx64', 'linux64', 'win64'],
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
