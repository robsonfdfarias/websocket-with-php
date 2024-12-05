class Conn{
    constructor(sala, nome){
        this.conn = null;
        this.sala = sala;
        this.nome = nome;
        this.status = true;
    }
    runSocket(){
        // Definindo as variáveis usuario e token
        const usuario = this.nome;
        const salaClient = this.sala;
        // console.log(salaClient)
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
                        ar.push('<div class="names">'+json.peoplo[id].nome+'</div>');
                    }
                }
                people.innerHTML+=ar.join('');
            }
            var messages = document.getElementById("messages");
            // messages.innerHTML += "<p>" + e.data + "</p>";
            messages.innerHTML += "<p>" + json.message + "</p>";
        };
        
    }
    onMessage(){
        let json = {
            roomId: this.sala,
            message: '//;;!!@@##',
            nome: this.nome
        }
        if(this.status){
            // this.conn.send(sala + '| //;;!!@@## |' + nome);
            this.conn.send(JSON.stringify(json));
            this.status = false;
        }
        // this.conn.send(sala + '|' + message + '|' + nome);
    }
    sendMessage(roomId) {
        var message = document.getElementById("messageInput");
        let json = {
            roomId: roomId,
            message: message.value,
            nome: this.nome
        }

        if(this.conn!=null && this.conn != undefined){
            // Enviar a mensagem com o ID da sala
            // this.conn.send(roomId + '|' + message + '|' + nam);
            this.conn.send(JSON.stringify(json));
        }
        
        // messageInput.value = ''; // Limpar o campo de mensagem
    }
}