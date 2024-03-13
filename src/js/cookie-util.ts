export default class CookieUtil {
    public static get(name: string) {
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
    }

    public static set(name: string, value: string, expires: Date) {
        var valueEncoded = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    
        if (expires instanceof Date) {
            valueEncoded += "; Expires=" + expires.toUTCString();
        }
    
        valueEncoded += "; Path=/";
        valueEncoded += "; SameSite=None"
        valueEncoded += "; Secure";
    
        document.cookie = valueEncoded;
    }

    public static unset(name: string) {
        CookieUtil.set(name, "", new Date(0));
    }
};