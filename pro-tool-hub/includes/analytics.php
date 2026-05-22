<?php
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
}
