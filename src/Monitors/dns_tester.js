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
const { Resolver } = require('dns');

exports.run = function(visinet, mconf){
	// Config Check
	if(mconf){
		
		// Verify monitor should be running
		if(mconf.run == "true"){
			
			// Run Monitor
			runmonitor(visinet, mconf)
			
		}
		
	}else{
		visinet.gfunctions.log(visinet, "{Monitor: common_server_ping} No configuration found")
	}
}

function runmonitor(visinet, mconf){
	mconf.servers.forEach(function(monurl){
		resolver = new Resolver();
		resolver.setServers([monurl]);
		
		setInterval(function(){
			
			// Monitor Code Here
			resolver.resolve4('google.com', (err, addresses) => {
				
				if(err){
					out = 0;
				}else if(addresses){
					out = 1;
				}else{ out = 0; }
				
				if(err){ visinet.gfunctions.logDCustom(visinet, "dns_tester-resolve_out", "Error Recieved: " + err) }
				visinet.gfunctions.logDCustom(visinet, "dns_tester-resolve_out", "Addresses Recieved: " + addresses)
				
				visinet.gfunctions.writePoint(visinet, "dns_tester", out, [{
					name: "server",
					value: monurl
				}])
			  
			});
			
		}, mconf.interval)
	})
}