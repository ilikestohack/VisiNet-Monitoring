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
const {InfluxDB, Point} = require("@influxdata/influxdb-client")

exports.run = function(visinet){
	visinet.cmodulesvars.influxdb = {}
	visinet.cmodulesvars.influxdb.influxDB = new InfluxDB(visinet.config.influxdb);
	visinet.cmodulesvars.influxdb.writeApi = visinet.cmodulesvars.influxdb.influxDB.getWriteApi(visinet.config.influxdb.org, visinet.config.influxdb.bucket)
	visinet.cmodulesvars.influxdb.queryAPI = visinet.cmodulesvars.influxdb.influxDB.getQueryApi(visinet.config.influxdb.org);
}

function writePoint(visinet, sensorid, val, tags){
	point = new Point("network_data")
	  .tag("sensor_id", sensorid)
	  .floatField("value", val)
	
	// Load custom tags
	if(tags){
		tags.forEach(function(item,index){
			point.tag(item.name, item.value)
		})
	}
	
	visinet.cmodulesvars.influxdb.writeApi.writePoint(point)
	
	visinet.cmodulesvars.influxdb.writeApi.close().then(() => {
	  visinet.gfunctions.logDCustom(visinet, "InfluxDB-write_info", `{Influx DB} WRITE FINISHED Writer: ${sensorid}, Value: ${val}`)
	})
}

// function getPoint(visinet, sensorid,) // IDK FLUX

exports.info = {
	name: "influxdb",
	load: false, // Not Finished
	gfuncs: [
		{
			name: "writePoint",
			func: writePoint
		}
	]
}