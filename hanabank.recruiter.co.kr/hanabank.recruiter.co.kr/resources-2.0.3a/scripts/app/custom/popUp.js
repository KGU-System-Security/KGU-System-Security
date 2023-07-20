'use strict';

var popUp = (function() {
	var fn, url='/app/noticePopup/';

	fn = {
		init : function(mode) {
			switch(mode) {
			case 'main' : url += 'getMain'; break;
			case 'resumeStart' : url += 'getResumeStart'; break;
			case 'resumeEnd' : url += 'getResumeEnd'; break;
			default : throw new Error('올바른 Mode를 입력하세요.');
			}
			fn.load();
		},
		load : function() {
			if($('body').hasClass('edit')) return false; // 편집모드는 띄우지 않음
			$.ajax({
				type: 'post', dataType: 'json',
				url: url,
				async: false
			}).done(function(data, e) {
				var i;
				for(i=0; i<data.noticePopupVOList.length; i++) fn.template(data.noticePopupVOList[i]);
				fn.event();
			});
		},
		event : function() {
			$('button[data-button="closePopup"]').click(function() {
				var $popup, popupSn;
				$popup= $(this).closest('div[data-popup]');
				popupSn = $popup.find('input[name="popupCookie"]:checked').val();
				
				if(popupSn) fn.setCookie(popupSn);
				$popup.remove();
			});
		},
		template : function(d) {
			var t = [], disabledSn, i;
			
			// 다시 이창을 열지 않기 설정된 쿠키 적용
			disabledSn = D.cookie.fn.getArray('popupSn');
			for(i=0; i<disabledSn.length; i++) if(Number(disabledSn[i]) === d.popupSn) return false;

            t.push('<div data-popUp class="oldPopup" id="NoticepopUp" style="width:' + (d.widthSize < 200 ? 200 : d.widthSize) +'px; height:' + (d.heightSize < 200 ? 200 : d.heightSize) + 'px; left:' + d.leftPosition + 'px; top:' + d.topPosition + 'px">');
            if(d.imageUploadYn) { // 이미지
                if(d.imageLinkUrl) t.push('<a href="' + d.imageLinkUrl + '" target="_blank">');
                t.push('<img src="'+d.imageFileUrl+'" alt="" style="display:block" />');
                if(d.imageLinkUrl) t.push('</a>');
            } else {
                t.push(d.contents);
            }
            t.push('	<div id="NoticepopUpclose"><label style="font-size:13px;"><input type="checkbox" class="checkbox" name="popupCookie" value="'+d.popupSn+'" style="height:inherit;margin:-2px 0 0;vertical-align:middle;"/><span class="label"></span> 다시 이 창을 열지 않기</label>');
            t.push('	<button type="button" data-button="closePopup">닫기</button></div>');
            t.push('</div>');
            $('body').append(t.join(''));
		},
		setCookie : function(sn) {
			if(!sn) throw new Error('popupSn이 없습니다.');
			D.cookie.fn.setUpdate('popupSn', sn); 
		}
	};
	
	return {
		init : fn.init
	};
})();