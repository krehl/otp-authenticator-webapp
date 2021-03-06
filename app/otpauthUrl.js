module.exports = {

    build: (secret, account, issuer) => {
        account = account || 'unknown';
        let label = account;
        if (issuer) {
            label = `${issuer} (${account})`;
        }

        let result = 'otpauth://totp/' + encodeURIComponent(label) + '?secret=' + encodeURIComponent(secret);
        if (account && issuer) {
            result += '&issuer=' + encodeURIComponent(issuer);
        }
        return result;
    },

    parse: (otpauthUrlString) => {
        const otpauthUrl = new URL(otpauthUrlString);

        const result = {};

        if (otpauthUrl.searchParams.get('secret')) {
            result.secret = decodeURIComponent(otpauthUrl.searchParams.get('secret'));
        }

        const label = decodeURIComponent(otpauthUrl.pathname.replace(RegExp('^//totp/'), ''));
        if (!label.includes(":")) {
            result.account = label;
        } else {
            result.account = label.split(':')[1];
            result.issuer = label.split(':')[0];
        }
        if (otpauthUrl.searchParams.get('issuer')) {
            result.issuer = decodeURIComponent(otpauthUrl.searchParams.get('issuer'));
        }

        return result;
    }
};