class Conn{
    constructor(sala, nome, key){
        this.conn = null;
        this.sala = sala;
        this.nome = nome;
        this.status = true;
        this.urlAdmin = new AdminGetUrlRff();
        this.chatWindow = new ChatWindow();
        this.crypto = new Crypto();
        this.key = key;
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

        this.conn.onmessage = async function(e) {
            let json = JSON.parse(e.data);
            // console.log(json)
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
            var message='---';
            if(json.message!=null && json.message!="saiu" && json.message!='//;;!!@@##' && json.message!=''){
                // console.log(new Uint8Array(JSON.parse(json.iv)).buffer)
                // console.log(new Uint8Array(JSON.parse(json.message)).buffer)
                message = await this.crypto.runDecrypto(new Uint8Array(JSON.parse(json.message)).buffer, this.key, new Uint8Array(JSON.parse(json.iv)).buffer);
                // console.log(message)
                message = '<b>'+json.fromName+': </b>'+message;
                // console.log('******************')
            }else if(json.message=="saiu"){
                message = '<b>'+json.fromName+'</b> saiu da sala. ';
            }else{
                if(json.fromName!=null){
                    message = '<b>'+json.fromName+'</b> acabou de entrar. ';
                }else{
                    return;
                }
            }
            if(json.fromId || json.to){
                let idDest = json.fromId?json.fromId:json.to;
                let nameDest = json.fromName?json.fromName:json.toName;
                // this.newChatUser(idDest, nameDest, json.message);
                // this.chatWindow.newChatUser(idDest, nameDest, json.message);
                this.chatWindow.newChatUser(idDest, nameDest, message);
                if(json.myId===null){
                    // this.animateTitle(idDest, json.message);
                    this.animateTitle(idDest, message);
                }
            }else{
                var messages = document.getElementById("messages");
                // messages.innerHTML += "<p>" + json.message + "</p>";
                messages.innerHTML += "<p>" + message + "</p>";
            }
            
        }.bind(this);
        
    }
    onMessage(){
        let json = {
            roomId: this.sala,
            message: '//;;!!@@##',
            nome: this.nome,
            to: null,
            newCon: true,
            iv:[]
        }
        if(this.status){
            this.conn.send(JSON.stringify(json));
            this.status = false;
        }
    }
    sendMessage(roomId, message, to) {
        let json = {
            roomId: roomId,
            message: message.message,
            iv: message.iv,
            nome: this.nome,
            to: to,
            newCon: false
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