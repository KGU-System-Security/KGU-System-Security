/************************************************
 * 각 기업에서 요청한 내용을 임의로 처리하는 파일 
 * *********************************************/
var AddOn = (function() {
	var fn;
	
	fn = {
		popCenter : function(width, height) {
			var left, top, windowWidth = $(window).width(), windowHeight = $(window).height();
			left = (windowWidth / 2) - (width / 2);
			top = (windowHeight / 2) - (height / 2);
			
			return {
				left : left,
				top : top
			}
		},
		popMidas : function(d) {
			if(!d) throw new Error('옵션을 입력하세요.');
			if(!d['companySn']) throw new Error('companySn을 입력하세요.');
			if(!d['closeDate']) throw new Error('closeDate을 입력하세요.');
			if(!d['href']) throw new Error('href를 입력하세요.');
			if(!d['width']) throw new Error('width를 입력하세요.');
			if(!d['height']) throw new Error('height를 입력하세요.');
			
			var position, now = new Date(), today; 
			today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			
			// 마이다스가 아니면 실행안함
			if(Number(d.companySn) != 1) return false;
			
			// 팝업이 종료되는 시간이 있고 그 시간이 되지 않았을 때 팝업띄움
			if( d.closeDate && today < d.closeDate) { 
				position = fn.popCenter(d.width, d.height);
				window.open(d.href, 'POP', 'width='+d.width+',height='+d.height+',left='+position.left+',top='+position.top);
			}
		}
	};
	
	return {
		popMidas : fn.popMidas
	}
})();

