'use strict';

var D = (function() {
	var getText = (function() {
		var currentLang, dataBase;
		currentLang = (function() { //html Tag의 Language를 따른다.
			var tagLang = document.documentElement.getAttribute('lang');
			var list = {
				'ko': true,
				'ja': true
			};
			if (!list[tagLang]) return 'ko';
			return tagLang;
		})();

		dataBase ={
			ko : {
				'sunday':'일',
				'monday':'월',
				'tuesday':'화',
				'wednesday':'수',
				'thursday':'목',
				'friday':'금',
				'saturday':'토',
				'morning':'오전',
				'afternoon':'오후',
				'year':'년',
				'month':'개월',
				'age':'만 {0}세',
				'over_capacity':'파일 첨부용량은 {0}를 초과할 수 없습니다.',
				'suffix1':'이',
				'suffix2':'가',
				'suffix3':'을',
				'suffix4':'를',
				'suffix5':'은',
				'suffix6':'는',
				'suffix7':'에',
			},
			ja : {
				'sunday':'日',
				'monday':'月',
				'tuesday':'火',
				'wednesday':'水',
				'thursday':'木',
				'friday':'金',
				'saturday':'土',
				'morning':'午前',
				'afternoon':'午後',
				'year':'年',
				'month':'か月',
				'age':'{0}歳',
				'over_capacity':'ファイルの添付容量は{0}を超えられません。',
				'suffix1':'が',
				'suffix2':'が',
				'suffix3':'を',
				'suffix4':'を',
				'suffix5':'は',
				'suffix6':'は',
				'suffix7':'に',
			}
		};
		return function(code) {
			return dataBase[currentLang][code];
		};
	})();
	var formatter = function(str) {
		for (var _len = arguments.length, param = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			param[_key - 1] = arguments[_key];
		}

		return str.replace(/{(\d+)}/g, function (match, number) {
			return typeof param[number] !== 'undefined' ? param[number] : match;
		});
	};

	var Param = (function() {
		var i, t, param = {}, arrParam = location.search.replace('?', '').split('&');
		if(location.search) for(i in arrParam) t = arrParam[i].split('='), param[t[0]] = t[1].match(',') ? t[1].split(',') : t[1];

		param.fn = {
			linear : function() {
				var i, p = '?';
				for(i in Param) if(i !== 'fn') p = p+(p !== '?' ? '&' : '')+i+'='+Param[i];
				return p;
			},
			array : function(code) {
				Param[code] = typeof Param[code] === 'string' ? [Param[code]] : Param[code];
			}
		};

		return param;
	})();

	var Cookie = (function() {
		var cookie = {}, init;

		init = function() {
			var i, arrCookie = document.cookie.split(';'), arrTemp;
			for(i=0; i<arrCookie.length; i++) {
				if(arrCookie[i].indexOf('=') > -1) {
					arrTemp = arrCookie[i].replace(' ', '').split('=');
					cookie[arrTemp[0]] = arrTemp[1];
				}
			}
		};

		cookie.fn = {
			set : function(k, v) {
				if(!k || !v) throw new Error('k,v 형태로 입력하세요.');
				document.cookie = k+'='+v;
				init();
			},
			setUpdate : function(k, v) {
				var i, temp;
				if(!k || !v) throw new Error('k,v 형태로 입력하세요.');
				if(!cookie[k]) document.cookie = k+'='+v;
				else {
					temp = cookie[k].split(',');
					for(i=0; i<temp.length; i++) if(temp[i] === v) return false;
					document.cookie = k+'='+cookie[k]+','+v;
				}

				init();
			},
			getArray : function(k) {
				return cookie[k] ? cookie[k].split(',') : [];
			}
		};

		init();

		return cookie;
	})();

	var Bool = function(d) {
		if(typeof d === 'boolean') return d;
		return (d === 'true');
	};

	var	Comma = function(d) {
		if(typeof d === 'number') d = ''+d;
		if(!d) return '-';
		return d.replace(/(\d)(?=(\d\d\d)+$)/g, '$1,'); // 천단위 콤마찍고 리턴
	};
	var UnComma = function(d) {
		return d.replace(/(,)/g, ''); // 천단위 콤마없애고 리턴
	};

	var Zero = function(d) {
		if(typeof d !== 'string' && typeof d !== 'number')throw new Error('zero : string/number 형태의 값만 유효합니다.');
		if(typeof d === 'string') d = Number(d);
		return d > 9 ? d : '0'+d;
	};

	var convertStrDateToObjDate = function(strdate) {
		var d, t, time;
		if(!strdate || typeof strdate !== 'string') return new Date(strdate);

		d = strdate.split(' ')[0] ? strdate.split(' ')[0].split(/\D/) : {};
		t = strdate.split(' ')[1] ? strdate.split(' ')[1].split(':') : {};
		time = new Date(d[0] || '', d[1] - 1, d[2] || '', t[0] || '', t[1] || '', t[2] || '');

		return time;
	};

	var DateTime = function(date, format) {
		var time, transformDate;

		if(!date) return '';
		if(date instanceof Date) date = date.getTime(); // new Date()로 넣을 경우 time을 추출해서 작동함
		if(!format) format = 'yyyy.MM.dd';

		transformDate = function(d, f) {
			var weekName = [getText('sunday'), getText('monday'), getText('tuesday'), getText('wednesday'), getText('thursday'), getText('friday'), getText('saturday')];
			if (!d.valueOf()) return '';

			return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
				switch ($1) {
					case 'yyyy' : return d.getFullYear();
					case 'yy' : return Zero(d.getFullYear() % 100);
					case 'MM' : return Zero(d.getMonth() + 1);
					case 'dd' : return Zero(d.getDate());
					case 'E' : return weekName[d.getDay()];
					case 'HH' : return Zero(d.getHours());
					case 'hh' : return Zero(d.getHours() % 12 ? d.getHours() % 12 : 12);
					case 'mm' : return Zero(d.getMinutes());
					case 'ss' : return Zero(d.getSeconds());
					case 'a/p' : return d.getHours() < 12 ? getText('morning') : getText('afternoon');
					default : return $1;
				}
			});
		};

		if(typeof date === 'string') {
			time = convertStrDateToObjDate(date);
		} else if(typeof date === 'number') {
			time = new Date(date);
		} else {
			time = new Date(0);
			time.setFullYear(date.year+1900);
			time.setMonth(date.month); // java는 month가 1부터 시작
			time.setDate(date.date);
			time.setHours(date.hours);
			time.setMinutes(date.minutes);
			time.setSeconds(date.seconds);
		}

		return transformDate(time, format);
	};

	var DateTimeDiff = function(diff) {
		// 날짜 차이 알아 내기 (2년 3개월)
		var oneDay = 24 * 60 * 60 * 1000;// 시 * 분 * 초 * 밀리세컨
		var oneMonth = oneDay * 30;// 월 만듬
		var tmp = 0, msg = '';

		if(!diff) return '';

		if(diff/oneMonth>=1) {
			tmp = parseInt(diff/oneMonth);
			if(tmp>12) {
				msg+= (parseInt(tmp/12)+ getText('year'));
				tmp = tmp % 12 -1;
			}

			if(msg!=='') { msg += ' '; }
			if(tmp>=1) msg += (tmp + getText('month'));
		}

		return msg;
	};

	var Json = (function(d) {
		return JSON.stringify(d);
	});

	var JsonRQ = (function(d) {
		return {_jsonrq : JSON.stringify(d)};
	});

	var Blank = (function(data) {
		var isCorrect = (data !== '' && data !== null && typeof data !== 'undefined');
		return isCorrect ? data : '-';
	});

	var Masking = (function() {
		var isMasking = null;
		return function(data) {
			var isCorrect = (data !== '' && data !== null && typeof data !== 'undefined' && data !== '-');
			// Privacy에서 마스킹처리가 true라면 -대신 *로 처리
			if(isMasking === null && typeof window.Privacy !== 'undefined' && Privacy.masking instanceof Function) isMasking = Privacy.masking();
			return isMasking ? '*' : isCorrect ? data : '-';
		}
	})();

	var UpdateInputName = (function(name, index, depth) {
		var head, i;
		for(i=1; i<depth; i++) name = name.replace('[', '{').replace(']', '}');
		head = name.slice(0, Number(name.search(/[\[]/)) + 1);
		for(i=1; i<depth; i++) head = head.replace('{', '[').replace('}', ']');
		return head+index+(name.slice(Number(name.search(/[\]]/))));
	});

	var Age =(function(birthday) {
		var diff, yearsDiff;
		var today = new Date();
		var oneDay = 24 * 60 * 60 * 1000;// 시 * 분 * 초 * 밀리세컨
		var oneMonth = oneDay * 30;// 월 만듬
		var oneYear = oneMonth * 12; //년

		// 날짜 차이 알아 내기 (2년 3개월)
		birthday = new Date(birthday);
		diff = today.getTime() - birthday.getTime();
		yearsDiff = today.getFullYear() - birthday.getFullYear();

		if(!birthday) return '';
		if(diff>0) yearsDiff--;

        return formatter(getText('age'), parseInt(yearsDiff)) +'(' +(parseInt(diff/oneYear)+1)+')';
    });

	// 배열을 특정 코드의 오브젝트로 만들어줌
	var ArrayToObject = function(code, arr) {
		var i, obj = {}, d;

		if(!arr) return null;

		for(i=0; i<arr.length; i++) {
			d = arr[i];
			obj[d[code]] = d;
		}

		return obj;
	};

	// 데이터가 존재하지않으면 ''을 리턴
	var Exists = function(data) {
		return (data && data !== 'undefined' && data !== undefined && data !== null && data !== 'null')? data : '';
	};

	// 파일 밸리데이터
	var FileValid = function(file, data) {
		var size, obj = {}, isAllowSize = false, sizeType = '', isSizeValid = true, regMB, regKB;

		obj = {
			valid : true,
			type : null,
			msg : ''
		};

		regMB = /^[0-9]*M$/i;
		regKB = /^\d{1,3}KB$/i;

		if(!file || file instanceof Object === false) throw new Error('첫번째 파라미터에 검사할 파일객체를 입력하세요.');
		if(!data || data instanceof Object === false) throw new Error('두번째 파라미터에 검사옵션객체를 입력하세요.');

		// 파일용량체크
		if(!data.size) throw new Error('검사할 첨부파일의 허용용량을 입력하세요. : size');

		// 10m, 10M 등 메가 표현식
		if(regMB.test(data.size)) {
			sizeType = 'M';
			isAllowSize = true;
		}

		// 500kb, 500KB 등 킬로바이트 표현식
		if(regKB.test(data.size)) {
			sizeType = 'KB';
			isAllowSize = true;
		}

		if(!isAllowSize) throw new Error('메가(10M)나 킬로바이트(500KB)로 허용용량을 입력하세요.');

		size = Number(data.size.replace(sizeType, ''));

		switch(sizeType) {
			case 'M' : if(size * 1024 * 1024 < file.size) isSizeValid = false; break;
			case 'KB' : if(size * 1024 < file.size) isSizeValid = false; break;
		}

		if(!isSizeValid) {
			obj.valid = false;
			obj.type = 'size';
			obj.msg = formatter(getText('over_capacity'), size+sizeType);
			return obj;
		}

		return obj;
	};

	// 브라우저 디텍팅
	var Detect = (function() {
		var s, match, isMobile;
		s = navigator.userAgent.toLowerCase();
		match = (/(webkit)[ \/](\w.]+)/).exec(s) || (/(opera)(?:.*version)?[ \/](\w.]+)/).exec(s) || (/(msie) ([\w.]+)/).exec(s) || !(/compatible/).test(s) && (/(mozilla)(?:.*? rv:([\w.]+))?/).exec(s) || [];
		if(navigator.appName === 'Netscape' && navigator.userAgent.search('Trident') !== -1) { match[1] = 'msie'; match[2] = '11'; }

		isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i).test(s);

		return {
			name: match[1] || '',
			version: match[2] || '0',
			isMobile : isMobile
		};
	})();

	//한글 조사
	var PostPosition = function(value, TYPE) {
		var enumpostPosition, noFinal, lastChar, pp;

		TYPE = String(TYPE);
		enumpostPosition = {
			1 : { useFinal : getText('suffix1'), noneFinal : getText('suffix2') },
			2 : { useFinal : getText('suffix3'), noneFinal : getText('suffix4') },
			3 : { useFinal : getText('suffix5'), noneFinal : getText('suffix5') },
			4 : { useFinal : getText('suffix7'), noneFinal : getText('suffix7') }
		};

		if(Object.keys(enumpostPosition).indexOf(TYPE) === -1) {
			throw new Error('TYPE 은 1,2,3,4 중 하나로 입력해주세요.');
		}

		if(!value) return '';

		noFinal = '가갸거겨고교구규그기개걔게계과괘궈궤괴귀긔까꺄꺼껴꼬꾜꾸뀨끄끼깨꺠께꼐꽈꽤꿔꿰꾀뀌끠나냐너녀노뇨누뉴느니내냬네녜놔놰눠눼뇌뉘늬다댜더뎌도됴두듀드디대댸데뎨돠돼둬뒈되뒤듸따땨떠뗘또뚀뚜뜌뜨띠때떄떼뗴똬뙈뚸뛔뙤뛰띄라랴러려로료루류르리래럐레례롸뢔뤄뤠뢰뤼릐마먀머며모묘무뮤므미매먜메몌뫄뫠뭐뭬뫼뮈믜바뱌버벼보뵤부뷰브비배뱨베볘봐봬붜붸뵈뷔븨빠뺘뻐뼈뽀뾰뿌쀼쁘삐빼뺴뻬뼤뽜뽸뿨쀄뾔쀠쁴사샤서셔소쇼수슈스시새섀세셰솨쇄숴쉐쇠쉬싀싸쌰써쎠쏘쑈쑤쓔쓰씨쌔썌쎄쎼쏴쐐쒀쒜쐬쒸씌아야어여오요우유으이애얘에예와왜워웨외위의자쟈저져조죠주쥬즈지재쟤제졔좌좨줘줴죄쥐즤짜쨔쩌쪄쪼쬬쭈쮸쯔찌째쨰쩨쪠쫘쫴쭤쮀쬐쮜쯰차챠처쳐초쵸추츄츠치채챼체쳬촤쵀춰췌최취츼카캬커켜코쿄쿠큐크키캐컈케켸콰쾌쿼퀘쾨퀴킈타탸터텨토툐투튜트티태턔테톄톼퇘퉈퉤퇴튀틔파퍄퍼펴포표푸퓨프피패퍠페폐퐈퐤풔풰푀퓌픠하햐허혀호효후휴흐히해햬헤혜화홰훠훼회휘희2459';
		lastChar = value.substring(value.length-1, value.length);
		pp = noFinal.indexOf(lastChar) === -1 ? enumpostPosition[TYPE].useFinal : enumpostPosition[TYPE].noneFinal;

		return pp;
	};

	//입력값이 태그로 인식되는것을 방지
	var HTMLText = function(text) {
		text = text || '';

		text = text.replace(/</g, '〈');
		text = text.replace(/>/g, '〉');

		return text;
	};

	// MRS2CodeDefinition에서 _로 공백처리되는 텍스트를 띄어쓰기로 변환하기 위해 만들었음
	var UnderbarToSapce = function(text) {
		text = text || '';

		text = text.replace(/_/g, ' ');

		return text;
	};

	//한글로 -년 -개월 표시
	var mmyyinKorean = function(data) {
		return (data / 12 >= 1 ? Math.floor(data / 12) + '년 ' : '') + (data % 12 > 0 ? '' + data% 12 + '개월' : data === 0 ? '0개월' : '');
	};

	var FillWithZero = function(num, len) {
		if(!len) throw new Error('0으로 채워진 후 전체 길이를 입력하세요');
		return (Array(len).join('0') + num).slice(-len);
	};

	var remainExistValue = function(obj) {
		var key;
		for(key in obj) {
			if(obj[key] === undefined) delete obj[key];
		}
	};

	var getTextareaRealLength = function(text) {
		// 브라우저 내장 validation에서 maxlength를 인식할때 \n이 들어갔을경우
		// 실제 길이(string의 length)와 브라우저가 측정한 길이가 달라서 맞춰주기 위한 함수
		//IE , Firefox validation에서 \n을 2글자로 인식하는것 같다
		var tmp, currentLength;
		tmp = text.match(/\n/g);
		currentLength =
			(D.detect.name === 'mozilla') ? text.length :
				tmp && tmp.length > 0 ? (tmp.length * 2) + (text.length - tmp.length) : text.length;
		return currentLength;
	};

	var numberSign = function(number) { //숫자앞에 부호 붙이기
		if(number > 0) return '+' + number;
		return number;
	};

	var unescapeHTML = function(str) {
		if (str == null) {
			return "";
		}
		return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, "\/").replace(/alert/g, '');
	};

	var preventXSS = function(str) {
		if (!str) {
			return '';
		}
		str = str.replace(/&/g, '&amp;');
		str = str.replace(/</g, '&lt;');
		str = str.replace(/>/g, '&gt;');
		str = str.replace(/\\/g, '&quot;');
		str = str.replace(/"/g, '&quot;');
		str = str.replace(/'/g, '&#x27;');
		str = str.replace(/\//g, '&#x2F;');

		return str;
	}

	var preventXSSExceptForNewline = function(str) {
		str = preventXSS(str);
		str = str.replace(/[\n\r]/g, '<br>');
		return str;
	}

	var quotesReplace = function (str) {
		if (!str) {
			return '';
		}
		str = str.replace(/"/g, '&quot;');

		return str;
	}

	//태그 벗기기 배열로 보내주셈
	var tagWrap = function(contents, tag) {
		tag.forEach(function(idx){
			switch (idx) {
				case 'img' :
					contents = contents.replace(/<img(.+?)>/g, function(matched, idx) {
						if(idx) {
							return D.unescapeHTML(matched);
						}
						return matched;
					});
					contents = contents.replace(/&lt;img(.+?)&gt;/g, function(matched, idx) {
						if(idx) {
							return D.unescapeHTML(matched);
						}
						return matched;
					});
					break;

				case 'a' :
					contents = contents.replace(/<a(.+?)\/a>/g, function(matched, idx) {
						if(idx) {
							return D.unescapeHTML(matched);
						}
						return matched;
					});
					contents = contents.replace(/&lt;a(.+?)\/a&gt;/g, function(matched, idx) {
						if(idx) {
							return D.unescapeHTML(matched);
						}
						return matched;
					});
					break;
			}
		})
		return contents;
	};

	var faceLiftTime = function(date, time){
		//페이스리프트에서 날짜와 시간이 분리됐는데 데이터를 넘길 때 합친 시간을 보내줘야해서 생김 ㅠㅠ
		var datetime = date + ' ' + time;
		return datetime;
	}

	//채용캠페인쪽에서 날짜가 ()에 감싸서 오는 경우 때문에 생김
	var unwrapDate = function(date, query) {
		date = date.replace('(','').replace(')','');
		date = D.date(date, query);
		return date;
	}

	/**
	 * Time을 Datetime에 붙이고 Time poperty는 삭제
	 * faceLift 화면에서는 날짜 선택 입력창이
	 * 기존:날짜 + 시간 하나에서
	 * 변경:날짜, 시간 두개로 나뉨
	 * 백엔드 변경을 피하기 위해 기존처럼 날짜와 시간을 합침
	 * @param param
	 * @returns {*}
	 */
	var getParamDatetimeCombined = function(param) {
		if(!faceLift()) return param;

		for(var key in param) {
			var strIndex = key.indexOf('Time');
			if(strIndex === -1) continue;

			var datetimeKey = key.substring(0, strIndex).concat('Datetime');
			var value = param[datetimeKey] + ' ' + param[key];
			param[datetimeKey] = value === ' ' ? '' : value;

			// if(!!param[datetimeKey] || !!param[key]) param[datetimeKey]=param[datetimeKey].trim();
			delete param[key];
		}

		return param;
	}

	/**
	 * Datetime에 날짜 + 시간이 한번에 온 값을
	 * Datetime과 Time에 나눔
	 * @param param
	 * @returns {*}
	 */
	var getParamDatetimeDivided = function(param) {
		if(!faceLift()) return param;

		for(var key in param) {
			var strIndex = key.indexOf('Datetime');
			if(strIndex === -1 || !param[key]) continue;

			var timeKey = key.substring(0, strIndex).concat('Time');
			var tmpArr = param[key].split(' ');
			param[key] = tmpArr[0];
			param[timeKey] = tmpArr[1];
		}

		return param;
	}

	return {
		param : Param,
		cookie : Cookie,
		json : Json,
		jsonrq : JsonRQ,
		bool : Bool,
		date : DateTime,
		dateStrToObj : convertStrDateToObjDate,
		dateDiff : DateTimeDiff,
		comma : Comma,
		unComma : UnComma,
		blank : Blank,
		masking : Masking,
		updateInputName : UpdateInputName,
		age : Age,
		arrToObj : ArrayToObject,
		exist : Exists,
		fileValid : FileValid,
		detect : Detect,
		postPosition : PostPosition,
		htmlText : HTMLText,
		underbarToSpace : UnderbarToSapce,
		MMYYinKOR : mmyyinKorean,
		zero : FillWithZero,
		obj : remainExistValue,
		realLength : getTextareaRealLength,
		number : numberSign,
		unescapeHTML: unescapeHTML,
		preventXSS : preventXSS,
		preventXSSExceptForNewline : preventXSSExceptForNewline,
		quotesReplace : quotesReplace,
		tagWrap : tagWrap,
		faceLiftTime : faceLiftTime,
		unwrapDate : unwrapDate,
		getParamDatetimeCombined: getParamDatetimeCombined,
		getParamDatetimeDivided: getParamDatetimeDivided
	};
})();

D.storage = (function() {
	var fn, errorMsg, storageData;

	// 파라미터 검증 시 반복 사용되는 메시지
	errorMsg = {
		firstParam : '첫번째 파라미터에 local 혹은 session을 입력하세요.',
		secondParam : '두번째 파라미터에 스토리지 key값을 string으로 입력하세요.',
		thirdParam : '세번째 파라미터에 스토리지 value값을 string/json으로 입력하세요.',
		fourthParam : '네번째 파라미터에 스토리지에 대한 코멘트를 입력하세요.'
	};

	// init 선언여부 판단
	storageData = {
		local : {},
		session : {}
	};

	fn = {
		init : function(type, key, value, comment) {
			var storageValue;

			fn.permitParam(type, key, value, comment);

			if(storageData[type][key] !== undefined) throw new Error(type+'Storage의 '+key+'는 이미 선언되었습니다.');

			switch(type) {
				case 'local' : storageValue = localStorage.getItem(key); break;
				case 'session' : storageValue = sessionStorage.getItem(key); break;
			}

			storageData[type][key] = true;

			// 초기화에선 이미 저장된 스토리지가 있을 경우에 데이터를 건드리지 않는다.
			if(storageValue !== null) return;

			fn.push(type, key, value);
		},
		set : function(type, key, value) {
			fn.permitParam(type, key, value);
			if(fn.inspectType(type, key, value)) fn.push(type, key, value);
		},
		push : function(type, key, value) {
			value = JSON.stringify(value);

			switch(type) {
				case 'local' : localStorage.setItem(key, value); break;
				case 'session' : sessionStorage.setItem(key, value); break;
			}
		},
		get : function(type, key) {
			var value;

			fn.permitParam(type, key);

			switch(type) {
				case 'local' : value = localStorage.getItem(key); break;
				case 'session' : value = sessionStorage.getItem(key); break;
			}

			return JSON.parse(value);
		},
		permitParam : function(type, key, value, comment) {
			if(type !== 'local' && type !== 'session') throw new Error(errorMsg.firstParam);
			if(key === undefined && typeof value !== 'string') throw new Error(errorMsg.secondParam);
			if(arguments.length > 2 && (value === undefined || typeof value === 'function')) throw new Error(errorMsg.thirdParam);
			if(arguments.length > 3 && (comment === undefined || typeof comment !== 'string')) throw new Error(errorMsg.fourthParam);
		},
		getType : function(value) {
			if(typeof value !== 'object') return 'String';
			else if(value instanceof Array) return 'Array';
			else if(value instanceof Object) return 'Object';
			throw new Error('D.storage에서 사용가능한 타입이 아닙니다. 데이터가 null이라면 다른 데이터를 입력하세요.');
		},
		inspectType : function(type, key, value) {
			var storageValue, valueType, storageValueType;

			if(storageData[type][key] === undefined) throw new Error(type+'Storage의 '+key+'는 선언된 적이 없습니다.');
			storageValue = fn.get(type, key);

			valueType = fn.getType(value);
			storageValueType = fn.getType(storageValue);

			// 1차 검사 - value와 스토리지의 타입이 맞나
			if(valueType !== storageValueType) {
				throw new Error('입력한 데이터와 스토리지의 데이터 타입이 같지 않습니다.\n' +
					'입력한 '+key+'의 데이터타입 : '+valueType+'\n' +
					'스토리지 '+key+'의 데이터타입 : '+storageValueType);
			}

			return true;
		}
	};

	return {
		init : fn.init,
		set : fn.set,
		get : fn.get
	};
})();
