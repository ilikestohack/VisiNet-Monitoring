pub mod config;

use std::fs;

use crate::config::Config;

fn main() {
    let content = fs::read_to_string("config.example.json5").expect("this to work");
    let json = json5::from_str::<Config>(&content);
    let _ = dbg!(json);
}
