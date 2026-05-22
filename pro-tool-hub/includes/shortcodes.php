<?php
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
}
