"use strict";

/* jshint node:true */

module.exports = function(grunt) {
	grunt.initConfig({
		nodewebkit: {
			options: {
				version: '0.12.0-alpha3',
				buildDir:"./dist",
				buildType:"versioned",
				appVersion:"0.2.0-pre",
				// choose what platforms to compile for here
				// platforms:['osx', 'linux32', 'linux64', 'win'],
				platforms:['osx', 'linux32', 'linux64'],
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
