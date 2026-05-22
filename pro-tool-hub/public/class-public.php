<?php
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
			echo '<!-- Pro Tool Hub SEO Suite overrides -->' . "\n";
			echo '<title>' . esc_html( $seo_title ) . '</title>' . "\n";
			echo '<meta property="og:title" content="' . esc_attr( $seo_title ) . '" />' . "\n";
			echo '<meta name="twitter:title" content="' . esc_attr( $seo_title ) . '" />' . "\n";
		}

		if ( ! empty( $seo_desc ) ) {
			echo '<meta name="description" content="' . esc_attr( $seo_desc ) . '" />' . "\n";
			echo '<meta property="og:description" content="' . esc_attr( $seo_desc ) . '" />' . "\n";
			echo '<meta name="twitter:description" content="' . esc_attr( $seo_desc ) . '" />' . "\n";
		}

		if ( ! empty( $seo_og_img ) ) {
			echo '<meta property="og:image" content="' . esc_url( $seo_og_img ) . '" />' . "\n";
			echo '<meta name="twitter:image" content="' . esc_url( $seo_og_img ) . '" />' . "\n";
			echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
		}
	}
}
