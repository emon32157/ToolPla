<?php
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
}
