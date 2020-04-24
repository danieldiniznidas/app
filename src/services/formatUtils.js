class formatUtils {
    formatDate(date) {
        if (date === null) return "";
        //2019-07-22T00:29:05.000Z
        //012345678901234567890123
        //          1         2
        return date.substring(8, 10)
            + "/" + date.substring(5, 7)
            + "/" + date.substring(0, 4);
    }

    formatTime(date) {
        if (date === null) return "";
        return date.substring(11, 16);
    }

    formatDateTime(date) {
        if (date === null) return "";
        return this.formatDate(date) + " " + this.formatTime(date);
    }

    formatCPF_CNPJ(text){
        if (String(text).length === 11) {
            return text.substring(0, 3)
                + "." + text.substring(3, 6)
                + "." + text.substring(6, 10)
                + "-" + text.substring(8, 11);
        }

        if (String(text).length === 14) {
            return text.substring(0, 2)
                + "." + text.substring(2, 5)
                + "." + text.substring(5, 8)
                + "/" + text.substring(8, 12)
                + "-" + text.substring(12, 14);
        }

        return text;
    }
}

export default new formatUtils();