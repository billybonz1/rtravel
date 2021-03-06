$(function() {
	/* Mobile Detect*/
	var md = window.navigator.userAgent;
	var isMobile = md.indexOf("Mobile") > 0 ? 1 : 0;
	if(isMobile){
		$(".header-slider li").css({
			"height": $(window).height() + "px"
		});
	}
	//Chrome Smooth Scroll
	try {
		$.browserSelector();
		if($("html").hasClass("chrome")) {
			$.smoothScroll();
		}
	} catch(err) {

	};

	$("img, a").on("dragstart", function(event) { event.preventDefault(); });

	// fancybox
	$("a.modal").fancybox();
	$('#header-slider').lightSlider({
		adaptiveHeight:true,
		item:1,
		slideMargin:0,
		loop:true,
		addClass: "header-slider-container",
		controls: false,
		auto: true,
		speed: 1000,
		pause: 5000,
		enableTouch: true,
		onSliderLoad: function () {
			$("video").each(function(){
				$(this)[0].play();
			});
		}
	});

	$(".with-sub-menu a").on("click",function(e){
		e.preventDefault();
		$(this).parent("li").toggleClass("active");
	});

	$(document).on("click",function(event){
		if( $(event.target).closest(".header-top__menu").length )
			return;
		$(".with-sub-menu").removeClass("active");
		event.stopPropagation();
	});


	$('.a-border').on('click',function(e){
		e.preventDefault();
		var id = $(this).attr("href");
		$('.a-border').removeClass('active');
		$(this).addClass('active');
		$(".poster *[data-post-id].active").hide().removeClass("active");
		$(".poster *[data-post-id="+id+"]").show().addClass("active");;

	});

	$('.gamburger').on('click',function(){
		$(this).toggleClass('active');
		$(".header-top__menu:not(.header-top__lang)").toggleClass('active');
	});

	$(document).on("click",function(event){
		if( $(event.target).closest(".header-top__menu:not(.header-top__lang),.gamburger").length )return;
		$('.gamburger').toggleClass('active');
		$(".header-top__menu:not(.header-top__lang)").toggleClass('active');
		event.stopPropagation();
	});

	$(window).scroll(function(){
		if($(document).scrollTop() > 360){
			$(".header-top").addClass("fixed");
		}else{
			$(".header-top").removeClass("fixed");
		}
	});
	if($(document).scrollTop() > 360){
		$(".header-top").addClass("fixed");
	}else{
		$(".header-top").removeClass("fixed");
	}




});

//Форма отправки 2.0
$(function() {
	$("[name=send]").click(function () {
		$(":input.error").removeClass('error');
		$(".allert").remove();

		var error;
		var btn = $(this);
		var ref = btn.closest('form').find('[required]');
		var msg = btn.closest('form').find('input, textarea');
		var send_btn = btn.closest('form').find('[name=send]');
		var send_options = btn.closest('form').find('[name=campaign_token]');

		$(ref).each(function() {
			if ($(this).val() == '') {
				var errorfield = $(this);
				$(this).addClass('error').parent('.field').append('<div class="allert"><span>Заполните это поле</span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
				error = 1;
				$(":input.error:first").focus();
				return;
			} else {
				var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
				if ($(this).attr("type") == 'email') {
					if(!pattern.test($(this).val())) {
						$("[name=email]").val('');
						$(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный e-mail</span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
						error = 1;
						$(":input.error:first").focus();
					}
				}
				var patterntel = /^()[0-9]{9,18}/i;
				if ( $(this).attr("type") == 'tel') {
					if(!patterntel.test($(this).val())) {
						$("[name=phone]").val('');
						$(this).addClass('error').parent('.field').append('<div class="allert"><span>Укажите коректный номер телефона</span><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>');
						error = 1;
						$(":input.error:first").focus();
					}
				}
			}
		});
		if(!(error==1)) {
			$(send_btn).each(function() {
				$(this).attr('disabled', true);
			});
			$(send_options).each(function() {
        		var form = $(this).closest('form'), name = form.find('.name').val();
				if ($(this).val() == '') {
					$.ajax({
						type: 'POST',
						url: 'mail.php',
						data: msg,
						success: function() {
							$( "#modal_callback_ok h4" ).remove();
							$( "#modal_callback_ok" ).prepend("<h4>"+name+",</h4>");
							$('form').trigger("reset");
							setTimeout(function(){  $("[name=send]").removeAttr("disabled"); }, 1000);
                            // Настройки модального окна после удачной отправки
                            $(".fancybox-close").click();
                            $('div.md-show').removeClass('md-show');
                            $("#call_ok")[0].click();
                        },
                        error: function(xhr, str) {
                        	alert('Возникла ошибка: ' + xhr.responseCode);
                        }
                    });
				} else {
					$.ajax({
						type: 'POST',
						url: 'mail.php',
						data: msg,
						success:
						$.ajax({
							type: 'POST',
							url: 'https://app.getresponse.com/add_subscriber.html',
							data: msg,
							statusCode: {0:function() {
								$( "#modal_callback_ok h4" ).remove();
								$( "#modal_callback_ok" ).prepend("<h4>"+name+",</h4>");
								$('form').trigger("reset");
								setTimeout(function(){  $("[name=send]").removeAttr("disabled"); }, 1000);
								$(".fancybox-close").click();
								// Настройки модального окна после удачной отправки
								$('div.md-show').removeClass('md-show');
								$("#call_ok")[0].click();
							}}
						}),
						error:  function(xhr, str) {
							alert('Возникла ошибка: ' + xhr.responseCode);
						}
					});
				}
			});
		}
		return false;
	})
});