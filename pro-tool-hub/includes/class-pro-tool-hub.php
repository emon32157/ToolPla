<?php
/**
 * The core plugin class.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/includes
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub {

	/**
	 * Define the core functionality of the plugin.
	 */
	public function __construct() {
		$this->load_dependencies();
	}

	/**
	 * Load the required dependencies for this plugin.
	 */
	private function load_dependencies() {
		// Include core components
		require_once PRO_TOOL_HUB_PATH . 'includes/cpt-tools.php';
		require_once PRO_TOOL_HUB_PATH . 'includes/shortcodes.php';
		require_once PRO_TOOL_HUB_PATH . 'includes/analytics.php';
		require_once PRO_TOOL_HUB_PATH . 'includes/ajax-handlers.php';

		// Include admin components
		if ( is_admin() ) {
			require_once PRO_TOOL_HUB_PATH . 'admin/admin-menu.php';
			require_once PRO_TOOL_HUB_PATH . 'admin/meta-boxes.php';
			require_once PRO_TOOL_HUB_PATH . 'admin/settings.php';
			require_once PRO_TOOL_HUB_PATH . 'admin/dashboard.php';
			require_once PRO_TOOL_HUB_PATH . 'admin/tool-importer.php';
		}

		// Include public components
		require_once PRO_TOOL_HUB_PATH . 'public/class-public.php';
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 */
	public function run() {
		// Register Activation & Deactivation hooks
		register_activation_hook( PRO_TOOL_HUB_PATH . 'pro-tool-hub.php', array( $this, 'activate' ) );
		register_deactivation_hook( PRO_TOOL_HUB_PATH . 'pro-tool-hub.php', array( $this, 'deactivate' ) );

		// Instantiate modules to fire hook hooks inside their constructors or via run
		$cpt = new Pro_Tool_Hub_CPT();
		$cpt->init();

		$shortcodes = new Pro_Tool_Hub_Shortcodes();
		$shortcodes->init();

		$analytics = new Pro_Tool_Hub_Analytics();
		$analytics->init();

		$ajax = new Pro_Tool_Hub_AJAX_Handlers();
		$ajax->init();

		$public = new Pro_Tool_Hub_Public();
		$public->init();

		if ( is_admin() ) {
			$admin_menu = new Pro_Tool_Hub_Admin_Menu();
			$admin_menu->init();

			$meta_boxes = new Pro_Tool_Hub_Meta_Boxes();
			$meta_boxes->init();

			$settings = new Pro_Tool_Hub_Settings();
			$settings->init();

			$dashboard = new Pro_Tool_Hub_Dashboard();
			$dashboard->init();

			$importer = new Pro_Tool_Hub_Tool_Importer();
			$importer->init();
		}
	}

	/**
	 * Plugin activation logic
	 */
	public function activate() {
		// Register Custom Post Types for active rewrite-rule flushing
		$cpt = new Pro_Tool_Hub_CPT();
		$cpt->register_post_type();
		$cpt->register_taxonomy();
		flush_rewrite_rules();

		// Create database table for analytics
		$analytics = new Pro_Tool_Hub_Analytics();
		$analytics->create_db_table();
	}

	/**
	 * Plugin deactivation logic
	 */
	public function deactivate() {
		flush_rewrite_rules();
	}
}
