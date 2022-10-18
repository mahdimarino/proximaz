/* jshint undef: true, unused: true */
/* global requirejs, require: false */
requirejs.config({
	waitSeconds: 0,
	paths: {
		'jquery': 'lib/jquery',
		'underscore': 'lib/underscore-min',
		'backbone': 'lib/backbone-min',
		'fastclick': 'lib/fastclick',
		'velocity': 'lib/velocity.min',
		'customScroll': 'lib/jquery.mCustomScrollbar.concat.min',
      	'waitImg': 'lib/jquery.waitforimages.min',
		'lightbox': 'lib/imagelightbox.min',
		'easing': 'lib/jquery.easing.1.3',
		'velocityUi': 'lib/velocity.ui', 
		'owlCarousel': 'lib/owl.carousel.min',
		'fancybox': 'lib/jquery.fancybox',
		'smoothScroll': 'lib/smoothscroll',
		'domReady': 'lib/domReady',
		'inview': 'lib/inview'
	},

	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		},
		'fastclick': ['jquery'],
		'velocity': ['jquery'],
		'owlCarousel': ['jquery'],
		'fancybox': ['jquery'],
		'velocityUi': {
			depse: [
				'jquery',
				'velocity'
			]
		},
		'customScroll': ['jquery'],
		'lightbox': ['jquery'],
		'waitImg': ['jquery'],
		'easing': ['jquery'],
		'smoothScroll': ['jquery'],
		'inview': ['jquery']
	}
});

require([
	'components/products',
	'components/generalBinds',
	'components/headerSlider',
	'components/reavealElements',
	'components/map'
]);