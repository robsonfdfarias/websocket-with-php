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
        this.imgs = [];
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
    async printEmotions(){
        if(this.imgs.length<=0){
            await this.fetchListEmotions();
        }
        var html = '';
        this.imgs.forEach(function(img){
            // let image='<img src="emotions/'+img.substituto+'" class="emotionsIcons" onclick="insertEmotion(this)">';
            let image='<img src="emotions/'+img+'" class="emotionsIcons" onclick="insertEmotion(this)">';
            html+=image;
        });
        return html;
    }
    async fetchListEmotions(){
        let url = getURL();
        url = url.replace("websocket.html", "");
        url+='endpointListImg.php';
        await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "Application/json"
            }
        })
        .then(response=>response.json())
        .then(json=>{
            console.log(json)
            this.imgs = json;
        })
        .catch(error=>{
            console.log("Erro encontrado: "+error);
        })
    }
}