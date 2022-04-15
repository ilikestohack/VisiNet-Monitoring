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
 
exports.run = function(visinet){
	visinet.cmodulesvars.influxdb = {}
	visinet.cmodulesvars.influxdb.influxDB = require('influxdb-nodejs');
	visinet.cmodulesvars.influxdb.client = new visinet.cmodulesvars.influxdb.influxDB(`http://${visinet.config.influxdb.username}:${visinet.config.influxdb.password}@${visinet.config.influxdb.url}/${visinet.config.influxdb.db}?auth=basic`)
}

function writePoint(visinet, sensorid, val, schema, tagsin){
	const fieldSchema = {
	  value: schema
	};
	tagSchema = {
		"sensor_id": "*"
	};
	tags = {
		"sensor_id": sensorid
	};
	fieldjson = {};
	
	if(schema == "i"){
		fieldjson.integer = val;
	}else if(schema == "s"){
		fieldjson.string = val;
	}else if(schema == "f"){
		fieldjson.value = val;
	}else if(schema == "b"){
		fieldjson.boolean = val;
	}
	
	if(tagsin){
		tagsin.forEach(function(item,index){
			tagSchema[item.name] = '*';
			tags[item.name] = item.value;
		})
	}
	
	visinet.cmodulesvars.influxdb.client.schema('network_data', fieldSchema, tagSchema, {});
	
	visinet.cmodulesvars.influxdb.client.write('network_data')
		.tag(tags)
		.field(fieldjson)
	  .then(() => visinet.gfunctions.logDCustom(visinet, "InfluxDB-write_info", `{Influx DB} WRITE FINISHED Writer: ${sensorid}, Value: ${val}`))
	  .catch(console.error);
}

exports.info = {
	name: "influxdb",
	load: true,
	gfuncs: [
		{
			name: "writePoint",
			func: writePoint
		}
	]
}