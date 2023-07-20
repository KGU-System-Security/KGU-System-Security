'use strict';

var TypeCommon = {
	setFont : function() {
		$('body').addClass(Data.view.companyInfo.fontClass);
	},
	setColor : function() {
		$('body').addClass(Data.view.companyInfo.colorClass).attr('data-skin', Data.view.companyInfo.colorClass);
	},
	loadSub : function() {
		var menuSn = Data.depth3Sn > 0 ? Data.depth3Sn : Data.depth2Sn;
		var headerContent = '';
		var arrTemp = [], arrHeader = [], arrContent = [], arrLabel = [];
		var content;
		switch(menuSn) {
			case '9999' : // 개인정보처리방침
				headerContent = Data.privacyInfo.headerContents;
				break;
			default :
				headerContent = Data.getMenu(menuSn).headerContents;
				break;
		}

		content = Data.getMenu(menuSn).contents;
		$('#saveArea').html(headerContent+content);
        if(LoadNaverMap)LoadNaverMap(); // 네이버지도 로드
		
		if(Data.specialCode) { // 특수 페이지 저장 ex) 개인정보수집동의
			switch(Data.specialCode) {
			case 9997 :
				arrTemp = Data.view.privacyAgreeInfo.contents.split(Data.spliter2);
				arrContent = arrTemp[0].split(Data.spliter);
				
				$('div[data-saveType="privacyAgree"]').each(function(index) {
					if(arrContent[index]) {
						$(this).html(arrContent[index]);
					}
				});
				if(arrTemp.length > 1) {
					arrHeader = arrTemp[1].split(Data.spliter);
					$('h2[data-saveType="privacyAgreeHeader"]').each(function(index) {
						if(arrHeader[index]) {
							$(this).html(arrHeader[index]);
						}
					});
				}
				if(arrTemp.length > 2) {
					arrLabel = arrTemp[2].split(Data.spliter);
					$('span[data-saveType="privacyAgreeLabel"]').each(function(index) {
						if(arrLabel[index]) {
							$(this).html(arrLabel[index]);
						}
					});		
				}
				break;
			}
		}
	}
};