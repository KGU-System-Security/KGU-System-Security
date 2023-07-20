'use strict';

(function() {
var LinkedForm = function(target) {
	if(!target) return false;
	this.interval;
	this.target = target;
	this._initLinkedForm();
};

$.extend(LinkedForm.prototype, {
	_initLinkedForm : function() {
		this._bindLinkedEvent();
	},
	_bindLinkedEvent : function() {
		//관계이벤트에 대한 함수
		
		//Select에 대한 관계이벤트
		this._bindLinkedSelect();

		//Radio에 대한 관계이벤트
		this._bindLinkedRadio();
		
		//Checkbox에 대한 관계이벤트
		this._bindLinkedCheckbox();
		
		//Input[text]에 대한 관계이벤트
		this._bindLinkedInputText();

		//Linked에 대한 초기화 이벤트
		this._initLinked();
	},
	_initLinked : function() {
		//Linked에 대한 초기화 이벤트
		var obj = this;
		
		// 셀렉트
		$(this.target).find('select[data-rel-id]').each(function() {
			$(this).change();
		});

		// 체크박스
		$(this.target).find('label[data-rel-id], span[data-rel-id], div[data-rel-id]').each(function() {
			var arrValue = [];
			$(this).find('input[type=checkbox]:checked').each(function() { arrValue.push($(this).val()); });
            obj._bindLinkedWith(this, arrValue);
		});
		
		// 라디오
		$(this.target).find('span[data-rel-id] input:radio:checked, div[data-rel-id] input:radio:checked').each(function() {
            $(this).click();
		});

		// 텍스트
		$(this.target).find('input[data-rel-id]').each(function() {
			obj._bindLinkedInputTextDefault(this);
		});
	},
	_bindLinkedSelect : function() {
		//Select관련 Linked 이벤트를 타입별로 바인딩
		var obj = this;
		$(this.target).on('change', 'select[data-rel-id]', function(e) {
			var type = $(this).attr('data-rel-type');
			switch (type) {
				case 'with' : //다음 값을 포함할 때 이벤트 발생
					obj._bindLinkedSelectWith(this);
				break;
				case 'without' : //다음 값을 포함하지 않을 때 이벤트 발생
					obj._bindLinkedSelectWithout(this);
				break;
				case 'complex' : //복합형 이벤트 발생
					obj._bindLinkedSelectComplex(this);
				break;				
				default : // 값이 ''만 아니면 이벤트 발생
					obj._bindLinkedSelectDefault(this);
				break;
			}
		});
	},
	_bindLinkedSelectWith : function(_this) {
		//Select관련 With 속성 Linked 이벤트를 바인딩
		var obj = this;
		var value = $(_this).val();
		obj._bindLinkedWith(_this, value);
	},
	_bindLinkedSelectWithout : function(_this) {
		//Select관련 Without 속성 Linked 이벤트를 바인딩
		var obj = this;
		var value = $(_this).val();
		obj._bindLinkedWithout(_this, value);
	},
	_bindLinkedSelectComplex : function(_this) {
		//Select관련 Complex 속성 Linked 이벤트를 바인딩
		var obj = this;
		var value = $(_this).val();
		obj._bindLinkedComplex(_this, value);
	},	
	_bindLinkedSelectDefault : function(_this) {
		//Select관련 Default 속성 Linked 이벤트를 바인딩
		var obj = this;
		var value = $(_this).val();
		obj._bindLinkedDefault(_this, value);
	},
	_bindLinkedRadio : function() {
		//Radio관련 Linked 이벤트를 타입별로 바인딩
		var obj = this;
		var arrTarget = [
			'label[data-rel-id] input[type=radio]',
			'span[data-rel-id] input[type=radio]',
			'div[data-rel-id] input[type=radio]'
		];

		$(this.target).on('click', arrTarget.join(), function(index) {
			var parent = $(this).closest('[data-rel-id]')[0];
			var type = $(parent).attr('data-rel-type');
			var value = $(this).val();
			switch (type) {
				case 'with' : //다음 값을 포함할 때 이벤트 발생
					obj._bindLinkedWith(parent, value);
				break;
				case 'without' : //다음 값을 포함하지 않을 때 이벤트 발생
					obj._bindLinkedWithout(parent, value);
				break;
				case 'complex' : //복합형 이벤트 발생
					obj._bindLinkedComplex(parent, value);
				break;	
				default : // 값이 ''만 아니면 이벤트 발생
					obj._bindLinkedDefault(parent, value);
				break;
			}
		});
	},
	_bindLinkedCheckbox : function() {
		//Checkbox관련 Linked 이벤트를 타입별로 바인딩
		var obj = this;
		var arrTarget = [
			'label[data-rel-id] input[type=checkbox]',
			'span[data-rel-id] input[type=checkbox]',
			'div[data-rel-id] input[type=checkbox]'
		];
		$(this.target).on('click, change', arrTarget.join(), function() {
			var parent = $(this).closest('[data-rel-id]')[0];
			var name = $(this).attr('name');
			var arrValue = [];
			if(!name) return false;

			$('input[name="'+name+'"]:checkbox:checked').each(function() {
				arrValue.push($(this).val());
			});
			obj._bindLinkedWith(parent, arrValue);
		});
	},
	_bindLinkedCheckboxWith : function(_this) {
		//Checkbox관련 With 속성 Linked 이벤트를 바인딩
		var obj = this;
         
		$(_this).on('click, change', 'input[type=checkbox]', function(e) {
			var name = $(this).attr('name');
			var arrValue = [];

			if(!name) return false;

			$('input[name="'+name+'"]:checkbox:checked').each(function() {
				arrValue.push($(this).val());
			});
			obj._bindLinkedWith(_this, arrValue);
		});
	},
	_bindLinkedInputText : function() {
		//Input[Text]관련 Linked 이벤트를 바인딩
		var obj = this;
		$(this.target).on('focus', 'input[data-rel-id]', function(e) {
			var obj2 = this;
			obj.interval = setInterval(function() {
				obj._bindLinkedInputTextDefault(obj2);
			}, 200);
		}).on('blur', 'input[data-rel-id]', function(e) {
			obj._bindLinkedInputTextDefault(this); // 인터벌 돌기 전에 blur을 하면 이벤트가 발생하지 않는 경우가 있어서 blur시 실행
			clearInterval(obj.interval);
		});
	},
	_bindLinkedInputTextDefault : function(_this) {
		//Input[Text]가 빈칸인지 체크
		var value = $.trim($(_this).val()); // 내용없이 스페이스만 치면 false
		this._bindLinkedDefault(_this, value);
	},
	_bindLinkedWith : function(_this, value) {
		//With 속성 Linked 이벤트 공통모듈
		var obj = this;
		var id = $(_this).attr('data-rel-id');
		var arrId = [];
		var arr = $(_this).attr('data-rel-value') ? $(_this).attr('data-rel-value').split(',') : [];
		var result = false;
		var i;
		if(!id) return false;

		// Complex 처리를 위해서 id를 배열처리함
		if(id.match(' ')) {
			arrId = id.split(' ');
		} else {
			arrId.push(id);
		}

		if(value instanceof Array === true) { // checkbox 처리
			for(i in value) {
				if(this._findValueArray(arr, value[i])) {
					result = true;
					break;
				}
			}
		} else {
			result = this._findValueArray(arr, value);
		}

		for(i=0; i<arrId.length; i++) {
			if(result && value) {
				$(this.target).find('[data-rel-target="'+arrId[i]+'"]').prop({disabled:false}).each(function() {
					obj._enabledChildren(this);
				});
				$(this.target).find('[data-rel-target="'+arrId[i]+'"][data-rel-hide=true]').show();
			} else {
				$(this.target).find('[data-rel-target="'+arrId[i]+'"]').prop({disabled:true}).each(function() {
					obj._disabledChildren(this);
				});
				$(this.target).find('[data-rel-target="'+arrId[i]+'"][data-rel-hide=true]').hide();
			}
		}
	},
	_enabledChildren : function(_this) {
		var i, obj = this, arrId = [],
			id = $(_this).attr('data-rel-id') ? $(_this).attr('data-rel-id') : $(_this).closest('label[data-rel-id], span[data-rel-id], div[data-rel-id]').attr('data-rel-id');

		if(!id) return false;

		arrId = id.split(' ');
		if(!arrId.length) arrId.push(id);

		for(i in arrId) {
			$(this.target).find('label[data-rel-id~="'+arrId[i]+'"] input[type=radio]:checked, span[data-rel-id~="'+arrId[i]+'"] input[type=radio]:checked, div[data-rel-id~="'+arrId[i]+'"] input[type=radio]:checked').each(function() {
				var _this = this;
				setTimeout(function() { $(_this).click(); }, 50); // 이유는 모르지만 시간차가 없으면 이벤트가 발생하지 않음 17.08.21 민종
			});

			$(this.target).find('select[data-rel-id~="'+arrId[i]+'"]').each(function() {
				$(this).change();
			});

			$(this.target).find('label[data-rel-id~="'+arrId[i]+'"], span[data-rel-id~="'+arrId[i]+'"], div[data-rel-id~="'+arrId[i]+'"]').each(function() {
				var arrValue = [];
				$(this).find('input[type=checkbox]:checked').each(function() {
					arrValue.push($(this).val());
				});
				obj._bindLinkedWith(this, arrValue);
			});
			$(this.target).find('input[data-rel-id~="'+arrId[i]+'"]').each(function() {
				obj._bindLinkedInputTextDefault(this);
			});
		}
	},
	_disabledChildren : function(_this) {
		var i, obj = this, arrId = [],
			id = $(_this).attr('data-rel-id') ? $(_this).attr('data-rel-id') : $(_this).closest('label[data-rel-id], span[data-rel-id], div[data-rel-id]').attr('data-rel-id');

		if(!id) return false;

		arrId = id.split(' ');
		if(!arrId.length) arrId.push(id);

		for(i in arrId) {
			$(this.target).find('[data-rel-target="'+arrId[i]+'"]').prop({disabled:true}).each(function() {
				obj._disabledChildren(this);
			});
			$(this.target).find('[data-rel-target="'+arrId[i]+'"][data-rel-hide=true]').hide();
		}
	},
	_bindLinkedWithout : function(_this, value) {
		//Without 속성 Linked 이벤트 공통모듈
		var obj = this;
		var id = $(_this).attr('data-rel-id');
		var arr = $(_this).attr('data-rel-value').split(',');
		var result = this._findValueArray(arr, value);

		if(!id) return false;

		if(!result && value) {
			$(this.target).find('[data-rel-target="'+id+'"]').prop({disabled:false}).each(function() {
				obj._enabledChildren(this);
			});
			$(this.target).find('[data-rel-target="'+id+'"][data-rel-hide=true]').show();
		} else {
			$(this.target).find('[data-rel-target="'+id+'"]').prop({disabled:true}).each(function() {
				obj._disabledChildren(this);
			});
			$(this.target).find('[data-rel-target="'+id+'"][data-rel-hide=true]').hide();
		}
	},
	_bindLinkedComplex : function(_this, value) {
		//Complex 속성 Linked 이벤트 공통모듈
		var obj = this;
		var id = $(_this).attr('data-rel-id');
		var arrValue = $(_this).attr('data-rel-value').split(' ');
		var arrId;
		var i, arr, result;
		if(!id) return false;

		arrId = id.split(' ');

		for(i=0; i<arrId.length; i++) {
			arr = arrValue[i].split(',');
			result = this._findValueArray(arr, value);
			if(result && value) {
				$(this.target).find('[data-rel-target="'+arrId[i]+'"]').prop({disabled:false}).each(function() {
					obj._enabledChildren(this);
				});
				$(this.target).find('[data-rel-target="'+arrId[i]+'"][data-rel-hide=true]').show();
			} else {
				$(this.target).find('[data-rel-target="'+arrId[i]+'"]').prop({disabled:true}).each(function() {
					obj._disabledChildren(this);
				});
				$(this.target).find('[data-rel-target="'+arrId[i]+'"][data-rel-hide=true]').hide();
			}
		}
	},
	_bindLinkedDefault : function(_this, value) {
		//Default 속성 Linked 이벤트 공통모듈
		var id = $(_this).attr('data-rel-id');
		var obj = this;
		if(!id) return false;
		if(value) {
			$(this.target).find('[data-rel-target="'+id+'"]').prop({disabled:false}).each(function() {
				obj._enabledChildren(this);
			});
			$(this.target).find('[data-rel-target="'+id+'"][data-rel-hide=true]').show();
		} else {
			$(this.target).find('[data-rel-target="'+id+'"]').prop({disabled:true}).each(function() {
				obj._disabledChildren(this);
			});
			$(this.target).find('[data-rel-target="'+id+'"][data-rel-hide=true]').hide();
		}
	},
	_findValueArray : function(arr, value) {
		var i;
		//배열에서 해당되는 값 검색
		for(i in arr) {
			if(value === arr[i]) return true;
		}
		return false;
	}
});

$.fn.linkedForm = function() {
	new LinkedForm(this);
};
})(jQuery);

$(function() {
	// body에 내에 설정되어 있는 rel attribute를 활성화
	$('body').linkedForm();
});