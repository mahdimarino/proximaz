/* jshint undef: true, unused: true */
/* global define, $, FastClick: false */
define([
	'components/backbone/formProductModel',
	'components/backbone/formProductCollection',
	'components/backbone/formProductCollectionView',
	'underscore', 'jquery', 'velocity', 'velocityUi', 'customScroll', 'lightbox', 'waitImg', 'easing', 'fastclick'
], function(ProductModel, ProductCollection, CollectionView, _){
	'use strict';

	var Products = {
		get: {
			checkout: 			$('.js-send-order'),
			formTabs: 			$('.js-form-tab'),
			bookTabs: 			$('.js-book-tab'),
			orderListBlock: 	$('.js-order-list-block'),
			orderList: 			'.js-order-list',
			orderItem: 			'.js-order-item',
			orderForm: 			$('.form-block'),
			categoryActiveLine: $('.js-catActiveLine'),
			categoryList: 		$('.js-catList'),
			categoryItem: 		$('.js-catItem'),
			categoryPageList: 	$('.js-product-page-list'),
			categoryPage: 		null,
			prodList: 			null,
			history: 			null,
			prodItems: 			null,
			lightbox: 			null,
			activeCategory: 	null,
			nextCategory: 		null,
			orderBtn: 			null,
			formClose: 			$('.js-close-form'),
			addToCardBtn: 		null,
			counter: 			null,
			productCollection: 	null,
			collectionView: 	null,
			addedProducts: 		0,
			totalPrice: 		'0.00'
		},

		init: function() {
			this.bindUiActions();
		},

		bindUiActions: function() {
			Products.firstCategoryLoad();
			FastClick.attach(document.body);

			// Bind category change on click
			Products.get.categoryItem.click(function(e) {
				var target 	= $(e.target);
 				
				Products.categoryPageChange.initCategoryChange(target, target.data('path'), target.data('category'));
			});

			// Create custom scroll
			Products.createOrderlistScroll(Products.get.orderListBlock);

			// Bind form close btn
			Products.get.formClose.click(function(e) {
				e.preventDefault();
				Products.toggleOrderForm.off();
			});

			// Create order list for order form
			Products.order.createCollection();
			Products.get.orderForm.on('open', function(event) {
				event.preventDefault();
				Products.order.createOrderList();
			}).on('closed', function(event) {
				event.preventDefault();
				Products.order.destroyOrderList();
			});

			// Bind book tabs
			Products.bindBookTabs.categoryTabs();
			Products.bindBookTabs.formTabs();

			// Check windows size
			var size = window.innerWidth;
		    Products.checkViewportSize(size);

			$(window).resize(_.debounce(function(){
				var size = window.innerWidth;
			    Products.checkViewportSize(size);
			},250));


			// Start form validation
			Products.get.checkout.on('click tap', function(e) {
				e.preventDefault();
				
				Products.submit.getProductsList();
				Products.submit.validateForm(Products.get.checkout);
			});

			// Validate bottom form
			$('.js-findus-btn').on('click tap', function(e) {
				e.preventDefault();
				Products.submit.validateForm($(this));
			});			
		},

		setCurrency: function () {
			var c = $('body').data('currency');

			$('.currency').html(c);
		},

		submit: {
			getProductsList: function() {
				var prodList = [];

				_(Products.get.productCollection.models).each( function(model) {
				 	prodList.push({
				 		title: model.get('title'),
				 		code: model.get('code')
				 	});
				});
				$('.js-prodlist-field').val(JSON.stringify(prodList));
			},

			validateForm: function(target) {
				var formValid = true,
				 	thisForm = target.closest('form');

				$('input.required', thisForm).each(function() {
					$(this).val($(this).val().trim());

					var thisInput 	= $(this).val().replace(/\s+/g, ''),
						re 			= /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

					if ($(this).attr('name') === "mail_field") {
						if(thisInput==="" || !re.test(thisInput)){
							formValid = false;
						}
					} else {
						if(thisInput===""){
							formValid = false;
						}
					}
				});


				if (formValid) {
					Products.submit.sendForm(thisForm);
				} else {
					target.velocity("callout.shake", 500);
				}
			},

			sendForm: function(thisForm) {
			    var url = "sendmail.php";

			    $.ajax({
					type: "POST",
					url: url,
					data: thisForm.serialize(), // serializes the form's elements.
					success: function(){
						$('input', thisForm).each(function(){
							$('.required').val('');
						});

						Products.submit.clearCollection();	
					}
				});
			},

			clearCollection: function() {
				Products.get.productCollection.reset();
			}
		},

		checkViewportSize: function(size) {
			if (size < 881) {
				if (!Products.get.categoryPageList.hasClass('js-smallDevice')) {
					Products.get.categoryPageList.addClass('js-smallDevice');
					$('.cat-products-desc').each(function() {
						$(this).velocity({ 
						    translateY: '100%'
						}, 10);
					});

					$('.order-list-container').velocity({ 
					    translateY: '100%'
					}, 10);
				}
			} else {
				Products.get.categoryPageList.removeClass('js-smallDevice');
				$('.cat-products-desc').each(function() {
					$(this).velocity({ 
					    translateY: '0'
					}, 10);
				});

				$('.order-list-container').velocity({ 
				    translateY: '0'
				}, 10);
			}
		},

		bindBookTabs: {
			categoryTabs: function() {
				Products.get.bookTabs.on('click tap', function(e) {
					e.preventDefault();
					
					var activeCat 	= Products.get.activeCategory,
						block 		= $(this).data('block'),
						target 		= $('.cat-products-desc', activeCat);

					if (!$(this).hasClass('is-active') || $('.changing-tab').length) {
						Products.get.bookTabs.removeClass('is-active').addClass('changing-tab');
						$(this).addClass('is-active');

						if (block === 'info') {
							Products.bindBookTabs.tabInfo.on(target, Products.get.bookTabs);
						} else {
							Products.bindBookTabs.tabInfo.off(target, Products.get.bookTabs);
						}
					}
				});
			},

			formTabs: function() {
				Products.get.formTabs.on('click tap', function(e) {
					e.preventDefault();
					
					var block 		= $(this).data('block'),
						target 		= $('.order-list-container');

					if (!$(this).hasClass('is-active') || $('.changing-tab').length) {
						Products.get.formTabs.removeClass('is-active').addClass('changing-tab');
						$(this).addClass('is-active');

						if (block === 'prodlist') {
							Products.bindBookTabs.tabInfo.on(target, Products.get.formTabs);
						} else {
							Products.bindBookTabs.tabInfo.off(target, Products.get.formTabs);
						}
					}
				});
			},

			tabInfo: {
				on: function(target, parent) {
					target.velocity("stop").velocity({ 
					    translateY: ['0', '100%']
					}, 250, 'swing', function() {
						parent.removeClass('changing-tab');
					});
				},

				off: function(target, parent) {
					target.velocity("stop").velocity({ 
					    translateY: ['-110%', '0']
					}, 250, 'swing', function() {
						parent.removeClass('changing-tab');
					});
				}
			},

			resset: function() {
				Products.get.bookTabs.removeClass('is-active');
				Products.get.bookTabs.first().addClass('is-active');
			}
		},

		order: {
			createCollection: function() {
				Products.get.productCollection = new ProductCollection();
				Products.get.productCollection.on('add', function() {
					Products.get.addedProducts = this.length;
					Products.order.updateCounter(this.length);
				}).on('reset', function() {
					Products.get.addedProducts = this.length;
					Products.order.updateCounter(this.length);

					$(Products.get.orderList).velocity('transition.expandOut', 250, function() {
						$(Products.get.orderList).remove();
						Products.order.getTotalPrice();
					});
				});
			},

			updateCounter: function(value) {
				$(".products-number").each(function() {
					$('.js-products-counter', $(this)).html(value);

					if (!$(this).hasClass('animated bounce')) {
						$(this).addClass('animated bounce');

						var target = $(this);
						setTimeout(function() {
							target.removeClass('animated bounce');
						}, 1500);
					}
				});
				Products.get.addedProducts = value;
			},

			bindClick: function(target) {
				target.each(function() {
					$(this).on('click tap', function(e) {
						e.preventDefault();
						var parent 	= $(this).closest('.js-product-item'),
							title 	= null,
							code 	= null,
							price 	= null;

						title 	= $('.js-prod-title', parent).html();
						code 	= $('.js-prod-code', parent).html();
						price 	= $('.js-prod-price', parent).text();

						Products.order.createModel(title, code, price);
					});
				});
			},

			createModel: function(title, code, price) {
				var productModel = new ProductModel();

				productModel.set({
					title: title,
					code: code,
					price: price
				});

				Products.order.addToCollection(productModel);
			},

			addToCollection: function(model) {
				Products.get.productCollection.add(model);
			},

			createOrderList: function() {
				Products.get.collectionView = new CollectionView({collection: Products.get.productCollection});
				$('.js-list-destination').append(Products.get.collectionView.render().el);
				if ($(Products.get.orderList).hasClass('is-lonely')) {
					Products.get.orderListBlock.addClass('is-empty');
				}

				$(Products.get.orderList).on('deleted', function(e) {
					e.preventDefault();
					Products.get.totalPrice = '0.00';
					Products.order.getTotalPrice();
				});

				Products.order.bindRemoveBtn();
				Products.order.getTotalPrice();
			},

			updateCollection: function(cid) {
				var model = Products.get.productCollection.get(cid);
				Products.get.productCollection.remove(model);
				Products.order.updateCounter(Products.get.productCollection.length);
			},

			bindRemoveBtn: function() {
				$('.js-remove-prod').on('click tap', function(e) {
					e.preventDefault();
					var thisParent = $(this).closest(Products.get.orderItem);

					thisParent.velocity('transition.expandOut', 250, function() {
						Products.order.updateCollection(thisParent.attr('id'));
						thisParent.remove();
						$(Products.get.orderList).trigger('deleted');
					});
				});
			},

			getTotalPrice: function() {
				if ($(Products.get.orderItem).length) {
					$(Products.get.orderItem).each(function() {

						var priceString = $('.js-order-price', $(this)).text().split(" ")[0].split("."),
							mainPrice 	= parseInt(priceString[0]),
							rest 		= parseInt(priceString[1]);

						var curentPrice 	= parseInt(Products.get.totalPrice.split(".")[0]),
							curentRest 		= parseInt(Products.get.totalPrice.split(".")[1]);

						var totalPrice 	= curentPrice + mainPrice,
							totalRest 	= curentRest + rest;

						if (totalRest.toString().length === 3) {
							totalPrice = totalPrice + parseInt(totalRest.toString()[0]);
							totalRest = parseInt(totalRest.toString().slice(1, 3));
						}

						if (totalRest === 0) {
							totalRest = '00';
						}

						Products.get.totalPrice = totalPrice.toString() + '.' + totalRest.toString();
					});
				} else {
					Products.get.totalPrice = '0.00';
				}

				$('.js-total-price').velocity({
					translateY: '100%'
				}, 60, function() {
					$('.js-total-price').text(Products.get.totalPrice);
				}).velocity({
					translateY: ['0', '-100%']
				}, 60);
			},

			destroyOrderList: function() {
				Products.get.collectionView.remove();
				Products.get.orderListBlock.removeClass('is-empty');
				Products.get.totalPrice = '0.00';
			}
		},

		toggleOrderForm: {
			on: function() {
				Products.get.orderForm.trigger('open');

				Products.get.orderForm.velocity({
				    translateX: [' 0', '-100%']
				}, 500, 'easeIn');
			},

			off: function() {
				Products.get.orderForm.velocity("reverse", 500, 'easeIn', function() {
					Products.get.orderForm.trigger('closed');
				});
			}
		},

		setVariable: function() {
			Products.get.categoryPage 	= $('.js-product-page');
			Products.get.prodList 		= $('.js-products-list');
			Products.get.history 		= $('.js-description-block');
			Products.get.prodItems 		= $('.products-item');
			Products.get.lightbox 		= '.js-imagelightbox';
			Products.get.orderBtn 		= $('.js-order-btn');
			Products.get.addToCardBtn 	= $('.js-add-to-card');
			Products.get.counter 		= '.js-products-counter';
		},

		firstCategoryLoad: function() {
			Products.get.categoryItem.first().addClass('active');
			var path 		= Products.get.categoryItem.first().data('path');


			Products.categoryPageChange.loadCategory(path, 'first');
		},

		checkImageSizes: function(items, info) {
			items.each(function() {
				var elHeight 	= $('.product-view', $(this)).height(),
					imageHeight = $('img', $(this)).height();

				if (imageHeight < elHeight) {
					$('img', $(this)).addClass('absolute');
				}
			});

			info.each(function() {
				var imageHeight = $('img', $(this)).height(),
					elHeight 	= $(this).height();

				if (imageHeight < elHeight) {
					$('img', $(this)).addClass('absolute');
				}
			});
		},

		createImagesLightbox: function(instance, category, target) {
			var settings = {
				overlay: {
					on: function() {
						$( '<div id="imagelightbox-overlay"></div>' ).appendTo( 'body' );
					},
					off: function() {
						$( '#imagelightbox-overlay' ).remove();
					}
				},

				closeButton: {
					on: function() {
						$( '<button type="button" id="imagelightbox-close" title="Close"></button>' ).appendTo( 'body' ).on( 'click touchend', function(){ $( this ).remove(); instance.quitImageLightbox(); return false; });
					},
					off: function() {
						$( '#imagelightbox-close' ).remove();
					}
				},

				caption: {
					on: function() {
						var parent 		= $( 'a[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"] img', wrapper ).closest('.js-product-item'),
							description = $( 'a[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"] img' ).attr( 'alt' ),
							title 		= $('.js-prod-title', parent).text();
						if( description.length > 5 )
							$( '<div id="imagelightbox-caption"> <h5>'+title+'</h5>' + description + '</div>' ).appendTo( 'body' );
					},
					off: function() {
						$( '#imagelightbox-caption' ).remove();
					}
				},

				activityIndicator: {
					on: function() {
						$( '<div id="imagelightbox-loading"><div></div></div>' ).appendTo( 'body' );
					},
					off: function() {
						$( '#imagelightbox-loading' ).remove();
					}
				},

				arrows: {
					on: function(instance, selector, newClass) {
						var $arrows = $( '<button type="button" class="imagelightbox-arrow '+newClass+' imagelightbox-arrow-left fa fa-angle-left"></button><button type="button" class="imagelightbox-arrow '+newClass+' imagelightbox-arrow-right fa fa-angle-right"></button>' );

						$arrows.appendTo( 'body' );

						$('.'+newClass).on( 'click touchend', function( e ) {
							e.preventDefault();

							var $this	= $( this ),
								$target	= $( selector + '[href="' + $( '#imagelightbox' ).attr( 'src' ) + '"]' ),
								index	= $target.index( selector );

							if( $this.hasClass( 'imagelightbox-arrow-left' ) )
							{
								index = index - 1;
								if( !$( selector ).eq( index ).length )
									index = $( selector ).length;
							}
							else
							{
								index = index + 1;
								if( !$( selector ).eq( index ).length )
									index = 0;
							}

							instance.switchImageLightbox( index );
							return false;
						});
					},

					off: function() {
						$( '.imagelightbox-arrow' ).remove();
					}
				}
			};

			var newClass 	= category + '-lightbox-arrow',
				wrapper		= $('.js-product-page[data-category="'+category+'"]');
			instance.imageLightbox({
				onStart: 	 function() { settings.overlay.on(); settings.closeButton.on(); settings.arrows.on(instance, '.'+target, newClass);},
				onEnd:	 	 function() { settings.overlay.off(); settings.activityIndicator.off(); settings.closeButton.off(); settings.caption.off(); settings.arrows.off();},
				onLoadStart: function() { settings.activityIndicator.on(); settings.caption.off(); },
				onLoadEnd:	 function() { settings.activityIndicator.off(); settings.caption.on(); $( '.imagelightbox-arrow' ).css( 'display', 'block' ); }
			});
		},

		createOrderlistScroll: function(target) {
			target.mCustomScrollbar({theme:"dark"});
		},

		listCustomScroll: function(prod, info) {
			prod.mCustomScrollbar();
			info.mCustomScrollbar({theme:"dark"});
		},

		categoryPageChange: {
			initCategoryChange: function(target, path, category) {
				if (!target.hasClass('active') && !$('.js-changing-category').length) {
					Products.get.categoryList.find('.active').removeClass('active');

					Products.get.categoryList.addClass('js-changing-category');

					if (!$('.js-product-page[data-category="'+category+'"]').length) {
						Products.categoryPageChange.loadCategory(path, target);
					} else {
						Products.get.nextCategory = $('.js-product-page[data-category'+ category +']');
						Products.categoryPageChange.startTransition(target);
					}
				}
			},

			loadCategory: function(path, target) {
				var $preloader 		= $('.book-preloader'),
					newClass 		= null;

				$preloader.show().velocity({
					opacity: ['1', '0']
				}, 250, function () {
					$.post( path, function( data ) {
						$(data).hide();
					    Products.get.categoryPageList.append($(data));

						$(data).waitForImages(function() {
							$preloader.velocity('reverse', function () {
								$preloader.hide();

							    if (target === 'first') {
							    	$(data).css('display', 'block');
									Products.get.activeCategory = $('.js-product-page');

									Products.setVariable();

									newClass = Products.get.activeCategory.data('category') + '-lightbox';
									$(Products.get.lightbox, Products.get.activeCategory).addClass(newClass);

									Products.createImagesLightbox($('.'+newClass), Products.get.activeCategory.data('category'), newClass);

									Products.listCustomScroll(Products.get.prodList, Products.get.history);
									Products.checkImageSizes(Products.get.prodItems, $('.category-image-block'));
									Products.get.orderBtn.on('click tap', function(event) {
										event.preventDefault();
										Products.toggleOrderForm.on();
									});
									Products.order.bindClick(Products.get.addToCardBtn);
									Products.order.updateCounter(Products.get.addedProducts);
									Products.setCurrency();
							    } else {
									Products.get.nextCategory = $(data);

								    Products.categoryPageChange.startTransition(target);
								    $('.js-order-btn', Products.get.nextCategory).click(function() {
								    	Products.toggleOrderForm.on();
								    });
								    Products.order.bindClick(Products.get.nextCategory.find('.js-add-to-card'));
								    Products.order.updateCounter(Products.get.addedProducts);
								    
									newClass = Products.get.nextCategory.data('category') + '-lightbox';
									$(Products.get.lightbox, Products.get.nextCategory).addClass(newClass);
									Products.createImagesLightbox( $('.'+newClass), Products.get.nextCategory.data('category'), newClass);
									Products.setCurrency();
							    }
							});
						});
					});
				});
			},

			startTransition: function(target) {
				Products.get.categoryPageList.css({
					height: Products.get.categoryPageList.height(),
					width: Products.get.categoryPageList.width()
				});

				Products.bindBookTabs.resset();

				Products.get.nextCategory = $('.js-product-page[data-category="'+target.data('category')+'"]');

				Products.get.activeCategory.addClass('previous-category');

				Products.get.nextCategory.css('display', 'block');
				// Binds for loaded block
				Products.checkImageSizes( Products.get.nextCategory.find('.products-item'), Products.get.nextCategory.find('.category-image-block') );
				Products.listCustomScroll( Products.get.nextCategory.find('.js-products-list'), Products.get.nextCategory.find('.js-description-block') );
				

				Products.get.nextCategory.addClass('next-category');

				target.addClass('active');


				var transitionTime = null;
				if (!Products.get.categoryPageList.hasClass('js-smallDevice')) {
					transitionTime = 700;

					Products.get.activeCategory.find('.cat-products-desc').velocity("stop").velocity({ 
					    translateX: ['-210%', '0']
					}, transitionTime);

					Products.get.activeCategory.find('.cat-products-list').velocity("stop").velocity({ 
					    opacity: '0'
					},{
						delay: transitionTime - 400,
						duration: 50
					});

					Products.get.nextCategory.velocity({ 
					    opacity: [1, 0],
					    translateZ: ['0', '-40px']
					},{
						duration: transitionTime
					});
				} else {
					$('.cat-products-desc', Products.get.nextCategory).velocity({ 
					    translateY: '100%'
					}, 10);

					transitionTime = 500;

					Products.get.activeCategory.velocity("stop").velocity({ 
					    translateY: ['100%', '0']
					}, transitionTime);

					Products.get.nextCategory.velocity("stop").velocity({ 
					    translateY: ['0', '-10%'],
					    opacity: ['1', '0.5']
					}, transitionTime); 
				}


				setTimeout(function() {
					$('.prod-page').each(function() {
						$(this).velocity({ 
						    translateX: 0
						}, 10);
					});

					Products.get.activeCategory.find('.cat-products-list').each(function() {
						$(this).css('opacity', '1');
					});

					if (Products.get.categoryPageList.hasClass('js-smallDevice')) {
						$('.cat-products-desc', Products.get.activeCategory).velocity({ 
						    translateY: '100%'
						}, 10);

						Products.get.activeCategory.velocity({
							translateY: 0
						}, 10);
					}

					Products.get.activeCategory.removeClass('previous-category').hide();
					Products.get.nextCategory.removeClass('next-category');
					$('.js-changing-category').removeClass('js-changing-category');
					$('.js-product-page-list').css({
						height: 'auto',
						width: 'auto'
					});

					Products.get.activeCategory = Products.get.nextCategory;
				}, transitionTime);
			}
		}
	};

	Products.init();
});