<?php
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
			$html = '<div class="tool-content">' . "\n" . '  <h3>Hello, World</h3>' . "\n" . '  <button id="alert-btn">Click me</button>' . "\n" . '</div>';
			$css  = '.tool-content {' . "\n" . '  padding: 15px;' . "\n" . '  border-radius: 6px;' . "\n" . '  background-color: #f3f4f6;' . "\n" . '}' . "\n" . '.tool-content h3 {' . "\n" . '  color: #1f2937;' . "\n" . '}';
			$js   = 'const btn = container.querySelector("#alert-btn");' . "\n" . 'if (btn) {' . "\n" . '  btn.addEventListener("click", () => {' . "\n" . '    alert("Interactive Script Fired!");' . "\n" . '  });' . "\n" . '}';
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
}
