/* jshint undef: true, unused: true */
/* global define: false */
define(['backbone'], function() {
	'use strict';

	var ProductModel = Backbone.Model.extend({
		defaults: {
			title: 	'',
			code: 	'',
			price: 	''
		}
	});

	return ProductModel;
});