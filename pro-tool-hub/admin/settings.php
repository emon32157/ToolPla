<?php
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
}
