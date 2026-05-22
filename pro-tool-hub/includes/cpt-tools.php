<?php
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
}
