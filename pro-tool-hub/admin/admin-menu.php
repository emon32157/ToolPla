<?php
/**
 * Register Admin menus and settings screens.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/admin
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub_Admin_Menu {

	public function init() {
		add_action( 'admin_menu', array( $this, 'register_admin_pages' ) );
		add_action( 'admin_init', array( $this, 'register_custom_admin_assets' ) );
	}

	/**
	 * Registers pages under the primary WP admin bar sidebar.
	 */
	public function register_admin_pages() {
		// Root controller menu item
		add_menu_page(
			__( 'Pro Tool Hub', 'pro-tool-hub' ),
			__( 'Pro Tool Hub', 'pro-tool-hub' ),
			'manage_options',
			'pro-tool-hub',
			array( $this, 'render_dashboard_page' ),
			'dashicons-superhero-alt', // Cool hero icon
			9
		);

		// Tools Redirect Menu Item - Maps custom post lists inside the hub structure
		add_submenu_page(
			'pro-tool-hub',
			__( 'My Tools', 'pro-tool-hub' ),
			__( 'My Tools', 'pro-tool-hub' ),
			'edit_posts',
			'edit.php?post_type=pro_tool'
		);

		// Groups Redirect Menu Item - Category tags mapping
		add_submenu_page(
			'pro-tool-hub',
			__( 'Tool Groups', 'pro-tool-hub' ),
			__( 'Tool Groups', 'pro-tool-hub' ),
			'manage_categories',
			'edit-tags.php?taxonomy=tool_group&post_type=pro_tool'
		);

		// Settings submenu page
		add_submenu_page(
			'pro-tool-hub',
			__( 'Settings', 'pro-tool-hub' ),
			__( 'Settings', 'pro-tool-hub' ),
			'manage_options',
			'pro-tool-hub-settings',
			array( $this, 'render_settings_page' )
		);

		// Importer / Exporter template submenu page
		add_submenu_page(
			'pro-tool-hub',
			__( 'Import / Export', 'pro-tool-hub' ),
			__( 'Import & Export', 'pro-tool-hub' ),
			'manage_options',
			'pro-tool-hub-importer',
			array( $this, 'render_importer_page' )
		);

		// Remove the double root menu duplication
		remove_submenu_page( 'pro-tool-hub', 'pro-tool-hub' );
		
		// Add Dashboard back first
		add_submenu_page(
			'pro-tool-hub',
			__( 'Dashboard & Stats', 'pro-tool-hub' ),
			__( 'Dashboard', 'pro-tool-hub' ),
			'manage_options',
			'pro-tool-hub',
			array( $this, 'render_dashboard_page' )
		);
	}

	/**
	 * Load scripts and styles purely for active Pro Tool Hub pages.
	 */
	public function register_custom_admin_assets( $hook ) {
		// Enqueue scripts specifically inside plugin scopes to prevent global visual conflicts
		wp_register_style( 'pth-admin-css', PRO_TOOL_HUB_URL . 'assets/css/admin-style.css', array(), PRO_TOOL_HUB_VERSION );
		wp_register_script( 'pth-admin-js', PRO_TOOL_HUB_URL . 'assets/js/admin-script.js', array( 'jquery' ), PRO_TOOL_HUB_VERSION, true );
		wp_register_script( 'pth-chart-js', 'https://cdn.jsdelivr.net/npm/chart.js', array(), '4.4.1', false );

		add_action( 'admin_enqueue_scripts', function ( $cur ) {
			if ( strpos( $cur, 'pro-tool-hub' ) !== false || strpos( $cur, 'pro_tool' ) !== false ) {
				wp_enqueue_style( 'pth-admin-css' );
				wp_enqueue_script( 'pth-chart-js' );
				wp_enqueue_script( 'pth-admin-js' );

				// Localize variables securely
				wp_localize_script( 'pth-admin-js', 'pth_admin_data', array(
					'ajax_url' => admin_url( 'admin-ajax.php' ),
					'nonce'    => wp_create_nonce( 'pth_admin_nonce' ),
					'strings'  => array(
						'confirm_reset' => __( 'Are you sure you want to permanently clear all view history logs?', 'pro-tool-hub' ),
						'error'         => __( 'An unexpected error occurred.', 'pro-tool-hub' )
					)
				) );
			}
		});
	}

	public function render_dashboard_page() {
		require_once PRO_TOOL_HUB_PATH . 'admin/dashboard.php';
		$db_page = new Pro_Tool_Hub_Dashboard();
		$db_page->render();
	}

	public function render_settings_page() {
		require_once PRO_TOOL_HUB_PATH . 'admin/settings.php';
		$settings_page = new Pro_Tool_Hub_Settings();
		$settings_page->render();
	}

	public function render_importer_page() {
		require_once PRO_TOOL_HUB_PATH . 'admin/tool-importer.php';
		$importer_page = new Pro_Tool_Hub_Tool_Importer();
		$importer_page->render();
	}
}
