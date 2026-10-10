/*jslint browser: true, plusplus: true, nomen:true, sub:true*/
/*global $, jQuery, alert*/

/**
 *  @author:    Sri Harsha Samineni
 *  @created:   Sep 2016
 *  @description: Commonly used jQuery functions for FO User services
 *  @copyright: (c) Copyright by Infosys technologies
 *  Revision 1.5
 *  Last Updated: Sri Harsha, Dec 19 2017
 **/
window.constants = {
	"DEV_ENV": "development",
	"LCACHE_MIN_TIME": "10800",
	"TAB_PER_PAGE": "10",
	"DATE_FORMAT": "DD-MM-YYYY",
	"EM_PORTS": "1585,2095,2568,2868,4587",
	"LATEST_EM_VERSION" :  "2.7",
	"EM_ENTY_ID" :  "gstnInfy",
	"PAYMENT_MAX_NUM": "999999999999",
	"PAYMENT_MIN_AMT": "1",
	"OTC_AMT": "10000"
};
function require(module, src, callback) {
	if (!(src !== null && (typeof src === 'string' || typeof src === 'object'))) {
		return;
	}
	src = typeof src === 'string' ? [src] : src;
	var total = [], loaded = [], failed = [], fn = function (e) {
		if (e.type === 'load') {
			loaded.push(e.target.src);
		} else {
			failed.push(e.target.src);
		}
		if ((loaded.length + failed.length) === total.length && typeof callback === 'function') {
			callback(!!failed.length, loaded, failed);
		}
	}, load = function (src) {
		var s = document.createElement('script');
		s.type = 'application/javascript';
		s.src = $().getServers().GST_STATIC_R1_URL + "/uiassets/js/" + module + "/" + src;
		s.addEventListener('error', fn, false);
		s.addEventListener('load', fn, false);
		document.getElementsByTagName('head')[0].appendChild(s);
		return s.src;
	}, i, s, j;
	for (i in src) {
		s = src[i].split(/[\s,]+/);
		for (j in s) {
			if(s[j].trim() === "") {
				continue;
			}
			if (total.indexOf(s[j]) < 0) {
				total.push(load(s[j]));
			}
		}
	}
}
(function ($) {
	'use strict';
	var wh = 0,
		fs = 0,
		cfs,
		it = 0,
		t,
		CONSTANTS = {},
		timerInt,
		winDigest = true,
		previousScroll = 0,
		caretTimeoutId,
		ua = navigator.userAgent,
		iPhone = /iphone/i.test(ua),
		chrome = /chrome/i.test(ua),
		android = /android/i.test(ua);
	$(document).on("click", ".datepicker-icon:not(:disabled) span", function () {
		//$(this).parent().find("input").focus();
		$(this).parent().find("input:enabled").trigger("openDPicker");
	});
	$(document).on("click", ".datepicker-icon i", function () {
		//$(this).parent().find("input").focus();
		$(this).parent().find("input:enabled").trigger("openDPicker");
	});
    $(document).on("click", ".datepicker-icon input", function () {
		//$(this).parent().find("input").focus();
		$(this).trigger("openDPicker");
	});
	
	
	$.fn.reposFooter = function () {
		if ($(".content-wrapper .container .mypage").length > 0) {
			if ($(".content-wrapper .container .mypage").height() <= $(window).height() * 0.6) {
				wh = $(window).height() * 0.6;
			}
			$(".content-wrapper .container .mypage .content-pane").css("min-height", wh);
			/*if ($('body').hasClass(".content-pane")) {
				$(".content-wrapper .container .mypage .content-pane").css("min-height", wh);
			} else {
				wh = $(window).height() * 0.42;
				$(".content-wrapper .container .mypage .tabpane").css("min-height", wh);
			}*/
		}
		
	};
	//check for external links -- 
	$.fn.setExtLinks = function () {
		$("[data-popup=true]").each(function () {
			if (!$(this).parent().hasClass("social") && $(this).find(".fa-external-link-square").length === 0) {
				$(this).append(" <i class='fa fa-external-link-square'></i>");
			}
		});
		$("[target=_blank]").each(function () {
			$(this).attr("rel","noopener noreferrer");
		});
	};
	
	$().reposFooter();
	$.fn.setConstant = function (prop, value) {
		Object.defineProperty(CONSTANTS, prop, {
			value: value
		});
	};
	$.fn.getConstant = function (prop) {
		return CONSTANTS[prop];
	};
	$.fn.getAllConstants = function () {
		return CONSTANTS;
	};
	$.fn.setServers = function (config) {
		$().setConstant("servers", config);
	};
	$.fn.getServers = function () {
		return $().getConstant('servers');
	};
	$.fn.setPan = function (config) {
		$().setConstant("pan", config);
	};
	$.fn.getPan = function () {
		return $().getConstant('pan');
	};
	$.fn.resizeContent = function (fs) {
		$(".mypage").find("li, a, label").each(function () {
			cfs = parseInt($(this).css("font-size").replace("px", ""), 10);
			$(this).css("font-size", (cfs + fs) + "px");
		});
	};
	$.fn.isDigested = function () {
		return winDigest;
	};
	$.fn.setDigest = function () {
		//console.log("reset digest")
		winDigest = true;
	};
	$.fn.resetDigest = function () {
		//console.log("remove digest")
		winDigest = false;
	};
	$(document).on("click", ".fresize", function () {
		if ($(this).hasClass("f-up")) {
			if (fs < 2) {
				fs = fs + 1;
				$().resizeContent(1);
			}
		} else {
			if (fs > -2) {
				fs = fs - 1;
				$().resizeContent(-1);
			}
		}
	});
	$.fn.getCookie = function (cname) {
		var name = cname + "=",
			ca = document.cookie.split(';'),
			i,
			c;
		for (i = 0; i < ca.length; i++) {
			c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	};
	$.fn.setCookie = function (cname, cvalue, minutes) {
		var d = new Date(),
			expires;
		if (!minutes) {
			minutes = 2; //2 minutes by default
		}
		d.setTime(d.getTime() + (minutes * 60 * 1000));
		expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	};
	$.fn.scrollTo = function (id) {
		$('html, body').animate({
			scrollTop: $("#"+id).offset().top
		}, 1000);
	};
	$(document).on("click", "div.back-to-top", function () {
		$("html, body").animate({
			scrollTop: 0
		}, 600);
		return false;
	});

	$(window).scroll(function () {
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		if (scrollTop > 100) {
			$('div.back-to-top').fadeIn('slow');
		} else {
			$('div.back-to-top').fadeOut('slow');
		}
		if (screen.width < 768) {
			/*if (scrollTop > 75) {
				$(".navbar").css("top", (scrollTop + 50) + "px");
				if (scrollTop > previousScroll){
					$('header').removeClass("sticky").fadeOut('slow');
				}
				else if(scrollTop > 75){
					$('header').addClass("sticky").fadeIn('slow');
				}
			} else {
				$(".navbar").css("top", "0px");
				$('header').removeClass("sticky").fadeIn('slow');
			}*/
			if (scrollTop > 75) {
				$("header").addClass("stickytop");
				$(".navbar").css("top", (scrollTop + 50) + "px");
			} else {
				$(".navbar").css("top", "auto");
				$("header").removeClass("stickytop");
			}
			if (previousScroll < scrollTop) {
				$("header").addClass("no-stickytop");
			} else {
				$("header").removeClass("no-stickytop");
			}
			previousScroll = scrollTop;
		}
		/*if(screen.width < 768) {
			if (scrollTop >= 75) {
				$('header').addClass('stickytop no-stickytop');
			}
			else {
				$('header').removeClass('stickytop no-stickytop');
			}
		} else {
			if (scrollTop >= 75) {
				$('.navbar').addClass('stickytop');
			}
			else {
				$('.navbar').removeClass('stickytop');
			}	
		}*/

		$('.navbar-collapse').collapse('hide');
		$(".navbar-toggle").removeClass("active");
	});
	$(".accessible").click(function () {
		$('html,body').animate({
			scrollTop: $(".content-wrapper").offset().top
		}, 'slow');
	});
	$(".navbar-toggle").on("click", function () {
		$(this).toggleClass("active");
	});

	$(".acc").click(function () {
		if ($(this).hasClass("acc-high-contrast")) {
			$("link[title=app-css]").attr("href", "/uiassets/css/app.css");
		} else {
			$("link[title=app-css]").attr("href", "/uiassets/css/iapp.css");
		}
	});
	$(document).on('mouseover', '[data-toggle="tooltip"]', function () {
		$(this).tooltip({
			placement : "top",
			html : true
		});
		$(this).tooltip('show');
	});
	$(document).on('mouseover', '[data-tooltip="true"]', function () {
		$(this).tooltip({
			placement : "top",
			html : true
		});
		$(this).tooltip('show');
	});

	$.fn.clearClockTimer = function () {
		if (timerInt) {
			clearInterval(timerInt);
		}
	};
	$.fn.setClockTimer = function (duration, display) {
		var timer = duration,
			minutes,
			seconds;
		timerInt = setInterval(function () {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			display.text(minutes + ":" + seconds);

			if (--timer < 0) {
				timer = duration;
			}
		}, 1000);
	};
	$(document).on('click', 'a[data-popup]', function (ev) {
		ev.preventDefault();
		var href = $(this).attr('href'),
			content = "This screen shall take you to a web page outside GST Portal.</p><p> For any queries regarding the content of the linked page, please contact the webmaster of the concerned website.";
		if ($(this).attr('data-download') === 'true') {
			content = "Are you sure you want to download this utility?";
		}
		$("#dataConfirmModal").remove();

		$('body').append('<div id="dataConfirmModal" class="modal fade" role="dialog" aria-labelledby="dataConfirmLabel"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-warning pulseWarning"><span class="micon-body pulseWarningIns"></span><span class="micon-dot pulseWarningIns"></span></div><h2>Information</h2><p>' + content + '</p></div><div class="modal-footer"><a class="btn btn-default" data-dismiss="modal">Cancel</a><a class="btn btn-primary" id="dataConfirmOK" target="_blank" rel="noopener noreferrer">Proceed</a></div></div></div></div>');

		$('#dataConfirmOK').attr('href', href).click(function () {
			$("#dataConfirmModal").modal("hide");
		});
		$('#dataConfirmModal').modal({
			show: true
		});
		return false;
	});

	function timeout() {
		it += 1;
		//console.log(it)
		if (it === 12 && window.location.href.indexOf("/auth") > 0) {
			$(document).find("input:first").focus();
			if (!$('#sessionModal').length) {
				$('body').append('<div id="sessionModal" class="modal fade" role="dialog" aria-labelledby="dataConfirmLabel"><div class="modal-dialog sweet"><div class="modal-content"><div class="modal-body"><div class="m-icon m-warning pulseWarning"><span class="micon-body pulseWarningIns"></span><span class="micon-dot pulseWarningIns"></span></div><h2>Warning</h2><p>Your logged in session will expire in next <span id="logout_time">03:00</span> Minutes. Click Continue to extend your session, or click Logout to logout of the application.</p></div><div class="modal-footer"><button id="dataLogout" class="btn btn-default" data-dismiss="modal">Logout</button><button class="btn btn-primary" id="dataSessOK" data-dismiss="modal">Continue</button></div></div></div></div>');
			}
			$('#sessionModal').modal({
				show: true,
				backdrop: 'static'
			});
			$().setClockTimer(60 * 3, $('#logout_time'));
			$(document).on("click", "#dataSessOK", function () {
				it = 0;
				//console.log(servers.GST_SERVICES_R1_URL)
				$().keepalive();
			});
			$(document).on("click", "#dataLogout", function () {
				$().logout();
			});
		}
		if (it === 5 && window.location.href.indexOf("/login") > 0) {
			var servers = $().getServers();
			window.location.href = servers.GST_CONTENT_R1_URL;
		}
		if (it >= 15 && window.location.href.indexOf("/auth") > 0) {
			$().logout();
		}
	}

	/*resetTimer();
	$('body').on("mousemove keypress click", function(e) {
	    it = 0;
	});*/
	$.fn.resetAlive = function () {
		it = 0;
	};
	$.fn.keepalive = function () {

		$.ajax({
			url: "auth/api/keepalive",
			crossDomain: true,
			dataType: 'json',
			xhrFields: {
				withCredentials: true
			},
			success: function (response) {
				if (response.errorCode === 'false') {
					$().logout();
				} else {
					it = 0;
					$().clearClockTimer();
					if ($().getCookie('draftId')) {
						$().setCookie('draftId', $().getCookie('draftId'), 15);
					}
				}
			},
			error: function () {
				$().logout();
			}
		});
	};
	$.fn.resetTimer = function () {
		if (t) {
			clearTimeout(t);
		}
		t = setInterval(timeout, 60 * 1000); //60000
	};
	if (window.location.href.indexOf("/auth") > 0) {
		$().resetTimer();
	}

	$.fn.logout = function () {
		$().resetDigest();
		var servers = $().getServers();
		
		window.location.href = servers.GST_SERVICES_R1_URL + "/services/logout";
	};
	$.fn.blockPage = function (type) {
		 if (type) {
            $(".dimmer-holder").show();
        } else {
			$(".dimmer-holder").hide();
		}
	};
	$("[type=password]").keypress(function (e) {
		var s = String.fromCharCode(e.which);
		if ((s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) || (e.shiftKey && s.toUpperCase() !== s && s.toLowerCase() === s)) {
			//caps lock on
			$(document).find(".capslock").css("visibility", 'visible');
		} else {
			$(document).find(".capslock").css("visibility", 'hidden');
		}
	});
	$(document).on("keydown, keypress", ".number", function (e) {
		var key = e.keyCode || e.charCode || 0;
		//console.error(e)
		if ($.inArray(key, [8, 9, 27, 13]) !== -1 ||
			// Allow: Ctrl+A, Command+A
				(key === 65 && (e.ctrlKey === true || e.metaKey === true))) {
			return;
		}
		//&& (e.keyCode < 96 || e.keyCode > 105)
		if (e.altKey || e.shiftKey || (((key < 48 || key > 57)))) {
			e.preventDefault();
			return false;
		}
		return;
	});

	function tog(v) {
		return v ? 'addClass' : 'removeClass';
	}

	$(document).on('input', '.clearable', function () {
		$(this)[tog(this.value)]('x');
	}).on('mousemove', '.x', function (e) {
		$(this)[tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
	}).on('click', '.onX', function () {
		$(this).removeClass('x onX').val('').change();
	});
	$(".high-low").on("click", function () {
		if (!$("link[title=app-css]").hasClass("inverted")) {
			$("link[title=app-css]").toggleClass("inverted").attr("href", $("link[title=app-css]").attr('href').replace("css/", "css/i"));
			$().setCookie("CC", true, 15);
		} else {
			$("link[title=app-css]").toggleClass("inverted").attr("href", $("link[title=app-css]").attr('href').replace("css/i", "css/"));
			$().setCookie("CC", false, -1);
		}

	});
	String.prototype.toUpperCaseFirstChar = function () {
		return this.substr(0, 1).toUpperCase() + this.substr(1);
	};

	String.prototype.toLowerCaseFirstChar = function () {
		return this.substr(0, 1).toLowerCase() + this.substr(1);
	};

	String.prototype.toUpperCaseEachWord = function (delim) {
		delim = delim || ' ';
		return this.split(delim).map(function (v) {
			return v.toUpperCaseFirstChar();
		}).join(delim);
	};

	String.prototype.toLowerCaseEachWord = function (delim) {
		delim = delim || ' ';
		return this.split(delim).map(function (v) {
			return v.toLowerCaseFirstChar();
		}).join(delim);
	};
	String.prototype.toCamelCase = function () {
		return this.replace(/^([A-Z])|\s(\w)/g, function (match, p1, p2, offset) {
			if (p2) {
				return p2.toUpperCase();
			}
			return p1.toLowerCase();
		});
	};
	String.prototype.endsWith = function (suffix) {
		return this.indexOf(suffix, this.length - suffix.length) !== -1;
	};
	/*for masking */
	$.mask = {
		definitions: {
			"9": "[0-9]",
			"a": "[A-Za-z]",
			"*": "[A-Za-z0-9]"
		},
		autoclear: true,
		dataName: "rawMaskFn",
		placeholder: "_"
	};
	$.fn.extend({
		caret: function (begin, end) {
			var range;
			if (0 !== this.length && !this.is(":hidden")) {
				return "number" == typeof begin ? (end = "number" == typeof end ? end : begin,
					this.each(function () {
						this.setSelectionRange ? this.setSelectionRange(begin, end) : this.createTextRange && (range = this.createTextRange(),
							range.collapse(!0), range.moveEnd("character", end), range.moveStart("character", begin),
							range.select());
					})) : (this[0].setSelectionRange ? (begin = this[0].selectionStart, end = this[0].selectionEnd) : document.selection && document.selection.createRange && (range = document.selection.createRange(),
					begin = 0 - range.duplicate().moveStart("character", -1e5), end = begin + range.text.length), {
					begin: begin,
					end: end
				});
			}
		},
		unmask: function () {
			return this.trigger("unmask");
		},
		mask: function (mask, settings) {
			var input, defs, tests, partialPosition, firstNonMaskPos, lastRequiredNonMaskPos, len, oldVal, fn;
			if (!mask && this.length > 0) {
				input = $(this[0]);
				fn = input.data($.mask.dataName);
				return fn ? fn() : void 0;
			}
			return settings = $.extend({
					autoclear: $.mask.autoclear,
					placeholder: $.mask.placeholder,
					completed: null
				}, settings), defs = $.mask.definitions, tests = [], partialPosition = len = mask.length,
				firstNonMaskPos = null, $.each(mask.split(""), function (i, c) {
					"?" == c ? (len--, partialPosition = i) : defs[c] ? (tests.push(new RegExp(defs[c])),
						null === firstNonMaskPos && (firstNonMaskPos = tests.length - 1), partialPosition > i && (lastRequiredNonMaskPos = tests.length - 1)) : tests.push(null);
				}), this.trigger("unmask").each(function () {
					function tryFireCompleted() {
						if (settings.completed) {
							for (var i = firstNonMaskPos; lastRequiredNonMaskPos >= i; i++)
								if (tests[i] && buffer[i] === getPlaceholder(i)) return;
							settings.completed.call(input);
						}
					}

					function getPlaceholder(i) {
						return settings.placeholder.charAt(i < settings.placeholder.length ? i : 0);
					}

					function seekNext(pos) {
						for (; ++pos < len && !tests[pos];);
						return pos;
					}

					function seekPrev(pos) {
						for (; --pos >= 0 && !tests[pos];);
						return pos;
					}

					function shiftL(begin, end) {
						var i, j;
						if (!(0 > begin)) {
							for (i = begin, j = seekNext(end); len > i; i++)
								if (tests[i]) {
									if (!(len > j && tests[i].test(buffer[j]))) break;
									buffer[i] = buffer[j], buffer[j] = getPlaceholder(j), j = seekNext(j);
								}
							writeBuffer(), input.caret(Math.max(firstNonMaskPos, begin));
						}
					}

					function shiftR(pos) {
						var i, c, j, t;
						for (i = pos, c = getPlaceholder(pos); len > i; i++)
							if (tests[i]) {
								if (j = seekNext(i), t = buffer[i], buffer[i] = c, !(len > j && tests[j].test(t))) break;
								c = t;
							}
					}

					function androidInputEvent() {
						var curVal = input.val(),
							pos = input.caret();
						if (oldVal && oldVal.length && oldVal.length > curVal.length) {
							for (checkVal(!0); pos.begin > 0 && !tests[pos.begin - 1];) pos.begin--;
							if (0 === pos.begin)
								for (; pos.begin < firstNonMaskPos && !tests[pos.begin];) pos.begin++;
							input.caret(pos.begin, pos.begin);
						} else {
							for (checkVal(!0); pos.begin < len && !tests[pos.begin];) pos.begin++;
							input.caret(pos.begin, pos.begin);
						}
						tryFireCompleted();
					}

					function blurEvent() {
						checkVal(), input.val() != focusText && input.change();
					}

					function keydownEvent(e) {
						if (!input.prop("readonly")) {
							var pos, begin, end, k = e.which || e.keyCode;
							oldVal = input.val(), 8 === k || 46 === k || iPhone && 127 === k ? (pos = input.caret(),
								begin = pos.begin, end = pos.end, end - begin === 0 && (begin = 46 !== k ? seekPrev(begin) : end = seekNext(begin - 1),
									end = 46 === k ? seekNext(end) : end), clearBuffer(begin, end), shiftL(begin, end - 1),
								e.preventDefault()) : 13 === k ? blurEvent.call(this, e) : 27 === k && (input.val(focusText),
								input.caret(0, checkVal()), e.preventDefault());
						}
					}

					function keypressEvent(e) {
						if (!input.prop("readonly")) {
							var p, c, next, k = e.which || e.keyCode,
								pos = input.caret();
							if (!(e.ctrlKey || e.altKey || e.metaKey || 32 > k) && k && 13 !== k) {
								if (pos.end - pos.begin !== 0 && (clearBuffer(pos.begin, pos.end), shiftL(pos.begin, pos.end - 1)),
									p = seekNext(pos.begin - 1), len > p && (c = String.fromCharCode(k), tests[p].test(c))) {
									if (shiftR(p), buffer[p] = c, writeBuffer(), next = seekNext(p), android) {
										var proxy = function () {
											$.proxy($.fn.caret, input, next)();
										};
										setTimeout(proxy, 0);
									} else input.caret(next);
									pos.begin <= lastRequiredNonMaskPos && tryFireCompleted();
								}
								e.preventDefault();
							}
						}
					}

					function clearBuffer(start, end) {
						var i;
						for (i = start; end > i && len > i; i++) tests[i] && (buffer[i] = getPlaceholder(i));
					}

					function writeBuffer() {
						input.val(buffer.join(""));
					}

					function checkVal(allow) {
						var i, c, pos, test = input.val(),
							lastMatch = -1;
						for (i = 0, pos = 0; len > i; i++)
							if (tests[i]) {
								for (buffer[i] = getPlaceholder(i); pos++ < test.length;)
									if (c = test.charAt(pos - 1),
										tests[i].test(c)) {
										buffer[i] = c, lastMatch = i;
										break;
									}
								if (pos > test.length) {
									clearBuffer(i + 1, len);
									break;
								}
							} else buffer[i] === test.charAt(pos) && pos++, partialPosition > i && (lastMatch = i);
						return allow ? writeBuffer() : partialPosition > lastMatch + 1 ? settings.autoclear || buffer.join("") === defaultBuffer ? (input.val() && input.val(""),
								clearBuffer(0, len)) : writeBuffer() : (writeBuffer(), input.val(input.val().substring(0, lastMatch + 1))),
							partialPosition ? i : firstNonMaskPos;
					}
					var input = $(this),
						buffer = $.map(mask.split(""), function (c, i) {
							return "?" != c ? defs[c] ? getPlaceholder(i) : c : void 0;
						}),
						defaultBuffer = buffer.join(""),
						focusText = input.val();
					input.data($.mask.dataName, function () {
							return $.map(buffer, function (c, i) {
								return tests[i] && c != getPlaceholder(i) ? c : null;
							}).join("");
						}), input.one("unmask", function () {
							input.off(".mask").removeData($.mask.dataName);
						}).on("focus.mask", function () {
							if (!input.prop("readonly")) {
								clearTimeout(caretTimeoutId);
								var pos;
								focusText = input.val(), pos = checkVal(), caretTimeoutId = setTimeout(function () {
									input.get(0) === document.activeElement && (writeBuffer(), pos == mask.replace("?", "").length ? input.caret(0, pos) : input.caret(pos));
								}, 10);
							}
						}).on("blur.mask", blurEvent).on("keydown.mask", keydownEvent).on("keypress.mask", keypressEvent).on("input.mask paste.mask", function () {
							input.prop("readonly") || setTimeout(function () {
								var pos = checkVal(!0);
								input.caret(pos), tryFireCompleted();
							}, 0);
						}), chrome && android && input.off("input.mask").on("input.mask", androidInputEvent),
						checkVal();
				});
		}
	});
    if (window.location.href.indexOf("/enrolplan") > 0) {
		$.ajax({
			url: "master/enrolplan",
			beforeSend: function(){
				$().blockPage(true);
			},
			complete: function(){
				$().blockPage(false);
			},
			success: function(data){
				if(data) {
					var x = JSON.parse(JSON.stringify(data)).data, table = "<table class='stack'>", y = JSON.parse(x);
					table += "<tr><th width='50%'>State</th><th width='20%'>Start Date</th><th width='20%'>End Date</th><th width='10%'>% Enrolled</th></tr>";
					$.map(y.st, function(item){
						table += "<tr><td data-th='State'><div>"+item.nm+"</div></td><td data-th='Start Date'><div>"+item.sdt+"</div></td><td data-th='End Date'><div>"+item.edt+"</div></td><td data-th='% Enrolled'><div>"+item.act+"</div></td></tr>";
					})
					table += "</table>";
					$(".table-responsive").html(table);
				} else {
					location.href= 'system/error';	
				}
			}, 
			error: function(){
				location.href= 'system/error';
			}
		});	
	}
}(jQuery));

$(window).ready(function () {
	'use strict';
	$(".dimmer-holder").fadeOut("slow");
});
$(document).ready(function () {
	setTimeout(function(){
		$().setExtLinks();
	})
});
$(window).resize(function () {
	'use strict';
	$().reposFooter();
	$(".navbar").css("top", "auto");
	if (!$(".navbar").hasClass("collapsed")) {
		$(".navbar").addClass("collapsed");
	}
});
window.onbeforeunload = function () {
	//$().setCookie("CC", false, -1);
};
/* var seal= function(){
if(window.location.href.indexOf("/auth") < 0) {
	//load only for pre login pages
	(function(d, t) {
		var s = d.createElement(t), options = {'domain':'*.gst.gov.in','style':'7','container':'entrust-net-seal'}; 
		s.src = 'https://seal.entrust.net/sealv2.js'; 
		s.async = true; 
		var scr = d.getElementsByTagName(t)[0], par = scr.parentNode; par.insertBefore(s, scr); 
		s.onload = s.onreadystatechange = function() { 
		var rs = this.readyState; if (rs && rs != 'complete' && rs != 'loaded') return; 
		try{goEntrust(options)} catch (e) {} }; 
	})(document, 'script');
}
}; */