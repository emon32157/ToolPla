/**
 * Repository of the 18 plugin files forming Pro Tool Hub
 */
export interface PluginFile {
  path: string;
  name: string;
  content: string;
  language: 'php' | 'text' | 'css' | 'javascript' | 'json';
  description: string;
}

export const DEFAULT_PLUGIN_FILES: PluginFile[] = [
  {
    path: 'pro-tool-hub.php',
    name: 'pro-tool-hub.php',
    language: 'php',
    description: 'Main plugin header bootstrap file. Handles absolute path configurations, constants declarations, and runs the main module activation sequences.',
    content: `<?php
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
run_pro_tool_hub();`
  },
  {
    path: 'readme.txt',
    name: 'readme.txt',
    language: 'text',
    description: 'WordPress.org directory readme standard file. Provides user guides, setup parameters, details core specs, and answers FAQ protocols.',
    content: `=== Pro Tool Hub ===
Contributors: pro-tool-developer
Tags: tool hub, tool directory, shortcode tool, custom css js, seo meta
Requires at least: 5.8
Tested up to: 6.4
Stable tag: 1.0.0
License: GPLv2 or later

A premium-quality, fully unlocked tool directory and generator system. Create custom interactive tools with custom HTML, CSS, and JavaScript, embed them anywhere using shortcodes, configure SEO meta fields, and monitor engagement through a detailed analytics dashboard.

== Description ==

Pro Tool Hub is a modular tool directory solution designed for developers, bloggers, and utility site creators. It lets you construct custom utility tools (like calculators, converters, formatting tools, text utilities, etc.) with sandboxed or integrated scripts, and injects them onto any page via WordPress shortcodes.

= Features =
* **Unrestricted & Active**: Features are completely unlocked. No licensing key or activation required.
* **Custom Tool Post Type**: Dedicated panel for creating and managing responsive utilities.
* **Granular Injection**: Live input fields for custom HTML, individual stylesheet scoping (CSS), and script injection (JS).
* **SEO Suite**: Add custom Meta Title, Description, and Open Graph parameters on a per-tool level.
* **Custom Analytics Engine**: High-performance database logger tracking tool views per day, with interactive Chart.js visualization.
* **Import/Export Utility**: Swift JSON-based installer to back up, migrate, or load pre-made tools.

== Installation ==

1. Upload the \`pro-tool-hub\` folder to the \`/wp-content/plugins/\` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Access "Pro Tool Hub" in the main navigation menu to start adding tools and inspecting dashboards!

== Frequently Asked Questions ==

= How do I render a tool on the frontend? =
Simply copy the generated shortcode \`[pro_tool id="YOUR_TOOL_ID"]\` or \`[pro_tool slug="YOUR_TOOL_SLUG"]\` and paste it into any Gutenberg block, Elementor widget, or classic post editor.`
  },
  {
    path: 'includes/class-pro-tool-hub.php',
    name: 'class-pro-tool-hub.php',
    language: 'php',
    description: 'Primary loader class. Instantiates active dependencies, registers custom action triggers, and orchestrates admin option setups and execution flows.',
    content: `<?php
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
}`
  },
  {
    path: 'includes/cpt-tools.php',
    name: 'cpt-tools.php',
    language: 'php',
    description: 'Registers the custom WordPress post type `pro_tool` and taxonomy `tool_group` hierarchy maps.',
    content: `<?php
/**
 * Register Custom Post Types and Taxonomies.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/includes
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub_CPT {

	public function init() {
		add_action( 'init', array( $this, 'register_post_type' ) );
		add_action( 'init', array( $this, 'register_taxonomy' ) );
	}

	/**
	 * Register the Tools Custom Post Type.
	 */
	public function register_post_type() {
		$labels = array(
			'name'               => _x( 'Tools', 'post type general name', 'pro-tool-hub' ),
			'singular_name'      => _x( 'Tool', 'post type singular name', 'pro-tool-hub' ),
			'menu_name'          => _x( 'Tools', 'admin menu', 'pro-tool-hub' ),
			'name_admin_bar'     => _x( 'Tool', 'add new on admin bar', 'pro-tool-hub' ),
			'add_new'            => _x( 'Add New', 'tool', 'pro-tool-hub' ),
			'add_new_item'       => __( 'Add New Tool', 'pro-tool-hub' ),
			'new_item'           => __( 'New Tool', 'pro-tool-hub' ),
			'edit_item'          => __( 'Edit Tool', 'pro-tool-hub' ),
			'view_item'          => __( 'View Tool', 'pro-tool-hub' ),
			'all_items'          => __( 'All Tools', 'pro-tool-hub' ),
			'search_items'       => __( 'Search Tools', 'pro-tool-hub' ),
			'parent_item_colon'  => __( 'Parent Tools:', 'pro-tool-hub' ),
			'not_found'          => __( 'No tools found.', 'pro-tool-hub' ),
			'not_found_in_trash' => __( 'No tools found in Trash.', 'pro-tool-hub' )
		);

		$args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => 'pro-tool-hub', // Parent menu item slug
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'tool' ),
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => null,
			'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
			'show_in_rest'       => true,
		);

		register_post_type( 'pro_tool', $args );
	}

	/**
	 * Register Custom Taxonomy 'Tool Group' (Category).
	 */
	public function register_taxonomy() {
		$labels = array(
			'name'              => _x( 'Tool Groups', 'taxonomy general name', 'pro-tool-hub' ),
			'singular_name'     => _x( 'Tool Group', 'taxonomy singular name', 'pro-tool-hub' ),
			'search_items'      => __( 'Search Tool Groups', 'pro-tool-hub' ),
			'all_items'         => __( 'All Tool Groups', 'pro-tool-hub' ),
			'parent_item'       => __( 'Parent Tool Group', 'pro-tool-hub' ),
			'parent_item_colon' => __( 'Parent Tool Group:', 'pro-tool-hub' ),
			'edit_item'         => __( 'Edit Tool Group', 'pro-tool-hub' ),
			'update_item'       => __( 'Update Tool Group', 'pro-tool-hub' ),
			'add_new_item'      => __( 'Add New Tool Group', 'pro-tool-hub' ),
			'new_item_name'     => __( 'New Tool Group Name', 'pro-tool-hub' ),
			'menu_name'         => __( 'Tool Groups', 'pro-tool-hub' ),
		);

		$args = array(
			'hierarchical'      => true,
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'tool-group' ),
			'show_in_rest'      => true,
		);

		register_taxonomy( 'tool_group', array( 'pro_tool' ), $args );
	}
}`
  },
  {
    path: 'includes/shortcodes.php',
    name: 'shortcodes.php',
    language: 'php',
    description: 'Registers the main [pro_tool id=""] custom post rendering hook, combining HTML layouts, local CSS styles and executing sandboxed JS logic blocks.',
    content: `<?php
/**
 * Handle frontend shortcodes of Pro Tool Hub.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/includes
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub_Shortcodes {

	public function init() {
		add_shortcode( 'pro_tool', array( $this, 'render_tool' ) );
	}

	/**
	 * Render the tool based on ID or post slug.
	 * Format: [pro_tool id="123"] or [pro_tool slug="word-counter"]
	 */
	public function render_tool( $atts ) {
		$args = shortcode_atts( array(
			'id'   => '',
			'slug' => '',
		), $atts, 'pro_tool' );

		$post_id = 0;

		if ( ! empty( $args['id'] ) ) {
			$post_id = intval( $args['id'] );
		} elseif ( ! empty( $args['slug'] ) ) {
			$posts = get_posts( array(
				'name'           => sanitize_key( $args['slug'] ),
				'post_type'      => 'pro_tool',
				'posts_per_page' => 1,
				'fields'         => 'ids'
			) );
			if ( ! empty( $posts ) ) {
				$post_id = $posts[0];
			}
		}

		if ( ! $post_id || 'pro_tool' !== get_post_type( $post_id ) ) {
			return '<p>' . esc_html__( 'Tool not found.', 'pro-tool-hub' ) . '</p>';
		}

		// Log Analytics Hook
		do_action( 'pro_tool_hub_log_view', $post_id );

		// Extract tool metadata
		$html = get_post_meta( $post_id, '_pth_html', true );
		$css  = get_post_meta( $post_id, '_pth_css', true );
		$js   = get_post_meta( $post_id, '_pth_js', true );

		// CSS injection (scoped or local inside a container)
		$output = '';
		$uid    = 'pth-tool-' . $post_id . '-' . wp_rand( 100, 999 );

		if ( ! empty( $css ) ) {
			$output .= '<style scoped>';
			// Scope styles to this specific tool wrapper to avoid messing up general theme stylesheet
			$output .= '#' . $uid . ' { display: block; position: relative; } ';
			$output .= str_replace( '.tool-container', '#' . $uid, $css );
			$output .= '</style>';
		}

		$output .= '<div id="' . esc_attr( $uid ) . '" class="pro-tool-hub-container">';
		$output .= do_shortcode( $html ); // support sub-shortcodes if appropriate
		$output .= '</div>';

		if ( ! empty( $js ) ) {
			$output .= '<script type="text/javascript">';
			$output .= '(function(){';
			$output .= '  const container = document.getElementById("' . esc_js( $uid ) . '");';
			// Pass current container as a parameter to script so it doesn't leak or can query scope
			$output .= '  if(container) {';
			$output .= $js;
			$output .= '  }';
			$output .= '})();';
			$output .= '</script>';
		}

		return $output;
	}
}`
  },
  {
    path: 'includes/analytics.php',
    name: 'analytics.php',
    language: 'php',
    description: 'Tracks view impressions on tool shortcodes, sets up database SQL schemas, and handles secure data querying methods.',
    content: `<?php
/**
 * Handle view event tracking and custom DB database logic.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/includes
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub_Analytics {

	private $table_name;

	public function __construct() {
		global $wpdb;
		$this->table_name = $wpdb->prefix . 'pro_tool_hub_views';
	}

	public function init() {
		// Connect the custom action triggered in shortcodes.php
		add_action( 'pro_tool_hub_log_view', array( $this, 'log_tool_view' ) );
		// Connect single-post logic if direct post views are loaded
		add_action( 'wp', array( $this, 'track_direct_tool_views' ) );
	}

	/**
	 * Setup SQL schema for daily view statistics.
	 */
	public function create_db_table() {
		global $wpdb;
		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $this->table_name (
			id bigint(20) NOT NULL AUTO_INCREMENT,
			tool_id bigint(20) NOT NULL,
			view_date date NOT NULL,
			views_count int(11) DEFAULT 1 NOT NULL,
			PRIMARY KEY  (id),
			UNIQUE KEY tool_date (tool_id, view_date)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * Registers a view for the requested tool_id on the current day.
	 */
	public function log_tool_view( $tool_id ) {
		global $wpdb;
		$tool_id = intval( $tool_id );
		if ( ! $tool_id ) {
			return;
		}

		$today = current_time( 'Y-m-d' );

		// Use Upsert query natively
		$query = $wpdb->prepare(
			"INSERT INTO $this->table_name (tool_id, view_date, views_count) 
			 VALUES (%d, %s, 1) 
			 ON DUPLICATE KEY UPDATE views_count = views_count + 1",
			$tool_id,
			$today
		);

		$wpdb->query( $query );
	}

	/**
	 * Track standard direct single post impressions if single-pro_tool.php displays
	 */
	public function track_direct_tool_views() {
		if ( is_singular( 'pro_tool' ) ) {
			$post_id = get_queried_object_id();
			$this->log_tool_view( $post_id );
		}
	}

	/**
	 * Fetch compiled stats for a custom span of days.
	 */
	public function get_view_stats( $days = 30 ) {
		global $wpdb;
		$days = intval( $days );

		$query = $wpdb->prepare(
			"SELECT view_date, SUM(views_count) as total_views 
			 FROM $this->table_name 
			 WHERE view_date >= DATE_SUB(CURDATE(), INTERVAL %d DAY) 
			 GROUP BY view_date 
			 ORDER BY view_date ASC",
			$days
		);

		return $wpdb->get_results( $query, ARRAY_A );
	}

	/**
	 * Fetch stats breakdown per tool.
	 */
	public function get_per_tool_stats( $days = 30 ) {
		global $wpdb;
		$days = intval( $days );

		$query = $wpdb->prepare(
			"SELECT p.post_title, SUM(v.views_count) as total_views 
			 FROM $this->table_name v 
			 JOIN $wpdb->posts p ON v.tool_id = p.ID 
			 WHERE v.view_date >= DATE_SUB(CURDATE(), INTERVAL %d DAY) 
			 GROUP BY v.tool_id 
			 ORDER BY total_views DESC",
			$days
		);

		return $wpdb->get_results( $query, ARRAY_A );
	}
}`
  },
  {
    path: 'includes/ajax-handlers.php',
    name: 'ajax-handlers.php',
    language: 'php',
    description: 'Deploys admin AJAX endpoints for metrics fetching and secure log clearing with security Nonce checking.',
    content: `<?php
/**
 * Handle AJAX inquiries safely.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/includes
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub_AJAX_Handlers {

	public function init() {
		// Analytics charts fetch handlers
		add_action( 'wp_ajax_pro_tool_hub_get_analytics', array( $this, 'ajax_fetch_analytics' ) );
		// Clean logs/stat handler
		add_action( 'wp_ajax_pro_tool_hub_reset_analytics', array( $this, 'ajax_reset_analytics' ) );
	}

	/**
	 * Safely fetch formatted stats for chart display.
	 */
	public function ajax_fetch_analytics() {
		// Verify Nonce
		if ( ! isset( $_GET['nonce'] ) || ! wp_verify_nonce( $_GET['nonce'], 'pth_admin_nonce' ) ) {
			wp_send_json_error( array( 'message' => __( 'Security verification failed.', 'pro-tool-hub' ) ) );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Unauthorized access.', 'pro-tool-hub' ) ) );
		}

		$days      = isset( $_GET['days'] ) ? intval( $_GET['days'] ) : 7;
		$analytics = new Pro_Tool_Hub_Analytics();
		
		$daily_views = $analytics->get_view_stats( $days );
		$tool_views  = $analytics->get_per_tool_stats( $days );

		wp_send_json_success( array(
			'daily'     => $daily_views,
			'per_tool' => $tool_views
		) );
	}

	/**
	 * Reset tracked data logs.
	 */
	public function ajax_reset_analytics() {
		// Verify Nonce
		if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'pth_admin_nonce' ) ) {
			wp_send_json_error( array( 'message' => __( 'Security token expired.', 'pro-tool-hub' ) ) );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_send_json_error( array( 'message' => __( 'Unauthorized action.', 'pro-tool-hub' ) ) );
		}

		global $wpdb;
		$table_name = $wpdb->prefix . 'pro_tool_hub_views';
		$wpdb->query( "TRUNCATE TABLE $table_name" );

		wp_send_json_success( array( 'message' => __( 'Analytics logs and viewer reports have been wiped clean.', 'pro-tool-hub' ) ) );
	}
}`
  },
  {
    path: 'admin/admin-menu.php',
    name: 'admin-menu.php',
    language: 'php',
    description: 'Registers submenus under the central Pro Tool Hub WP dashboard sidebar, enqueuing localized secure scripts and styles parameters.',
    content: `<?php
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
}`
  },
  {
    path: 'admin/meta-boxes.php',
    name: 'meta-boxes.php',
    language: 'php',
    description: 'Implements HTML, scoped CSS, Custom JS editor textareas, alongside fields for Meta Title, Description, and OG parameters.',
    content: `<?php
/**
 * Custom fields for tools (HTML, CSS, JS, and SEO fields) on the edit screen.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/admin
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub_Meta_Boxes {

	public function init() {
		add_action( 'add_meta_boxes', array( $this, 'add_tool_meta_boxes' ) );
		add_action( 'save_post_pro_tool', array( $this, 'save_tool_meta_fields' ) );
	}

	public function add_tool_meta_boxes() {
		// Core Code Editor Meta Box
		add_meta_box(
			'pth_code_editor',
			__( 'Tool Code Components', 'pro-tool-hub' ),
			array( $this, 'render_code_editor_box' ),
			'pro_tool',
			'normal',
			'high'
		);

		// SEO Suite Meta Box
		add_meta_box(
			'pth_seo_suite',
			__( 'Tool SEO & Meta Suite', 'pro-tool-hub' ),
			array( $this, 'render_seo_suite_box' ),
			'pro_tool',
			'normal',
			'default'
		);
	}

	/**
	 * Renders HTML, CSS, & JS input codeblocks.
	 */
	public function render_code_editor_box( $post ) {
		// Nonce Security Verification
		wp_nonce_field( 'pth_save_code_meta', 'pth_code_nonce' );

		$html = get_post_meta( $post->ID, '_pth_html', true );
		$css  = get_post_meta( $post->ID, '_pth_css', true );
		$js   = get_post_meta( $post->ID, '_pth_js', true );

		// Prepopulate defaults if blank to assist developer setup
		if ( empty( $html ) && empty( $css ) && empty( $js ) && 'auto-draft' === $post->post_status ) {
			$html = '<div class="tool-content">' . "\\n" . '  <h3>Hello, World</h3>' . "\\n" . '  <button id="alert-btn">Click me</button>' . "\\n" . '</div>';
			$css  = '.tool-content {' . "\\n" . '  padding: 15px;' . "\\n" . '  border-radius: 6px;' . "\\n" . '  background-color: #f3f4f6;' . "\\n" . '}' . "\\n" . '.tool-content h3 {' . "\\n" . '  color: #1f2937;' . "\\n" . '}';
			$js   = 'const btn = container.querySelector("#alert-btn");' . "\\n" . 'if (btn) {' . "\\n" . '  btn.addEventListener("click", () => {' . "\\n" . '    alert("Interactive Script Fired!");' . "\\n" . '  });' . "\\n" . '}';
		}

		?>
		<div class="pth-meta-container">
			<div class="pth-field-row">
				<label for="pth_html"><strong><?php esc_html_e( 'HTML Markup', 'pro-tool-hub' ); ?></strong></label>
				<p class="description"><?php esc_html_e( 'Add your structure markup here. Standard WP shortcodes will parse inside this block.', 'pro-tool-hub' ); ?></p>
				<textarea id="pth_html" name="pth_html" rows="8" class="large-text code"><?php echo esc_textarea( $html ); ?></textarea>
			</div>

			<div class="pth-field-row">
				<label for="pth_css"><strong><?php esc_html_e( 'Scoped CSS Styles', 'pro-tool-hub' ); ?></strong></label>
				<p class="description"><?php esc_html_e( 'CSS definitions here are automatically scoped to prevent leaking into your global active theme. Use selector .tool-container to refer specifically to your utility container frame.', 'pro-tool-hub' ); ?></p>
				<textarea id="pth_css" name="pth_css" rows="8" class="large-text code"><?php echo esc_textarea( $css ); ?></textarea>
			</div>

			<div class="pth-field-row">
				<label for="pth_js"><strong>JavaScript Logic</strong></label>
				<p class="description">Write standard Vanilla JS commands. Use the auto-injected local variable <code>container</code> to query elements scope-locally. Avoid global scopes!</p>
				<textarea id="pth_js" name="pth_js" rows="8" class="large-text code"><?php echo esc_textarea( $js ); ?></textarea>
			</div>
		</div>
		<?php
	}

	/**
	 * Renders Title, Description, and Open Graph inputs.
	 */
	public function render_seo_suite_box( $post ) {
		wp_nonce_field( 'pth_save_seo_meta', 'pth_seo_nonce' );

		$seo_title = get_post_meta( $post->ID, '_pth_seo_title', true );
		$seo_desc  = get_post_meta( $post->ID, '_pth_seo_desc', true );
		$seo_og_img = get_post_meta( $post->ID, '_pth_seo_og_img', true );

		?>
		<div class="pth-meta-container pth-seo-wrapper">
			<div class="pth-field-row">
				<label for="pth_seo_title"><strong><?php esc_html_e( 'SEO Meta Title', 'pro-tool-hub' ); ?></strong></label>
				<input type="text" id="pth_seo_title" name="pth_seo_title" value="<?php echo esc_attr( $seo_title ); ?>" class="large-text" placeholder="<?php echo esc_attr( $post->post_title ); ?>" />
				<p class="description"><?php esc_html_e( 'Overrides default title on browser tab settings.', 'pro-tool-hub' ); ?></p>
			</div>

			<div class="pth-field-row">
				<label for="pth_seo_desc"><strong><?php esc_html_e( 'SEO Meta Description', 'pro-tool-hub' ); ?></strong></label>
				<textarea id="pth_seo_desc" name="pth_seo_desc" rows="3" class="large-text" placeholder="<?php esc_html_e( 'Brief visual teaser description...', 'pro-tool-hub' ); ?>"><?php echo esc_textarea( $seo_desc ); ?></textarea>
				<p class="description"><?php esc_html_e( 'Optimizes post snippets displayed on Google Search queries.', 'pro-tool-hub' ); ?></p>
			</div>

			<div class="pth-field-row">
				<label for="pth_seo_og_img"><strong><?php esc_html_e( 'Open Graph Image (URL)', 'pro-tool-hub' ); ?></strong></label>
				<input type="url" id="pth_seo_og_img" name="pth_seo_og_img" value="<?php echo esc_url( $seo_og_img ); ?>" class="large-text" placeholder="https://example.com/social-share.jpg" />
				<p class="description"><?php esc_html_e( 'Provide a specific thumbnail image URL triggered during URL shared previews on Discord, Facebook, and Twitter.', 'pro-tool-hub' ); ?></p>
			</div>
		</div>
		<?php
	}

	/**
	 * Verify and save post metas.
	 */
	public function save_tool_meta_fields( $post_id ) {
		// Avoid autosaves
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Save Code Fields
		if ( isset( $_POST['pth_code_nonce'] ) && wp_verify_nonce( $_POST['pth_code_nonce'], 'pth_save_code_meta' ) ) {
			if ( current_user_can( 'edit_post', $post_id ) ) {
				$html = isset( $_POST['pth_html'] ) ? wp_kses_post( wp_unslash( $_POST['pth_html'] ) ) : '';
				// Strip tags safely for CSS and scripts but keep actual string logic intact
				$css  = isset( $_POST['pth_css'] ) ? sanitize_textarea_field( wp_unslash( $_POST['pth_css'] ) ) : '';
				$js   = isset( $_POST['pth_js'] ) ? wp_unslash( $_POST['pth_js'] ) : ''; // Unslashed directly to keep js brackets syntax, but escaped selectively on render

				update_post_meta( $post_id, '_pth_html', $html );
				update_post_meta( $post_id, '_pth_css', $css );
				update_post_meta( $post_id, '_pth_js', $js );
			}
		}

		// Save SEO Fields
		if ( isset( $_POST['pth_seo_nonce'] ) && wp_verify_nonce( $_POST['pth_seo_nonce'], 'pth_save_seo_meta' ) ) {
			if ( current_user_can( 'edit_post', $post_id ) ) {
				$seo_title  = isset( $_POST['pth_seo_title'] ) ? sanitize_text_field( wp_unslash( $_POST['pth_seo_title'] ) ) : '';
				$seo_desc   = isset( $_POST['pth_seo_desc'] ) ? sanitize_textarea_field( wp_unslash( $_POST['pth_seo_desc'] ) ) : '';
				$seo_og_img = isset( $_POST['pth_seo_og_img'] ) ? esc_url_raw( wp_unslash( $_POST['pth_seo_og_img'] ) ) : '';

				update_post_meta( $post_id, '_pth_seo_title', $seo_title );
				update_post_meta( $post_id, '_pth_seo_desc', $seo_desc );
				update_post_meta( $post_id, '_pth_seo_og_img', $seo_og_img );
			}
		}
	}
}`
  },
  {
    path: 'admin/settings.php',
    name: 'settings.php',
    language: 'php',
    description: 'Enables global options controls, giving admins the ability to style global css overlays or toggle views logger networks.',
    content: `<?php
/**
 * Global settings configuration management panel.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/admin
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub_Settings {

	public function init() {
		add_action( 'admin_init', array( $this, 'register_settings_fields' ) );
	}

	public function register_settings_fields() {
		register_setting( 'pth_settings_group', 'pth_global_css' );
		register_setting( 'pth_settings_group', 'pth_load_analytics', array(
			'type'    => 'boolean',
			'default' => true
		) );
		register_setting( 'pth_settings_group', 'pth_custom_footer_credit' );
	}

	public function render() {
		?>
		<div class="wrap pth-admin-wrap">
			<h1 class="pth-brand-title"><?php esc_html_e( 'Pro Tool Hub Settings', 'pro-tool-hub' ); ?></h1>
			<p class="pth-sub-header">Configure global assets, analytics preferences, and branding overrides for your custom tools.</p>

			<form method="post" action="options.php">
				<?php settings_fields( 'pth_settings_group' ); ?>
				<?php do_settings_sections( 'pth_settings_group' ); ?>

				<table class="form-table card pth-settings-card">
					<tbody>
						<tr>
							<th scope="row">
								<label for="pth_load_analytics"><?php esc_html_e( 'Analytics Tracking Engine', 'pro-tool-hub' ); ?></label>
							</th>
							<td>
								<input type="checkbox" id="pth_load_analytics" name="pth_load_analytics" value="1" <?php checked( get_option( 'pth_load_analytics', true ), 1 ); ?> />
								<span class="description"><?php esc_html_e( 'Track custom impressions per tool and compile reporting details automatically.', 'pro-tool-hub' ); ?></span>
							</td>
						</tr>

						<tr>
							<th scope="row">
								<label for="pth_global_css"><?php esc_html_e( 'Global Shared Tool Stylesheet (CSS)', 'pro-tool-hub' ); ?></label>
							</th>
							<td>
								<textarea id="pth_global_css" name="pth_global_css" rows="6" class="large-text code"><?php echo esc_textarea( get_option( 'pth_global_css', '' ) ); ?></textarea>
								<p class="description"><?php esc_html_e( 'Inject global utilities classes, custom styling frameworks, or shared properties across all tools automatically.', 'pro-tool-hub' ); ?></p>
							</td>
						</tr>

						<tr>
							<th scope="row">
								<label for="pth_custom_footer_credit"><?php esc_html_e( 'Custom Footer Branding', 'pro-tool-hub' ); ?></label>
							</th>
							<td>
								<input type="text" id="pth_custom_footer_credit" name="pth_custom_footer_credit" value="<?php echo esc_attr( get_option( 'pth_custom_footer_credit' ) ); ?>" class="large-text" placeholder="Powered by Pro Tool Hub" />
								<p class="description"><?php esc_html_e( 'Add a customized copyright footer or badge to render globally underneath tools.', 'pro-tool-hub' ); ?></p>
							</td>
						</tr>
					</tbody>
				</table>

				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}
}`
  },
  {
    path: 'admin/dashboard.php',
    name: 'dashboard.php',
    language: 'php',
    description: 'Implements the core reporting panel, binding dynamic metrics arrays to canvas charts in real-time.',
    content: `<?php
/**
 * Renders the High-Performance Analytics Dashboard (using Chart.js).
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/admin
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub_Dashboard {

	public function init() {
		// Loaded via admin-menu.php controller
	}

	public function render() {
		$analytics = new Pro_Tool_Hub_Analytics();
		$daily     = $analytics->get_view_stats(7);
		$per_tool  = $analytics->get_per_tool_stats(7);

		$total_views = 0;
		foreach ( $daily as $day ) {
			$total_views += intval( $day['total_views'] );
		}
		
		?>
		<div class="wrap pth-admin-wrap">
			<div class="pth-dashboard-header">
				<h1 class="pth-brand-title"><?php esc_html_e( 'Pro Tool Hub Analytics Dashboard', 'pro-tool-hub' ); ?></h1>
				<button id="pth-reset-stats-btn" class="button button-link delete-button"><span class="dashicons dashicons-trash"></span> Wipe Statistics Data</button>
			</div>
			
			<div class="pth-grid-summary">
				<div class="pth-card-stat">
					<h3>Total Tool Views <span class="badge">7 Days</span></h3>
					<p class="number"><?php echo esc_html( $total_views ); ?></p>
				</div>
				<div class="pth-card-stat">
					<h3>Unique Tools Tracked</h3>
					<p class="number"><?php echo esc_html( count($per_tool) ); ?></p>
				</div>
				<div class="pth-card-stat">
					<h3>Integrations Status</h3>
					<p class="number text-sm font-semibold text-success">● Operational</p>
				</div>
			</div>

			<div class="pth-grid-charts">
				<div class="pth-chart-card container-card">
					<h3>Traffic Volume Map</h3>
					<div class="chart-wrapper">
						<canvas id="pth-traffic-chart"></canvas>
					</div>
				</div>

				<div class="pth-chart-card container-card">
					<h3>Breakdown Per Tool</h3>
					<div class="chart-wrapper">
						<canvas id="pth-breakdown-chart"></canvas>
					</div>
				</div>
			</div>

			<!-- Dynamic local hydration parameters for Admin scripts -->
			<script type="text/javascript">
				document.addEventListener('DOMContentLoaded', function() {
					window.pth_initial_stats = {
						daily: <?php echo wp_json_encode($daily); ?>,
						per_tool: <?php echo wp_json_encode($per_tool); ?>
					};
				});
			</script>
		</div>
		<?php
	}
}`
  },
  {
    path: 'admin/tool-importer.php',
    name: 'tool-importer.php',
    language: 'php',
    description: 'Builds JSON-based exporters and importers, handling uploads safely and saving properties using WordPress posts helper functions.',
    content: `<?php
/**
 * Clean JSON import/export system to manage tools securely.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/admin
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub_Tool_Importer {

	public function init() {
		add_action( 'admin_init', array( $this, 'process_tool_export_action' ) );
		add_action( 'admin_init', array( $this, 'process_tool_import_action' ) );
	}

	/**
	 * Export Tools payload as JSON attachment.
	 */
	public function process_tool_export_action() {
		if ( ! isset( $_GET['action'] ) || 'pth_export_tools' !== $_GET['action'] ) {
			return;
		}

		if ( ! isset( $_GET['nonce'] ) || ! wp_verify_nonce( $_GET['nonce'], 'pth_export_action' ) ) {
			wp_die( esc_html__( 'Security validation failed.', 'pro-tool-hub' ) );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Unauthorized credential access.', 'pro-tool-hub' ) );
		}

		$tools = get_posts( array(
			'post_type'      => 'pro_tool',
			'posts_per_page' => -1,
		) );

		$export_data = array();

		foreach ( $tools as $tool ) {
			$export_data[] = array(
				'title'      => $tool->post_title,
				'content'    => $tool->post_content,
				'excerpt'    => $tool->post_excerpt,
				'html'       => get_post_meta( $tool->ID, '_pth_html', true ),
				'css'        => get_post_meta( $tool->ID, '_pth_css', true ),
				'js'         => get_post_meta( $tool->ID, '_pth_js', true ),
				'seo_title'  => get_post_meta( $tool->ID, '_pth_seo_title', true ),
				'seo_desc'   => get_post_meta( $tool->ID, '_pth_seo_desc', true ),
				'seo_og_img' => get_post_meta( $tool->ID, '_pth_seo_og_img', true ),
			);
		}

		header( 'Content-Type: application/json; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename="pro-tools-export-' . gmdate( 'Y-m-d' ) . '.json"' );
		echo wp_json_encode( $export_data );
		exit;
	}

	/**
	 * Imports tools array payload securely.
	 */
	public function process_tool_import_action() {
		if ( ! isset( $_POST['pth_import_submit'] ) ) {
			return;
		}

		if ( ! isset( $_POST['pth_import_nonce'] ) || ! wp_verify_nonce( $_POST['pth_import_nonce'], 'pth_import_action' ) ) {
			wp_die( esc_html__( 'Security transaction authorization has timed out.', 'pro-tool-hub' ) );
		}

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Insufficient security permission parameters.', 'pro-tool-hub' ) );
		}

		if ( ! isset( $_FILES['pth_import_file'] ) || $_FILES['pth_import_file']['error'] !== UPLOAD_ERR_OK ) {
			add_settings_error( 'pth_importer', 'pth_upload_err', __( 'Please select a valid export file to proceed.', 'pro-tool-hub' ), 'error' );
			return;
		}

		$file_path = $_FILES['pth_import_file']['tmp_name'];
		$content   = file_get_contents( $file_path );
		$payload   = json_decode( $content, true );

		if ( ! is_array( $payload ) ) {
			add_settings_error( 'pth_importer', 'pth_json_invalid', __( 'Corrupted config JSON schema or contents.', 'pro-tool-hub' ), 'error' );
			return;
		}

		$count = 0;
		foreach ( $payload as $tool_data ) {
			if ( empty( $tool_data['title'] ) ) {
				continue;
			}

			// Create active post
			$post_id = wp_insert_post( array(
				'post_title'   => sanitize_text_field( $tool_data['title'] ),
				'post_content' => wp_kses_post( $tool_data['content'] ),
				'post_excerpt' => isset( $tool_data['excerpt'] ) ? sanitize_text_field( $tool_data['excerpt'] ) : '',
				'post_type'    => 'pro_tool',
				'post_status'  => 'publish'
			) );

			if ( is_wp_error( $post_id ) ) {
				continue;
			}

			// Register meta payloads
			update_post_meta( $post_id, '_pth_html', isset( $tool_data['html'] ) ? wp_kses_post( $tool_data['html'] ) : '' );
			update_post_meta( $post_id, '_pth_css', isset( $tool_data['css'] ) ? sanitize_textarea_field( $tool_data['css'] ) : '' );
			update_post_meta( $post_id, '_pth_js', isset( $tool_data['js'] ) ? wp_unslash( $tool_data['js'] ) : '' );
			update_post_meta( $post_id, '_pth_seo_title', isset( $tool_data['seo_title'] ) ? sanitize_text_field( $tool_data['seo_title'] ) : '' );
			update_post_meta( $post_id, '_pth_seo_desc', isset( $tool_data['seo_desc'] ) ? sanitize_textarea_field( $tool_data['seo_desc'] ) : '' );
			update_post_meta( $post_id, '_pth_seo_og_img', isset( $tool_data['seo_og_img'] ) ? esc_url_raw( $tool_data['seo_og_img'] ) : '' );

			$count++;
		}

		add_settings_error( 'pth_importer', 'pth_success', sprintf( __( 'Loaded %d custom tools into repository smoothly.', 'pro-tool-hub' ), $count ), 'updated' );
	}

	public function render() {
		?>
		<div class="wrap pth-admin-wrap">
			<h1 class="pth-brand-title"><?php esc_html_e( 'Pro Tool Hub Backup Suite', 'pro-tool-hub' ); ?></h1>
			<p class="pth-sub-header">Backup, migrate, or bulk install robust utility pre-sets swiftly using JSON protocols.</p>

			<?php settings_errors( 'pth_importer' ); ?>

			<div class="pth-importer-columns shadow">
				<!-- Export Card -->
				<div class="pth-importer-card card pth-equal-card">
					<h2>Backup Configuration System</h2>
					<p>Generate a secure JSON snapshot of all of your active tools (including their embedded scripts, scoped styles, markup, and custom SEO datasets).</p>
					
					<div class="pth-action">
						<a href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin.php?page=pro-tool-hub-importer&action=pth_export_tools' ), 'pth_export_action', 'nonce' ) ); ?>" class="button button-primary button-hero">
							<span class="dashicons dashicons-download"></span> Backup All Open Tools
						</a>
					</div>
				</div>

				<!-- Import Card -->
				<div class="pth-importer-card card pth-equal-card">
					<h2>Restore or Migrate Repositories</h2>
					<p>Load backing arrays and preset tool configuration maps straight into your system in real-time.</p>
					
					<form method="post" enctype="multipart/form-data" action="">
						<?php wp_nonce_field( 'pth_import_action', 'pth_import_nonce' ); ?>
						<p>
							<input type="file" name="pth_import_file" accept=".json" required />
						</p>
						<p class="pth-action">
							<button type="submit" name="pth_import_submit" class="button button-secondary button-hero">
								<span class="dashicons dashicons-upload"></span> Restore Configuration Map
							</button>
						</p>
					</form>
				</div>
			</div>
		</div>
		<?php
	}
}`
  },
  {
    path: 'public/partials/single-tool-view.php',
    name: 'single-tool-view.php',
    language: 'php',
    description: 'Serves as the dedicated single article style mapping on front panels, injecting metadata titles and rendering direct tool layouts.',
    content: `<?php
/**
 * Frontend template wrapper override to render single tools in fully scoped grids.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/public/partials
 */

get_header();

?>
<div id="primary" class="content-area pth-single-post-wrapper">
	<main id="main" class="site-main" role="main">

		<?php
		while ( have_posts() ) :
			the_post();

			$post_id = get_the_ID();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'pth-single-tool-article' ); ?>>
				<header class="entry-header pth-tool-header">
					<?php the_title( '<h1 class="entry-title pth-main-title">', '</h1>' ); ?>
					<?php if ( has_excerpt() ) : ?>
						<div class="entry-subtitle pth-subtitle"><?php the_excerpt(); ?></div>
					<?php endif; ?>
				</header>

				<div class="entry-content pth-main-content">
					<?php
					// Display main post editor content first
					the_content();

					// Inline injector of core shortcode logic
					$shortcodes = new Pro_Tool_Hub_Shortcodes();
					echo $shortcodes->render_tool( array( 'id' => $post_id ) );
					?>
				</div>

				<footer class="entry-footer pth-footer">
					<?php
					$footer_text = get_option( 'pth_custom_footer_credit', __( 'Powered by Pro Tool Hub', 'pro-tool-hub' ) );
					if ( ! empty( $footer_text ) ) {
						echo '<div class="pth-branding-credit">' . esc_html( $footer_text ) . '</div>';
					}
					?>
				</footer>
			</article>
			<?php

		endwhile; // End of the loop.
		?>

	</main>
</div>
<?php

get_footer();`
  },
  {
    path: 'public/class-public.php',
    name: 'class-public.php',
    language: 'php',
    description: 'Enqueues frontend styling files and triggers SEO metadata override tags inside the WP head buffer dynamically.',
    content: `<?php
/**
 * Client assets loader & Header SEO modifier logic.
 *
 * @package    Pro_Tool_Hub
 * @subpackage Pro_Tool_Hub/public
 */

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Pro_Tool_Hub_Public {

	public function init() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
		// Single templates bypass inject loader
		add_filter( 'single_template', array( $this, 'inject_single_tool_template' ) );
		// SEO tags parser hooks
		add_action( 'wp_head', array( $this, 'inject_seo_header_metadata' ), 1 );
	}

	public function enqueue_frontend_assets() {
		wp_enqueue_style( 'pth-public-css', PRO_TOOL_HUB_URL . 'assets/css/public-style.css', array(), PRO_TOOL_HUB_VERSION );
		wp_enqueue_script( 'pth-public-js', PRO_TOOL_HUB_URL . 'assets/js/public-script.js', array( 'jquery' ), PRO_TOOL_HUB_VERSION, true );
	}

	/**
	 * Load single-tool-view.php template file for direct custom post view mapping.
	 */
	public function inject_single_tool_template( $single_template ) {
		global $post;

		if ( 'pro_tool' === $post->post_type ) {
			$file = PRO_TOOL_HUB_PATH . 'public/partials/single-tool-view.php';
			if ( file_exists( $file ) ) {
				return $file;
			}
		}

		return $single_template;
	}

	/**
	 * Dynamically rewrite headers with custom SEO tags.
	 */
	public function inject_seo_header_metadata() {
		if ( ! is_singular( 'pro_tool' ) ) {
			return;
		}

		$post_id = get_queried_object_id();

		$seo_title  = get_post_meta( $post_id, '_pth_seo_title', true );
		$seo_desc   = get_post_meta( $post_id, '_pth_seo_desc', true );
		$seo_og_img = get_post_meta( $post_id, '_pth_seo_og_img', true );

		// Title rewrite modifier if provided
		if ( ! empty( $seo_title ) ) {
			echo '<!-- Pro Tool Hub SEO Suite overrides -->' . "\\n";
			echo '<title>' . esc_html( $seo_title ) . '</title>' . "\\n";
			echo '<meta property="og:title" content="' . esc_attr( $seo_title ) . '" />' . "\\n";
			echo '<meta name="twitter:title" content="' . esc_attr( $seo_title ) . '" />' . "\\n";
		}

		if ( ! empty( $seo_desc ) ) {
			echo '<meta name="description" content="' . esc_attr( $seo_desc ) . '" />' . "\\n";
			echo '<meta property="og:description" content="' . esc_attr( $seo_desc ) . '" />' . "\\n";
			echo '<meta name="twitter:description" content="' . esc_attr( $seo_desc ) . '" />' . "\\n";
		}

		if ( ! empty( $seo_og_img ) ) {
			echo '<meta property="og:image" content="' . esc_url( $seo_og_img ) . '" />' . "\\n";
			echo '<meta name="twitter:image" content="' . esc_url( $seo_og_img ) . '" />' . "\\n";
			echo '<meta name="twitter:card" content="summary_large_image" />' . "\\n";
		}
	}
}`
  },
  {
    path: 'assets/css/admin-style.css',
    name: 'admin-style.css',
    language: 'css',
    description: 'Styling definitions for dashboard grids, metrics summaries cards, loading scopes, and admin text areas.',
    content: `/* Core branding, spacing and dashboard analytics layout for Pro Tool Hub */

.pth-admin-wrap {
    margin: 20px 20px 0 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}

.pth-brand-title {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2px;
}

.pth-sub-header {
    font-size: 14px;
    color: #4b5563;
    margin-top: 0;
    margin-bottom: 25px;
}

/* Stat Grid */
.pth-grid-summary {
    display: flex;
    gap: 20px;
    margin-bottom: 25px;
    flex-wrap: wrap;
}

.pth-card-stat {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    flex: 1;
    min-width: 220px;
}

.pth-card-stat h3 {
    margin: 0 0 10px 0;
    font-size: 13px;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.05em;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pth-card-stat h3 .badge {
    background-color: #f3f4f6;
    color: #374151;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
}

.pth-card-stat .number {
    margin: 0;
    font-size: 32px;
    font-weight: 700;
    color: #111827;
}

.pth-card-stat .text-success {
    color: #10b981 !important;
}

/* Charts Panel */
.pth-grid-charts {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

@media(max-width: 1024px) {
    .pth-grid-charts {
        grid-template-columns: 1fr;
    }
}

.pth-chart-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.pth-chart-card h3 {
    margin: 0 0 20px 0;
    font-size: 16px;
    color: #111827;
    font-weight: 600;
}

.chart-wrapper {
    position: relative;
    height: 300px;
    width: 100%;
}

/* Importer Column */
.pth-importer-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.pth-importer-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 25px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.pth-importer-card h2 {
    margin-top: 0;
    color: #111827;
    font-weight: 600;
}

.pth-importer-card p {
    color: #4b5563;
    line-height: 1.5;
}

.pth-action {
    margin-top: 25px;
}

/* Codemirror Code editor Styling overrides */
.pth-field-row {
    margin-bottom: 20px;
}

.pth-field-row label {
    display: block;
    font-size: 14px;
    color: #111827;
    margin-bottom: 4px;
}

.pth-field-row textarea.code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 13px;
    background-color: #1e1e24;
    color: #f8f8f2;
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #3e3e4a;
    line-height: 1.5;
    width: 100%;
}

.pth-field-row textarea.code:focus {
    outline: none;
    border-color: #2271b1;
    box-shadow: 0 0 0 1px #2271b1;
}`
  },
  {
    path: 'assets/css/public-style.css',
    name: 'public-style.css',
    language: 'css',
    description: 'Handles layouts and padding margins for dynamic tools embed columns in theme grids frontend.',
    content: `/* Public styles for tools sandbox display wrapper */

.pro-tool-hub-container {
    width: 100%;
    margin: 1.5rem 0;
    box-sizing: border-box;
    font-family: system-ui, -apple-system, sans-serif;
}

.pro-tool-hub-container * {
    box-sizing: border-box;
}

/* Main single tool layout wrapper details */
.pth-single-tool-article {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
}

.pth-tool-header {
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 1.5rem;
}

.pth-main-title {
    font-size: 2.25rem;
    font-weight: 800;
    color: #111827;
    line-height: 1.2;
    margin-bottom: 0.5rem;
}

.pth-subtitle p {
    font-size: 1.125rem;
    color: #4b5563;
    margin: 0;
}

.pth-footer {
    margin-top: 3rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 1.5rem;
}

.pth-branding-credit {
    font-size: 0.825rem;
    color: #9ca3af;
    text-align: center;
    letter-spacing: 0.025em;
}`
  },
  {
    path: 'assets/js/admin-script.js',
    name: 'admin-script.js',
    language: 'javascript',
    description: 'Binds telemetry view maps data securely with Chart.js line and doughnut structures.',
    content: `/**
 * Admin dashboard & interactive charts setup.
 */
jQuery(document).ready(function($) {
    
    // Initialize Dashboard Statistics Charts if analytics endpoints are present
    if ($('#pth-traffic-chart').length > 0 && window.pth_initial_stats) {
        initDailyStatsChart(window.pth_initial_stats.daily);
        initBreakdownChart(window.pth_initial_stats.per_tool);
    }

    function initDailyStatsChart(data) {
        const ctx = document.getElementById('pth-traffic-chart').getContext('2d');
        const labels = data.map(item => item.view_date);
        const values = data.map(item => item.total_views);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Impressions',
                    data: values,
                    borderColor: '#2271b1',
                    backgroundColor: 'rgba(34, 113, 177, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    function initBreakdownChart(data) {
        const ctx = document.getElementById('pth-breakdown-chart').getContext('2d');
        const labels = data.map(item => item.post_title);
        const values = data.map(item => item.total_views);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#ec4899',
                        '#6b7280'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { boxWidth: 12 }
                    }
                }
            }
        });
    }

    // Reset statistics action handler
    $('#pth-reset-stats-btn').on('click', function(e) {
        e.preventDefault();
        
        if (confirm(pth_admin_data.strings.confirm_reset)) {
            const btn = $(this);
            btn.prop('disabled', true).text('Clearing statistics...');

            $.post(pth_admin_data.ajax_url, {
                action: 'pro_tool_hub_reset_analytics',
                nonce: pth_admin_data.nonce
            }, function(response) {
                if (response.success) {
                    alert(response.data.message);
                    window.location.reload();
                } else {
                    alert(response.data.message || pth_admin_data.strings.error);
                    btn.prop('disabled', false).text('Wipe Statistics Data');
                }
            }, 'json').fail(function() {
                alert(pth_admin_data.strings.error);
                btn.prop('disabled', false).text('Wipe Statistics Data');
            });
        }
    });
});`
  },
  {
    path: 'assets/js/public-script.js',
    name: 'public-script.js',
    language: 'javascript',
    description: 'Frontend client assets hook scripts.',
    content: `/**
 * Frontend execution file for public tools.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Dynamic custom hooks can listen to actions triggered on .pro-tool-hub-container
    console.log('Pro Tool Hub client assets mounted smoothly.');
});`
  }
];
