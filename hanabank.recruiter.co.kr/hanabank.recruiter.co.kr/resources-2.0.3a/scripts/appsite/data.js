'use strict';

/*******************************************************************************
 *  백앤드에서 주는 Data와 관련있는 파일
 *  Ajax로 오는 모든 데이터는 이곳에서 처리함
 *  companySubjectSn : 회사 고유키
 *  appsiteSn : 사이트 고유키
 *  menuSn : 현재 페이지 메뉴 고유키
 *  settingType : 현재 선택한 레이아웃 타입
 *  view : Ajax로 불러온 데이터를 저장할 변수
 *  init() : 초기화
 *  loadData() : view에 담을 데이터를 Ajax로 불러올 함수
 *  getMenu() : menuSn을 넣으면 해당 메뉴 데이터를 리턴
 *  getUrl() : menuSn을 넣으면 getMenu()데이터 중 url만 리턴
 *  getChildUrl() : getUrl()에서 하위 자식을 찾는 재귀함수(직접 사용하지 않음)
 *  setInputData() : menuSn에서 menuCode 기반으로 메뉴키가 변경되면서 menuCode로 menuSn을 구하는 함수 추가
 *  setMeta() : head>title과 meta를 웹접근성과 SEO에 맞게 설정(Data객체 성격에는 맞지 않지만 따로 갈 곳이 없어 작업함)
 *******************************************************************************/



/*******************************************************************************
 *  Type A,B,C 등의 객체를 받아 다른 파일에서 사용할 수 있게 해줌
 *  이걸 실행하면 초기에 실행되는 setType()는 사라짐
 *  설마 N번째 타입이 생기진 않겠지!? ㄷㄷㄷㄷ
 *
 *  setType() : Data.settingType에 맞는 Type객체를 상속받음
 *******************************************************************************/
var Data;
var TypeN = {
	setType : function() {
		if(Data.settingType === 'A') {
			TypeN = TypeA;
		} else if(Data.settingType === 'B') {
			TypeN = TypeB;
		} else if(Data.settingType === 'C') {
			TypeN = TypeC;
		} else if(Data.settingType === 'D') {
			TypeN = TypeD;
		} else if(Data.settingType === 'E') {
			TypeN = TypeE;
		} else if(Data.settingType === 'F') {
			TypeN = TypeF;
		} else if(Data.settingType === 'G') {
			TypeN = TypeG;
		} else if(Data.settingType === 'H') {
			TypeN = TypeH;
		}
	}
};

var TypeNMain = {
	setType : function() {
		if(Data.settingType === 'A') {
			TypeNMain = TypeAMain;
		} else if(Data.settingType === 'B') {
			TypeNMain = TypeBMain;
		} else if(Data.settingType === 'C') {
			TypeNMain = TypeCMain;
		} else if(Data.settingType === 'D') {
			TypeNMain = TypeDMain;
		} else if(Data.settingType === 'E') {
			TypeNMain = TypeEMain;
		} else if(Data.settingType === 'F') {
			TypeNMain = TypeFMain;
		} else if(Data.settingType === 'G') {
			TypeNMain = TypeGMain;
		} else if(Data.settingType === 'H') {
			TypeNMain = TypeHMain;
		}
	}
};

/*******************************************************************************
 *  Data.view에 담긴 데이터의 일부만 업데이트하는 객체
 *  menu() : Data.view.menuList를 업데이트함
 *  slider() : Data.view.slideImageList를 업데이트함
 *******************************************************************************/
var Update = { // Data 객체의 일부만 갱신할 때 사용하는 객체
	menu : function() {
		// 사용할 데이터 로드
		$.ajax({
			type: 'POST', dataType: 'json', beforeSend : loading.show(),
			url: '/appsite/companyMenu/selectMenuList',
			async: false,
			data: {
				appsiteSn : Data.appsiteSn,
				settingType : Data.settingType
			}
		}).always(loading.hide).fail(ajaxOnfail)
		.done(function(data, e) {	// 대메뉴 로드
			Data.view.menuList = data; // 전체 데이터 객체 중 메뉴부분만 갱신
			$('#header').html(TypeN.loadMenu());
		});
	},
	slider : function() {
		// 사용할 데이터 로드
		$.ajax({
			type: 'post', dataType: 'json', beforeSend : loading.show(),
			url: '/appsite/companyContents/getSlideImageList',
			data: {
				appsiteSn : Data.appsiteSn
			}
		}).always(loading.hide).fail(ajaxOnfail)
		.done(function(data, e) {	// 대메뉴 로드
			var width = Number($('#imgArea').attr('data-width'));
			var height = Number($('#imgArea').attr('data-height'));

			// 전체 데이터 객체 중 메뉴부분만 갱신
			Data.view.slideImageList = data;

			// 슬라이더 갱신
			$('#slider').html(Slider.install(width, height));
			Slider.stop();
			Slider.init();
		});
	}
};

Data = {
	appsiteSn : Number($('#appsiteSn').val()),
	menuSn : 0, // 현재 선택된 메뉴의 고유값
	menuCode : 0, // 현재 페이지의 종류
	specialCode : 0, // 한 페이지에서 두 종류를 저장할 때 쓰는 코드 ex: 개인정보 수집 이용에 관한 동의
	depth1Sn : 0,
	depth2Sn : 0,
	depth3Sn : 0,
	settingType : $('#settingType').val(),
	settingSkin : '',
	isBuilder : D.bool($('#isBuilder').val()),
	isMain : $('body').hasClass('main'),
	spliter : '§§',
	spliter2 : '§§§§',
	jobdaLoginUrl : '',
	view : null, // Ajax로 불러온 데이터를 저장할 변수
	init : function() {
		Data.loadData();
		Data.setInputData();
		Data.setMeta();
		TypeN.setType();
		TypeNMain.setType();
		TypeCommon.setFont();
		TypeCommon.setColor();

		//Jobflex연동
		$(document).on('mousedown', 'a[href="/app/applicant/registResume"]', function (e) {
			e.preventDefault();
			// 오른쪽 마우스 클릭일 경우
			if (e.which === 3) {
				return;
			}
			window.open('/app/applicant/jobnotice/popupNoticeList/?applicantActionCode=SHOW_NOTICE', 'width=1000,height=600,scrollbars=yes,resizable=yes');
			return false;
		});

		$(document).on('mousedown', 'a[href="/app/applicant/modifyResume"]', function (e) {
			e.preventDefault();
			// 오른쪽 마우스 클릭일 경우
			if (e.which === 3) {
				return;
			}
			window.open('/app/applicant/jobnotice/popupNoticeList/?applicantActionCode=SHOW_NOTICE',  'width=1000,height=600,scrollbars=yes,resizable=yes');
			return false;
		});

		// a 태그의 기본 이벤트를 막고, window.open으로 잡다 로그인 사이트를 연다.
		$(document).on('click', 'a#jobdaLoginUrl', function(e) {
			e.preventDefault();
			window.open(Data.jobdaLoginUrl)
			return false;
		})
	},
	loadData : function() {
		// 사용할 데이터 로드
		$.ajax({
			type: 'post', dataType: 'json', beforeSend : loading.show(),
			url: '/appsite/company/getMainView',
			data: {
				appsiteSn : Data.appsiteSn,
				settingType : Data.settingType
			},
			async: false
		}).always(loading.hide).fail(ajaxOnfail)
		.done(function(data, e) {
			Data.view = data;
		});
	},
	getMenu : function(menuSn) { // menuSn을 이용하여 해당 객체를 리턴하는 메소드
		// param : menuSn
		// return : menuSn에 해당하는 menu 객체
		var menu = Data.view.menuList;
		var menu2, menu3, i, j, k;
		menuSn = Number(menuSn);
		for(i in menu) {
			if(menu[i].menuSn === menuSn) return menu[i];
			menu2 = menu[i].childMenuList;
			for(j in menu2) {
				if(menu2[j].menuSn === menuSn) return menu2[j];
				if(menu2[j].childMenuList !== undefined) {
					menu3 = menu2[j].childMenuList;
					for(k in menu3) {
						if(menu3[k].menuSn === menuSn) return menu3[k];
					}
				}
			}
		}
		return false;
	},
	getMenuSn : function(menuCode) { // menuCode를 받아 menuSn을 리턴하는 메소드
		var menu = Data.view.menuList;
		var menu2, menu3, i, j, k;
		switch(menuCode) {
		case 9997 : // 개인정보수집 및 이용에 관한 동의
			return Data.view.privacyAgreeInfo.menuSn;
		default :
			for(i in menu) { // 1뎁스
				if(menu[i].menuCode === menuCode) return menu[i].menuSn;
				menu2 = menu[i].childMenuList;
				for(j in menu2) { // 2뎁스
					if(menu2[j].menuCode === menuCode) return menu2[j].menuSn;
					menu3 = menu2[j].childMenuList;
					if(menu3.length > 0) { // 3뎁스
						for(k in menu3) {
							if(menu3[k].menuCode === menuCode) return menu3[k].menuSn;
						}
					}
				}
			}
			break;
		}

		return '';
	},
	getUrl : function(menuSn) { // 퀵메뉴 등에서 menuSn을 받아 해당 Url을 리턴하는 메소드
		// param : menuSn
		// return : url
		var menu, menu2, menu3, i, j, k;
		menu = Data.view.menuList;
		const { permanentJobNotice } = Data.view;
		for(i in menu) { // 1뎁스
			if(menu[i].menuSn === menuSn) {
				if(menu[i].url !== '' && menu[i].useYn === 1) {
					// 잡다 계약 당시 공고이면서 빌더에서 url 변경을 하지 않은 경우
					if(permanentJobNotice.contractSubjectType === 'JOBDA' && menu[i].url === '/app/applicant/alwaysRegistResume') {
						Data.jobdaLoginUrl = Data.getPermanentUrl();
						// href 태그를 닫고, id를 달아 이벤트를 연결함
						return `"id="jobdaLoginUrl"`;
					} else {
						return menu[i].url;
					}
				}

				return Data.getChildUrl(menu[i].childMenuList);
			}
			menu2 = menu[i].childMenuList;
			for(j in menu2) { // 2뎁스
				if(menu2[j].menuSn === menuSn) {
					if(menu2[j].url !== '' && menu2[j].useYn === 1) {
						if(permanentJobNotice.contractSubjectType === 'JOBDA' && menu2[j].url === '/app/applicant/alwaysRegistResume') {
							Data.jobdaLoginUrl = Data.getPermanentUrl();
							return `"id="jobdaLoginUrl"`;
						} else {
							return menu2[j].url;
						}
					}

					return Data.getChildUrl(menu2[j].childMenuList);
				}
				menu3 = menu2[j].childMenuList;
				if(menu3 !== undefined) { // 3뎁스
					for(k in menu3) {
						if(menu3[k].menuSn === menuSn && menu3[k].useYn === 1) {
							if(permanentJobNotice.contractSubjectType === 'JOBDA' && menu3[k].url === '/app/applicant/alwaysRegistResume') {
								Data.jobdaLoginUrl = Data.getPermanentUrl();
								return `"id="jobdaLoginUrl"`;
							} else {
								return menu3[k].url;
							}
						}
					}
				}
			}
		}
		return '';
	},
	getPermanentUrl : function () {
		const { permanentJobNotice } = Data.view;
		const RESUME_DOMAIN = `/app/applicant/alwaysRegistResume&jobnoticeSn=${permanentJobNotice.jobnoticeSn}`;
		const JOBDA_DOMAIN = $('#jobdaDomain').val();
		const APPLY_START_DATE = `${permanentJobNotice.applyStartDateStr}`;
		const APPLY_END_DATE = `${permanentJobNotice.applyEndDateStr}`;
		return `${JOBDA_DOMAIN}/jobflex/login?companyName=${Data.view.companyInfo.companyName}&jobNoticeName=${permanentJobNotice.jobnoticeName}&applyStartDate=${APPLY_START_DATE}&applyEndDate=${APPLY_END_DATE}&resumeDomain=${window.location.origin + RESUME_DOMAIN}&type=resume`;
	},
	getChildUrl : function(obj) { // getUrl에서 자신의 url이 없을 때 자식 url을 받는 재귀함수
		var i, j;
		for(i=0; i<obj.length; i++) {
			if(obj[i].useYn === 0) { // 해당 메뉴가 닫혀 있으면 나머지 메뉴 중 열린 녀석으로 주소를 줌
				if(i < obj[i].length-1) for(j=i+1; j<obj.length; j++) if(obj[j].useYn) return obj[j].url;
				else return '';
			} else if(obj[i].url !== '' && obj[i].useYn === 1) { // url이 있으면 바로 적용
				return obj[i].url;
            } else if(obj[i].childMenuList) { // 자식이 있다면 자식을 검색
                return Data.getChildUrl(obj[i].childMenuList);
			}
		}
	},
	getLinkKindCode : function(menuSn) { // 링크타입을 구하는 함수
		// param : menuSn
		// return : linkKindCode
		var menu = Data.view.menuList;
		var menu2, menu3, i, j, k;
		for(i in menu) { // 1뎁스
			if(menu[i].menuSn === menuSn) {
				if(menu[i].url !== '' && menu[i].useYn === 1) {
					return menu[i].linkKindCode;
				}

				return Data.getChildLinkKindCode(menu[i].childMenuList);
			}
			menu2 = menu[i].childMenuList;
			for(j in menu2) { // 2뎁스
				if(menu2[j].menuSn === menuSn) {
					if(menu2[j].url !== '' && menu2[j].useYn === 1) {
						return menu2[j].linkKindCode;
					}

					return Data.getChildLinkKindCode(menu2[j].childMenuList);
				}
				menu3 = menu2[j].childMenuList;
				if(menu3 !== undefined) { // 3뎁스
					for(k in menu3) {
						if(menu3[k].menuSn === menuSn && menu3[k].useYn === 1) {
							return menu3[k].linkKindCode;
						}
					}
				}
			}
		}
		return '';
	},
	getChildLinkKindCode : function(obj) { // getLinkKindCode에서 자신의 url이 없을 때 자식 linkKindCode을 받는 재귀함수
		var i;
		for(i in obj) {
            if(obj[i].url !== '' && obj[i].useYn === 1) { // url이 있으면 바로 적용
				return obj[i].linkKindCode;
            } else if(obj[i].childMenuList) { // 자식이 있다면 자식을 검색
                return Data.getChildLinkKindCode(obj[i].childMenuList);
			}
		}
	},
	setInputData : function() { // 데이터를 처리하는 기본 input을 셋팅
		var depth1Sn, depth2Sn, depth3Sn, menuSn;
		Data.menuCode = $('#depth3Code').val() ? $('#depth3Code').val() : $('#depth2Code').val();
		Data.specialCode = Number($('#specialCode').val());

		switch(Data.menuCode) {
		case '2100' : // 지원서 작성
		case '2200' : // 지원서 수정
		case '2300' : // 합격자 조회
		case '2400' : // 검사응시
		case '2500' : // 지원서 조회
			$('#headerTitle').val(Data.getMenu(Data.getMenuSn($('#depth2Code').val())).menuName);
			break;
		case '9999' : // 개인정보처리방침
			Data.view.menuList[0].childMenuList.push(Data.view.privacyInfo); // menuList home 밑에 삽입
			break;
		}
		depth1Sn = Data.getMenuSn($('#depth1Code').val());
		depth2Sn = Data.getMenuSn($('#depth2Code').val());
		depth3Sn = 0;
		if($('#depth3Code').size()) {
			depth3Sn = Data.getMenuSn($('#depth3Code').val());
			$('#depth3Sn').val(depth3Sn);
		}
		menuSn = depth3Sn > 0 ? depth3Sn :depth2Sn; // 3뎁스가 있으면 3뎁스 menuSn, 없으면 2뎁스 menuSn
		Data.menuSn = menuSn;
		Data.depth1Sn = depth1Sn;
		Data.depth2Sn = depth2Sn;
		Data.depth3Sn = depth3Sn;
	},
	setMeta : function() { // head>title을 웹접근성과 SEO에 맞게 설정
		var title = '';
		if(!$('body').hasClass('main')) { // 서브
			if(Data.depth3Sn) title = Data.getMenu(Data.depth3Sn).menuName+' | ';
			title = title + Data.getMenu(Data.depth2Sn).menuName+' | '+Data.getMenu(Data.depth1Sn).menuName+' | '+Data.view.companyInfo.companyName;
			title = title.replace(/&amp;/g, '&').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"");
			document.title = title;
		}
	}
};

// 화면 로딩 이전에 실행
Data.init();
