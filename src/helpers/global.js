export const globalHelper = {

    /**
     * Método que pega uma cor em HEX e retorna uma cor de texto que fica com contraste
     * @param {String} background
     */
    ajustarCorTexto(background) {

        // Converta a cor de fundo em RGB
        const r = parseInt(background.substr(1, 2), 16);
        const g = parseInt(background.substr(3, 2), 16);
        const b = parseInt(background.substr(5, 2), 16);

        // Determine o brilho usando a fórmula de luminosidade relativa
        const brilho = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

        // Defina a cor do texto com base no brilho
        const corTexto = brilho > 0.5 ? "#000000" : "#FFFFFF";

        return corTexto;
    },

    /**
     * Método que pega uma cor em rgb e transforma em hex
     */
    rgb2hex(rgb) {
        rgb = rgb.match(
            /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
        );
        return rgb && rgb.length === 4
            ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
            : "";
    },

    hex2rgb(hex){
        let hexStr = hex.replace(/#/g, "");
        var aRgbHex = hexStr.match(/.{1,2}/g);
        return {
          r: parseInt(aRgbHex[0], 16),
          g: parseInt(aRgbHex[1], 16),
          b: parseInt(aRgbHex[2], 16),
        };
    }

}
