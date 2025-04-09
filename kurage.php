<?php
/**
 * Plugin Name:       Kurage
 * Description:       Example block scaffolded with Create Block tool.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       kurage
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_kurage_block_init() {
	register_block_type( __DIR__ . '/build/kurage' );
}
add_action( 'init', 'create_block_kurage_block_init' );

add_action( 'after_setup_theme', function(){
	add_theme_support('align-wide');
});




add_action('init', function(){
	$pluginPath = plugin_dir_url(__FILE__);
	$cssPath = $pluginPath . 'markdown.css';
	$adminCss = get_option('md-table-editor:admin', '');
	$frontCss = get_option('md-table-editor:front', '');

	$adminCss = $adminCss ? $adminCss : $cssPath;
	$frontCss = $frontCss ? $frontCss : $cssPath;


	add_action('wp_head', fn() => printf('<link rel="stylesheet" href="%s" />', esc_attr($frontCss)));
	add_action('admin_head', fn() => printf('<link rel="stylesheet" is-markdown-content-style="true" href="%s" />', esc_attr($adminCss)));
});

add_action('rest_api_init', function(){

	// グローバル設定のデータを受け取る(getCurrentPost()から取得)
	register_rest_field(
		'post',
		'md_table_editor_height',
		[
			'get_callback' => fn() => (int)get_option('md-table-editor:editor-height', 500)
		]
	);

	register_rest_route(
		'md-table-editor/v1',
		'/settings',
		[
			[
				'methods' => WP_REST_Server::READABLE,
				'callback' => function(WP_REST_Request $request)
				{
					$admin = get_option('md-table-editor:admin', '');
					$front = get_option('md-table-editor:front', '');
					$height = (int)get_option('md-table-editor:editor-height', 500);

					return rest_ensure_response([
						'admin' => $admin,
						'front' => $front,
						'editorHeight' => $height
					]);
				}
			],
			[
				'methods' => WP_REST_Server::CREATABLE,
				'callback' => function(WP_REST_Request $request)
				{
					$admin = $request->get_param('admin');
					$front = $request->get_param('front');
					$height = (int)$request->get_param('editorHeight');

					update_option('md-table-editor:admin', esc_url($admin));
					update_option('md-table-editor:front', esc_url($front));
					update_option('md-table-editor:editor-height', $height);

					return rest_ensure_response([
						'admin' => $admin,
						'front' => $front,
						'editorHeight' => $height
					]);
				},
				'permission_callback' => fn() => current_user_can('manage_options'),
				'validate_callback' => function($request)
				{
					$admin = $request->get_param('admin');
					$front = $request->get_param('front');
					$pa = parse_url($admin, PHP_URL_SCHEME);
					$fa = parse_url($front, PHP_URL_SCHEME);

					$height = (int)$request->get_param('editorHeight');

					$errors = new WP_Error();

					if(!($admin === '' || $pa === 'http' || $pa === 'https'))
					{
						$errors->add('md_table_editor_admin_error', 'admin url is parsed error!');
					}

					if(!($front === '' || $fa === 'http' || $fa === 'https'))
					{
						$errors->add('md_table_editor_front_error', 'front url is parsed error!');
					}

					if($height < 100 || $height > 2000)
					{
						$errors->add('md_table_editor_editorheight_error', 'Editor height is overflow');
					}
					
					return $errors->has_errors() ? $errors : true;
				}
			],
		]);
});

