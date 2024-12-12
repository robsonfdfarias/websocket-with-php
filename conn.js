class Conn{
    constructor(sala, nome){
        this.conn = null;
        this.sala = sala;
        this.nome = nome;
        this.status = true;
        this.urlAdmin = new AdminGetUrlRff();
        this.chatWindow = new ChatWindow();
    }
    runSocket(){
        // Definindo as variáveis usuario e token
        const usuario = this.nome;
        const salaClient = this.sala;
        let people = document.getElementById('peopleAr');
        this.conn = new WebSocket(`ws://localhost:8080?usuario=${usuario}&sala=${salaClient}`);
        this.conn.onopen = function(e) {
            console.log("Conectado ao servidor WebSocket");
            this.onMessage();
        }.bind(this);

        this.conn.onmessage = function(e) {
            let json = JSON.parse(e.data);
            if(json.peoplo){
                people.innerHTML='';
                let ar = [];
                for(const id in json.peoplo){
                    if(json.peoplo.hasOwnProperty(id)){
                        ar.push('<div class="names" style="cursor:pointer;" onclick="newChatUser('+id+', \''+json.peoplo[id].nome+'\')">'+json.peoplo[id].nome+'</div>');
                    }
                }
                people.innerHTML+=ar.join('');
            }
            if(json.fromId || json.to){
                let idDest = json.fromId?json.fromId:json.to;
                let nameDest = json.fromName?json.fromName:json.toName;
                // this.newChatUser(idDest, nameDest, json.message);
                this.chatWindow.newChatUser(idDest, nameDest, json.message);
                if(json.myId===null){
                    this.animateTitle(idDest, json.message);
                }
            }else{
                var messages = document.getElementById("messages");
                // messages.innerHTML += "<p>" + e.data + "</p>";
                messages.innerHTML += "<p>" + json.message + "</p>";
            }
            
        }.bind(this);
        
    }
    onMessage(){
        let json = {
            roomId: this.sala,
            message: '//;;!!@@##',
            nome: this.nome,
            to: null
        }
        if(this.status){
            this.conn.send(JSON.stringify(json));
            this.status = false;
        }
    }
    sendMessage(roomId, message, to) {
        let json = {
            roomId: roomId,
            message: message,
            nome: this.nome,
            to: to
        }

        if(this.conn!=null && this.conn != undefined){
            // Enviar a mensagem com o ID da sala
            this.conn.send(JSON.stringify(json));
        }
    }
    async animateTitle(id, message){
        let title = document.getElementById('title_'+id);
        if(title){
            let count = 0;
            let change = false;
            this.playAudio();
            var originalTitle = document.title;  // Armazena o título original
            async function animate(){
                if(count<10){
                    document.title = (count % 2 === 0) ? message : originalTitle;
                    count++;
                    setTimeout(animate, 500);
                }else{
                    // title.removeAttribute('style');
                    document.title = originalTitle;  // Restaura o título original
                    return;
                }
                if(change){
                    title.setAttribute('style', 'background-color:green;');
                    change=false;
                }else{
                    title.setAttribute('style', 'background-color:red;');
                    change=true;
                }
            }
            await animate();
        }
    }
    playAudio(){
        var audio = document.getElementById('audio');
        audio.play();
    }
}