"use strict";

var RsaCommon = function () {
  var fn = {
    getRsaParams: function getRsaParams() {
      var modulus, exponent;
      $.ajax({
        type: 'GET',
        url: '/mrs2/cus/rsa/get-public-key-spec',
        async: false
      }).done(function (res) {
        modulus = res.modulus;
        exponent = res.exponent;
      });
      return {
        modulus: modulus,
        exponent: exponent
      };
    }
  };
  return {
    getEncPassword: function getEncPassword(password) {
      var _fn$getRsaParams = fn.getRsaParams(),
        modulus = _fn$getRsaParams.modulus,
        exponent = _fn$getRsaParams.exponent;
      var rsa = new RSAKey();
      rsa.setPublic(modulus, exponent);
      return rsa.encrypt(password);
    }
  };
}();
//# sourceMappingURL=rsaCommon.js.map