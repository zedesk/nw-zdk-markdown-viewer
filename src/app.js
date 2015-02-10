"use strict";

/*jslint node: true */
/*jslint browser: true*/
/*jslint esnext:true */

var fs = require("fs");
var os = require("os");
var gui = require("nw.gui");
var path = require("path");

var userDataDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.zdk-markdown-viewer';
var log = userDataDir + '/log.md';

if (!fs.existsSync(userDataDir)) {
	fs.mkdirSync(userDataDir);
}

gui.App.on('open', function(cmdline) {
	// get here when opening file with "open with" in finder
	fs.appendFile(log,'command line: ' + cmdline+'\n');
	var win = gui.Window.get();
	filename = path.basename(cmdline);
	dir = path.dirname(cmdline);
	app.getMdFiles(false);
	app.open(filename);
});

fs.appendFile(log, "opening...\n");
var dir, filename;
if(gui.App.argv.length && fs.existsSync(gui.App.argv[0])) {
	dir = path.normalize(gui.App.argv[0]);
	if([".",".."].indexOf(dir) !== -1 ) {
		dir = path.normalize(process.env.PWD+"/"+dir);
	}
	var stat = fs.statSync(dir);
	if(stat.isFile()) {
		filename = path.basename(dir);
		dir = path.dirname(dir);
	}
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
fs.appendFile(log, "dir "+dir+"\n");
fs.appendFile(log, "filename "+filename+"\n");
fs.appendFile(log, "appname "+gui.App.manifest.name);

var win = gui.Window.get();
var nativeMenuBar = new gui.Menu({ type: "menubar" });
try {
	nativeMenuBar.createMacBuiltin(gui.App.manifest.name, {
		hideEdit: false,
		hideWindow: true
	});
	win.menu = nativeMenuBar;
} catch (ex) { }

window.addEventListener("polymer-ready", initApp, false);

var app;
function initApp() {
	fs.appendFile(log, "initApp\n" );
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
				that.getMdFiles.call(that, true);
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

	(function() {
		var title = document.querySelector("core-toolbar div");
		var zdkMarked = document.querySelector("zdk-marked");
		if(zdkMarked.parsed) {
			console.log("meta",zdkMarked.getMeta());
		}
		zdkMarked.addEventListener("parsed", function() {
			var meta = zdkMarked.getMeta();
			title.innerHTML = meta.title;
			document.querySelector("template#toc").model = { toc:zdkMarked.getToc()};
		}, false);
	})();

	(function() {
		var tocMenu = document.querySelector("#tocMenu");
		var zdkMarked = document.querySelector("zdk-marked");
		tocMenu.addEventListener("click", function(evt) {
			var link = evt.srcElement;
			if( link.tagName === "LI") {
				link = link.querySelector("a");
			}
			console.log(link.getAttribute("href"));
			zdkMarked.goLink(link.getAttribute("href"));
		}, false);
	})();

	/**
	* Show history panel
	*/
	/*
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
	*/

	/**
	* Get Title of the iframe
	*/
	( function() {
		var iframe = document.querySelector("iframe#ext");
		iframe.addEventListener("load", function() {
			if(iframe.contentDocument.title !== "Load page") {
				document.querySelector("#internet .title").innerHTML = iframe.contentDocument.title;
				document.querySelector("#internet .url").innerHTML = iframe.contentWindow.location;
			}
		}, false);
	})();

	this.getMdFiles = function( readme ) {
		var that = this;
		readme = readme || false;

		return new Promise(function(resolve, reject) {
			fs.readdir( dir, function(err,list) {
				if(err) {
					console.error(err);
					return reject(err);
				}
				if(!list) {
					return reject("can't read directory");
				}
				var ul = document.querySelector("#directory ul");
				ul.innerHTML = "";
				var li;

				var count = list.length;
				if(!count) { resolve(); }

				document.querySelector("core-tooltip [tip]").innerHTML = dir;
				if(dir != "/") {
					document.querySelector("core-tooltip .title").innerHTML = dir.slice(dir.lastIndexOf("/")+1);
					li = document.createElement("li");
					li.innerHTML = "..";
					var func = function() {
						dir = dir.slice(0,dir.lastIndexOf("/"));
						if(!dir.length) { dir = "/"; }
						that.getMdFiles(true);
					};
					li.addEventListener("click",func,false);
					ul.appendChild(li);
				} else {
					document.querySelector("core-tooltip .title").innerHTML = "/";
				}
				var folders = document.createDocumentFragment();

				function getStat(file) {
					return new Promise(function(resolve, reject) {
						fs.lstat( dir+"/"+file, function(err, stats) {
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
									if(readme && file.toLowerCase() === "readme.md") {
										that.open(file, true);
									}
								}
								if(stats.isDirectory()) {
									li.classList.add("folder");
									li.innerHTML = file;
									func = function() {
										dir += "/"+file;
										that.getMdFiles(true);
									};
									li.addEventListener("click",func,false);
									folders.appendChild(li);
								}
								if(stats.isSymbolicLink()) {
									var link = fs.readlinkSync( dir+ "/"+ file );
									var tmp = fs.lstatSync( link );
									if( tmp.isDirectory() ) {
										li.classList.add("folder");
										li.innerHTML = file;
										func = function() {
											dir = link;
											that.getMdFiles(true);
										};
										li.addEventListener("click",func,false);
										folders.appendChild(li);
									}
								}
							}
							return li;
						})
						.then( function() {
							if(--count === 0) {
								ul.appendChild(folders);
								_watchDir( that );
								resolve();
							}
						})
						.catch( function(err) {
							// console.error(err);
							if(--count === 0) {
								ul.appendChild(folders);
								_watchDir( that );
								resolve();
							}
						});
				});
			});
		});
	};

	function _watchDir( App ) {
		if (watchDir) {
			if( watchDir !== dir ) {
				fs.unwatchFile(watchDir);
			} else {
				return;
			}
		}

		// var that = this;
		watchDir = dir;
		fs.watchFile(watchDir, function (evt, filename) {
			App.getMdFiles( )
				.catch( function(err) {
					// @TODO show an error panel
					fs.unwatchFile(watchDir);
					console.error(err);
				});
		});
	}

	this.open = function(file, auto) {
		fs.appendFile(log, "open file "+ dir + "/" +file+"\n");
		var that = this;

		return new Promise(function(resolve, reject) {
			if( !auto && document.querySelector("core-drawer-panel").selected === "drawer" ) {
				document.querySelector("core-drawer-panel").togglePanel();
			}
			var zdkMarked = document.querySelector("zdk-marked");
			var internet = document.querySelector("#internet");

			if(internet.style.display === "flex") {
				internet.querySelector("iframe").src = "load.htm";
				internet.style.display = "none";
			}
			var filePath = dir + "/" + file;

			var dirPath = path.dirname( filePath );
			if( dirPath !== dir ) {
				// TODO give dir as argument
				dir = dirPath;
				that.getMdFiles( false );
			}

			if( zdkMarked.getAttribute("path") !== filePath) {
				zdkMarked.setAttribute("path",filePath);
			}
			zdkMarked.removeAttribute("src");

			fs.readFile( filePath, {encoding:'utf-8'}, function(err, data) {
				if(err) reject(err);

				zdkMarked.textContent = data;
				_watchFile( that, filePath );

				resolve();
			});
		});
	};

	function _watchFile( App, filePath ) {
		if (watchFile) {
			if( watchFile !== filePath ) {
				fs.unwatchFile(watchFile);
			} else {
				return;
			}
		}

		watchFile = filePath;
		fs.watchFile(watchFile, function (evt, filename) {
			App.open( path.basename(filePath) );
		});
	}

	this.closeBrowser = function() {
		var internet = document.querySelector("#internet");
		if(internet.style.display === "flex") {
			internet.querySelector("iframe").src = "load.htm";
			internet.style.display = "none";
		}
	};

	this.run = function() {
		var spawn = require('child_process').spawn,
			os    = require("os");
		var that = this;
		var zdkMarked = document.querySelector("zdk-marked");
		zdkMarked.addEventListener("link", function(e) {
			var link = e.detail;
			switch( link.type ) {
				case "markdown":
					that.open(link.href);
					break;
				case "pdf":
				case "internal":
					if( link.href[0] === "#") {
						zdkMarked.goLink(link.href);
					} else {
						var openCmd;
						switch( os.platform() ) {
							case "darwin" :
								openCmd = "open";
								break;
							case "linux":
								openCmd = "xdg-open";
								break;
						}
						var xdgOpen = spawn(openCmd,[dir+"/"+link.href]);
					}
					/*
					var iframe = document.querySelector("iframe#ext");
					document.querySelector("#internet .title").innerHTML = "Loading ...";
					document.querySelector("#internet .url").innerHTML = "";
					iframe.src = "file://"+dir+"/"+link.href;
					document.querySelector("#internet").style.display = "flex
					*/
					break;
				case "external" :
					var iframe = document.querySelector("iframe#ext");
					document.querySelector("#internet .title").innerHTML = "Loading ...";
					document.querySelector("#internet .url").innerHTML = "";
					iframe.src = link.href;
					document.querySelector("#internet").style.display = "flex";
					break;
			}
		},false);
		this.getMdFiles(filename?false:true)
			.then( function() {
				if(filename) {
					that.open(filename);
				}
			});
	};
}
