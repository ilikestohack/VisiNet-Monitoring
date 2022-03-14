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
const Enmap = require("enmap");

exports.run = function(visinet){
	if(visinet.config.runtests == "true"){
		// Tester Loading
		tests = new Enmap();
		fs.readdir("./Tests/", (err, files) => {
			// Get Tester
			if (err) return console.error(err);
			files.forEach(file => {
				if (!file.endsWith(".js")) return;
				let props = require(`../Tests/${file}`);
				let moduleName = file.split(".")[0];
				console.log(`[Tester Load] Attempting to load tester ${moduleName}`);
				
				// Run Tester
				props.run(visinet)
			});
		});
	}
}

exports.info = {
	name: "tests",
	load: true,
	gfuncs: false
}