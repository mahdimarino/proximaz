/* jshint undef: true, unused: true */
/* global define, google: false */
define(['jquery', 'components/mapStyles', 'velocity', 'velocityUi'], function($, MapStyles){
	"use strict";

	var Map = {

		init: function () {
			this.bindUiActions();
		},

		bindUiActions: function () {
			var	mapBlock = document.getElementById('js-map-container');
			var myLatlng = new google.maps.LatLng(40.799645, -73.952437);
			
			var	mapOptions = {
			      	zoom: 15,
					center: myLatlng,
			      	mapTypeId: google.maps.MapTypeId.ROADMAP,
			      	styles: MapStyles,
			      	disableDefaultUI: true
				};

			var	map = new google.maps.Map(mapBlock, mapOptions);

			var image = {
				url: 'img/pin.png'
			};
			var marker = new google.maps.Marker({
				position: myLatlng,
				map: map,
				icon: image
			});

			var mapContainer = $('.map-container');
			$('.js-show-map').click(function() {
				mapContainer.css('display', 'block').velocity({
					opacity: ['1', '0'],
					scale: ['1', '1.1']
				}, 500);
			});

			$('.js-hide-map').click(function() {
				mapContainer.velocity({
					opacity: ['0', '1'],
					scale: ['0.9', '1']
				}, 500, function () {
					mapContainer.css('display', 'none');
				});
			});

			google.maps.event.addListenerOnce(map, 'idle', function(){
				mapContainer.hide();
			});
		}
	};

	Map.init();
});