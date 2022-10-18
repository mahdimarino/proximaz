/* jshint undef: true, unused: true */
/* global define: false */
define([
	'backbone',
	'components/backbone/formProductView'
], function(backbone, ProductView) {
	'use strict';

	var ProductCollectionView = Backbone.View.extend({
		className: 	'order-list js-order-list',
		tagName: 	'ul',

		initialize: function() {
			this.createOrderList();
		},

		createOrderList: function() {
			var that = this;

			that.collection.forEach(function(model){
				var productView = new ProductView({model: model}); 
				that.$el.append(productView.render().el);
			});
		},

		render: function() {
			return this;
		}
	});

	return ProductCollectionView;
});