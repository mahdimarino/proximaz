/* jshint undef: true, unused: true */
/* global define: false */
define([
	'components/backbone/formProductModel',
	'jquery',
	'backbone',
	'underscore'
], function(ProductModel, Products) {
	'use strict';

	var ProductCollection = Backbone.Collection.extend({
		model: ProductModel
	});

	return ProductCollection;
});