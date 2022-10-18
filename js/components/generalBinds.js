/* jshint undef: true, unused: true */
/* global define: false */
define(['jquery', 'domReady', 'velocity', 'owlCarousel', 'fancybox', 'smoothScroll', 'underscore'], function($, domReady, Reveal) {
	'use strict';

	var General = {
		get: {
			nav: $('.js-nav-item a')
		},

		init: function() {
			this.bindUiActions();
		},

		bindUiActions: function() {
			General.bindPageScroll();

			this.bindOwlCarousel('.ingredien-carousel');
			this.bindTestim('.js-testim-list');
			this.bindfacnybox('.fancybox');

			domReady(function () {
				setTimeout(function() {
				General.hidePreloader();
					
				}, 500);
			});

			if ($('.color-palette').length) {
				this.checkCollors();
			}

			this.addHint();
		},

		addHint: function () {
			$('#mail_field').parent().prepend('<span class="form-hint js-form-hint">');
			$('.js-form-hint').html("To test the pre-order system enter your e-mail address, and you will recieve the message you've sent.").append("<span class='ps'>P.S. Don't worry, we won't spam you with stupid mails.</span>");

			$('#mail_field').focusin(function() {
				$('.js-form-hint').show().velocity('stop').velocity({
					translateY: ['-120%', '-110%'],
					opacity: ['1', '0']
				}, 250);
			}).focusout(function() {
				$('.js-form-hint').velocity('stop').velocity({
					translateY: ['-110%', '-120%'],
					opacity: ['0', '1']
				}, 250, function () {
					$('.js-form-hint').hide();
				});
			});
		},

		checkCollors: function () {
			var curent = $('body').data('color');

			$('.color-item[data-color='+curent+']').addClass('is-active');

			$('.color-item').click(function() {
				$('.color-item.is-active').removeClass('is-active');
				$(this).addClass('is-active');
				var nextC = $(this).data('color');

				$('body').attr('data-color', nextC);
			});

			$('.active-toggle').click(function() {
				$('.color-palette').toggleClass('is-active');
			});
		},

		hidePreloader: function () {
			$('body, html').scrollTop(0);

			$('.js-preloader-block').velocity({
				opacity: '0'
			}, 500, function () {
				$(this).hide();

				// Reveal hidden elements
				$(window).trigger('revealReady');
			});
			setTimeout(function() {
				General.hideFog();
			}, 250);
		},

		hideFog: function () {
			$('.fog-left-top').velocity({
				translateX: '-50%',
				translateY: '-150%',
				opacity: '0',
				scale: '1.5'
			}, 3000, function () {
				$(this).hide();
			});
			$('.fog-left-bottom').velocity({
				translateX: '-50%',
				translateY: '-100%',
				opacity: '0',
				scale: '1.5'
			}, 3000, function () {
				$(this).hide();
			});
			$('.fog-right-top').velocity({
				translateX: '50%',
				translateY: '-150%',
				opacity: '0',
				scale: '1.5'
			}, 3000, function () {
				$(this).hide();
			});
			$('.fog-right-bottom').velocity({
				translateX: '50%',
				translateY: '-100%',
				opacity: '0',
				scale: '1.5'
			}, 3000, function () {
				$(this).hide();
			});
		},

		bindPageScroll: function() {
			$('.book-table').click(function() {
				var scrollTo = $('#contact').offset().top;
				$('html, body').stop().animate({
				    'scrollTop': scrollTo
				}, 1000, 'swing');
			});

			General.get.nav.on('click',function (e) {
		        e.preventDefault();

		        var target = this.hash,
		        $target = $(target);

		        $('html, body').stop().animate({
		            'scrollTop': $target.offset().top
		        }, 1000, 'swing', function () {
		            window.location.hash = target;
		        });
		    });
		},
		bindfacnybox: function(target) {
			$(target).fancybox({
				openEffect	: 'none',
				closeEffect	: 'none',
				helpers: {
			        overlay: {
			          locked: false
			        }
			    }
			});
		},
		bindTestim: function (target) {
			$(target).on('initialized.owl.carousel', function() {
				var content = $('.owl-item.center', $(this)).find('.js-item-testim').text();
				$('.js-testim-content').html(content).slideDown(250);
			});

			$(target).owlCarousel({
			    center: true,
			    mouseDrag: false,
			    touchDrag: false,
			    nav: true,
			    dots: false,
			    smartSpeed: 500,
			    navText: ['', ''],
			    responsive: {
			    	0: {
			    		items: 1,
			    		navRewind: true,
			    		mouseDrag: true,
			    		touchDrag: true
			    	},
			    	750: {
			    		items: 3
			    	}
			    }
			});

			$('.owl-next', $(target)).addClass('fa-angle-right fa');
			$('.owl-prev', $(target)).addClass('fa-angle-left fa');

			$(target).on('translated.owl.carousel', function() {
				var el 		= $('.js-testim-content'),
					content = $('.owl-item.center', $(this)).find('.js-item-testim').text(),
					curentH = el.height();

				el.parent().height(curentH);

				el.velocity({
					opacity: ['0', '1']
				}, 250, function () {
					el.html(content);
					var newH = el.height();
					el.parent().height(newH);
					
					el.delay(250).velocity('reverse');
				});
			});
		},
		bindOwlCarousel: function(target) {
			$(target).owlCarousel({
			    loop:true,
			    margin:25,
			    responsiveClass:true,
			    navText: false,
			    pagination:false,
			    autoplay: 5000,
			    responsive:{
			        0:{
			            items:1,
			            nav:true
			        },
			        600:{
			            items:2,
			            nav:false
			        },
			        1000:{
			            items:2,
			            nav:true,
			            loop:false
			        }
			    }
			});

			$('.owl-next', $(target)).addClass('fa-angle-right fa');
			$('.owl-prev', $(target)).addClass('fa-angle-left fa');
		}
	};

	General.init();
});