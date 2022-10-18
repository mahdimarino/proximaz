/* jshint undef: true, unused: true */
/* global define: false */
define(['jquery', 'underscore', 'owlCarousel'], function($, _){
	"use strict";

	var s = {
		$owl: $('.js-header-slider'),
		$owlT: $('.js-text-slider')
	};

	var HeaderSlider = {
		init: function () {
			this.bindUiActions();
		},

		bindUiActions: function () {
			if (s.$owl) {
				s.$owl.on('initialized.owl.carousel', function() {
					HeaderSlider.findItems();
				});

				this.initSlider();

				s.$owl.on('translated.owl.carousel', function() {
					HeaderSlider.findItems();
				});
			}

			if (s.$owlT) {
				HeaderSlider.initTextSlider();
			}
		},

		initTextSlider: function () {
			s.$owlT.owlCarousel({
				dots: false,
				smartSpeed: 2000,
				items: 1,
				loop: true,
				autoplay: true,
				autoHeight: true,
				animateIn: 'fadeInDown',
				animateOut: 'fadeOutDown'
			});
		},

		initSlider: function () {
			s.$owl.owlCarousel({
			    nav: true,
			    dots: false,
			    smartSpeed: 700,
			    navText: ['', ''],
			    items: 1,
			    loop: true,
			    animateIn: 'fadeIn',
			    animateOut: 'fadeOut'
		    });

		    $('.owl-nav div', s.$owl).append('<div class="item-thumb"><span class="thumb-image"></div>');
		    $('.owl-next', s.$owl).addClass('fa fa-angle-right');
		    $('.owl-prev', s.$owl).addClass('fa fa-angle-left');

		    if (s.$owl.hasClass('is-parallax')) {
		    	HeaderSlider.cheepFullHeight();
		    }

		    HeaderSlider.checkImagesSize();

		    $(window).resize(_.debounce(function(){
		    	if (s.$owl.hasClass('is-parallax')) {
		    		HeaderSlider.cheepFullHeight();
		    	}

			    HeaderSlider.checkImagesSize();
		    },500));
		},

		cheepFullHeight: function () {
			$('.item-container', s.$owl).css({
				padding: '0',
				height: $(window).height()
			});
		},

		checkImagesSize: function () {
			if ($('.is-parallax').length && $('.header-slider').length) {
				$('.item-image').removeClass('owl-fullh-image');
				$('.owl-item', s.$owl).each(function() {
					var elH  = $(this).height(),
						imgH = $('.item-image', $(this)).height();

					if (imgH < elH) {
						$('.item-image', $(this)).addClass('owl-fullh-image');
					}
				});
			}
		},

		findItems: function () {
			if ($('.item-thumb', s.$owl).length) {
				var curent 	= $('.active', s.$owl).index(),
					next 	= $('.owl-item')[curent+1],
					prev 	= $('.owl-item')[curent-1];

				var nextThumb = $('img', next).attr('src'),
					prevThumb = $('img', prev).attr('src');

				HeaderSlider.createThumb(prevThumb, nextThumb);
			} else {
				setTimeout(function() {HeaderSlider.findItems();}, 100);
			}

		},

		createThumb: function (left, right) {
			$('.owl-prev .thumb-image', s.$owl).css('background-image', 'url('+left+')');
			$('.owl-next .thumb-image', s.$owl).css('background-image', 'url('+right+')');
		}
	};

	HeaderSlider.init();
});