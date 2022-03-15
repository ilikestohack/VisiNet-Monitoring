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

// Global object for cross-modules
visinet = {
	config: require("../userdata/config.json"), // Load Config File
	gfunctions: {},
	cmonitorvars: {},
	cmodulesvars: {}
}

// Node Modules
const fs = require("fs");
const Enmap = require("enmap");

// Module Loading
visinet.modules = new Enmap();
fs.readdir("./Modules/", (err, files) => {
	// Get Module
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./Modules/${file}`);
        let moduleName = file.split(".")[0];
        console.log(`[Module Load] Attempting to load module ${moduleName}`);
        visinet.modules.set(moduleName, props);
    });
	
	// Run Module
	visinet.modules.forEach(function(module, index){
		if(module.info.load == true){
			module.run(visinet)
		}
		if(module.info.gfuncs){
			module.info.gfuncs.forEach(function(item, index){
				visinet.gfunctions[item.name] = item.func;
			})
		}
	})
});