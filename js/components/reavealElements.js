/* jshint undef: true, unused: true */
/* global define: false */
define(['jquery', 'inview', 'velocity'], function($){
	"use strict";

	var s = {
		$speciality: $('.speciality-block'),
		$prodList: $('.js-product-page-list'),
		$ingredients: $('.ingredients-column'),
		$team: $('.team-item-block'),
		$facts: $('.fact-item-block'),
		$oneBlock: $('.one-block-wrapper .column'),
		$pay: $('.payment-list-block'),
		$find: $('.find-us-column')
	};

	var Reveal = {

		init: function () {
			// Prepare for reveal
			$.each(s, function() {
			    this.css('opacity', '0');
			}); 

			this.bindUiActions();
		},

		bindUiActions: function () {
			this.revealSpeciality(this);
			this.revealProducts(this);
			this.revealIngredients(this);
			this.revealTeam(this);
			this.revealFacts(this);
			this.revealOneBlock(this);
			this.revealTestim(this);
			this.revealPay(this);
			this.revealFind(this);
		},

		mainReveal: function (el, wait) {
			el.velocity({
				opacity: '1',
				translateY: ['0', '40px']
			}, {duration: 1000, delay: wait});
		},

		revealFind: function (that) {
			s.$find.each(function(index) {
				$(this).one('inview', function () {
					that.mainReveal($(this), index * 100);
				});
			});
		},

		revealPay: function (that) {
			s.$pay.each(function(index) {
				$(this).one('inview', function () {
					that.mainReveal($(this), index * 100);
				});
			});
		},

		revealTestim: function (that) {
			$('.js-testim-list, .testimonials-text-list').css('opacity', '0');
			$('.js-testim-list').one('inview', function () {
				that.mainReveal($(this), 0);
			});
			$('.testimonials-text-list').one('inview', function () {
				that.mainReveal($(this), 0);
			});
		},

		revealOneBlock: function (that) {
			s.$oneBlock.each(function(index) {
				$(this).one('inview', function () {
					that.mainReveal($(this), index * 100);
				});
			});	
		},

		revealFacts: function (that) {
			s.$facts.each(function(index) {
				$(this).one('inview', function () {
					that.mainReveal($(this), index * 100);
				});
			});
		},

		revealTeam: function (that) {
			s.$team.each(function(index) {
				$(this).one('inview', function () {
					$(this).velocity({
						opacity: '1',
						translateX: ['0', '-15%']
					}, {duration: 1000, delay: index * 100});
				});
			});	
		},

		revealIngredients: function (that) {
			s.$ingredients.each(function(index) {
				$(this).one('inview', function () {
					that.mainReveal($(this), index * 100);
				});
			});
		},

		revealProducts: function (that) {
			s.$prodList.each(function() {
				$(this).one('inview', function () {
					that.mainReveal($(this), 0);
				});
			});
		},

		revealSpeciality: function (that) {
			s.$speciality.each(function(index) {
				$(this).one('inview', function () {
					that.mainReveal($(this), index * 100);
				});
			});
		}
	};

	$(window).on('revealReady', function () {
		Reveal.init();
	});
});