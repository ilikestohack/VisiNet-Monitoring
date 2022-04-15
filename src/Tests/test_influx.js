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
	// Write Point to Influx
	visinet.gfunctions.writePoint(visinet, "test_infux", 100, "f")
	
	// Reset Point
	setTimeout(function(){
		visinet.gfunctions.writePoint(visinet, "test_infux", 0, "f")
	}, 8000)
	
	// Back to 50
	setTimeout(function(){
		visinet.gfunctions.writePoint(visinet, "test_infux", 50, "f")
	}, 16000)
	
	// Reset Point
	setTimeout(function(){
		visinet.gfunctions.writePoint(visinet, "test_infux", 0, "f")
	}, 24000)
}