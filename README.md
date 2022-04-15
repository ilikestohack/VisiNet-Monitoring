# VisiNet Monitoring
## A new way to monitor your networking

## Setup
1. [Install InfluxDB](https://docs.influxdata.com/influxdb/v2.1/install/) by following the steps to install and configure your bucket
2. Copy `config.example.json` to `config.json`
3. Fill in the config.json file using the guild below
4. Run VisiNet Monitoring using the run.bat script on windows or node . in a CLI

## Configuration
```json
{
	"module_logging": {
		"consoledebug": "true", // true/false - log debug lines to console
		"filedebug": "true", // true/false - log debug lines to a file
		"custom": { // true/file/false - log to console+file, log to file, do not log
			"custom_server_ping-ping_data": "file",
			"InfluxDB-write_info": "file",
			"dns_tester-resolve_out": "file",
			"network_issue-query_out": "file"
		}
	},
	"influxdb": { // Does not currently support org/token methods [see this](https://docs.influxdata.com/influxdb/v2.1/reference/api/influxdb-1x/#authenticate-with-a-username-and-password-scheme)
		"url": "INFLUX IP:PORT", // The IP:Port of your Influx instance for example 192.168.1.2:8086
		"username": "INFLUX USERNAME", // The Username for your Influx instance
		"password": "INFLUX PASSWORD", // The Password for your Influx instance
		"db": "INFLUX BUCKET/DB" // The DB of your Influx instance
	},
	"monitors": { // run: true/false run or do not run the specified Monitor, interval: the amount of time before VisiNet Rescans the Monitors in milliseconds
		"common_server_ping": {
			"run": "true",
			"interval": 5000,
			"servers": ["8.8.8.8", "1.1.1.1", "192.168.1.1"] // The Servers which will be pinged by common_server_ping Monitor
		},
		"dns_tester": {
			"run": "true",
			"interval": "10000",
			"servers": ["192.168.1.1", "1.1.1.1", "8.8.8.8"] // The Servers which will be resolved by dns_tester Monitor
		},
		"network_issue": {
			"run": "true",
			"interval": "15000",
			"lan_check_ip": "192.168.1.44", // The IP used to check LAN connection (should be included in common_server_ping Monitor)
			"dns_check_server": "192.168.1.44", // The IP used to check DNS Resolve connection (should be included in dns_tester Monitor)
			"wan_check_ip": "1.1.1.1" // The IP used to check WAN connection (should be included in common_server_ping Monitor)
		},
		"nmap_check": {
			"run": "true",
			"interval": "10000",
			"checks": [ // An array of check objects
				{
					"host": "192.168.1.40", // The IP address to be checked
					"port": 25565, // The port to be checked
					"type": "tcp" // The scan type tcp/udp
				},
				{
					"host": "192.168.1.40",
					"port": 19132,
					"type": "udp"
				}
			]
		}
	},
	"operating_system": "windows", // Used to parse command differences windows/linux
	"runtests": "true" // true/false Run tests in Tests folder
}
```