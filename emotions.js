class Emotions{
    constructor(){
        // this.json = [
        //     { palavra: "[:-)]", substituto: '<img src="emotions/sorrindo.png">' },
        //     { palavra: "[:-(]", substituto: '<img src="emotions/triste.png">' }
        // ];
        this.json = [
            { palavra: "[:-)]", substituto: 'sorrindo.png' },
            { palavra: "[:-(]", substituto: 'triste.png' }
        ];
    }
    substituirEmoticons(frase) {
        var substituicoes = this.json;
        substituicoes.forEach(function(substituicao) {
            let regex = new RegExp(substituicao.palavra, 'g');  // Cria a regex para cada emoticon
            let img = '<img src="emotions/'+substituicao.substituto+'" class="emotionsIcons">';
            // frase = frase.replace(regex, substituicao.substituto);  // Substitui o emoticon pelo HTML
            frase = frase.replace(regex, img);  // Substitui o emoticon pelo HTML
        });
        return frase;
    }
    printEmotions(){
        var html = '';
        this.json.forEach(function(img){
            let image='<img src="emotions/'+img.substituto+'" class="emotionsIcons" onclick="insertEmotion(this)">';
            html+=image;
        });
        return html;
    }
}