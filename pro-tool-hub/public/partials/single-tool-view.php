<?php
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

get_footer();
