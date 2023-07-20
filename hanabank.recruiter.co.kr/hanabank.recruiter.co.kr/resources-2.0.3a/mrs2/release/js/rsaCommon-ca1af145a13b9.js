const RsaCommon = (() => {
    const fn = {
        getRsaParams() {
            let modulus, exponent;

            $.ajax({
                type: 'GET',
                url: '/mrs2/cus/rsa/get-public-key-spec',
                async: false
            }).done(function(res) {
                modulus = res.modulus;
                exponent = res.exponent;
            });

            return { modulus, exponent };
        }
    };

    return {
        getEncPassword(password) {
            const { modulus, exponent } = fn.getRsaParams();
            const rsa = new RSAKey();
            rsa.setPublic(modulus, exponent);
            return rsa.encrypt(password);
        }
    };
})();