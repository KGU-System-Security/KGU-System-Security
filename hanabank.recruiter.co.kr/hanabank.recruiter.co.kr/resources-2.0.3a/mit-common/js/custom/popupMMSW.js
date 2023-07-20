'use strict';

var PopupMMSW = (function() { //MUSS에서 설정한 팝업 띄우기 /고유키 값은 noticeSn
	var fn;
	var facelift= false;
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
				'popup_once' : '오늘 하루 그만보기',
				'close' : '닫기'
			},
			ja : {
				'popup_once' : '今日はもう見ない',
				'close' : '閉じる'
			}
		};
		return function(code) {
			return dataBase[currentLang][code];
		};
	})();

	fn = {
		init : function(popupList) {
			fn.load(popupList);
		},
		load : function(popupList) {
			var i, data;
			if($('body').hasClass('edit')) return false; // 편집모드는 띄우지 않음
			data = popupList;
			for(i=0; i<data.length; i++) fn.template(data[i]);
			fn.event();
		},
		event : function() {
			$('button[data-button="closePopup"]').click(function() {
				var $popup, noticeSn;
				$popup= $(this).closest('div[data-popup]');
				noticeSn = $popup.find('input[name="popupCookie"]:checked').val();

				if(noticeSn) fn.setCookie(noticeSn);
				$popup.remove();
			});
		},
		template : function(d) {
			var t = [], disabledSn, i;

			// 오늘하루 그만보기 설정된 쿠키 적용
			disabledSn = D.cookie.fn.getArray('MMSWpopupSn');
			for (i = 0; i < disabledSn.length; i++) if (parseInt(disabledSn[i]) === d.noticeSn) return false;

			t.push('<div data-popUp class="popUp" style="width:' + (d.sizeX < 200 ? 200 : d.sizeX) + 'px;height:' + (d.sizeY < 200 ? 200 : d.sizeY) + 'px;left:' + d.positionX + 'px;top:' + d.positionY + 'px;'+(facelift? 'border-radius: 5px;border:1px solid #302E41;': '')+'">');
			if (d.imageContentsYn) { // 이미지
				if (d.imageLinkURL) t.push('<a href="' + d.imageLinkURL + '" target="_blank">');
				t.push('<img src="/' + d.imageContentsFilePath + d.imageContentsUID + '" alt="" style="display:block" />');
				if (d.imageLinkURL) t.push('</a>');
			} else { // 텍스트 에디터
				t.push(d.contents);
			}
			t.push('	<div class="close" style="'+(facelift? 'background:#302E41;': '')+'"><label style="'+(facelift? 'font-size:12px;': '')+'"><input type="checkbox" class="checkbox" name="popupCookie" value="' + d.noticeSn + '" /><span class="label"></span> ' + getText('popup_once') + '</label>');
			t.push('	<button type="button" data-button="closePopup" style="'+(facelift? 'width:50px;background:#00C17C;color:white;border:1px solid #00C17C;border-radius:5px;padding:1px;float:right;margin-right:10px;margin-top:6px;': '')+'">' + getText('close') + '</button></div>');
			t.push('</div>');

			$('#wrap').append(t.join(''));
		},
		setCookie : function(sn) {
			if(!sn) throw new Error('MMSWpopupSn이 없습니다.');
			D.cookie.fn.setUpdate('MMSWpopupSn', sn);
		}
	};

	return {
		init : function(popupList, faceliftProduct) {
			facelift = faceliftProduct;
			fn.init(popupList);
		}
	};
})();