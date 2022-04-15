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

// IMPORTANT!!! This monitor requires the other monitors in visinet...
// Removing those monitors could result in a failure to pull some data

// Node Modules
const { exec } = require('child_process');

exports.run = function(visinet, mconf){
	// Config Check
	if(mconf){
		
		// Verify monitor should be running
		if(mconf.run == "true"){
			
			// Run Monitor
			runmonitor(visinet, mconf)
			setInterval(function(){
				runmonitor(visinet, mconf)
			}, mconf.interval)
			
		}
		
	}else{
		visinet.gfunctions.log(visinet, "{Monitor: network_issue} No configuration found")
	}
}

function runmonitor(visinet, mconf){
	// Monitor Code Here
	error = [];
	if(query(visinet, mconf, [ { name: "sensor_id", value: "common_server_ping" }, { name: "pingout", value: "recieved/sent" }, { name: "_field", value: "value" }, { name: "url", value: mconf.lan_check_ip }]) !== 100){
		error.push("No LAN Ping");
	}
	if(query(visinet, mconf, [ { name: "sensor_id", value: "dns_tester" }, { name: "_field", value: "string" }, { name: "server", value: mconf.dns_check_server }]) !== 100){
		error.push("No DNS Resolve");
	}
	if(query(visinet, mconf, [ { name: "sensor_id", value: "common_server_ping" }, { name: "pingout", value: "recieved/sent" }, { name: "_field", value: "value" }, { name: "url", value: mconf.wan_check_ip }]) !== 100){
		error.push("No WAN Ping");
	}
	
	if(error.length == 0){
		error.push("Network Great")
		errtext = "Network Great";
	}else{
		errtext = "Errors: ";
		errtext += error[0];
		if(error.length > 1){
			error.forEach(function(item,index){
				if(index !== 0){
					errtext += ", "
					errtext += item
				}
			})
		}
	}
	
	visinet.gfunctions.writePoint(visinet, "network_issue", errtext, "s")
}

function query(visinet, mconf, tags){
	idbquery = visinet.cmodulesvars.influxdb.client.query("network_data");
	tags.forEach(function(item){
		idbquery.where(item.name, item.value)
	})
	visinet.gfunctions.logDCustom(visinet, "network_issue-query_out", idbquery)
	return idbquery;
}