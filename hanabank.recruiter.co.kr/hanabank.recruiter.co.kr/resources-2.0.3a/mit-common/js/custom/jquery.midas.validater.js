(function() {
$(function() {
// 밸리데이터 생성자 - 유효성 검사에 사용될 데이터 생성
function Validater() {
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
				'suffix1':'이',
				'suffix2':'가',
				'suffix3':'을',
				'suffix4':'를',
				'suffix5':'은',
				'suffix6':'는',
				'suffix7':'에',
				'plzInput': '입력하세요.',
				'plzSelect': '선택하세요.',
				'plzNumberOnly': '숫자만 입력하세요.',
				'plzMinLength': '글자 이상 작성하세요.',
				'plzMaxLength': '글자 이하로 작성하세요.',
				'plzMinNumber': '이상 입력하세요.',
				'plzMaxNumber': '이하로 입력하세요.',
				'plzCheck': '체크하세요.',
				'plzEmail': '올바르게 입력하세요.',
				'plzNumberOrderLarge': '앞숫자가 뒷숫자보다 빨라야 합니다.',
				'plzNumberOrderEquals': '앞숫자가 뒷숫자와 같거나 빨라야 합니다.',
				'plzDateOrderLarge': '앞날짜가 뒷날짜보다 빨라야 합니다.',
				'plzDateOrderEquals': '앞날짜가 뒷날짜와 같거나 빨라야 합니다.',
				'plzDateOrderTime': '시작시간이 종료시간보다 빨라야 합니다.',
				'plzLeastOne': '최소한 한개의 값을 입력해야 합니다.',
				'plzFileDefault': '업로드 할 수 없는 파일 확장자입니다.',
				'plzFileImage': '이미지 파일만 업로드 가능합니다.',
				'plzFileExcel': '엑셀파일만 업로드 가능합니다.'
			},
			ja : {
				'suffix1':'が',
				'suffix2':'が',
				'suffix3':'を',
				'suffix4':'を',
				'suffix5':'は',
				'suffix6':'は',
				'suffix7':'に',
				'plzInput':'入力してください。',
				'plzSelect':'選択してください。',
				'plzNumberOnly':'数字だけ入力してください。',
				'plzMinLength':'文字以上作成してください。',
				'plzMaxLength':'文字以下で作成してください。',
				'plzMinNumber':'以上入力してください。',
				'plzMaxNumber':'以下で入力してください。',
				'plzCheck':'チェックしてください。',
				'plzEmail':'正しく入力してください。',
				'plzNumberOrderLarge':'前の数字が後ろの数字より先でなければなりません。',
				'plzNumberOrderEquals':'前の数字が後ろの数字と同じであるかそれとも先でなければなりません。',
				'plzDateOrderLarge':'前の日が後ろの日より先でなければなりません。',
				'plzDateOrderEquals':'前の日が後ろの日と同じであるかそれとも先でなければなりません。',
				'plzDateOrderTime':'始めた時間が終了時間より先でなければなりません。',
				'plzLeastOne':'最少一個のvalueを入力してください。',
				'plzFileDefault':'アップロードできないファイルextentionです。',
				'plzFileImage':'イメージファイルだけアップロード可能です。',
				'plzFileExcel':'エクセルファイルだけアップロード可能です。'
			}
		};
		return function(code) {
			return dataBase[currentLang][code];
		};
	})();


	this.postPosition = {
		// 조사 = postPosition = pp
		//  useFinal = 받침있는 글자
		//  noneFinal = 받침없는 글자
		//  type1 = 주격조사
		//  type2 = 목적격조사
		//  type3 = 보격조사
		type1 : {
			useFinal : getText('suffix1'),
			noneFinal : getText('suffix2')
		}, type2 : {
			useFinal : getText('suffix3'),
			noneFinal : getText('suffix4')
		}, type3 : {
			useFinal : getText('suffix5'),
			noneFinal : getText('suffix6')
		}, type4 : {
			useFinal : getText('suffix7'),
			noneFinal : getText('suffix7')
		}
	};
	this.msgGroup = {
		// 메세지
		plzInput : {
			msg : getText('plzInput'),
			type : this.postPosition.type2
		},
		plzSelect : {
			msg : getText('plzSelect'),
			type : this.postPosition.type2
		},
		plzNumberOnly : {
			msg : getText('plzNumberOnly'),
			type : this.postPosition.type3
		},
		plzMinLength : {
			msg : getText('plzMinLength'),
			type : this.postPosition.type2
		},
		plzMaxLength : {
			msg : getText('plzMaxLength'),
			type : this.postPosition.type2
		},
		plzMinNumber : {
			msg : getText('plzMinNumber'),
			type : this.postPosition.type2
		},
		plzMaxNumber : {
			msg : getText('plzMaxNumber'),
			type : this.postPosition.type2
		},
		plzCheck : {
			msg: getText('plzCheck'),
			type : this.postPosition.type2
		},
		plzEmail : {
			msg: getText('plzEmail'),
			type : this.postPosition.type2
		},
		plzNumberOrderLarge : {
			msg: getText('plzNumberOrderLarge'),
			type : this.postPosition.type3
		},
		plzNumberOrderEquals : {
			msg: getText('plzNumberOrderEquals'),
			type : this.postPosition.type3			
		},
		plzDateOrderLarge : {
			msg: getText('plzDateOrderLarge'),
			type : this.postPosition.type3
		},
		plzDateOrderEquals : {
			msg: getText('plzDateOrderEquals'),
			type : this.postPosition.type3			
		},
		plzDateOrderTime : {
            msg: getText('plzDateOrderTime'),
            type : this.postPosition.type3          
        },
		plzLeastOne : {
		    msg: getText('plzLeastOne'),
		    type : this.postPosition.type3            
		},
		plzFileDefault : {
			msg: getText('plzFileDefault'),
			type : this.postPosition.type4
		},
		plzFileImage : {
			msg: getText('plzFileImage'),
			type : this.postPosition.type3			
		},
		plzFileExcel : {
			msg: getText('plzFileExcel'),
			type : this.postPosition.type3
		}
	};
	this.keyCode =  {
		// 자주 사용하는 키코드
		enter : 13,
		del : 46,
		home : 36,
		end : 35,
		backSpace : 8,
		leftCtrl : 17,
		tab : 9,
		shift : 16,
		a : 65,
		b : 66,
		c : 67,
		d : 68,
		e : 69,
		f : 70,
		g : 71,
		h : 72,
		i : 73,
		j : 74,
		k : 75,
		l : 76,
		m : 77,
		n : 78,
		o : 79,
		p : 80,
		q : 81,
		r : 82,
		s : 83,
		t : 84,
		u : 85,
		v : 86,
		w : 87,
		x : 88,
		y : 89,
		z : 90,
		zero : 48,
		one : 49,
		two : 50,
		three : 51,
		four : 52,
		five : 53,
		six : 54,
		seven : 55,
		eight : 56,
		nine : 57,
		dot : 190,
		keypadZero : 96,
		keypadOne : 97,
		keypadTwo : 98,
		keypadThree : 99,
		keypadFour : 100,
		keypadFive : 101,
		keypadSix : 102,
		keypadSeven : 103,
		keypadEight : 104,
		keypadNine : 105,
		keypadDot : 110,
		arrowLeft : 37,
		arrowTop : 38,
		arrowRight : 39,
		arrowBottom : 40
	};
	this.defaultEnableKeyCode = [
		// 키보드 제어를 해도 풀어놓을 키 저장배열
		this.keyCode.tab,
		this.keyCode.shift,
		this.keyCode.backSpace,
		this.keyCode.del,
		this.keyCode.home,
		this.keyCode.end,
		this.keyCode.arrowLeft,
		this.keyCode.arrowRight,
		this.keyCode.dot,
		this.keyCode.keypadDot
	];
	this.intEnableKeyCode = [
		// 정수입력 옵션일 경우해도 풀어놓을 키 저장배열
		this.keyCode.tab,
		this.keyCode.shift,
		this.keyCode.backSpace,
		this.keyCode.del,
		this.keyCode.home,
		this.keyCode.end,
		this.keyCode.arrowLeft,
		this.keyCode.arrowRight
	];	
	this.error = false, // 에러발생상태 : true면 에러
	this.mordenBrowser; // IE하위 버전체크 - false : IE9 이하
}

// 밸리데이터 메소드 - 검사에 사용될 함수 생성
$.extend(Validater.prototype, {
	_initValidater : function($form,options) {
		// 밸리데이터 초기화 함수

		// 옵션 셋팅 - 기본값 정해진게 없음
		var set = $.extend({
			placeholder : false
		},options);

		this.customAlert = set.customAlert || null;
		
		// 입력과정에 필요한 이벤트 바인딩
		this._bindPreSubmitEvent($form);

		// Submit 버튼 클릭 후 발생하는 이벤트
		this._bindSubmitEvent($form, set);

		// IE하위 버전체크 - false : IE9 이하
		this.mordenBrowser = this._checkMordenBrowser();

		// IE하위에서 Placeholder 기능 적용
		if(set.placeholder == true && this.mordenBrowser == false) {
			this._bindPlaceholder();
		}
	},
	_bindPreSubmitEvent : function($form) {
		// Submit하기 이전에 필요한 이벤트 바인딩
		this._bindNumberOnly($form);
		this._bindIntOnly($form);		
		this._bindLengthCalculator($form);
	},
	_bindSubmitEvent : function($form, set) {
		// Submit 버튼 클릭 후 발생하는 이벤트
		if(!set.submitBtn) {return false;}
		var obj = this;
		
		// Submit버튼이 Form 내에서만 종속적으로 작동할 수 있게 ID가 있다면 선택자를 묶어줌
		var formId = "#"+$form.attr("id")+" ";
		if(formId == "# ") {
			formId = "";	
		}
		// Submit버튼 클릭 (중복 이벤트 바인딩을 피하기위해 off 삽입)
		$(document).off('click', formId+set.submitBtn).on('click', formId+set.submitBtn, function(e) {
			e.preventDefault();
			
			// 밸리데이션 시작
			obj.error = obj._startValidate($form, set);
			// Submit 처리
			if(!obj.error) { // 에러가 없다면 post처리 메소드 실행
				//Placeholder 기능이 활성화되어 있을 때 처리
				if(set.placeholder == true && obj.mordenBrowser == false) {
					obj._resetPlaceholder();
				}
				
				if(set.submitMethod) { // submit메소드가 있다면 실행
					set.submitMethod(obj.error, this, $form);
				} else { // submit메소드가 없다면 바로 submit
					$form.submit();	
				}
			}
			
		});
	},
	_bindPlaceholder : function() {
		// IE하위버전에서 Placeholder 기능 적용
		var arrPlaceholder = new Array();
		$("input[placeholder]").each(function(index) { // 로딩시 초기화
			var value = $(this).val();
			var text = $(this).attr("placeholder");
			arrPlaceholder[index] = text;
			$(this).attr("data-index",index);
			if(!value) { // value가 없을 경우에 적용
				$(this).val(text).addClass("placeholder");
			}			
		}).focus(function() { // 포커싱
			var index = $(this).attr("data-index");
			var value = $(this).val();
			if(value == arrPlaceholder[index]) {
				$(this).val("").removeClass("placeholder");
			}
		}).blur(function() { // 포커싱 아웃
			var index = $(this).attr("data-index");
			var value = $(this).val();
			if(value == "" ) {
				$(this).val(arrPlaceholder[index]).addClass("placeholder");
			}
		});
	},
	_startValidate : function($form, set) {
		// 밸리데이션 체크 시작
		var error = false;
		var obj = this;
		$form.find("[data-valid]").each(function(index) {
			var valid = $(this).attr("data-valid");
			var arrType = valid.split(" ");
			var _this = this;
			for(var i in arrType) {
				error = obj._checkValidation(_this, arrType[i], set);
				if(error) {return false;}
			}
		});
		return error;
	},
	_checkValidation : function(_this, type, set) {
		var error = false, disabled, count=0, disabledCount = 0;
		
		if($(_this).attr('data-valid') == 'checked') { // 라디오나 체크박스일 경우는 disabled 다르게 체크
			$(_this).find('input:radio, input:checkbox').each(function() { count++; });
			$(_this).find('input:radio:disabled, input:checkbox:disabled').each(function() { disabledCount++; });

			if(count == disabledCount) { return false; } // 모두 disabled라면 체크하지 않음
		} else {
			disabled = $(_this).prop("disabled");
		}
		if(disabled) {return false;}
		switch (type) {
			case "blank" : // 빈 Input 체크
				error = this._checkBlank(_this, set);
				break;
			case "number-only" : // 숫자와 소숫점 포함
				error = this._checkNumberOnly(_this);
				break;
			case "int-only" : // 정수만 입력 소숫점 비포함
				error = this._checkIntOnly(_this);
				break;
			case "length-limit" : // 글자크기 제한
				error = this._checkLengthLimit(_this);
				break;
			case "number-limit" : // 숫자크기 제한
				error = this._checkNumberLimit(_this);
				break;
			case "selected" : // 셀렉트 선택 체크
				error = this._checkSelected(_this);
				break;
			case "checked" : // 라디오&체크박스 체크
				error = this._checkChecked(_this);
				break;
			case "email" : // 이메일 정규화 검사
				error = this._checkEmail(_this);
				break;
			case "number-order" : // 뒷숫자가 앞숫자보다 크거나 같은지 확인
				error = this._checkNumberOrder(_this, set);
				break;
			case "date-order" : // 뒷달력이 앞달력보다 날짜가 빠르지 않은지 검사
				error = this._checkDateOrder(_this, set);
				break;
			case "least-one" : // span으로 묶인 개체 내부에 최소한 한개의 데이터가 들어있는지 검사
			    error = this._checkLeastOne(_this, set);
			    break;
			case "file-check" : // 파일유형이 맞는지 검사
				error = this._checkFile(_this, set);
				break;
		}
		return error;
	},
	_alertMsg : function(_this, option) {
		// alert메시징
		var title, pp, size, text, lastChar, noFinal;
		noFinal = '가갸거겨고교구규그기개걔게계과괘궈궤괴귀긔까꺄꺼껴꼬꾜꾸뀨끄끼깨꺠께꼐꽈꽤꿔꿰꾀뀌끠나냐너녀노뇨누뉴느니내냬네녜놔놰눠눼뇌뉘늬다댜더뎌도됴두듀드디대댸데뎨돠돼둬뒈되뒤듸따땨떠뗘또뚀뚜뜌뜨띠때떄떼뗴똬뙈뚸뛔뙤뛰띄라랴러려로료루류르리래럐레례롸뢔뤄뤠뢰뤼릐마먀머며모묘무뮤므미매먜메몌뫄뫠뭐뭬뫼뮈믜바뱌버벼보뵤부뷰브비배뱨베볘봐봬붜붸뵈뷔븨빠뺘뻐뼈뽀뾰뿌쀼쁘삐빼뺴뻬뼤뽜뽸뿨쀄뾔쀠쁴사샤서셔소쇼수슈스시새섀세셰솨쇄숴쉐쇠쉬싀싸쌰써쎠쏘쑈쑤쓔쓰씨쌔썌쎄쎼쏴쐐쒀쒜쐬쒸씌아야어여오요우유으이애얘에예와왜워웨외위의자쟈저져조죠주쥬즈지재쟤제졔좌좨줘줴죄쥐즤짜쨔쩌쪄쪼쬬쭈쮸쯔찌째쨰쩨쪠쫘쫴쭤쮀쬐쮜쯰차챠처쳐초쵸추츄츠치채챼체쳬촤쵀춰췌최취츼카캬커켜코쿄쿠큐크키캐컈케켸콰쾌쿼퀘쾨퀴킈타탸터텨토툐투튜트티태턔테톄톼퇘퉈퉤퇴튀틔파퍄퍼펴포표푸퓨프피패퍠페폐퐈퐤풔풰푀퓌픠하햐허혀호효후휴흐히해햬헤혜화홰훠훼회휘희2459';
		title = $(option.target).attr('title');
		lastChar = title.substring(title.length-1, title.length);
		pp = noFinal.indexOf(lastChar) == -1 ? option.obj.type.useFinal : option.obj.type.noneFinal;
		size = option.size?option.size:"";
		text = title+pp+" "+size+option.obj.msg;

		if(typeof this.customAlert != 'function') {
			alert(text);
			$(_this).focus();
		} else {
			this.customAlert(text, function() {
				$(_this).focus();	
			});
		}
	},
	_checkBlank : function(_this, set) {
		// 입력했는지를 체크
		var error = false;
		var value = $.trim($(_this).val());
		var placeholder = $(_this).attr("placeholder");
		var valid = $(_this).attr("data-valid");
		// 검사
		if(!value || (set.placeholder == true && this.mordenBrowser == false && placeholder != "" && placeholder == value)) {
			var option = {
				target : _this,
				obj : this.msgGroup.plzInput
			};
			this._alertMsg(_this, option);
			error = true;
		}			
		return error;
	},
	_checkNumberOnly : function(_this) {
		// 숫자와 소수점만 입력했는지를 체크
		var error = false;
		var value = $(_this).val();
		var isNumberOnly = /[^\d.]/g.test(value); // 숫자와 소수점을 제외한 내용이 있는지 체크
		if(isNumberOnly) {
			var option = {
				target : _this,
				obj : this.msgGroup.plzNumberOnly
			};
			this._alertMsg(_this, option);
			$(_this).focus();
			error = true;
		}
		return error;
	},
	_checkIntOnly : function(_this) {
		// 정수만 입력했는지를 체크
		var error = false;
		var value = $(_this).val();
		var isIntOnly = /[^\d]/g.test(value); // 정수가 아닌 내용이 있는지 체크
		if(isIntOnly) {
			var option = {
				target : _this,
				obj : this.msgGroup.plzNumberOnly
			};
			this._alertMsg(_this, option);
			$(_this).focus();
			error = true;
		}
		return error;		
	},
	_bindNumberOnly : function($form) {
		// 키보드 사용시 숫자와 소수점만 입력
		var obj = this;
		$form.find('input[data-valid~=number-only]').css({imeMode : 'disabled'});
		$form.on("keydown", "input[data-valid~=number-only]", function(e) {
			var isDot, isCheck, decimalSize, pattern, value, p = [], i, j, k, cursorPosition, arrNumber;
		    isDot = e.which==obj.keyCode.dot || e.which==obj.keyCode.keypadDot;
			isCheck = obj._checkDefaultKeyCode(e.which);
			
			if(isDot && (this.value=='' || 0<=this.value.indexOf('.'))) return false;
			if(isCheck) return true;			
			if(!((e.which >= obj.keyCode.zero && e.which <= obj.keyCode.nine) || (e.which >= obj.keyCode.keypadZero && e.which <= obj.keyCode.keypadNine))) return false;
			else { // 숫자키가 맞으면 커서 위치에 넣어도 되는지 정규식 만들어서 판단
				decimalSize = Number($(this).attr('data-decimal-length')) || 2; // 기본값은 소숫점 2자리
				
				p.push('^\\d+(?:[.]');
				for(i=1;i<=decimalSize;i++) p.push('?[\\d]'); // 소숫점만큼 생성
				p.push(')?$');
				pattern = new RegExp(p.join(''));
				
				if(!e.key) { // 사파리에서 e.key가 안넘어옴... 16.11.21 민종
					arrNumber = [[48, 57], [96,105]];
					for(i=0;i<arrNumber.length;i++) {
						k = 0;
						for(j=arrNumber[i][0]; j<=arrNumber[i][1]; j++) {
							if(j == e.keyCode) {
								e.key = k;
								break;
							} else k++;
						}
					}
				}
				
				cursorPosition = this.selectionStart;
				value = (this.value.substring(0, cursorPosition) + e.key + this.value.substring(cursorPosition));

				return pattern.test(value);
			}
		});
	},
	_bindIntOnly : function($form) {
		// 키보드 사용시 정수만 입력
		var obj = this;
		$form.find('input[data-valid~=int-only]').css({imeMode : 'disabled'});
		$form.on("keydown", "input[data-valid~=int-only]", function(e) {
			var isCheck = obj._checkIntKeyCode(e.which);
			if(isCheck) {return true;}
			if(!((e.which >= obj.keyCode.zero && e.which <= obj.keyCode.nine) || (e.which >= obj.keyCode.keypadZero && e.which <= obj.keyCode.keypadNine))) {
				return false;
			}
		});
	},	
	_checkDefaultKeyCode : function(eventKey) {
		// 기본키 검사
		for(var i in this.defaultEnableKeyCode) {
			if(eventKey == this.defaultEnableKeyCode[i]) {return true;}
		}
		return false;
	},
	_checkIntKeyCode : function(eventKey) {
		// 정수입력키 검사
		for(var i in this.intEnableKeyCode) {
			if(eventKey == this.intEnableKeyCode[i]) {return true;}
		}
		return false;
	},	
	_bindLengthCalculator : function($form) {
		// textarea에 몇자 쳤는지 알 수 있는 input
		var interval;
		
		// 초기 로딩 시 길이 출력
		$form.find("textarea[data-length-target]").each(function() {
			var target = $(this).attr("data-length-target");
			if(!target) {return false;}
			var length = $(this).val().length;
			$(target).val(length);				
		});
		
		// 키보드 입력시 길이 출력
		$form.on("focus", "textarea[data-length-target]", function(e) {
			var target = $(this).attr("data-length-target");
			if(!target) {return false;}			
			var _this = this;
			var checkLength = function() {
				var length = $(_this).val().length;
				$(target).val(length);
			};			
			interval = setInterval(checkLength, 100);
		}).on("blur", "textarea[data-length-target]", function(e) {
			clearInterval(interval);
		});
	},
	_checkLengthLimit : function(_this) {
		// 글자수 제한 체크
		var error = false;
		var min = $(_this).attr("data-min-limit");
		var max = $(_this).attr("data-max-limit");
		var length = $(_this).val().length;
		var option = {};
		if(length < min || length > max) {
			if(length < min) {
				option = {
					target : _this,
					obj : this.msgGroup.plzMinLength,
					size : min
				};
			} else if(length > max) {
				option = {
					target : _this,
					obj : this.msgGroup.plzMaxLength,
					size : max
				};
			}
			this._alertMsg(_this, option);
			$(_this).focus();
			error = true;
		}
		return error;
	},
	_checkNumberLimit : function(_this) {
		// 숫자 크기 제한 체크
		var error = false;
		var min = Number($(_this).attr("data-min-limit"));
		var max = Number($(_this).attr("data-max-limit"));
		var value = Number($(_this).val());
		var option = {};
		if(value < min || value > max) {
			if(value < min) {
				option = {
					target : _this,
					obj : this.msgGroup.plzMinNumber,
					size : min
				};
			} else if(value > max) {
				option = {
					target : _this,
					obj : this.msgGroup.plzMaxNumber,
					size : max
				};
			}
			this._alertMsg(_this, option);
			$(_this).focus();
			error = true;
		}
		return error;
	},
	_checkSelected : function(_this) {
		// 셀렉트 선택 체크 확인
		var error = false;
		var value = $(_this).val();
		if(!value) {
			var option = {
				target : _this,
				obj : this.msgGroup.plzSelect
			};
			this._alertMsg(_this, option);
			$(_this).focus();
			error = true;
		}
		return error;
	},
	_checkChecked : function(_this) {
		// 라디오&체크박스 체크 확인
		var error = false;
		var radioLength = $(_this).find("input:radio").size();
		var checkboxLength = $(_this).find("input:checkbox").size();
		var checked = $(_this).find("input:checked").size();
		if(checked == 0 && (radioLength > 0 || checkboxLength > 0)) {
			// 선태된것 없고 radio나 checkbox가 1개 이상일 경우
			var option = {
				target : _this,
				obj : this.msgGroup.plzCheck
			};
			this._alertMsg(_this, option);
			$(_this).find("input").first().focus();
			error = true;
		}
		return error;
	},
	_checkEmail : function(_this) {
		// 이메일 정규화 검사
		var error = false;
		var regEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_\.-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
		var email = $(_this).val();
		if(email != '' && !email.match(regEmail)) {
			var option = {
				target : _this,
				obj : this.msgGroup.plzEmail
			};
			this._alertMsg(_this, option);
			$(_this).focus();
			error = true;
		}
		return error;
	},
	_checkNumberOrder : function(_this, set) {
		// 뒷숫자가 앞숫자보다 크거나 같은지
		var error = false;
		var orderType = $(_this).attr("data-order-type");
		if(!orderType) {
			return false;	
		}
		
		var start = $(_this).find("input[data-number-type=low]").val();
		var end = $(_this).find("input[data-number-type=high]").val();
		
		if(this.mordenBrowser === false && set.placeholder === true) { // IE하위브라우저에 placeholder 옵션사용
			var startPlaceholder = $(_this).find("input[data-number-type=low]").attr("placeholder");
			var endPlaceholder = $(_this).find("input[data-number-type=high]").attr("placeholder");

			if(start == startPlaceholder && end == endPlaceholder) { 
				// value에 placeholder입력 상태면 그냥 넘김
				return false;
			}
		} 
		
		if(!$(_this).find("input[data-number-type=low]").val() || !$(_this).find("input[data-number-type=high]").val()) {
			// 둘 중 아무 데이터도 없으면 넘어감
			return false;

		} else if(orderType == "large" && Number(start) >= Number(end)) {
			// 앞숫자가 뒷숫자보다 large 옵션에 크면서 같으면 경고 출력 후 함수종료
			var option = {
				target : _this,
				obj : this.msgGroup.plzNumberOrderLarge
			};
			this._alertMsg(_this, option);
			$(_this).find("input[data-number-type=high]").focus();			
			error = true;
		} else if(orderType == "equals" && Number(start) > Number(end)) {
			// equals 옵션이면서 크면 경고 출력 후 함수종료
			var option = {
				target : _this,
				obj : this.msgGroup.plzNumberOrderEquals
			};
			this._alertMsg(_this, option);
			$(_this).find("input[data-number-type=high]").focus();			
			error = true;
		}
		return error;		
	},
	_checkDateOrder : function(_this, set) {
		// 뒷달력이 앞달력보다 날짜가 빠르지 않은지 검사
		var error = false;
		var orderType = $(_this).attr("data-order-type");
		if(!orderType) {
			return false;	
		}
		
		var $start = $(_this).find("input[data-date-type=start]");
		var $end = $(_this).find("input[data-date-type=end]");
		var start = $start.val();
		var end = $end.val();
		
		// 시간 비교를 위한 변수
		var startTime, endTime;
		
		if(this.mordenBrowser === false && set.placeholder === true) { // IE하위브라우저에 placeholder 옵션사용
			var startPlaceholder = $start.attr("placeholder");
			var endPlaceholder = $end.attr("placeholder");

			if(start == startPlaceholder && end == endPlaceholder) { 
				// value에 placeholder입력 상태면 그냥 넘김
				return false;
			}
		}
		
		if((!start && !end) || ($start.prop('disabled') && $end.prop('disabled'))) {
			// 아무 데이터가 없거나 둘다 disabeld면 넘어감
			return false;	
		} else if(start && !end) {
			// 앞달력만 선택되면 경고 출력 후 함수종료
			var option = {
				target : _this,
				obj : this.msgGroup.plzSelect
			};
			this._alertMsg(_this, option);
			$(_this).find("input[data-date-type=end]").focus();			
			error = true;
		} else if(!start && end) {
			// 뒷달력만 선택되면 경고 출력 후 함수종료
			var option = {
				target : _this,
				obj : this.msgGroup.plzSelect
			};
			this._alertMsg(_this, option);
			$(_this).find("input[data-date-type=start]").focus();			
			error = true;
		} else if(orderType == "large" && start >= end) {
			// 앞달력이 뒷달력보다 large 옵션에 크거나 같으면 경고 출력 후 함수종료
			var option = {
				target : _this,
				obj : this.msgGroup.plzDateOrderLarge
			};

			$timeStart = $(_this).find('input[data-time-type=start]');
			$timeEnd = $(_this).find('input[data-time-type=end]');

			if(start > end) {
				// 날짜만 체크
				this._alertMsg(_this, option);
				$(_this).find("input[data-date-type=end]").focus();
				error = true;
			} else if((start === end) && $timeStart.size() && $timeEnd.size()) {
				// 날짜가 같다고 시간 옵션까지 적용되었다면 시간까지 체크
				if($timeStart.val() >= $timeEnd.val()) {
					option.obj = this.msgGroup.plzDateOrderTime;
					this._alertMsg(_this, option);
					$(_this).find("input[data-time-type=end]").focus();
					error = true;
				}
			}
			
		} else if(orderType == "equals") {
			// equals 옵션이면서 크면 경고 출력 후 함수종료
			var $timeStart , $timeEnd;
			var option = {
				target : _this,
				obj : this.msgGroup.plzDateOrderEquals
			};
			
			$timeStart = $(_this).find('input[data-time-type=start]');
			$timeEnd = $(_this).find('input[data-time-type=end]');
			
			if(start > end) {
				// 날짜만 체크
				this._alertMsg(_this, option);
				$(_this).find("input[data-date-type=end]").focus();
				error = true;
			} else if((start === end) && $timeStart.size() && $timeEnd.size()) {
				 // 날짜가 같다고 시간 옵션까지 적용되었다면 시간까지 체크
				if($timeStart.val() >= $timeEnd.val()) {

					option.obj = this.msgGroup.plzDateOrderTime;
					this._alertMsg(_this, option);
					$(_this).find("input[data-time-type=end]").focus();
					error = true;
				}
			}
		} else if(orderType == "time") {
		    // time을 포함한 시간을 비교하고, startTime이 크면 경고 출력 후 함수 종료
		    var option = {
	                target : _this,
	                obj : null //this.msgGroup.plzDateOrderEquals
	        };
		    startTime = $(_this).find('input[data-time-type=start]').val();
		    endTime = $(_this).find('input[data-time-type=end]').val();
		    
		    // 시간이 비어있으면
		    if( startTime==''){
		        option.obj = this.msgGroup.plzInput;
				this._alertMsg(_this, option);
                $(_this).find("input[data-time-type=start]").focus();       
                error = true;
		    }
		    else if( endTime=='' ){
		        option.obj = this.msgGroup.plzInput;
				this._alertMsg(_this, option);
                $(_this).find("input[data-time-type=end]").focus();       
                error = true;
		    }
		    else if( (new Date(start+' '+startTime)).getTime() >= (new Date(end+' '+endTime)).getTime() ) { 
		        option.obj = this.msgGroup.plzDateOrderTime;
				this._alertMsg(_this, option);
                if( start > end ){
                    $(_this).find("input[data-date-type=end]").focus();
                }
                else{
                    $(_this).find("input[data-time-type=end]").focus();
                }
                error = true;
		    }
		}
		return error;		
	},
	_checkLeastOne : function(_this, set) {
	    // data-valid="least-one" 옵션 내부 input엘리먼트 중에서 data-least-one 속성을 가진 녀석들 중 최소한 하나의 값을 갖는지 검사
	    var error = true;
	    var blankTarget = null;
	    $(_this).find('input[data-least-one]').each(function(){
           var value = $(this).val();
           if( value != '' ) {
               error = false;
           }
           else if(blankTarget==null){
               blankTarget = this;
           }
        });
	    
	    //알림메시지
        if(error) {
            var option = {
                target : _this,
                obj : this.msgGroup.plzLeastOne
            };
			this._alertMsg(_this, option);
            $(blankTarget).focus();
        }       
        return error;   
	},
	_checkFile : function(_this, set) {
		// 파일 타입을 체크해서 허용된 파일인지 검사
		var error = false,
			value = $(_this).val(),
			fileType = $(_this).attr('data-file-type'),
			option = {},
			typeReg, reg;

		if(!value) { return false; } // 입력검사는 blank에서 할것
		
		switch(fileType) {
			case 'image' : 
				typeReg =  '\.(jpg|jpeg|gif|png)$';
				option.obj = this.msgGroup.plzFileImage;				
				break;
			case 'excel' :
				typeReg =  '\.(xlsx|xls)$'; 
				option.obj = this.msgGroup.plzFileExcel;
				break;
			default : 
				typeReg = '\.(html|htm|php|php3|php4|php5|phtml|phps|in|cgi|pi|shtml|jsp|asp|aspx|ascx|bat|exe|dll|reg|cfm)$';
				option.obj = this.msgGroup.plzFileDefault;
				break;
		}
		
		reg = (new RegExp(typeReg, "i"));
		
		switch(fileType) {
			case 'image' : 
			case 'excel' :
				error = !reg.test($(_this).val().toLowerCase()) ? true : false;
				break;
			default : 
				error = reg.test($(_this).val().toLowerCase()) ? true : false;
				break;
		}
		
        if(error) {
            option.target = _this;
			this._alertMsg(_this, option);
            $(_this).focus();
        } 

		return error;
	},
	_checkMordenBrowser : function() {
		// IE버전체크
		if(navigator.userAgent.indexOf("MSIE 7") == -1 && navigator.userAgent.indexOf("MSIE 8") == -1 && navigator.userAgent.indexOf("MSIE 9") == -1) {
			return true; // 모던브라우저
		} else {
			return false; // IE9 이하
		}
	},
	_resetPlaceholder : function() {
		// IE하위버전에서 작성되지 않은 placeholder 리셋
		$("input[placeholder]").each(function() {
			var value = $(this).val();
			var placeholder = $(this).attr("placeholder");
			if(value==placeholder) { // value와 placeholder이 같으면 초기화
				$(this).val("");
			}
		});
	}
});

$.fn.validater = function(options) {
	// 한 번만 실행해야 하는 함수 연결 - 아직 정해진 내용 없음
	if(!$.validater.initialized) {
		$.validater.initialized = true;
	}

	// 초기화 함수 실행
	$.validater._initValidater(this,options);
};

$.validater = new Validater();
$.validater.initialized = false;

});
})(jQuery);