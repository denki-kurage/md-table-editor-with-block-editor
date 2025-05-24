<?php
/**
 * Plugin Name:       MdTableEditor with Block Editor
 * Description:       This is an editor that allows you to edit tables in Markdown notation.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      8.0.30
 * Author:            denkikurage
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mdtableeditor
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


add_action( 'init', fn() => register_block_type( __DIR__ . '/build/kurage' ) );

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

	$themes = ['coy', 'dark', 'default', 'funkey', 'okaidia', 'solarized', 'tommorow', 'twilight'];
	$rand = wp_rand(0, count($themes) - 1);
	$theme = 'tommorow';

	$styles = [
		['md-table-editor-prism-tommorow', $pluginPath . "prismjs/{$theme}/prism.css"],
	];

	$scripts = [
		['md-table-editor-prism-core', $pluginPath . "prismjs/{$theme}/prism.js"],
	];

	$enqueue = function($styles, $scripts)
	{
		foreach($styles as $style) wp_enqueue_style(...$style);
		foreach($scripts as $script) wp_enqueue_script(...$script);
	};

	$renderInlineCss = function($url)
	{
		// インラインフレーム内で使用するものなので
		printf('<meta property="is-markdown-content-style" content="%s" />', esc_attr($url));
	};
	
	add_action('wp_enqueue_scripts', fn() => $enqueue($styles, $scripts));
	add_action('wp_enqueue_scripts', fn() => wp_enqueue_style('md-table-editor-front-css', $frontCss));

	add_action('admin_enqueue_scripts', fn() => $enqueue($styles, $scripts));
	add_action('admin_head', fn() => $renderInlineCss($adminCss));
	add_action('admin_head', fn() => $renderInlineCss($pluginPath . "prismjs/{$theme}/prism.css"));

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
				},
				'permission_callback' => fn() => current_user_can('manage_options'),
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
					$pa = wp_parse_url($admin, PHP_URL_SCHEME);
					$fa = wp_parse_url($front, PHP_URL_SCHEME);

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



