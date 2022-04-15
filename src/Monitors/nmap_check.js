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
const { exec } = require('child_process');

exports.run = function(visinet, mconf){
	// Config Check
	// Verify monitor should be running
	if(mconf){
		if(mconf.run == "true"){

			// Run Monitor
			runmonitor(visinet, mconf)

		}
	}else{
		visinet.gfunctions.log(visinet, "{Monitor: nmap_check} No configuration found or Module Disabled")
	}
}

function runmonitor(visinet, mconf){
	setInterval(function(){
		
		// Monitor Code Here
		mconf.checks.forEach(function(item, index){
			if(item.type === "udp"){ udpcmd = " -sU"; }else{ udpcmd = ""; }
			exec(`nmap -p ${item.port}${udpcmd} ${item.host}`, (error, stdout, stderr) => {
				state = stdout.toString().split("\n")[5].split(" ")[1];

				visinet.gfunctions.writePoint(visinet, "nmap_check", state, "s", [
					{
						name: "host",
						value: item.host
					},
					{
						name: "port",
						value: item.port
					},
					{
						name: "type",
						value: item.type
					}
				])
			})
		})
		
	}, mconf.interval)
}