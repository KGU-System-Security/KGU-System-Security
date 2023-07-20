'use strict';

var AppModal, Photo, Detector, changeSmartEditorHeight, viewSmartEditor, ajaxOnfail, AjaxLoadingImage, loading, AjaxLoading, Pop, Tab, Slider, SetNaverMap, LoadNaverMap;

// IE8 콘솔에러에 대응하기 위한 가짜 객체
window.console = window['console'] || {
	log : function(msg) {
		// IE8일 경우 없는 console.log 함수를 만든다.
	}
};

// $(function() {
// 	var msg = '';
// 	msg +='안녕하세요. 시스템 담당자입니다.';
// 	msg +='\n보다 나은 서비스 제공을 위해';
//  msg +='\n정기 및 수시 업데이트를 진행하고 있습니다.';
// 	msg +='\n';
// 	msg +='\n현재 업데이트가 진행 중에 있습니다.';
// 	msg +='\n';
// 	msg +='\n업데이트 중에는 기능이 정상동작하지 않으며,';
// 	msg +='\n데이터의 저장 또한 정상적으로 이루어지지 않습니다.';
// 	msg +='\n';
// 	msg +='\n업데이트 종료 예상 시간은 2107년 7월 3일(월) 오전 04시 30분 이오니,';
// 	msg +='\n업데이트 완료 이후에 이용해주시기 바랍니다.';
// 	msg +='\n';
// 	msg +='신속하고 안정적으로 작업을 완료할 수 있도록 최선을 다하겠습니다.';
// 	msg = msg.replace(/\n/gi, '<br/>');
// 	msg = '<p style="font-weight:bold;font-size:12px">'  +msg + '</p>';
// 	Alert(msg);
// });

AppModal = (function() {
	var opt = {},
	fnSetOption, // 옵션설정
	fnOpen, // 열기
	fnClose, // 닫기
	fnEvent, // 기본이벤트부여
	fnValidUnit, // 옵션 단위검사
	fnLayout, // 레이아웃 수치 계산
	fnCreate; // 팝업생성

	fnSetOption = function(option) { // 옵션설정
		$.extend(opt, {
			title : '제목을 입력하세요',
			width : '800',
			height : '400',
			scroll : false,
			openAnimation : true, 
			closeAnimation : true,
			btnTitle : '확인',
			btnEvent : function() { Alert ? Alert('이벤트를 연결하세요') : alert('이벤트를 연결하세요'); },
			cancelTitle : '취소',
			cancelEvent : function() { return true; },
			cachingEvent : function() { /* 빈 함수 */ },
			callback : function() { /* 빈 함수 */ },
			content : '컨텐츠를 입력하세요',
			validater : false,
			enabledCancel : true,
			enabledForm : true,
			enabledConfirm : true,
			enabledCaching : false,
			enabledSecondBtn : false,
			enabledSecondBtnConfirm : true,
			enabledCancelConfirm : false,
			secondBtnTitle : '두번째버튼',
			secondBtnEvent : function() { alert('이벤트를 연결하세요'); return false; },
			confirmMsg : '',
			secondBtnConfirmMsg : '',
			cancelConfirmMsg : '',
			bottomArea : false,
			bottomHeight : '75',
			bottomContent : '컨텐츠를 입력하세요.'
		}, option);
	
		opt.width = opt.width+''; // 스트링으로 변환
		opt.height = opt.height+''; // 스트링으로 변환
		
		return fnValidUnit('width') && fnValidUnit('height');
	};
	
	fnOpen = function() { // 열기
		opt.callback();
		$('body').css({overflowY:'hidden'});
		if(opt.openAnimation) setTimeout(function() {	$('#modal').fadeIn('fast'); }, 200);
		else $('#modal').show();
	};
	
	fnClose = function() { // 닫기
		if(opt.closeAnimation) {
			$('#modal').fadeOut('fast');
			setTimeout(function() {	
				$('body').css({overflowY:'auto'});
				opt.enabledForm ? $('#modalFrm').remove() : $('#modal').remove();
			}, 200);
		} else {
			$('#modal').remove();
			$('body').css({overflowY:'auto'});
			opt.enabledForm ? $('#modalFrm').remove() : $('#modal').remove();
		}
	};
	
	fnEvent = function() { // 기본 이벤트 바인딩
		if(opt.validater) { // jquery.midas.validater 설정
			$('#modalFrm').validater({
				submitBtn : '#modal button[data-button="modalSubmit"]',
				submitMethod : function() {
					var msg = opt.confirmMsg ? opt.confirmMsg : opt.btnTitle+'하시겠습니까?';
					var Confirm = window['Confirm'] || null;
					if(opt.enabledConfirm) {
						if(Confirm) Confirm(msg, function() { if(opt.btnEvent()) fnClose(); });
						else if(confirm(msg)) if(opt.btnEvent()) fnClose();
					} else {
						if(opt.btnEvent()) fnClose();
					}
				}
			});
		} else if(opt.enabledCaching) {
			$('#modal button[data-button="modalCaching"]').click(function() {
				opt.cachingEvent();
				fnClose();
			});
		} else { // 기본
			$('#modal button[data-button="modalSubmit"]').click(function() {
				var msg = opt.confirmMsg ? opt.confirmMsg : opt.btnTitle+'하시겠습니까?';
				var Confirm = window['Confirm'] || null;
				
				if(opt.enabledConfirm) {
					if(Confirm) Confirm(msg, function() { if(opt.btnEvent()) fnClose(); });
					else if(confirm(msg)) if(opt.btnEvent()) fnClose();
				} else {
					if(opt.btnEvent()) fnClose();
				}
			});			
		}

		$('#modal button[data-button="modalSecondBtn"]').click(function() {
			var msg = opt.secondBtnConfirmMsg ? opt.secondBtnConfirmMsg : opt.secondBtnTitle+'하시겠습니까?';
			var Confirm = window['Confirm'] || null;
			if(opt.enabledSecondBtnConfirm) {
				if(Confirm) Confirm(msg, function() { if(opt.secondBtnEvent()) fnClose(); });
				else if(confirm(msg)) if(opt.secondBtnEvent()) fnClose();
			} else {
				if(opt.secondBtnEvent()) fnClose();
			}
		});
		
		$('#modal button[data-button="modalCancel"]').click(function() {
			var msg = opt.cancelConfirmMsg ? opt.cancelConfirmMsg : opt.cancelTitle+'하시겠습니까?';
			var Confirm = window['Confirm'] || null;
			if(opt.enabledCancelConfirm) {
				if(Confirm) Confirm(msg, function() { if(opt.cancelEvent()) fnClose(); });
				else if(confirm(msg)) if(opt.cancelEvent()) fnClose();
			} else {
				if(opt.cancelEvent()) fnClose();
			}
		});
		$('#modal button[data-button="modalClose"]').click(fnClose);
		
		$(document).keydown(function(e) {
			if(e.keyCode===27) fnClose(); // ESC
		});
	};
	
	fnValidUnit = function(unit) { // 단위누락시 자동변환
		if(!opt[unit].match('px') && !opt[unit].match('%')) {
			if(Number(opt[unit]) > 0) opt[unit] = opt[unit]+'px';
			else throw new Error('유효한 '+unit+'를 입력하세요.');
		}
		return true;
	};
	
	fnLayout = function() { // 레이아웃 수치 계산
		var style, marginTop;
		marginTop = (($(window).height() - opt.height.replace('px', '').replace('%', '')) / 2)+'px';
		style = (opt.width ? 'width:'+opt.width+';' : '')+''+(!opt.scroll && opt.height ? 'height:'+opt.height+';margin-top:'+marginTop : '');
		return style;
	};
	
	fnCreate = function() {
		var t = [], s = fnLayout();
	
		if(opt.enabledForm) t.push('<form id="modalFrm">'); // form이 반드시 여기 있어야 modal-scroll이 동작함
		t.push('<div id="modal" class="appsite-modal-bg">');
		t.push('	<div class="appsite-modal '+(opt.scroll ? 'modal-scroll' : '')+'" style="'+s+'">');
		t.push('		<h2 class="h2">'+opt.title+'<button type="button" data-button="modalClose" class="btn-close-modal"></button></h2>');
		t.push('			<div class="modal-body">'+opt.content+'</div>');
		if(opt.enabledCaching) { // 0일 동안 보지 않기
			t.push('		<div class="caching-set">');
			t.push('			<label class="styled-select"><select id="cachingPeriod"><option value="1">1</option><option value="7">7</option><option value="30">30</option></select></label>');
			t.push('			일 동안 보이지 않기');
			t.push('			<button type="button" class="btn btn-last" style="margin-left:20px;" data-button="modalCaching">닫기</button>');
			t.push('		</div>');
		} else {
			t.push('		<div class="btn-set">');
			if(opt.bottomArea) t.push('<div id="modalBottom" style="padding:0 20px;height:'+opt.bottomHeight+'px;text-align:left">'+opt.bottomContent+'</div>');
			t.push('			<button type="button" class="btn-modal" data-button="modalSubmit">'+opt.btnTitle+'</button>');
			if(opt.enabledSecondBtn) t.push('<button type="button" class="btn-modal" data-button="modalSecondBtn">'+opt.secondBtnTitle+'</button>');
			if(opt.enabledCancel) t.push('<button type="button" class="btn-modal btn-modal-ng" data-button="modalCancel">'+opt.cancelTitle+'</button>');
		}
		t.push('		</div>');
		t.push('	</div>');
		t.push('</div>');
		if(opt.enabledForm) t.push('</form>');
		$('body').append(t.join(''));
	};
	
	return function(option) {
		if(fnSetOption(option)) { // 옵션에 문제가 없으면 모달생성
			fnCreate();
			fnEvent();
			fnOpen();
		}
		return opt;
	};
})();

Slider = (function() {
	var Slider = null;

	var sliderType = {
        'SLIDE': {
            set: {
                width: 0,
                height: 0,
                time: 5000,
                length: 0,
                index: 0,
                intervar: null,
                btnStop: false
            },
            move: function(index) {
                var nextIndex = index < Slider.set.length - 1 ? Slider.set.index + 1 : 0;
                $('#slider img[data-index=' + index + ']').stop().css({left: '0px'}).animate({left: '-' + Slider.set.width + 'px'}, 800, 'easeInOutQuart');
                $('#slider img[data-index=' + nextIndex + ']').stop().css({left: Slider.set.width + 'px'}).animate({left: '0px'}, 800, 'easeInOutQuart');
                Slider.set.index = nextIndex;
            },
            start: function() {
                if (Slider.btnStop) {
                    return false;
                }
                if ($('#slider img').size() > 1) {
                    Slider.set.interval = setInterval(function() {
                        Slider.move(Slider.set.index);
                    }, Slider.set.time);
                }
            },
            stop: function() {
                clearInterval(Slider.set.interval);
            },
            install: function(width, height) {
                var data = Data.view.slideImageList;
                var tag = [];
                var i;
                if (data.length > 1) {
                    tag.push('<div class="sliderControl">');
                    tag.push('	<button type="button" class="pause" data-button="pause">일시정지</button>');
                    tag.push('	<button type="button" class="play active" data-button="play">재생</button>');
                    tag.push('</div>');
                }
                for (i in data) {
                    if (data[i].linkKindCode > 1) { // URL이 있을 경우
                        tag.push('<a href="' + data[i].url + '" ' + (data[i].linkKindCode === 5 ? 'target="_blank"' : '') + '>');
                    }
                    tag.push('<img src="' + data[i].imagePath + '" alt="' + data[i].imageExplanation + '" width="' + width + '" height="' + height + '" />');
                    if (data[i].linkKindCode > 1) { // URL이 있을 경우
                        tag.push('</a>');
                    }
                }
                return tag.join('');
            },
            preInstall: function() {
                $('#slider img').each(function(index) {
                    $(this).attr('data-index', index);
                    if (index > 0) {
                        $(this).css({
                            left: Slider.set.width + 'px',
                            top: '0px'
                        });
                    }
                });
            }
        },
        'FADE' : {
            set: {
                width: 0,
                height: 0,
                time: 5000,
                length: 0,
                index: 0,
                intervar: null,
                btnStop: false
            },
            move: function(index) {
                var nextIndex = index < Slider.set.length - 1 ? Slider.set.index + 1 : 0;
                $('#slider img[data-index=' + index + ']').stop().css({opacity: 1}).animate({opacity: 0}, 1200, 'easeInOutQuart', function() {
                	$(this).css({ display : 'none' });
				});
                $('#slider img[data-index=' + nextIndex + ']').stop().css({opacity: 0, display: 'block'}).animate({opacity: 1}, 1200, 'easeInOutQuart');
                Slider.set.index = nextIndex;
            },
            start: function() {
                if (Slider.btnStop) {
                    return false;
                }
                if ($('#slider img').size() > 1) {
                    Slider.set.interval = setInterval(function() {
                        Slider.move(Slider.set.index);
                    }, Slider.set.time);
                }
            },
            stop: function() {
                clearInterval(Slider.set.interval);
            },
            install: function(width, height) {
                var data = Data.view.slideImageList;
                var tag = [];
                var i;
                if (data.length > 1) {
                    tag.push('<div class="sliderControl">');
                    tag.push('	<button type="button" class="pause" data-button="pause">일시정지</button>');
                    tag.push('	<button type="button" class="play active" data-button="play">재생</button>');
                    tag.push('</div>');
                }
                for (i=0; i<data.length; i++) {
                    if (data[i].linkKindCode > 1) { // URL이 있을 경우
                        tag.push('<a href="'+data[i].url+'" '+(data[i].linkKindCode === 5 ? 'target="_blank"' : '')+'>');
                    }
                    tag.push('<img src="'+data[i].imagePath+'" alt="'+data[i].imageExplanation+'" width="'+width+'" height="'+height+'" style="display:'+(i === 0 ? 'block' : 'none')+'" />');
                    if (data[i].linkKindCode > 1) { // URL이 있을 경우
                        tag.push('</a>');
                    }
                }
                return tag.join('');
            },
            preInstall: function() {
                $('#slider img').each(function(index) {
                    if (index !== 0) $(this).css('opacity', 0);
                    $(this).attr('data-index', index);
                });
            }
        }
    };

	var fn = {
        init: function() {
			if(Slider.preInstall) Slider.preInstall();

            Slider.set.width = $('#slider').width();
            Slider.set.height = $('#slider').height();
            Slider.set.length = $('#slider img').size();

            $('#slider img').mouseenter(Slider.stop).mouseleave(Slider.start);

            $('#slider button[data-button=pause]').click(function() {
                if ($(this).hasClass('active')) {
                    return false;
                }
                Slider.stop();
                Slider.btnStop = true;
                $('#slider button[data-button=play]').removeClass('active');
                $(this).addClass('active');
            });

            $('#slider button[data-button=play]').click(function() {
                if ($(this).hasClass('active')) {
                    return false;
                }
                Slider.start();
                Slider.btnStop = false;
                $('#slider button[data-button=pause]').removeClass('active');
                $(this).addClass('active');
            });

            Slider.start();
        }
	};

	Slider = sliderType[($('#settingType') > 'D' ? 'FADE' : 'SLIDE')];
	return $.extend({}, Slider, fn);
})();

Tab = {
	lastIndex : 0, // 마지막으로 생성된 인덱스 번호에 대한 배열
	init : function() {
		var depth = $('div[data-type=tab]').hasClass('hasDepth2') ? 2 : 1;
		Tab.bindClickEvent(depth);
		Tab.updateLastIndex();
	},
	bindClickEvent : function(depth) {
		$(document).off('click', 'div[data-type=tab] ul.depth1>li>button').on('click', 'div[data-type=tab] ul.depth'+depth+'>li>button', function(e) {
			var index = Number($(this).attr('data-index'));
			$('div[data-type=tab] ul.depth'+depth+'>li>button').removeClass('active');
			$(this).addClass('active');
			if($(this).find('>span').attr('contenteditable') === 'true') $(this).find('>span').focus();

			$('div[data-type=tabTarget]').each(function() {
				var targetIndex = Number($(this).attr('data-index'));
				if(index === targetIndex) {
					$(this).addClass('active');
					
					// 탭메뉴에서 숨겨진 지도는 제대로 불려오지 않기 때문에 재로딩 17.02.07 민종
					$(this).find('iframe').each(function() {
						this.src = this.src;
					});
				} else {
					$(this).removeClass('active');
				}
			});
		});

		if(depth === 2) { // depth2 라면
			$(document).on('click', 'div[data-type=tab] ul.depth1>li>button', function(e) {
				if($(this).hasClass('active')) { // 열린 애를 클릭하면 취소
					return false;
				}
				$('div[data-type=tab] ul.depth2').slideUp();
				$(this).next('ul.depth2').slideDown('fast');
				$('div[data-type=tab] ul.depth1>li>button').removeClass('active');
				$(this).addClass('active');
			});
		}
	},
	initLastIndex : function() {
		Tab.lastIndex = $('div[data-type=tabTarget]').size();
	},
	updateLastIndex : function() {
		$('div[data-type=tabTarget]').each(function() {
			var index = Number($(this).attr('data-index'));
			if(index > Tab.lastIndex) {
				Tab.lastIndex = index;
			}
		});
	}
};

Pop = {
	init : function() {
		Pop.rejectEmail();
        Pop.privacyPolicy();
	},
	rejectEmail : function() { // 이메일무단수집거부
		$('#rejectEmail').click(function(e) {
			var skin;
			if(!$('body').hasClass('edit')) {
				e.preventDefault();
                skin = $('body').attr('data-skin');
				window.open(this.href+'&skin='+skin, 'rejectEmail', 'width=500,height=350,resizable=0');
			}
		});
	},
	privacyPolicy : function() { // 개인정보 처리방침
        var url, isBuilder, isSettingPage;
		var skin = $('body').attr('data-skin');

        isBuilder = $('#isBuilder').val();
        isSettingPage = $('#isSettingPage').val();

        $(document).on('click', '.linkPrivacy', function(e) {
            e.preventDefault();
            url = $(this).attr('href');
            window.open(url + '&skin=' + skin + '&isBuilder=' + isBuilder + '&isSettingPage=' + isSettingPage, 'privacyPolicy', 'width=800, height=600, scrollbars=1');
        });
	}
};

// 로딩되는 녀석을 만들긴했는데 아직 쓰는데가 없음 ㅡㅡ;
AjaxLoading = {
	start : function(target) {
		var tag = [];
		var targetHeight = $(target).height();
		var height = $('#newAjaxLoading').height();
		var marginTop = (targetHeight - height) / 2;

		tag.push('<div id="newAjaxLoading" class="ajaxLoading"><i class="fa fa-spinner fa-pulse"></i></div>');
		$(target).append(tag.join(''));
		$('#newAjaxLoading').css('margin-top', marginTop+'px').removeAttr('id');
	},
	finish : function(target) {
		$(target).find('.ajaxLoading').remove();
	}
};

Photo = {
	setImageSize : function(naturalWidth, naturalHeight, frameWidth, frameHeight) { // 이미지를 프레임에 맞게 사이즈를 조정해주는 기능
		var width = 0;
		var height = 0;
		var ratio = 0;
		var marginTop = 0;
		var size = {};

		if(naturalWidth === naturalHeight && naturalWidth > 0 && naturalHeight > 0) { // 정사각형
			if(frameWidth > frameHeight) { // 프레임이 가로형
				width = frameHeight;
				height = frameHeight;
			} else if(frameWidth < frameHeight) { // 프레임이 세로형
				width = frameWidth;
				height = frameWidth;
			} else { // 프레임이 정사각형
				width = frameWidth;
				height = frameWidth;
			}
		} else if(naturalWidth < naturalHeight) { // 세로형 이미지
			if(frameHeight >= naturalHeight) { // 프레임보다 이미지가 작을 경우
				width = naturalWidth > frameWidth ? frameWidth : naturalWidth;
				height = naturalHeight;
			} else { // 프레임보다 이미지가 클 경우
				ratio = naturalHeight / frameHeight;
				width = naturalWidth / ratio > frameWidth ? frameWidth : naturalWidth / ratio;
				height = frameHeight;
			}
		} else if(naturalWidth > naturalHeight) { // 가로형 이미지
			if(frameWidth >= naturalWidth) { // 프레임보다 이미지가 작을 경우
				width = naturalWidth;
				height = naturalHeight > frameHeight ? frameHeight : naturalHeight;
			} else { // 프레임보다 이미지가 클 경우
				ratio = naturalWidth / frameWidth;
				width = frameWidth;
				height = naturalHeight / ratio > frameHeight ? frameHeight : naturalHeight / ratio;
			}

			marginTop = (frameHeight - height) / 2;
		}

		if(width > 0) size.width = width;
		if(height > 0) size.height = height;
		if(marginTop > 0) size.marginTop = marginTop;

		return size;
	}
};

// 브라우저 디텍터 : mQuery에서 가져옴
Detector = (function() {
    var result={};
    var navi=window['navigator'], agent=navi.userAgent.toLowerCase(), platform=navi.platform.toLowerCase(), app=navi.appVersion.toLowerCase(),
        device='pc', isMobile=0,
        browser, bv, os, osv,
        i, t0,
        ie=function() {
            if (agent.indexOf('msie')<0&&agent.indexOf('trident')<0) return;
            if (agent.indexOf('iemobile')> -1) os='winMobile';
            return browser='ie', bv=agent.indexOf('msie 7')> -1&&agent.indexOf('trident')> -1?-1:agent.indexOf('msie')<0?11:parseFloat((/msie ([\d]+)/).exec(agent)[1]);
        },
        chrome=function() {
            if (agent.indexOf(i='chrome')<0&&agent.indexOf(i='crios')<0) return;
            return browser='chrome', bv=parseFloat((i==='chrome'?/chrome\/([\d]+)/:/crios\/([\d]+)/).exec(agent)[1]);
        },
        firefox=function() { return agent.indexOf('firefox')<0?0:(browser='firefox', bv=parseFloat((/firefox\/([\d]+)/).exec(agent)[1])); },
        safari=function() { return agent.indexOf('safari')<0?0:(browser='safari', bv=parseFloat((/safari\/([\d]+)/).exec(agent)[1])); },
        opera=function() {
            var i;
            return (agent.indexOf(i='opera')<0&&agent.indexOf(i='opr')<0)?0:(browser='opera', bv=(i==='opera')?parseFloat((/version\/([\d]+)/).exec(agent)[1]):parseFloat((/opr\/([\d]+)/).exec(agent)[1]));
        },
        naver=function() {
			return agent.indexOf('naver')<0?0:browser='naver';
		};
    if (agent.indexOf('android')> -1) {
        browser=os='android',
        device=agent.indexOf('mobile') === -1?(browser+='Tablet', 'tablet'):'mobile',
		i=(/android ([\d.]+)/).exec(agent),
		i=i[1].split('.'),
        osv= i? (parseFloat(i[0]+'.'+i[1])):0,
        isMobile=1,
        naver()||opera()||chrome()||firefox()||(bv=i=(/safari\/([\d.]+)/).exec(agent)?parseFloat(i[1]):0);
    } else if (agent.indexOf(i='ipad')> -1||agent.indexOf(i='iphone')> -1) {
        device = (i === 'ipad' ? 'tablet' : 'mobile'),
        browser=os=i,
		i=(/os ([\d_]+)/).exec(agent),
		i=i[1].split('_'),
        osv=i ? (parseFloat(i[0]+'.'+i[1])):0,
        isMobile=1,
        i=(/mobile\/([\S]+)/),
        naver()||opera()||chrome()||firefox()||(bv=(0)); // MRS-4148 모바일 사파리 에이전트 변경으로 버전을 명시할 수 없어 0으로 리턴
    } else if (platform.indexOf('win')> -1) {
        for (i in t0={'5.1':'xp', '6.0':'vista', '6.1':'7', '6.2':'8', '6.3':'8.1', '6.4':'10'}) {
            if (agent.indexOf('windows nt '+i)> -1) {
                osv=t0[i];
                break;
            }
        }
        os = 'win', ie()||opera()||chrome()||firefox()||safari();
    } else if (platform.indexOf('mac')> -1) {
        os = 'mac',
        i = (/os x ([\d._]+)/).exec(agent)[1].replace('_', '.').split('.'),
        osv=parseFloat(i[0]+'.'+i[1]), opera()||chrome()||firefox()||safari();
    } else os=app.indexOf('x11')> -1?'unix':app.indexOf('linux')> -1?'linux':0, chrome()||firefox();
    for (i in t0={
        device:device, isMobile:isMobile,
        browser:browser, browserVer:bv,
        os:os, osVer:osv,
        down:isMobile?'touchstart':'mousedown', move:isMobile?'touchmove':'mousemove', up:isMobile?'touchend':'mouseup'
    }) if (t0.hasOwnProperty(i)) result[i]=t0[i];
    return result;
})();

/********************************************************************************************
Ajax 로딩이미지 띄우기
********************************************************************************************/
AjaxLoadingImage = function() {
	this.url = (document.resources || '/resources') + '/images/ajaxLoading.gif';
	this.count = 0;
	this.maxLength = 0;
};
AjaxLoadingImage.prototype.show = function() {
	var height = $(window).height();
	this.maxLength++;

	if($('#loading').size() > 0) { // 이미 로딩되어 있으면 취소
		return false;
	}

	$('body').append('<div id="loading" style="line-height:'+height+'px"><img src="'+this.url+'" alt="Loading" /></div>');
};
AjaxLoadingImage.prototype.hide = function() { // Ajax를 무조건 닫을 때 사용하는 함수
	$('div#loading').remove();
	this.maxLength = 0;
	this.count = 0;
};
AjaxLoadingImage.prototype.countHide = function() { // Ajax를 여러개 돌릴 때 사용하는 함수
    if(++this.count >= this.maxLength) {
		this.hide();
	}
};

loading = new AjaxLoadingImage();

/********************************************************************************************
Date Util
********************************************************************************************/
String.prototype.nvl = function(rep) { return (this.length === 0) ? rep : this; };
String.prototype.string = function(len) { var s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function(len) { return '0'.string(len - this.length) + this; };
Number.prototype.zf = function(len) { return this.toString().zf(len); };

Date.prototype.format = function(f) {
	var weekName = ['일', '월', '화', '수', '목', '금', '토'];
	var d = this;
	var h;
	if (!this.valueOf()) return '';
	
	return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
		switch ($1) {
			case 'yyyy' : return d.getFullYear();
			case 'yy' : return (d.getFullYear() % 1000).zf(2);
			case 'MM' : return (d.getMonth() + 1).zf(2);
			case 'dd' : return d.getDate().zf(2);
			case 'E' : return weekName[d.getDay()];
			case 'HH' : return d.getHours().zf(2);
			case 'hh' : return h = d.getHours(), ((h % 12) ? h : 12).zf(2);
			case 'mm' : return d.getMinutes().zf(2);
			case 'ss' : return d.getSeconds().zf(2);
			case 'a/p' : return d.getHours() < 12 ? '오전' : '오후';
			default : return $1;
		}
	});
};

$(function() {
	Slider.init();
	Tab.init();
	Pop.init();
});

ajaxOnfail = function(x, e) {
	var statusCode = x.status;
	switch(statusCode) {
	case 901 :
		Alert('세션이 종료되었습니다.');
		break;
	case 999 :
		Alert(x.responseText);
		break;
	default :
		Alert('처리중 오류가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
		//location.href = "/com/systemNotice/error";
	}
};

/*********************
뷰어 들어가는 부모에 data-viewSmartEditor를 사용하여 사용
* ******************/
changeSmartEditorHeight = function() {
    setTimeout(function() {
        var theHeight=document.getElementById('viewSmartEditor').contentWindow.document.body.scrollHeight;
        document.getElementById('viewSmartEditor').height=theHeight;
    }, 50);
};

viewSmartEditor = (function() {
   var checkImages, changeHeight;

	changeHeight = (function() {
		setTimeout(function() {
			var theHeight=document.getElementById('mailpreviewframe').contentWindow.document.body.scrollHeight;
			document.getElementById('mailpreviewframe').height=theHeight;
		}, 300);
	});

	checkImages=(function() {
		var len, t;
		var checkCount;
		return function(list) {
			var max, loaded;
			len=list.length, max=len, loaded=0;
			checkCount=function() {
				loaded++;
				if(max===loaded) changeHeight();
			};
			while(len--) t=list[len], t.onload=checkCount, t.onerror=checkCount;
		};
	})();

	return function() {
		$('[data-viewSmartEditor]').html('<iframe id="viewSmartEditor" name="viewSmartEditor" width="100%" scrolling="no" frameborder="0" height="20px" onload="changeSmartEditorHeight()" src="/resources/mit-common/smartEditor/SmartEditorRead.html"></iframe>');
		checkImages($('#viewSmartEditor').contents()[0].images);
	};
})();

SetNaverMap = (function() {
	var fn, keyData, opt, defaultOpt;

	keyData = {};

    opt = {
		center: null,
		zoom: 12,
		mapTypeControl: true,
		zoomControl: true
	};
    
    // 서울시청
	defaultOpt = {
		x : 126.9783882,
		y : 37.5666103
	};

	fn = {
		init : function(id) {
			fn.load(id);
		},
		load : function(id) {
			naver.maps.Service.geocode({
				query: keyData[id].address
			}, function(status, response) {
				var items;

				if (status !== naver.maps.Service.Status.OK) {
					return Alert('네이버 지도를 불러오는데 실패했습니다.');
				}


				if(response.v2.meta.totalCount === 0) {
					fn.drawMap(id); // 검색된 주소가 없고 좌표값을 넘기지 않으면 네이버 기본값이 서울시청이다.
					return Alert('입력한 주소로 검색된 결과가 없습니다.');
				}

                items = response.v2.addresses;
				fn.drawMap(id, items[0]);
			});
		},
		drawMap : function(id, data) {
			var map, label;
			document.getElementById(id).innerHTML = ''; // 초기화
            if(!data) data = defaultOpt;
			opt.center = new naver.maps.LatLng(data.y, data.x);
			map = new naver.maps.Map(id, opt);
			label = new naver.maps.InfoWindow({
				anchorSkew: true
			});
			label.setContent((function() {
				var t = [];
				t.push('<div class="naverMapLabel">'+keyData[id].companyName+'</div>');
				return t.join('');
			})());
			label.open(map, new naver.maps.Point(data.x, data.y));
		}
	};

	return function(id, address, companyName) {
        if(!id) throw new Error('첫번째 파라미터로 ID를 입력하세요.');
        keyData[id] = {};
        keyData[id].address = (address ? decodeURIComponent(address) : '서울 중구 세종대로 110');
		keyData[id].companyName = (companyName ? decodeURIComponent(companyName) : '서울시청');
		fn.init(id);
	};
})();

LoadNaverMap = function() {
    var script, $map;

    $map = $('div[data-type="map"][data-mapType="naver"]>div[id^="naverMap-"]');

    // 지도가 없거나 메인이면 리턴
    if(!$map.size() || $('body').hasClass('main')) return false;

    // 빌더가 아니면서 API Script 로딩이 없을 경우 호출 - 빌더는 header.jsp에 선언되어 있음
    if(!$('#naverMapApi').size()) {
        script = document.createElement('script');
        script.id = 'naverMapApi';
        script.src = 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=71gvyvcco8&submodules=geocoder';
        script.onreadystatechange = script.onload = (function() {
            setTimeout(LoadNaverMap, 200); // 네이버 API를 사용하려면 약간의 추가시간이 필요함
        });
        document.getElementsByTagName('head')[0].appendChild(script);
    } else {
        // 지도가 존재할 경우 지도 로드
        $('div[data-type="map"][data-mapType="naver"]>div[id^="naverMap-"]').each(function() {
            var id, address, companyName;
            id = $(this).attr('id');
            address = decodeURIComponent($(this).attr('data-address'));
            companyName = decodeURIComponent($(this).attr('data-companyName'));
            SetNaverMap(id, address, companyName);
        });
    }
};