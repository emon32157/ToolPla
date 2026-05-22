<?php
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
}
