/**
 * VisiNet Monitoring -- A new way to monitor your networking
 * Copyright (C) 2022 charmines
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// Node Modules
const fs = require("fs");

exports.run = function(visinet){
	visinet.logs = {};
	visinet.logs.debugLog = fs.createWriteStream('../userdata/logs/debug.log', { flags: 'a' /* append */ });
	visinet.logs.log = fs.createWriteStream('../userdata/logs/log.log', { flags: 'a' /* append */ });	
}

function log(visinet, text){
	console.log("[Logging]", text)
	visinet.logs.log.write(JSON.stringify(text) + "\n")
}

function logd(visinet, text){
	if(visinet.config.module_logging.consoledebug == "true"){
		console.log("[Debug Log]", text)
	}
	if(visinet.config.module_logging.filedebug == "true"){
		// File debugging goes here
		visinet.logs.debugLog.write(JSON.stringify(text) + "\n")
	}
}

function logDCustom(visinet, name, text){
	if(visinet.config.module_logging.custom){
		if(visinet.config.module_logging.custom[name] == "true"){ logd(visinet, `\{${name}\} ${text}`) }
		if(visinet.config.module_logging.custom[name] == "true" || visinet.config.module_logging.custom[name] == "file"){
			if(!visinet.logs[name]){
				visinet.logs[name] = fs.createWriteStream(`../userdata/logs/${name}.log`, { flags: 'a' /* append */ });	
			}
			visinet.logs[name].write(JSON.stringify(text) + "\n")
		}
	}
}

exports.info = {
	name: "logging",
	load: true,
	gfuncs: [
		{
			name: "log",
			func: log
		},
		{
			name: "logd",
			func: logd
		},
		{
			name: "logDCustom",
			func: logDCustom
		}
	]
}