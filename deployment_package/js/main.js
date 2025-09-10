;(function () {
	
	'use strict';



	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}

	};


	var counter = function() {
		$('.stat-number').countTo({
			 formatter: function (value, options) {
	      return value.toFixed(options.decimals);
	    },
		});
	};

	// Animations
	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated');
							} else {
								el.addClass('fadeInUp animated');
							}

							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};


	var burgerMenu = function() {

		$('.js-colorlib-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');	
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');	
			}
		});



	};

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#colorlib-aside, .js-colorlib-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
	    	
	    }
		});

		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
		});

	};

	var clickMenu = function() {

		$('#navbar a:not([class="external"])').click(function(event){
			var section = $(this).data('nav-section'),
				navbar = $('#navbar');

				if ( $('[data-section="' + section + '"]').length ) {
			    	$('html, body').animate({
			        	scrollTop: $('[data-section="' + section + '"]').offset().top - 55
			    	}, 500);
			   }

		    if ( navbar.is(':visible')) {
		    	navbar.removeClass('in');
		    	navbar.attr('aria-expanded', 'false');
		    	$('.js-colorlib-nav-toggle').removeClass('active');
		    }

		    event.preventDefault();
		    return false;
		});


	};

	// Reflect scrolling in navigation
	var navActive = function(section) {

		var $el = $('#navbar > ul');
		$el.find('li').removeClass('active');
		$el.each(function(){
			$(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
		});

	};

	var navigationSection = function() {

		var $section = $('section[data-section]');
		
		$section.waypoint(function(direction) {
		  	
		  	if (direction === 'down') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
	  		offset: '150px'
		});

		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 155; }
		});

	};






	var sliderMain = function() {
		
	  	$('#colorlib-hero .flexslider').flexslider({
			animation: "fade",
			slideshowSpeed: 5000,
			directionNav: true,
			start: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			},
			before: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			}

	  	});

	};

	var stickyFunction = function() {

		var h = $('.image-content').outerHeight();

		if ($(window).width() <= 992 ) {
			$("#sticky_item").trigger("sticky_kit:detach");
		} else {
			$('.sticky-parent').removeClass('stick-detach');
			$("#sticky_item").trigger("sticky_kit:detach");
			$("#sticky_item").trigger("sticky_kit:unstick");
		}

		$(window).resize(function(){
			var h = $('.image-content').outerHeight();
			$('.sticky-parent').css('height', h);


			if ($(window).width() <= 992 ) {
				$("#sticky_item").trigger("sticky_kit:detach");
			} else {
				$('.sticky-parent').removeClass('stick-detach');
				$("#sticky_item").trigger("sticky_kit:detach");
				$("#sticky_item").trigger("sticky_kit:unstick");

				$("#sticky_item").stick_in_parent();
			}
			

			

		});

		$('.sticky-parent').css('height', h);


	};

	var owlCrouselFeatureSlide = function() {
		$('.owl-carousel').owlCarousel({
			animateOut: 'fadeOut',
		   animateIn: 'fadeIn',
		   autoplay: true,
		   loop:true,
		   margin:0,
		   nav:true,
		   dots: false,
		   autoHeight: true,
		   items: 1,
		   navText: [
		      "<i class='icon-arrow-left3 owl-direction'></i>",
		      "<i class='icon-arrow-right3 owl-direction'></i>"
	     	]
		})
	};

;(function () {
	
	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}

	};

	// Enhanced Animated Counters with Better Timing
	var counter = function() {
		$('.stat-number').each(function() {
			var $this = $(this);
			var countTo = $this.attr('data-count') || $this.text();
			var duration = $this.attr('data-duration') || 2000;
			
			$({ countNum: 0 }).animate({
				countNum: countTo
			}, {
				duration: duration,
				easing: 'swing',
				step: function() {
					$this.text(Math.floor(this.countNum));
				},
				complete: function() {
					$this.text(this.countNum);
				}
			});
		});
	};

	// Animations
	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated');
							} else {
								el.addClass('fadeInUp animated');
							}

							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};

	// Enhanced Skills Progress Animation with Hover Effects
	var skillsAnimation = function() {
	    $('.skill-item').each(function() {
	        var $skill = $(this);
	        var $bar = $skill.find('.skill-bar');
	        var $fill = $skill.find('.skill-fill');
	        var percentage = $skill.find('.skill-percentage').text().replace('%', '');
	        
	        // Set initial width
	        $fill.css('width', '0%');
	        
	        // Animate on scroll
	        $skill.waypoint(function(direction) {
	            if (direction === 'down' && !$skill.hasClass('animated')) {
	                $skill.addClass('animated');
	                $fill.animate({
	                    width: percentage + '%'
	                }, {
	                    duration: 1500,
	                    easing: 'easeOutCubic'
	                });
	            }
	        }, { offset: '80%' });
	        
	        // Hover effects
	        $skill.hover(
	            function() {
	                $(this).find('.skill-name').css('color', 'var(--bs-primary)');
	                $(this).find('.skill-fill').css('background', 'linear-gradient(90deg, var(--bs-primary), #10b981)');
	            },
	            function() {
	                $(this).find('.skill-name').css('color', '');
	                $(this).find('.skill-fill').css('background', '');
	            }
	        );
	    });
	};

	// Interactive Project Cards
	var projectCardInteractions = function() {
	    $('.project-card').each(function() {
	        var $card = $(this);
	        var $image = $card.find('.project-image');
	        var $overlay = $card.find('.project-overlay');
	        var $content = $card.find('.project-content');
	        
	        // Hover effects
	        $card.hover(
	            function() {
	                $overlay.fadeIn(300);
	                $content.find('.project-title').css('color', 'var(--bs-primary)');
	            },
	            function() {
	                $overlay.fadeOut(300);
	                $content.find('.project-title').css('color', '');
	            }
	        );
	        
	        // Tech tag hover effects
	        $card.find('.tech-tag').hover(
	            function() {
	                $(this).css({
	                    'background': 'var(--bs-primary)',
	                    'color': 'white',
	                    'transform': 'translateY(-2px)'
	                });
	            },
	            function() {
	                $(this).css({
	                    'background': '',
	                    'color': '',
	                    'transform': ''
	                });
	            }
	        );
	    });
	};

	// Typing Animation for Hero Title
	var typingAnimation = function() {
	    var $heroTitle = $('.hero-title');
	    if ($heroTitle.length > 0) {
	        var text = $heroTitle.text();
	        $heroTitle.text('');
	        
	        var i = 0;
	        var timer = setInterval(function() {
	            if (i < text.length) {
	                $heroTitle.text($heroTitle.text() + text.charAt(i));
	                i++;
	            } else {
	                clearInterval(timer);
	                // Add blinking cursor effect
	                $heroTitle.addClass('typing-done');
	            }
	        }, 100);
	    }
	};

	// Floating Skill Badges Animation
	var floatingSkills = function() {
	    $('.skill-indicator').each(function(index) {
	        var $skill = $(this);
	        var delay = index * 0.5;
	        
	        setTimeout(function() {
	            $skill.addClass('animate-in');
	        }, delay * 1000);
	        
	        // Random floating animation
	        setInterval(function() {
	            var randomX = Math.random() * 20 - 10;
	            var randomY = Math.random() * 20 - 10;
	            $skill.css({
	                'transform': 'translate(' + randomX + 'px, ' + randomY + 'px)'
	            });
	        }, 3000 + Math.random() * 2000);
	    });
	};

	// Dark Mode Toggle
	var darkModeToggle = function() {
	    var $toggle = $('.dark-mode-toggle');
	    var $body = $('body');
	    var $icon = $toggle.find('i');
	    
	    // Check for saved theme preference
	    if (localStorage.getItem('darkMode') === 'true') {
	        $body.addClass('dark-mode');
	        $icon.removeClass('fa-moon').addClass('fa-sun');
	    }
	    
	    $toggle.click(function() {
	        $body.toggleClass('dark-mode');
	        
	        if ($body.hasClass('dark-mode')) {
	            localStorage.setItem('darkMode', 'true');
	            $icon.removeClass('fa-moon').addClass('fa-sun');
	        } else {
	            localStorage.setItem('darkMode', 'false');
	            $icon.removeClass('fa-sun').addClass('fa-moon');
	        }
	    });
	};

	// Image Loading Animation
	var imageLoadingAnimation = function() {
	    $('img[data-src]').each(function() {
	        var $img = $(this);
	        var src = $img.data('src');
	        
	        $img.attr('src', src).on('load', function() {
	            $img.addClass('loaded');
	        });
	    });
	};

	// Neuroscience Demo Interactions
	var neuroscienceDemo = function() {
	    $('.neuroscience-card').each(function() {
	        var $card = $(this);
	        var $icon = $card.find('.neuroscience-icon');
	        
	        $card.hover(
	            function() {
	                $icon.addClass('pulse');
	            },
	            function() {
	                $icon.removeClass('pulse');
	            }
	        );
	        
	        // Click interaction for demo
	        $card.click(function() {
	            // Simulate demo activation
	            $card.addClass('demo-active');
	            setTimeout(function() {
	                $card.removeClass('demo-active');
	            }, 2000);
	        });
	    });
	};

	// Geospatial Map Interactions
	var geospatialMap = function() {
	    $('.geospatial-map').hover(
	        function() {
	            $(this).addClass('map-active');
	        },
	        function() {
	            $(this).removeClass('map-active');
	        }
	    );
	};

	// Enhanced Timeline Animations
	var timelineAnimations = function() {
	    $('.timeline-item').each(function(index) {
	        var $item = $(this);
	        
	        $item.waypoint(function(direction) {
	            if (direction === 'down' && !$item.hasClass('timeline-animated')) {
	                setTimeout(function() {
	                    $item.addClass('timeline-animated');
	                }, index * 200);
	            }
	        }, { offset: '80%' });
	    });
	};

	// Contact Form Enhancements
	var contactFormEnhancements = function() {
	    $('.contact-form .form-control').focus(function() {
	        $(this).parent().addClass('focused');
	    }).blur(function() {
	        if ($(this).val() === '') {
	            $(this).parent().removeClass('focused');
	        }
	    });
	};

	// Scroll Progress Indicator
	var scrollProgress = function() {
	    var $progressBar = $('<div class="scroll-progress"><div class="scroll-progress-fill"></div></div>');
	    $('body').prepend($progressBar);
	    
	    $(window).scroll(function() {
	        var scrollTop = $(window).scrollTop();
	        var docHeight = $(document).height() - $(window).height();
	        var scrollPercent = (scrollTop / docHeight) * 100;
	        
	        $('.scroll-progress-fill').css('width', scrollPercent + '%');
	    });
	};

	// Particle Background Effect
	var particleBackground = function() {
	    if ($('.hero-section').length > 0 && !isMobile.any()) {
	        var canvas = document.createElement('canvas');
	        canvas.id = 'particle-canvas';
	        $('.hero-section').prepend(canvas);
	        
	        var ctx = canvas.getContext('2d');
	        canvas.width = window.innerWidth;
	        canvas.height = window.innerHeight;
	        
	        var particles = [];
	        var particleCount = 50;
	        
	        function Particle() {
	            this.x = Math.random() * canvas.width;
	            this.y = Math.random() * canvas.height;
	            this.vx = Math.random() * 2 - 1;
	            this.vy = Math.random() * 2 - 1;
	            this.size = Math.random() * 2 + 1;
	        }
	        
	        for (var i = 0; i < particleCount; i++) {
	            particles.push(new Particle());
	        }
	        
	        function animate() {
	            ctx.clearRect(0, 0, canvas.width, canvas.height);
	            ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
	            
	            particles.forEach(function(particle) {
	                particle.x += particle.vx;
	                particle.y += particle.vy;
	                
	                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
	                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
	                
	                ctx.beginPath();
	                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
	                ctx.fill();
	            });
	            
	            requestAnimationFrame(animate);
	        }
	        
	        animate();
	    }
	};

	var burgerMenu = function() {

		$('.js-colorlib-nav-toggle').on('click', function(event){
			event.preventDefault();
			var $this = $(this);

			if ($('body').hasClass('offcanvas')) {
				$this.removeClass('active');
				$('body').removeClass('offcanvas');	
			} else {
				$this.addClass('active');
				$('body').addClass('offcanvas');	
			}
		});



	};

	// Click outside of offcanvass
	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#colorlib-aside, .js-colorlib-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
	    	
	    }
		});

		$(window).scroll(function(){
			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-colorlib-nav-toggle').removeClass('active');
			
	    	}
		});

	};

	var clickMenu = function() {

		$('#navbar a:not([class="external"])').click(function(event){
			var section = $(this).data('nav-section'),
				navbar = $('#navbar');

				if ( $('[data-section="' + section + '"]').length ) {
			    	$('html, body').animate({
			        	scrollTop: $('[data-section="' + section + '"]').offset().top - 55
			    	}, 500);
			   }

		    if ( navbar.is(':visible')) {
		    	navbar.removeClass('in');
		    	navbar.attr('aria-expanded', 'false');
		    	$('.js-colorlib-nav-toggle').removeClass('active');
		    }

		    event.preventDefault();
		    return false;
		});


	};

	// Reflect scrolling in navigation
	var navActive = function(section) {

		var $el = $('#navbar > ul');
		$el.find('li').removeClass('active');
		$el.each(function(){
			$(this).find('a[data-nav-section="'+section+'"]').closest('li').addClass('active');
		});

	};

	var navigationSection = function() {

		var $section = $('section[data-section]');
		
		$section.waypoint(function(direction) {
		  	
		  	if (direction === 'down') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
	  		offset: '150px'
		});

		$section.waypoint(function(direction) {
		  	if (direction === 'up') {
		    	navActive($(this.element).data('section'));
		  	}
		}, {
		  	offset: function() { return -$(this.element).height() + 155; }
		});

	};

	var sliderMain = function() {
		
	  	$('#colorlib-hero .flexslider').flexslider({
			animation: "fade",
			slideshowSpeed: 5000,
			directionNav: true,
			start: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			},
			before: function(){
				setTimeout(function(){
					$('.slider-text').removeClass('animated fadeInUp');
					$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
				}, 500);
			}

	  	});

	};

	var stickyFunction = function() {

		var h = $('.image-content').outerHeight();

		if ($(window).width() <= 992 ) {
			$("#sticky_item").trigger("sticky_kit:detach");
		} else {
			$('.sticky-parent').removeClass('stick-detach');
			$("#sticky_item").trigger("sticky_kit:detach");
			$("#sticky_item").trigger("sticky_kit:unstick");
		}

		$(window).resize(function(){
			var h = $('.image-content').outerHeight();
			$('.sticky-parent').css('height', h);


			if ($(window).width() <= 992 ) {
				$("#sticky_item").trigger("sticky_kit:detach");
			} else {
				$('.sticky-parent').removeClass('stick-detach');
				$("#sticky_item").trigger("sticky_kit:detach");
				$("#sticky_item").trigger("sticky_kit:unstick");

				$("#sticky_item").stick_in_parent();
			}
			

			

		});

		$('.sticky-parent').css('height', h);


	};

	var owlCrouselFeatureSlide = function() {
		$('.owl-carousel').owlCarousel({
			animateOut: 'fadeOut',
		   animateIn: 'fadeIn',
		   autoplay: true,
		   loop:true,
		   margin:0,
		   nav:true,
		   dots: false,
		   autoHeight: true,
		   items: 1,
		   navText: [
		      "<i class='icon-arrow-left3 owl-direction'></i>",
		      "<i class='icon-arrow-right3 owl-direction'></i>"
	     	]
		})
	};

	// Back to Top Button Functionality
	var backToTop = function() {
	    var $backToTop = $('.back-to-top');

	    $(window).scroll(function() {
	        if ($(this).scrollTop() > 300) {
	            $backToTop.addClass('show');
	        } else {
	            $backToTop.removeClass('show');
	        }
	    });

	    $backToTop.click(function(e) {
	        e.preventDefault();
	        $('html, body').animate({
	            scrollTop: 0
	        }, 800);
	        return false;
	    });
	};

	// Newsletter Form Handling
	var newsletterForm = function() {
	    $('.newsletter-form').submit(function(e) {
	        e.preventDefault();

	        var $form = $(this);
	        var $input = $form.find('.newsletter-input');
	        var $button = $form.find('.btn-newsletter');
	        var email = $input.val();

	        if (!email || !isValidEmail(email)) {
	            showNotification('Please enter a valid email address', 'error');
	            return;
	        }

	        // Simulate form submission
	        $button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Subscribing...');

	        setTimeout(function() {
	            showNotification('Thank you for subscribing! Check your email for confirmation.', 'success');
	            $input.val('');
	            $button.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Subscribe');
	        }, 2000);
	    });
	};

	// Email validation helper
	function isValidEmail(email) {
	    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	    return regex.test(email);
	}

	// Notification system
	function showNotification(message, type) {
	    // Remove existing notifications
	    $('.notification').remove();

	    var notificationClass = type === 'success' ? 'notification-success' : 'notification-error';

	    var notification = $('<div class="notification ' + notificationClass + '">' +
	        '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i> ' +
	        message +
	        '<span class="notification-close">&times;</span>' +
	        '</div>');

	    $('body').append(notification);

	    // Auto hide after 5 seconds
	    setTimeout(function() {
	        notification.fadeOut(300, function() {
	            $(this).remove();
	        });
	    }, 5000);

	    // Close on click
	    notification.find('.notification-close').click(function() {
	        notification.fadeOut(300, function() {
	            $(this).remove();
	        });
	    });
	}

	// Enhanced Testimonials Carousel
	var testimonialsCarousel = function() {
	    if ($('.testimonials-carousel').length > 0) {
	        $('.testimonials-carousel').owlCarousel({
	            items: 1,
	            loop: true,
	            autoplay: true,
	            autoplayTimeout: 5000,
	            autoplayHoverPause: true,
	            nav: true,
	            dots: true,
	            navText: [
	                "<i class='fas fa-chevron-left'></i>",
	                "<i class='fas fa-chevron-right'></i>"
	            ],
	            animateOut: 'fadeOut',
	            animateIn: 'fadeIn',
	            smartSpeed: 1000
	        });
	    }
	};

	// Smooth scroll for anchor links
	var smoothScroll = function() {
	    $('a[href*="#"]:not([href="#"])').click(function() {
	        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	            var target = $(this.hash);
	            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	            if (target.length) {
	                $('html, body').animate({
	                    scrollTop: target.offset().top - 70
	                }, 1000);
	                return false;
	            }
	        }
	    });
	};

	// Add loading animation classes
	var addLoadingAnimations = function() {
	    $('.section').addClass('fade-in-up');
	    $('.project-card, .skill-category, .testimonial-item').addClass('fade-in-up');
	};

	// Document on load.
	$(function(){
		fullHeight();
		counter();
		counterWayPoint();
		contentWayPoint();
		burgerMenu();

		clickMenu();
		// navActive();
		navigationSection();
		// windowScroll();


		mobileMenuOutsideClick();
		sliderMain();
		stickyFunction();
		owlCrouselFeatureSlide();

		// New enhanced functions
		skillsAnimation();
		backToTop();
		newsletterForm();
		testimonialsCarousel();
		smoothScroll();
		addLoadingAnimations();
		
		// Creative enhancements
		projectCardInteractions();
		typingAnimation();
		floatingSkills();
		darkModeToggle();
		imageLoadingAnimation();
		neuroscienceDemo();
		geospatialMap();
		timelineAnimations();
		contactFormEnhancements();
		scrollProgress();
		particleBackground();
	});


