"use strict";

/*eslint quotes: ['off']*/
var Privacy = window.Privacy || function () {
  var LangData = function () {
    var currentLang, dataBase;
    currentLang = function () {
      //html Tag의 Language를 따른다.
      var tagLang = document.documentElement.getAttribute('lang');
      var list = {
        'ko': true,
        'ja': true
      };
      if (!list[tagLang]) return 'ko';
      return tagLang;
    }();
    dataBase = {
      "ko": {
        "title": "개인정보 다운로드 및 인쇄 요청사유",
        "guide": {
          "001": "정보통신망법상 개인정보 보호를 위하여 복사가 불가능합니다.",
          "002": "개인정보 다운로드 및 인쇄 요청사유(구체적인 목적)를 입력해주세요."
        },
        "button": {
          "cancel": "취소",
          "confirm": "확인"
        },
        "alert": {
          "001": "요청사유를 입력해주세요.",
          "002": "다운로드 및 인쇄를 할 수 없습니다.\n[환경설정]> [보안설정]> [개인정보 접근제한]> [개인정보 다운로드 제한] 에서 설정 값을 확인해 주세요."
        },
        "input": {
          "placeholder": "구체적인 목적을 입력해주세요.",
          "title": "다운로드 사유"
        }
      },
      "ja": {
        "title": "個人情報ダウンロードおよび印刷要請事由",
        "guide": {
          "001": "情報通信網法上、個人情報保護のためコピーができません。",
          "002": "個人情報ダウンロードおよび印刷要請事由（具体的な目的）を入力してください。"
        },
        "button": {
          "cancel": "キャンセル",
          "confirm": "保存"
        },
        "alert": {
          "001": "要請事由を入力してください。",
          "002": "ダウンロードおよび印刷ができません。\n[環境設定]> [セキュリティ設定]> [個人情報アクセス制限]>[個人情報ダウンロードおよび印刷] にて規定値をご確認ください。"
        },
        "input": {
          "placeholder": "具体的な事由を入力してください。",
          "title": "ダウンロード事由"
        }
      }
    };
    return dataBase[currentLang];
  }();
  return {
    LangData: LangData
  };
}();

/*****************************************
 * 개인정보 다운로드 제한
 *****************************************/
Privacy.downloadLimit = function () {
  var _downloadLimit,
    isLoaded = false; // 한 번만 실행하고 값을 덮어씌울 수 없어야 해서 싱글톤으로 작업한다.

  return function () {
    var downloadLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (isLoaded === false) {
      _downloadLimit = downloadLimit;
      isLoaded = true;
    }
    return _downloadLimit;
  };
}();

/*****************************************
 * 개인정보 다운로드, 인쇄시 사용하는 팝업
 *****************************************/

/* 사용법
Privacy.downLoad(function(reason) {
    console.log(reason);
});
*/
Privacy.downLoad = function (callback) {
  if (Privacy.downloadLimit() === false) {
    // 다운로드 권한체크
    if (callback instanceof Function === false) throw new Error('callback을입력하세요.');
    (function () {
      var fn = {
        init: function init() {
          fn.template();
          fn.event();
          $('#privacyDownloadReason').focus();
        },
        template: function template() {
          var facelift = D.bool($('#hasFaceLiftProduct').val());
          var t = [],
            marginTop;
          t.push('<div id="privacyDownloadwrapDialog" style="position:fixed;left:0;top:0;right:0;bottom:0;z-index:99999;background:rgba(0,0,0,0.5);">');
          t.push('	<div id="privacyDownloadDialog" style="');
          t.push('		box-sizing:border-box;position:relative;margin-left:auto;margin-right:auto;padding:30px;width:480px;');
          t.push('		background:#fbfbfb;border:1px solid #aaa;box-shadow:1px 3px 4px rgba(0,0,0,0.8);');
          t.push('		color:#000;');
          t.push('	">');
          t.push("        <div style=\"font-size: 18px; text-align: center; font-weight: bold; color: #283442;\">".concat(Privacy.LangData['title'], "</div>"));
          t.push("        <div style=\"font-size: 13px; font-weight: 400; margin-top: 11px;text-align: center;color: #283442;margin-bottom:20px;\">".concat(Privacy.LangData['guide']['002'], "</div>"));
          t.push("        <input style=\"margin-bottom: 11px;\" type=\"text\" class=\"text text100per\" id=\"privacyDownloadReason\" title=\"".concat(Privacy.LangData['input']['title'], "\" placeholder=\"").concat(Privacy.LangData['input']['placeholder'], "\">"));
          t.push('        <div style="text-align: right; margin-top: 9px;">');
          t.push("            <button type=\"button\" class=\"btn ".concat(facelift ? 'face-lift-add-question' : '', "\" data-button=\"ok\" style=\"width: 80px; height: 32px; ").concat(facelift ? 'line-height:9px;' : '', "\">").concat(Privacy.LangData['button']['confirm'], "</button>"));
          t.push("            <button type=\"button\" class=\"btn btn-ng ".concat(facelift ? 'face-lift-default-greenBtnline' : '', "\" data-button=\"cancel\" style=\"width: 80px; height: 32px; margin-right: 0;").concat(facelift ? 'line-height:0' : '', "\">").concat(Privacy.LangData['button']['cancel'], "</button>"));
          t.push('        </div>');
          t.push('    </div>');
          t.push('</div>');
          $('body').append(t.join(''));
          marginTop = (window.innerHeight - $('#privacyDownloadDialog').height()) / 2 - 100;
          $('#privacyDownloadDialog').css({
            marginTop: "".concat(marginTop, "px")
          });
        },
        event: function event() {
          //확인
          $('#privacyDownloadwrapDialog button[data-button="ok"]').on('click', function () {
            var reason = $('#privacyDownloadReason').val();
            if (reason === '') return Privacy.LangData['alert']['001'];
            $('#privacyDownloadwrapDialog').remove();
            callback(reason);
          });

          //취소
          $('#privacyDownloadwrapDialog button[data-button="cancel"]').on('click', function () {
            $('#privacyDownloadwrapDialog').remove();
          });
        }
      };
      fn.init();
    })();
  } else {
    Alert(Privacy.LangData['alert']['002']);
  }
};

/*****************************************
 * 우클릭, CTRL+C, CTRL+X 방지
 *****************************************/
Privacy.copyLimit = function () {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var msg = Privacy.LangData['guide']['001'];
  if (limit) {
    // 우클릭 방지
    $(document).on('contextmenu', function (e) {
      e.preventDefault();
    });

    // CTRL+C, CTRL+X 방지
    $(document).on('keydown', function (e) {
      var selection;
      if (e.ctrlKey === true && (e.keyCode === 67 || e.keyCode === 88)) {
        // 67 : c, 88 : x
        e.preventDefault();

        // CTRL+C를 여러번 하면 크롬에서 복사되는 것을 방지하기 위해 범위지정 무효화
        selection = window.getSelection();
        selection.removeRange(selection.getRangeAt(0));
        if (window.Alert) Alert(msg);else alert(msg);
      }
    });
  }
};

/*****************************************
 * 개인정보 마스킹 처리
 *****************************************/
Privacy.masking = function () {
  var _masking,
    isLoaded = false; // 한 번만 실행하고 값을 덮어씌울 수 없어야 해서 싱글톤으로 작업한다.

  return function () {
    var masking = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    if (isLoaded === false) {
      _masking = masking;
      isLoaded = true;
    }
    return _masking;
  };
}();

/*******************************************
 * CSRF 공격 방지 스크립트
 ********************************************/
Privacy.csrf = function (url) {
  var token;
  if (typeof url !== 'string') return Alert('올바른 URL 값을 입력해주세요.');
  $.ajax({
    method: 'get',
    dataType: 'json',
    url: url,
    async: false,
    cache: false,
    contentType: 'application/json;'
  }).done(function (x) {
    token = x;
  });
  return function (callback) {
    if (typeof token === 'undefined') return Alert("".concat(url, " \uD1A0\uD070 \uBC1C\uD589\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4."));
    callback(token);
  };
};
//# sourceMappingURL=privacy.js.map