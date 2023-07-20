'use strict';

/********************************************************************************************
 *  이 파일은 브라우저에서 기본적으로 제공하는 UI를 커스텀한 내용이 있는 파일입니다.
 *  궁금하신 부분은 김민종에게 문의해주세요.
 * *****************************************************************************************/

/********************************************************************************************
 *  커스텀 Dialog
 * *****************************************************************************************/
var CustomDialog = (function() {
	var getText = (function() {
		var currentLang, dataBase;
		currentLang = (function() { //html Tag의 Language를 따른다.
			var tagLang = document.documentElement.getAttribute('lang');
			var list = {
				'ko': true,
				'ja': true
			};
			if (!list[tagLang]) {
				return 'ko';
			}else
				return tagLang;
		})();

		dataBase ={
			ko : {
				'confirm' : '확인',
				'cancel' : '취소'
			},
			ja : {
				'confirm' : '確認',
				'cancel' : '取消'
			}
		};
		return function(code) {
			return dataBase[currentLang][code];
		};
	})();

	var i, method, view, ok, cancel, down, up, keydown, keyup, callback, callbackFalse, callbackAlways, isDialog = false, keyArr = [], $ok, $cancel;

	// init 기능
	(function() {
		// 스크롤에 관련된 키보드 키를 배열에 넣음
		for(i=33; i<=40; i++) keyArr.push(i);
		for(i=97; i<=105; i++) keyArr.push(i);
		
		$(document).bind('wheel', function(e) {
			if(isDialog) e.preventDefault();
		}).bind('keydown', function(e) {
			if(isDialog) for(i=0; i<keyArr.length; i++) if(e.keyCode === keyArr[i]) e.preventDefault();
		});
	})();
	
	view = function(msg) {
		var t = [], marginTop, isLowIE, background;

		isLowIE = !(navigator.userAgent.indexOf('MSIE 7') === -1 && navigator.userAgent.indexOf('MSIE 8') === -1);
		background = isLowIE ? 'background-image:url('+(document.resources || '/resources')+'/mit-common/js/custom/images/midas.customUI.alpha.png)' : 'background:rgba(0,0,0,0.5)';

		t.push('<div id="wrapDialog" style="position:fixed;left:0;top:0;right:0;bottom:0;z-index:99999;'+background+'">');
		t.push('	<div id="Dialog" style="');
		t.push('		box-sizing:border-box;position:relative;margin-left:auto;margin-right:auto;padding:20px 20px 50px 20px;width:440px;');
		t.push('		background:#fbfbfb;border:1px solid #aaa;box-shadow:1px 3px 4px rgba(0,0,0,0.8);');
		t.push('		color:#000;');
		t.push('	">');
		t.push('		<p style="margin-bottom:26px;font-size:14px;">'+(msg === undefined ? '' : msg.replace(/\n/gi, '<br>'))+'</p>');
		t.push('		<div style="position:absolute;right:20px;bottom:20px;z-index:2;">');
		
		// 크롬 탭 width계산 버그로 탭을 앞으로 당김
		t.push('<button type="button" data-button="ok" style="');
		t.push('				position:relative;');
		t.push('				box-sizing:border-box;width:70px;height:30px;');
		t.push('				background:#f9f9f9;border:1px solid #bababa;box-shadow:1px 1px 1px rgba(0,0,0,0.15);');
		t.push('				color:#000;cursor:pointer');
		t.push('			">'+getText('confirm')+'</button>');
		if(method === 'confirm') {
			// 여기는 스페이스를 일부러 띄움
			t.push(' <button type="button" data-button="cancel" style="');
			t.push('			position:relative;');
			t.push('			box-sizing:border-box;width:70px;height:30px;');
			t.push('			background:#f9f9f9;border:1px solid #bababa;box-shadow:1px 1px 1px rgba(0,0,0,0.15);');
			t.push('			color:#000;cursor:pointer');
			t.push('		">'+getText('cancel')+'</button>');
		}
		t.push(' <button type="button" style="'); // 포커스 차단을 위한 더미 버튼
		t.push('				overflow:hidden;position:absolute;right:20px;bottom:20px;z-index:1;width:0px;height:0px;opacity:0;cursor:pointer');
		t.push('			"></button>');
		t.push('		</div>');
		t.push('	</div>');
		t.push('</div>');
		
		$('body').append(t.join(''));
		
		marginTop = ((window.innerHeight - $('#Dialog').height()) / 2) - 100;
		$('#Dialog').css({marginTop : marginTop+'px'});
		$ok = $('#Dialog button[data-button="ok"]');
		$cancel = $('#Dialog button[data-button="cancel"]');
		$ok.focus().click(ok)
			.bind('mousedown', down)
			.bind('mouseup mouseout', up)
			.bind('keydown', keydown)
			.bind('keyup', keyup)
			.bind('contextmenu', function() { return false; });

		$cancel.click(cancel)
			.bind('mousedown', down)
			.bind('mouseup mouseout', up)
			.bind('keydown', keydown)
			.bind('keyup', keyup)
			.bind('contextmenu', function() { return false; });
		$('#wrapDialog').bind('contextmenu', function() { return false; })
			.click(function() {
			$ok.focus();	
		});
		
		isDialog = true;
	};
	
	down = function(e) {
		e.target.style.left = '1px',
		e.target.style.top = '1px';
	};
	
	up = function(e) {
		e.target.style.left = '0px',
		e.target.style.top = '0px';
	};

	keydown = function(e) {
		var type = $(this).attr('data-button');

        e.stopPropagation();
		
		if(e.keyCode === 9) {
			e.preventDefault();
			(method === 'confirm' && type === 'ok') ? $cancel.focus() : $ok.focus(); // 탭
		}
		if(e.keyCode === 32) down(e); // 스페이스
		if(e.keyCode === 13) type === 'ok' ? ok() : cancel(); // 엔터
		if(e.keyCode === 27) method === 'alert' ? ok() : cancel(); // ESE
		if((e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) && method === 'confirm') type === 'ok' ? $cancel.focus() : $ok.focus();
	};

	keyup = function(e) {
		var type = $(this).attr('data-button');
		if(e.keyCode === 32) {
			up(e);
			method === 'alert' ? ok() : type === 'ok' ? ok() : cancel();
		}
	};

	cancel = function() {
		$('#wrapDialog').remove();
		isDialog = false;
		if(typeof callbackFalse === 'function') callbackFalse();
        if(typeof callbackAlways === 'function') callbackAlways();
	};

	ok = function() {
		$('#wrapDialog').remove();
		isDialog = false;
		if(typeof callback === 'function') callback();
        if(typeof callbackAlways === 'function') callbackAlways();
	};

	return function(dialog, msg, fnTrue, fnFalse, fnAlways) {
		if(isDialog) return false;
		method = dialog;
		callback = typeof fnTrue === 'function' ? fnTrue : null;
		if(dialog === 'confirm') callbackFalse = typeof fnFalse === 'function' ? fnFalse : null;
        if(dialog === 'confirm') callbackAlways = typeof fnAlways === 'function' ? fnAlways : null;
        view(msg);
	};
})();

var Alert = function(msg, callback) {
	CustomDialog('alert', msg, callback);
};

var Confirm = function(msg, callback, callbackFalse, callbackAlways) {
	CustomDialog('confirm', msg, callback, callbackFalse, callbackAlways);
};