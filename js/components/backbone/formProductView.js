/* jshint undef: true, unused: true */
/* global define: false */
define([
	'components/backbone/formProductModel', 
	'backbone'
], function(ProductModel) {
	'use strict';

	var ProductView = Backbone.View.extend({
		className: 	'order-item js-order-item',
		tagName: 	'li',

		template: _.template([
			'<p class="order-name l-dis-ib">',
			    '<%= title %>',
			    '<span class="order-code"><%= code %></span>',
			'</p>',
			'<p class="order-price js-order-price l-dis-ib">',
			    '<%= price %>',
			    '<span class="remove-product-btn js-remove-prod product-control-btn l-dis-ib"></span>',
			'</p>',
		].join('')),

		initialize: function() {
			this.$el.attr('id', this.model.cid);
			this.$el.html(this.template(this.model.toJSON()));
		},

		render: function() {
			return this;
		}
	});

	return ProductView;
});