'use strict';

/*************************************************
 *  Type와 관련있는 UI전용파일 (빌더관련 파일은 /builder/builder-type-D.js에 작업)
 *  init() : 초기화
 *  loadMenu() : 메뉴 로드
 *  loadBreaCrumb() : 메뉴1>메뉴2>메뉴3 로드
 *  loadCommon() : 공통으로 사용하는 부분 리턴(type-A-main.js에서 호출)
 *  loadSub() : 서브컨텐츠 로드
 *  bindEventMenu() : 상단메뉴이벤트 바인딩
 ************************************************/

var TypeG = {
	init : function() {
		TypeG.loadMenu();
		TypeG.loadBreadCrumb();
		TypeCommon.loadSub();
		TypeG.loadFooter();
		TypeG.bindEventMenu();
	},
	loadMenu : function() {
		if(Data.depth3Sn > 0) {
			$('#header').addClass('hasDepth3');
		}

		$('#header').html(TypeG.loadCommon());
	},
	loadBreadCrumb : function() { // 빌더에서 사용하기 때문에 반드시 있어야 하는 함수
		var depth1Name = Data.getMenu(Data.depth1Sn).menuName;
		var depth2Name = Data.getMenu(Data.depth2Sn).menuName;
		var depth3Name;
		var tag = [];

		// 서브에서만 작동
		if(!$('body').hasClass('sub')) return false;
		if(!depth1Name || !depth2Name) return false;
		tag.push(depth1Name+' > '+depth2Name);

		if(Data.depth3Sn > 0) {
			depth3Name = Data.getMenu(Data.depth3Sn).menuName;
			tag.push(' > '+depth3Name);
		}

		$('#breakcrumb').html(tag.join(''));
	},
	loadCommon : function() { // 공용으로 사용하는 부분을 불러오는 메소드
		var view = Data.view, isBlank;
		var menu = view.menuList;
		var menu2;
		var menu3 = {};
		var tag = [];
		var i, j, k;

		view.logoInfo = view.logoInfo || {};

		tag.push('<div class="wrapHeader">');
		tag.push('<h1 id="logo" class="logo" data-modal="logo" data-imageSn="'+view.logoInfo.imageSn+'">');
		tag.push('	<a href="/appsite/company/index"><img src="'+view.logoInfo.imagePath+'" width="150" height="50" class="block" alt="'+view.logoInfo.imageExplanation+'" onerror="this.src=\''+(document.resources || '/resources')+'/images/appsite/noLogo_login.png\'" /></a>');
		tag.push('</h1>');

		tag.push('		<nav>');
		tag.push('			<ul id="dataMainMenu"">');

		for(i=0; i<menu.length; i++) {
			if(menu[i].useYn === 1) {
				tag.push('		<li '+(i===0?'class="none"':'')+'>');
				tag.push('			<a href="'+Data.getUrl(menu[i].menuSn)+'" class="'+(Data.depth1Sn === menu[i].menuSn ? 'active':'')+'" '+(Data.getLinkKindCode(menu[i].menuSn)===5 || menu[i].menuCode === '2000' ? 'target="_blank"' : '')+'>'+menu[i].menuName+'</a>');
				menu2 = menu[i].childMenuList;
				tag.push('			<ul class="subMenu">');
				for(j in menu2) {
					if(menu2[j].useYn === 1) {
						tag.push('		<li class="'+(Data.depth2Sn === menu2[j].menuSn ? 'active':'')+'">');
						if(menu2[j].childMenuList.length > 0) {
							menu3 = menu2[j].childMenuList;
							tag.push('		<span>'+menu2[j].menuName+'</span>');
							tag.push('		<ul class="depth3">');
							for(k in menu3) {
                                if(menu3[k].useYn === 1) {
									tag.push('		<li class="'+(Data.depth3Sn === menu3[k].menuSn ? 'active':'')+'"><a href="'+Data.getUrl(menu3[k].menuSn)+'" '+(Data.getLinkKindCode(menu3[k].menuSn)===5? 'target="_blank"' : '')+'>'+menu3[k].menuName+'</a></li>');
                                }
							}
							tag.push('		</ul>');
						} else {
							isBlank = (Data.getLinkKindCode(menu2[j].menuSn)===5 || menu2[j].menuCode === '2200' || menu2[j].menuCode === '2800' || menu2[j].menuCode === '2100' || menu2[j].menuCode === '2700') ? true : false;
							tag.push('			<a href="'+Data.getUrl(menu2[j].menuSn)+'" '+(isBlank ? 'target="_blank"' : '')+'>'+menu2[j].menuName+'</a>');
						}
						tag.push('		</li>');
					}
				}
				tag.push('			</ul>');
				tag.push('		</li>');
			}
		}
		tag.push('			</ul>');
		tag.push('		</nav>');

		tag.push('</div>');

		if(Data.isMain) { // 메인이면 슬라이드 노출
            tag.push('<div id="imgArea" class="layoutMain" data-modal="slider" data-width="1920" data-height="520">');
            tag.push('	<div id="slider" class="slider">');
            tag.push(Slider.install(1920, 520));
            tag.push('	</div>');
            tag.push('</div>');
		} else { // 서브면 배경 노출
			tag.push('<div id="background" data-modal="background" data-width="1920" data-height="300" style="background-image:url('+Data.view.companyInfo.subHeaderImagePath+')"></div>');
		}

		return tag.join('');
	},
	loadFooter : function() {
		var view = Data.view;
		var tag = [];
		var contact = view.companyInfo;

		tag.push('<div id="wrapFooter" class="wrapFooter">');
		tag.push('	<footer>');
		tag.push('		<a href="/appsite/company/callPage?url=etc/privacyPolicyPopup&type='+Data.settingType+'" class="linkPrivacy">개인정보 처리방침</a>');
		tag.push('		<a href="/appsite/company/callPage?url=etc/popRejectEmail&cSn='+Data.companySubjectSn+'&aSn='+Data.appsiteSn+'&type='+Data.settingType+'" target="_blank" data-modal="rejectEmailCollect" id="rejectEmail">이메일무단수집거부</a>');
		tag.push('		<p data-textedit data-quickMenuSn="'+view.quickMenuList[6].quickMenuSn+'">'+view.quickMenuList[6].explanation+'</p>');
		if(Data.isBuilder || (!Data.isBuilder && (contact.telephone || contact.fax || contact.email))) { // 빌더이거나 빌더가 아닐 경우 전화/팩스/이메일 중 하나라도 있으면 나옴
			tag.push('	<address>');
			if(Data.isBuilder || (!Data.isBuilder && (contact.telephone))) { // 전화를 사용할 경우 전화가 나온다.
				tag.push('	<span class="title">전화</span>');
				tag.push('	<span class="content"><span data-textedit data-companyInfo="telephone">'+contact.telephone+'</span> '+(Data.isBuilder || (!Data.isBuilder && (contact.fax)) ? '/ 팩스 <span data-textedit data-companyInfo="fax">'+contact.fax+'</span></span><br/>' : ''));
			} else if(!Data.isBuilder && (contact.fax)) { // 빌더가 아니고 전화없이 팩스만 있을 경우 팩스만 나온다.
				tag.push('	<span class="title">팩스</span>');
				tag.push('	<span class="content"><span data-textedit data-companyInfo="fax">'+contact.fax+'</span></span><br/>');
			}

			if(Data.isBuilder || (!Data.isBuilder && (contact.email))) { // 전화를 사용할 경우 전화가 나온다.
				tag.push('	<span class="title">이메일</span>');
				tag.push('	<span class="content"><span data-textedit data-companyInfo="email">'+contact.email+'</span></span>');
			}
			tag.push('	</address>');
		}
		tag.push('	</footer>');
		tag.push('</div>');

		$('#wrap').append(tag.join(''));
	},
	bindEventMenu : function() {
		var showMenu = function(_this) {
			$('nav ul.subMenu').stop().slideUp();
			$(_this).next().stop().slideDown('fast');
		};

		var hideMenu = function(_this) {
			$('nav ul.subMenu').stop().slideUp();
		};

		//Jobflex연동
		$(document).on('click', 'a[href="/app/applicant/registResume"]', function (e) {
			e.preventDefault();
			return false;
		});

		$(document).on('click', 'a[href="/app/applicant/modifyResume"]', function (e) {
			e.preventDefault();
			return false;
		});

		$(document).on('mouseenter', '#dataMainMenu>li>a', function(e) {
			e.preventDefault();
			showMenu(this);
		}).on('focus', '#dataMainMenu>li>a', function(e) {
			e.preventDefault();
			showMenu(this);
		}).on('mouseleave', '#dataMainMenu>li', function(e) {
			e.preventDefault();
			hideMenu(this);
		}).on('blur', '#dataMainMenu .subMenu>li:last-child>a', function(e) {
			e.preventDefault();
			hideMenu(this);
		});
	}
};

// 화면이 로딩된 후 실행
$(function() {
	TypeG.init();
});
