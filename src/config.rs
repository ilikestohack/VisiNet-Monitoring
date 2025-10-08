use serde::Deserialize;

#[derive(Deserialize, Debug, PartialEq)]
pub struct Config {
    pub log_level: u8,
    pub monitor_settings: MonitorDefaultSettings,
    pub outputs: OutputSettings,
    pub monitors: MonitorsSettings,
}

#[derive(Deserialize, Debug, PartialEq)]
pub struct MonitorDefaultSettings {
    pub heartbeat_interval: u8,
    pub retries: u8,
    pub retry_interval: u8,
    pub upside_down: bool,
    pub was_it_dns: bool,
}

#[derive(Deserialize, Debug, PartialEq)]
pub struct OutputSettings {
    pub log: bool,
}

#[derive(Deserialize, Debug, PartialEq)]
pub struct MonitorsSettings {
    pub http: Vec<HTTPMonitor>,
    pub ping: Vec<PingMonitor>,
    pub tcp: Vec<TcpMonitor>,
    pub dns: Vec<DNSMonitor>,
    pub groups: Vec<GroupMonitor>,
}

#[derive(Deserialize, Debug, PartialEq)]
#[serde(tag = "type", content = "value")]
pub enum VisinetMonitorSetting {
    Text(String),
    Boolean(bool),
}

#[derive(Deserialize, Debug, PartialEq)]
pub struct VisinetMonitorSettings {
    pub ping: VisinetMonitorSetting,
    pub dns: VisinetMonitorSetting,
}

#[derive(Deserialize, Debug, PartialEq)]
pub struct HTTPMonitor {}

#[derive(Deserialize, Debug, PartialEq)]
pub struct PingMonitor {
    pub name: String,
    pub hostname: String,
    pub packet_size: u8,
    pub monitor_settings: MonitorDefaultSettings,
    pub visinet_settings: VisinetMonitorSettings,
}

#[derive(Deserialize, Debug, PartialEq)]
pub struct TcpMonitor {}

#[derive(Deserialize, Debug, PartialEq)]
pub struct DNSMonitor {}

#[derive(Deserialize, Debug, PartialEq)]
pub struct GroupMonitor {}
