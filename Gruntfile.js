"use strict";

/* jshint node:true */

module.exports = function(grunt) {
	grunt.initConfig({
		nodewebkit: {
			options: {
				version: 'latest',
				buildDir:"./dist",
				buildType:"versioned",
				appVersion:"0.1.1",
				// choose what platforms to compile for here
				platforms:['osx', 'linux32', 'linux64'],
				macIcns: './icns/MMD.icns',
				macPlist:'./info.plist'
			},
			src: ['./src/**/*']
		}
	});

	grunt.loadNpmTasks('grunt-node-webkit-builder');
	grunt.registerTask('default', ['nodewebkit']);
};
