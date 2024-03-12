// Based on https://gist.github.com/nelsonJM/7813384
var CookieUtil = {
    get: function (name) {
        const nameEncoded = encodeURIComponent(name) + "=";
        const start = document.cookie.indexOf(nameEncoded);
        let value = null;
        let end;
            
        if (start > -1) {
            end = document.cookie.indexOf(";", start);
            if (end == -1) end = document.cookie.length;
            value = decodeURIComponent(document.cookie.substring(start + nameEncoded.length, end));
        } 

        return value;
    },
    set: function (name, value, expires) {
        var value = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    
        if (expires instanceof Date) {
            value += "; Expires=" + expires.toGMTString();
        }
    
        value += "; Path=/";
        value += "; SameSite=None"
        value += "; Secure";
    
        document.cookie = value;
    },
    unset: function (name, path, domain, secure) {
        this.set(name, "", new Date(0), path, domain, secure);
    }
};