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
	if(mconf){
		
		// Verify monitor should be running
		if(mconf.run == "true"){
			
			// Create Custom Monitor Variable Object
			visinet.cmonitorvars.common_server_ping = {};
			// Run Monitor
			runmonitor(visinet, mconf)
			
		}
		
	}else{
		visinet.gfunctions.log(visinet, "{Monitor: common_server_ping} No configuration found")
	}
}

function runmonitor(visinet, mconf){
	mconf.servers.forEach(function(monurl){
		setInterval(function(){
			
			// Monitor Code Here
			psout = pingserver(visinet, mconf, monurl);
			if(psout){ // First request has no psout
				visinet.gfunctions.logd(visinet, psout)
				setPSRLPoint(visinet, mconf, psout.received / psout.sent * 100, "pingout", "received/sent", "8.8.8.8")
				setPSRLPoint(visinet, mconf, psout.lost / psout.sent * 100, "pingout", "lost/sent", "8.8.8.8")
			}
			
		}, mconf.interval)
	})
}

function pingserver(visinet, mconf, url){
	if(visinet.config.operating_system == "windows"){
		
		exec('ping -n 1 ' + url, (error, stdout, stderr) => {
			// Parse PacketSRL
			packetsrl = stdout.toString().split("\n")[5].replace("    ", "");
			packetsrl_parse = packetsrl.replace("Packets: ", "").split(", ")
			packetsrl_sent = packetsrl_parse[0].split(" = ")[1]
			packetsrl_received = packetsrl_parse[1].split(" = ")[1]
			packetsrl_lost = packetsrl_parse[2].split(" = ")[1].split(" ")[0]
			
			reply = stdout.toString().split("\n")[2];
			
			pingobj = {
				psrl: packetsrl,
				sent: packetsrl_sent,
				received: packetsrl_received,
				lost: packetsrl_lost,
				reply: reply
			};
			
			visinet.gfunctions.logd(visinet, `Packet Sent: ${pingobj.sent}`)
			visinet.gfunctions.logd(visinet, `Packet Recieved: ${pingobj.received}`)
			visinet.gfunctions.logd(visinet, `Packet Lost: ${pingobj.lost}`)
			visinet.gfunctions.logd(visinet, `Reply: ${pingobj.reply}`)
			
			visinet.cmonitorvars.common_server_ping.pingobj = pingobj;
		});
		
	}else if(visinet.config.operating_system == "linux"){
		
		exec('ping -c 1 ' + url, (error, stdout, stderr) => {
			// Parse PacketSRL
			packetsrl = stdout.toString().split("\n")[5]
			packetsrl_parse = packetsrl.split(", ")
			packetsrl_sent = packetsrl_parse[0].replace(" packets transmitted", "")
			packetsrl_received = packetsrl_parse[1].replace(" received", "")
			packetsrl_lost_perc = packetsrl_parse[2].replace("% packet loss", "")
			packetsrl_lost = packetsrl_lost_perc / 100 * packetsrl_sent
			
			reply = stdout.toString().split("\n")[2];
			
			pingobj = {
				psrl: packetsrl,
				sent: packetsrl_sent,
				received: packetsrl_received,
				lost: packetsrl_lost,
				reply: reply
			};
			
			visinet.gfunctions.logd(visinet, `Packet Sent: ${pingobj.sent}`)
			visinet.gfunctions.logd(visinet, `Packet Recieved: ${pingobj.received}`)
			visinet.gfunctions.logd(visinet, `Packet Lost: ${pingobj.lost}`)
			visinet.gfunctions.logd(visinet, `Reply: ${pingobj.reply}`)
			
			visinet.cmonitorvars.common_server_ping.pingobj = pingobj;
		});
		
	}else{
		visinet.gfunctions.log(visinet, "{Monitor: common_server_ping} OS Not Supported Yet")
	}
	return visinet.cmonitorvars.common_server_ping.pingobj;
}

function setPSRLPoint(visinet, mconf, val, tagname, tagval, url){
	visinet.gfunctions.writePoint(visinet, "common_server_ping", val, [
		{
			name: "outform",
			value: "packetSRL"
		},
		{
			name: tagname,
			value: tagval
		},
		{
			name: "url",
			value: url
		}
	])
}