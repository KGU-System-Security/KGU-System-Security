var Common = (function() {

    return {

    }
})();


/********************************************************************************************
천단위 콤마
********************************************************************************************/
var comma = function(data) {
	data = ""+data; // 숫자형을 문자형으로 변경
	return data.replace(/(\d)(?=(\d\d\d)+$)/g , '$1,'); // 천단위 콤마찍고 리턴
};
var unComma = function(data) {
	return data.replace(/(,)/g, ''); // 천단위 콤마없애고 리턴
};

/********************************************************************************************
Button Href 연결
********************************************************************************************/
(function($) {
$(function() {
	$("button[data-href]").click(function(e) {
		e.preventDefault();
		var href = $(this).attr("data-href");
		var target = $(this).attr('data-target');
		if(href == "back") {
			Confirm('이전 화면으로 돌아가시겠습니까?', function() {
				history.back(-1);
			});
		} else if (target="_blank") {
			window.open(href);
		} else if(href) {
			location.href = href;
		}
	});
});
})(jQuery);

/********************************************************************************************
달력 설정
********************************************************************************************/
(function() {
$(function() {

	$.datepicker.regional['ko'] = {
		closeText: '닫기',
		prevText: '이전달',
		nextText: '다음달',
		currentText: '오늘',
		monthNames: ['1월', '2월', '3월', '4월', '5월', '6월',
		'7월', '8월', '9월', '10월', '11월', '12월'],
		monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월',
		'7월', '8월', '9월', '10월', '11월', '12월'],
		dayNames: ['일', '월', '화', '수', '목', '금', '토'],
		dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		weekHeader: 'Wk',
		dateFormat: 'yy-mm-dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: '년'
	};
	//jQuery-ui의 datapicker기능에 위에서 만든 한국어 기능 추가
	$.datepicker.setDefaults($.datepicker.regional['ko']);

});
})(jQuery);


/********************************************************************************************
팝업 설정
********************************************************************************************/
(function() {
$(function() {
	$(document).on("click", "button[data-pop], input[data-pop]", function(e) {
		var code = $(this).attr("data-pop");
		var index = $(this).attr("data-index");
		var width = $(this).attr("data-pop-width");
		var height = $(this).attr("data-pop-height");
		var skin = $('body').attr('data-skin');
		var type = $('#settingType').val();
		width = width ? width : 500; // 넓이설정이 없으면 500이 기본
		height = height ? height : 360; // 높이설정이 없으면 360이 기본
		var pop = window.open("/com/code/"+code+"?index="+index+"&type="+type+"&skin="+skin, "applicantPopup", "width="+width+",height="+height+",resizable=0");
		pop.focus();
	});
	$(document).on('click', 'button[data-button=uploadPhoto]', function() {
		var skin = $('body').attr('data-skin');
		var type = $('#settingType').val();
		var pop = window.open("/app/applicant/uploadPhoto?&type="+type+"&skin="+skin,"uploadPhoto","width=500,height=350,resizable=0");
		pop.focus();
	});
	$("input[data-pop]").each(function() {
		$(this).prop({readonly:true});
	});
});
})(jQuery);

/********************************************************************************************
가이드 팝업
********************************************************************************************/
(function() {
$(function() {
	$(".btn-guide").click(function(e) {
		$(this).next().stop().slideDown("fast").addClass("active");
	});
	$(document).mousedown(function(e) {
		var hasClass = $(e.target).hasClass("guide");
		if(!hasClass) {
			$("div.guide.active").fadeOut();
		}
	});
});
})(jQuery);

/********************************************************************************************
Ajax 로딩이미지
********************************************************************************************/
var loading = {
	show : function() {
		$("body").append("<div id='loading' style='line-height:"+$(window).height()+"px'><img src='"+(document.resources || "/resources")+"/images/ajaxLoading.gif' alt='loading' /></div>");
	},
	hide : function() {
		$("#loading").remove();
	}
};


/********************************************************************************************
레이어팝업공지
********************************************************************************************/
var notice = {
	show : function() {
		var tag = [];
		tag.push('<div id="notice">');
		tag.push('	<h1>대졸공채 이력서 접수기간 연장안내</h1>');
		tag.push('	<h2>안녕하십니까?<br/>마이다스아이티 인사기획팀입니다.</h2>');
		tag.push('	<p>당사 2015년 대졸신입공채에 지원해 주신 모든 분들께 감사 드리며,<br/>지원서 접수 시간 연장에 대해 안내 드립니다.</p>');
		tag.push('	<p>당사의 2015년 대졸신입공채 지원서 접수 기한은<br/><strong>2014년 9월 25일(목) 18:00까지 였으나</strong><br/>접수 마감기한을 즈음하여 동시 접속자 수의 급속한 증가로 인한<br/>서버 속도의 현저한 저하로 입사지원서 제출이 원활하지 않았습니다.<br/>이에 따라 지원서 접수를 <strong>2014년 9월 25(목) 자정까지 연장 운영</strong>하고자 하니<br/>입사지원에 참조하여 주시기 바랍니다.</p>');
		tag.push('	<p>현재 서버 복구 및 증설을 완료하였지만 지원서 접수 마감 당일에는<br/>지원자가 몰려 접속 장애가 재발생할 수 있음을 감안하시어 가능한<br/><strong>마감 전 여유 시간을 두고 지원서 제출을 부탁 드립니다.</strong></p>');
		tag.push('	<p>지원자 여러분께 큰 불편을 끼쳐 드려 죄송합니다.</p>');
		tag.push('	<p>감사합니다.</p>');
		tag.push('	<div class="btn-set"><button type="button" class="btn btn-small btn-primary" onclick="notice.hide();">확인</button></div>');
		tag.push('</div>');
		$("body").append(tag.join(""));
	},
	hide : function() {
		$("#notice").hide();
	}
};

/********************************************************************************************
Checkbox 전체선택
********************************************************************************************/
$(function() {
	// Name 선택형
	$(document).on("click", "input[type=checkbox][data-check-all]", function(index) {
		var name = $(this).attr("data-check-all");
		var checked = $(this).prop("checked");

		// 배열객체를 선택해야 할 경우가 있기 때문에 ^= 로 작업하였음('해당 name으로 시작하는' 이란 의미)
		if(!name) {return false;}
		$("input[type=checkbox][name^="+name+"]").each(function() {
			if($(this).closest('tr').css('display') != 'none' && $(this).prop('disabled') == false) { // 숨겨진 tr은 무시함
				$(this).prop("checked",checked);
			}
		});

		// 체크박스를 해제하면 전체선택 체크도 해제
		$("input[type=checkbox][name^="+name+"]:checked").click(function(e) {
			var checked = $(this).prop("checked");
			if(!checked) {
				$("input[type=checkbox][data-check-all="+name+"]").prop("checked",false);
			}
		});
	});
});

/********************************************************************************************
페이징 유틸
********************************************************************************************/
//
/*
 * Paging Util
 */
var MRS = MRS || {};

/* Paging Module
 * use : MRS.PagingUtil.initialize(페이징정보객체(initialize 참조), 페이징태그가 들어갈 위치의 jQuery 셀렉터, function(index) {
 *		//페이징 버튼을 눌렀을 때 실행할 콜백
 *		//index : 페이징 번호
 *		}).generatePagingTag();
 */
MRS.PagingUtil = (function() {
	var PagingUtil = {};

	/**Field Summary*/
	var pageSize = 0;
	var blockSize = 0;
	var currentPage = 0;
	var skipRows = 0;
	var maxRows = 0;
	var recordCount = 0;
	var lastPage = 0;
	var pagingExeFn = {};
	var $pageingParent = '';

	//Temp variable
	var _tag = [];


	/** Method Summary */
	//init
	PagingUtil.initialize = function(pagingInfoJSON, pagingParent, _pagingExeFn) {
		pageSize = Number(pagingInfoJSON.pageSize) || 10;
		blockSize = Number(pagingInfoJSON.blockSize) || 10;
		currentPage = Number(pagingInfoJSON.currentPage) || 1;
		skipRows = Number(pagingInfoJSON.skipRows) || 0;
		maxRows = Number(pagingInfoJSON.maxRows) || 0;
		recordCount = Number(pagingInfoJSON.recordCount) || 0;
		lastPage = Number(pagingInfoJSON.lastPage) || 1;
		pagingExeFn = _pagingExeFn;
		$pagingParent = $(pagingParent);

		return this;
	};

	//get block zend page
	var getBlockStartPage = function(iCurrentPage) {
		var _num = 1;
		_num = (Math.floor((iCurrentPage - 1) / blockSize)) * blockSize + 1;
		return _num;
	};

	//get block end page
	var getBlockEndPage = function(iCurrentPage) {
		var _num = 1;
		_num = getBlockStartPage(iCurrentPage) + (blockSize - 1) ;
		if (_num> lastPage) _num= lastPage;
		return _num;
	};

	//get next block start page
	var getNextBlockStartPage = function(iCurrentPage) {
		var _num = 1;
		_num = (Math.floor(((iCurrentPage - 1) + blockSize) / blockSize)) * blockSize + 1;
		return _num;
	};

	//get next block start page
	var getPrevBlockStartPage = function(iCurrentPage) {
		var _num = 1;
		_num = (Math.floor(((iCurrentPage - 1) - blockSize) / blockSize)) * blockSize + 1;
		return _num;
	};

	//Generate Paging tag
	PagingUtil.generatePagingTag = function() {
		$pagingParent.off('click').on('click', 'button[pageIndex], a[pageIndex]', function(evt) {
			evt.preventDefault();
			pagingExeFn($(this).attr('pageIndex'));
		});

		_tag = [];
		if ( lastPage > 1 ) {
			_tag.push('<button type="button" class="btn btn-paging btn-small btn-circle fa fa-angle-double-left" pageIndex="1"></button>');
		}

		//이전 블럭으로 이동
		if ( currentPage > blockSize ){
			_tag.push('<button type="button" class="btn btn-paging btn-small btn-circle fa fa-angle-left" pageIndex="'+getPrevBlockStartPage(currentPage)+'"></button>');
		}
		_tag.push('<ul>');

		//페이지 리스트
		for(var i = getBlockStartPage(currentPage); i <= getBlockEndPage(currentPage); i++) {
			if ( i === currentPage ) _tag.push('<li><a href="#" class="active">'+i+'</a></li>');
			else _tag.push('<li><a href="#page'+i+'" pageIndex="'+i+'">'+i+'</a></li>');
		}

		_tag.push('</ul>');
		//다음 블럭으로 이동
		if ( getNextBlockStartPage(currentPage) <= lastPage ){
			_tag.push('<button type="button" class="btn btn-paging btn-small btn-circle fa fa-angle-right"  pageIndex="'+getNextBlockStartPage(currentPage)+'"></button>');
		}

		if(lastPage > 1) {
			_tag.push('<button type="button" class="btn btn-paging btn-small btn-circle fa fa-angle-double-right"  pageIndex="'+lastPage+'"></button>');
		}
		$pagingParent.html(_tag.join(''));
	};

	PagingUtil.currentPageIndex = function() {
		return currentPage;
	}

	return PagingUtil;
})();

/****************************
 *  MRS-관리자용 summernote 공통함수
 *  jquery.midasit.common.js 의 editor를 쓰지 않고 이 함수를 통해서 만들도록 한다.
 ****************************/
$.fn.mrsEditor=function(options, callback){
	options=options||{}; // 옵션이 없으면 빈객체 할당
	options.imageUploadUrl = options.imageUploadUrl || '/com/attachFile/uploadImageFile';
	options.imageUploadSizeLimit = options.imageUploadSizeLimit || 1024*1024*4;
	options.imageUploadFail = options.imageUploadFail || ajaxOnfail;
	options.onError=Alert;
	return $.fn.editor.call(this,options,callback)
};


/**********************
 ajax fail 했을 때 후처리
 Common.ajaxOnfail은 2.0 방식인데 1.0에서도 이렇게 호출해서 오류가 남.
 일단 버그 픽스가 급해서 1.0 common.js 에서 이 함수(Common.ajaxOnfail) 를 만들었다. #4670 [1.0]MRS-inSight 지원자 등록 이슈
 이번 반영끝나면 다 Common. ~~ 하는 방식으로 바꿔야할듯하다
 ************************/

Common.ajaxOnfail = (function(x, e){
    var statusCode = x.status;
    switch(statusCode){
        case 901 :
            Alert(x.responseText, function(){
                location.href = '/cus/login';
            });
            break;
        case 999 :
            Alert(x.responseText);
            break;
        default :
            Alert('처리중 오류가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
    }
});
