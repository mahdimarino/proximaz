/* jshint undef: true, unused: true */
/* global requirejs, require: false */
requirejs.config({
	waitSeconds: 0,
	paths: {
		'jquery': 'lib/jquery',
		'velocity': 'lib/velocity.min',
		'underscore': 'lib/underscore-min',
		'domReady': 'lib/domReady',
		'velocityUi': 'lib/velocity.ui',
		'owlCarousel': 'lib/owl.carousel.min'
	},

	shim: {
		'underscore': {
			exports: '_'
		},
		'velocity': ['jquery'],
		'velocityUi': {
			depse: [
				'jquery',
				'velocity'
			]
		},
		'owlCarousel': ['jquery']
	}
});

require(['jquery', 'domReady', 'underscore', 'velocity', 'velocityUi', 'owlCarousel'], function($, domReady, _){
	'use strict';

	function keepFullHeight() {
		var $container = $('.page-content');

		$container.height($(window).height());

		$(window).resize(_.debounce(function(){
			$container.height($(window).height());
		},500));
	}

	function revealElements() {
		$('.js-header').velocity('transition.slideDownIn', 1000);
		$('.js-footer').velocity('transition.slideUpIn', 1000);
		$('.owl-nav').velocity({
			opacity: '1'
		}, {duration: 1000, delay: 1000});

		$('.work-item-container').each(function(index) {
			$(this).velocity({
				opacity: '1',
				translateY: ['0', '20%']
			}, {duration: 1000, delay: index * 200});
		});
		setTimeout(function() {
			$('body').css('overflow', 'visible');
		}, 2000);
	}

	function initSlider() {
		var owl = $('.js-list-container');

		owl.owlCarousel({
			items: 3,
			dots: false,
			nav: true, 
			navText: ['', ''],
			smartSpeed: 500,
			navContainer: '.owl-nav',
			loop: true
		});
	}

	// Run functions
	keepFullHeight();

	// Init slider
	initSlider();

	// Make element fixed
	$('.js-item-type').click(function() {
		var top  	= $(this).offset().top,
			left 	= $(this).offset().left,
			nextL 	= ($(window).width() / 2) - ($(this).width() / 2),
			nextT 	= ($(window).height() / 2) - ($(this).height() / 2);

		// Calc rectangle
		var width 	= Math.pow($(window).width(), 2),
			height 	= Math.pow($(window).height(), 2),
			circleW = Math.pow((width + height), 1/2);

		$(this).addClass('is-active').css({
			top: top,
			left: left,
			position: 'fixed',
			margin: 0,
			'z-index': 999
		}).appendTo('body').velocity({
			top: nextT,
			left: nextL
		}, 300, 'ease', function () {
			$(this).addClass('is-changing').velocity({
				width: circleW,
				height: circleW,
				color: '#fff'
			}, 500, 'ease', function () {
				window.location.replace($(this).data('doc'));
			});
		});
	});

	// Reveal elements
	domReady(function () {
		revealElements();
	});
});