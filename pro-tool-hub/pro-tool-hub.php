<?php
/**
 * Plugin Name:       Pro Tool Hub
 * Plugin URI:        https://example.com/pro-tool-hub
 * Description:       A premium-quality, modular tool directory and creator system. Design custom tools with custom HTML, CSS, and JS, map them to shortcodes, manage SEO settings, and view interaction analytics without licensing limits.
 * Version:           1.0.0
 * Author:            Pro Tool Developer
 * Author URI:        https://example.com
 * License:           GPL2 or later
 * Text Domain:       pro-tool-hub
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Current plugin version.
 */
define( 'PRO_TOOL_HUB_VERSION', '1.0.0' );

/**
 * Path to the plugin directory.
 */
define( 'PRO_TOOL_HUB_PATH', plugin_dir_path( __FILE__ ) );

/**
 * URL to the plugin directory.
 */
define( 'PRO_TOOL_HUB_URL', plugin_dir_url( __FILE__ ) );

/**
 * The core plugin class definition.
 */
require_once PRO_TOOL_HUB_PATH . 'includes/class-pro-tool-hub.php';

/**
 * Begins execution of the plugin.
 */
function run_pro_tool_hub() {
	$plugin = new Pro_Tool_Hub();
	$plugin->run();
}
run_pro_tool_hub();
