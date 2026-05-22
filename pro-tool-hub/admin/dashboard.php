<?php
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
}
