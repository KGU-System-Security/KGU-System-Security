'use strict';

/*************************************************
 *  TypeN 메인과 관련있는 파일 (빌더관련 파일은 /builder/builder-type-G.js에 작업)
 ************************************************/
var TypeGMain = {
	init : function() {
		if(!$('body').hasClass('main')) { return false; }
		TypeGMain.loadMain();
	},
	getReplacedHTML : function(html) { //변수가 지저분해서 replace로 넣어주기로 했음
		var cnt = 0;
		var regex = /<\$tag\$(.*?)>(.*?)<\/\$tag\$>/gm; //<$tag$></$tag$> 파싱 attribute 부분과 content내용이 각각 $1, $2로 치환됨
        
		var defaultUrl = [
			'/appsite/company/callSubPage?code1=3000&code2=3100&code3=3110', // 회사소개
			'/appsite/company/callSubPage?code1=4000&code2=4200', // 인재상
			'/appsite/company/callSubPage?code1=3000&code2=3300', // 직무소개
            '/appsite/company/callSubPage?code1=1000&code2=1100', //채용 안내
			'/app/applicant/registResume', // 지원서 작성
			'/bbs/appsite/faq/list' // FAQ
		];

        html = html.replace(regex, function(match, attributes, contents, index, string) { //regex 일치하는 부분이 있을때마다 function을 호출, return 하는 string으로 치환됨
            var text = match;
            var currentMenu = Data.view.quickMenuList[cnt];
            text = text.replace(/\$tag\$/g, (Data.isBuilder ? 'div' : 'a'));
            text = text.replace(/\$title\$/g, currentMenu.title);
            text = text.replace(/\$quickMenuSn\$/g, currentMenu.quickMenuSn);
            text = text.replace(/\$explanation\$/g, currentMenu.explanation);
            text = text.replace(/\$imagePath\$/g, (currentMenu.imageVO ? currentMenu.imageVO.imagePath : ''));
            text = text.replace(/\$href\$/g, Data.getUrl(currentMenu.linkMenuSn) || defaultUrl[cnt]);

            text = text.replace(/\$target\$/g, (Data.getLinkKindCode(currentMenu.linkMenuSn)===5 ? 'target="_blank"' : ''));
            cnt++;
            return text;
        });

		return html;
	},
	loadMain : function() {
		var tag = [];
		var html = '';

		tag.push('<div id="wrap" class="main">');
		tag.push('  <header id="header" class="layoutMain clearfix">');
		tag.push(TypeG.loadCommon());
		tag.push('	</header>');
		tag.push('	<div class="wrapMainContent clearfix">');
		tag.push('      <div class="row no-margin">');
		tag.push('		    <$tag$ class="mainMenu mainMenu1-1" href="$href$" $target$>');
		tag.push('			    <h2 data-select class="mainH2" data-quickMenuSn="$quickMenuSn$">$title$</h2>');
		tag.push('				<hr class="gray-horizon"/>')
		tag.push('			    <p class="sub-title" data-textedit data-quickMenuSn="$quickMenuSn$">$explanation$</p>');
		tag.push('			    <div class="icon" data-modal="icon" data-quickMenuSn="$quickMenuSn$"><img src="$imagePath$" alt="" width="120" height="90" /></div>');
		tag.push('		    </$tag$>');
		tag.push('		    <$tag$ class="mainMenu mainMenu1-2" href="$href$" $target$>');
		tag.push('		    	<h2 data-select class="mainH2" data-quickMenuSn="$quickMenuSn$">$title$</h2>');
		tag.push('				<hr class="gray-horizon"/>')
		tag.push('		    	<p class="sub-title" data-textedit data-quickMenuSn="$quickMenuSn$">$explanation$</p>');
		tag.push('		    	<div class="icon" data-modal="icon" data-quickMenuSn="$quickMenuSn$"><img src="$imagePath$" alt="" width="120" height="90" /></div>');
		tag.push('		    </$tag$>');
		tag.push('		    <$tag$ class="mainMenu mainMenu1-3" href="$href$" $target$>');
		tag.push('		    	<h2 data-select class="mainH2" data-quickMenuSn="$quickMenuSn$">$title$</h2>');
		tag.push('				<hr class="gray-horizon"/>')
		tag.push('		    	<p class="sub-title" data-textedit data-quickMenuSn="$quickMenuSn$">$explanation$</p>');
		tag.push('		    	<div class="icon" data-modal="icon" data-quickMenuSn="$quickMenuSn$"><img src="$imagePath$" alt="" width="120" height="90" /></div>');
		tag.push('	    	</$tag$>');
		tag.push('	    </div>');
		tag.push('	    <div class="row">');
		tag.push('	    	<$tag$ class="mainMenu mainMenu1-4" href="$href$" $target$>');
		tag.push('	    		<h2 data-select class="mainH2" data-quickMenuSn="$quickMenuSn$">$title$</h2>');
		tag.push('				<hr class="gray-horizon"/>')
		tag.push('	    		<p class="sub-title" data-textedit data-quickMenuSn="$quickMenuSn$">$explanation$</p>');
		tag.push('	    		<div class="icon" data-modal="icon" data-quickMenuSn="$quickMenuSn$"><img src="$imagePath$" alt="" width="120" height="90" /></div>');
		tag.push('	    	</$tag$>');
		tag.push('	    	<$tag$ class="mainMenu mainMenu1-5" href="$href$" $target$>');
		tag.push('	    		<h2 data-select class="mainH2" data-quickMenuSn="$quickMenuSn$">$title$</h2>');
		tag.push('				<hr class="gray-horizon"/>')
		tag.push('	    		<p class="sub-title" data-textedit data-quickMenuSn="$quickMenuSn$">$explanation$</p>');
		tag.push('	    		<div class="icon" data-modal="icon" data-quickMenuSn="$quickMenuSn$"><img src="$imagePath$" alt="" width="120" height="90" /></div>');
		tag.push('	    	</$tag$>');
		tag.push('	    	<$tag$ class="mainMenu mainMenu1-6" href="$href$" $target$>');
		tag.push('	    		<h2 data-select class="mainH2" data-quickMenuSn="$quickMenuSn$">$title$</h2>');
		tag.push('				<hr class="gray-horizon"/>')
		tag.push('	    		<p class="sub-title" data-textedit data-quickMenuSn="$quickMenuSn$">$explanation$</p>');
		tag.push('		    	<div class="icon" data-modal="icon" data-quickMenuSn="$quickMenuSn$"><img src="$imagePath$" alt="" width="120" height="90" /></div>');
		tag.push('		    </$tag$>');
		tag.push('      </div>');
		tag.push('  </div>');
		tag.push('</div>');

		html = TypeGMain.getReplacedHTML(tag.join(''));
		$('body.main').prepend(html);
		TypeG.loadFooter();
	}
};

// 화면이 로딩된 후 실행
$(function() {
	TypeGMain.init();
});