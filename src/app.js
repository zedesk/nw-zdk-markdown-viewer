"use strict";

/*jslint node: true */
/*jslint browser: true*/
/*jslint esnext:true */

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

var app;
function initApp() {
	app = new App();
    app.run();
}

function App() {
	
	this.nav = document.querySelector("nav ul");
	
	this.getMdFiles = function() {
		var that = this;
		
		return new Promise(function(resolve, reject) {
			fs.readdir( dir, function(err,list) {
                if(err) {
                    console.error(err);
                    reject(err);
                }
				var ul = document.querySelector("nav ul");
				ul.innerHTML = "";
				var li;
			
				var count = list.length;
				if(!count) { resolve(); }
			
				if(dir != "/") {
					li = document.createElement("li");
					li.innerHTML = "..";
					var func = function() { 
						dir = dir.slice(0,dir.lastIndexOf("/")); 
                        if(!dir.length) { dir = "/"; }
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
			var internet = document.querySelector("#internet");
			if(internet.style.display === "flex") {
				internet.querySelector("iframe").src = "about:blank";
				internet.style.display = "none";
	        }
			zdkMarked.setAttribute("path",dir);
		
			fs.readFile( dir+"/"+file, {encoding:'utf-8'}, function(err, data) {
				if(err) reject(err);
			
				zdkMarked.textContent = data;
			
				resolve();
			});
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