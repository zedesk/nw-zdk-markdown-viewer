"use strict";

/*jslint node: true */
/*jslint browser: true*/

var fs = require("fs");
var os = require("os");
var gui = require("nw.gui");

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

function initApp() {
	new App().run();
}

function App() {
	
	this.nav = document.querySelector("nav ul");
	
	this.getMdFiles = function() {
		var that = this;
		
		return new Promise(function(resolve, reject) {
			fs.readdir( dir, function(err,list) {
				var ul = document.querySelector("nav ul");
				ul.innerHTML = "";
				var li;
			
				var count = list.length;
				if(!count) { dfd.resolve(); }
			
				if(dir != "/") {
					li = document.createElement("li");
					li.innerHTML = "..";
					var func = function() { 
						dir = dir.slice(0,dir.lastIndexOf("/")); 
						that.getMdFiles();
					};
					li.addEventListener("click",func,false);
					ul.appendChild(li);
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
								resolve();
							}
						})
						.catch( function(err) {
							console.error(err);
							if(--count === 0) { 
								ul.appendChild(folders);
								resolve();
							}
						});
				});
			});
		});
	};
	
	this.open = function(file) {
		return new Promise(function(resolve, reject) {
			var zdkMarked = document.querySelector("zdk-marked");
			var iframe = document.querySelector("iframe#ext");
			if(iframe.style.display === "block") {
				iframe.src = "about:blank";
				iframe.style.display = "none";
	        }
			zdkMarked.setAttribute("path",dir);
		
			fs.readFile( dir+"/"+file, function(err, data) {
				if(err) reject(err);
			
				zdkMarked.innerHTML = data;
			
				resolve();
			});
		});
	};
	
	this.run = function() {
        var that = this;
        var zdkMarked = document.querySelector("zdk-marked");
        zdkMarked.addEventListener("link", function(e) {
            var link = e.detail;
            switch( link.type ) {
                case "external" :
                    var iframe = document.querySelector("iframe#ext");
                    iframe.src = link.href;
                    iframe.style.display = "block";
                    break;
                case "markdown":
                    that.open(link.href);
                    break;
            }
        },false);
		this.getMdFiles();
	};
}