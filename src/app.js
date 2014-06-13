"use strict";

/*jslint node: true */
/*jslint browser: true*/
/*jslint esnext:true */

var fs = require("fs");
var os = require("os");
var gui = require("nw.gui");
var path = require("path");

var dir;
if(gui.App.argv.length && fs.existsSync(gui.App.argv[0])) {
	dir = gui.App.argv[0];
} else {
	dir = gui.App.dataPath;
	switch(os.platform()) {
		case "darwin":
			dir = dir.slice(0,dir.lastIndexOf("/Library"));
			break;
		case "linux":
			dir = dir.slice(0,dir.lastIndexOf("/.config"));
			break;
	}
}
window.addEventListener("DOMContentLoaded", initApp, false);

var app;
function initApp() {
	app = new App();
	app.run();
}

function App() {
	
	var watchFile = null;
	var watchDir = null;

	this.nav = document.querySelector("nav ul");
	
	/**
	* Allows drag and drop
	*/
	(function(that) {
		var dropbox = document.querySelector("html");
		dropbox.ondragover = function () { return false; };
		dropbox.ondragend = function ()  { return false; };
		dropbox.addEventListener("drop",drop,false);
		function drop(e) {
			e.stopPropagation();  
			e.preventDefault();
			
			var file = e.dataTransfer.files[0];
			
			var stats = fs.statSync(file.path);
			if( stats.isDirectory() ) {
				dir = file.path;
				that.getMdFiles.call(that);
			} else {
				dir = path.dirname(file.path);
				that.getMdFiles.call(that)
					.then( function() {
						that.open.call(that,path.basename(file.path));
					});
			}
			
			return false;
		}
	})(this);

	/**
	 * Show tip on directory
	 */
	(function() {
		document.querySelector("#directory header").addEventListener("mouseover", function() {
			this.querySelector(".tip").style.display = "block";
		});
		document.querySelector("#directory header").addEventListener("mouseout", function() {
			this.querySelector(".tip").style.display = "none";
		});
	})();

	/**
	 * Show history panel
	 */
	(function() {
		document.querySelector("#history header").addEventListener("click", function() {
			var history = this.parentElement;
			if(history.querySelector("ul").style.display === "block") {
				history.querySelector("ul").style.display = "none";
			} else {
				history.querySelector("ul").style.display = "block";
			}
		});
	})();
    
	this.getMdFiles = function() {
		var that = this;
		
		return new Promise(function(resolve, reject) {
			fs.readdir( dir, function(err,list) {
				if(err) {
					console.error(err);
					reject(err);
				}
				var ul = document.querySelector("#directory ul");
				ul.innerHTML = "";
				var li;
			
				var count = list.length;
				if(!count) { resolve(); }

				document.querySelector("#directory header .tip").innerHTML = dir;
				if(dir != "/") {
					document.querySelector("#directory header .title").innerHTML = dir.slice(dir.lastIndexOf("/")+1);
					li = document.createElement("li");
					li.innerHTML = "..";
					var func = function() { 
						dir = dir.slice(0,dir.lastIndexOf("/")); 
                        if(!dir.length) { dir = "/"; }
						that.getMdFiles();
					};
					li.addEventListener("click",func,false);
					ul.appendChild(li);
				} else {
					document.querySelector("#directory header .title").innerHTML = "/";
				}
				var folders = document.createDocumentFragment();
				
				function getStat(file) {
					return new Promise(function(resolve, reject) {
						fs.stat( dir+"/"+file, function(err, stats) {
							if(err) { reject(err); }
							resolve(stats);
						});
					});
				}
			
				list.forEach( function(file) {
					getStat(file)
						.then( function(stats) {
							var func = null;
                        
							li = document.createElement("li");
							if( /^[^\.]/.test(file) ) {
								if(stats.isFile() && /\.md$/.test(file)) {
									li.innerHTML = file;
									func = function() { 
										var selected = ul.querySelector("li.select");
										if(selected) selected.classList.remove("select");
										this.classList.add("select");
										that.open(file); 
									};
									li.addEventListener("click",func,false);
									if(watchFile && watchFile === dir+"/"+file) {
										li.classList.add("select");
									}
									ul.appendChild(li);
								}
								if(stats.isDirectory()) {
									li.classList.add("folder");
									li.innerHTML = file;
									func = function() { 
										dir += "/"+file; 
										that.getMdFiles();
									};
									li.addEventListener("click",func,false);
									folders.appendChild(li);
								}
							}
							return li;
						})
						.then( function() {
							if(--count === 0) { 
								ul.appendChild(folders);
								_watchDir.call( that );
								resolve();
							}
						})
						.catch( function(err) {
							// console.error(err);
							if(--count === 0) { 
								ul.appendChild(folders);
								_watchDir.call( that );
								resolve();
							}
						});
				});
			});
		});
	};

	function _watchDir( ) {
		if (watchDir) {
			if( watchDir !== dir ) {
				fs.unwatchFile(watchDir);
			} else {
				return;
			}
		}

		var that= this;
		watchDir = dir;
		fs.watchFile(watchDir, function (evt, filename) {
			that.getMdFiles( );
		});
	};

	this.open = function(file) {
		var that = this;
		
		return new Promise(function(resolve, reject) {
			var zdkMarked = document.querySelector("zdk-marked");
			var internet = document.querySelector("#internet");
			if(internet.style.display === "flex") {
				internet.querySelector("iframe").src = "about:blank";
				internet.style.display = "none";
			}
			zdkMarked.setAttribute("path",dir);
			zdkMarked.removeAttribute("src");
            
			fs.readFile( dir+"/"+file, {encoding:'utf-8'}, function(err, data) {
				if(err) reject(err);
				
				zdkMarked.textContent = data;
				_watchFile.call( that, dir+"/"+file );
				
				resolve();
			});
		});
	};
	
	function _watchFile( filePath ) {
		if (watchFile) {
			if( watchFile !== filePath ) {
				fs.unwatchFile(watchFile);
			} else {
				return;
			}
		}
		
		var that= this;
		watchFile = filePath;
		fs.watchFile(watchFile, function (evt, filename) {
			that.open( path.basename(filePath) );
		});
	};
	
	this.closeBrowser = function() {
		var internet = document.querySelector("#internet");
		if(internet.style.display === "flex") {
			internet.querySelector("iframe").src = "about:blank";
			internet.style.display = "none";
	    }
    };
	
	this.run = function() {
		var that = this;
		var zdkMarked = document.querySelector("zdk-marked");
		zdkMarked.addEventListener("link", function(e) {
			var link = e.detail;
			switch( link.type ) {
				case "markdown":
					that.open(link.href);
					break;
				case "external" :
					var iframe = document.querySelector("iframe#ext");
					iframe.src = link.href;
					document.querySelector("#internet").style.display = "flex";
					break;
			}
		},false);
		this.getMdFiles();
	};
}