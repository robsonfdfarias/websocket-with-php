class Conn{
    constructor(sala, nome){
        this.conn = null;
        this.sala = sala;
        this.nome = nome;
        this.status = true;
        this.urlAdmin = new AdminGetUrlRff();
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
                        ar.push('<div class="names" style="cursor:pointer;" onclick="newChatUser('+id+', \''+json.peoplo[id].nome+'\')">'+json.peoplo[id].nome+'</div>');
                    }
                }
                people.innerHTML+=ar.join('');
            }
            if(json.fromId || json.to){
                let idDest = json.fromId?json.fromId:json.to;
                let nameDest = json.fromName?json.fromName:json.toName;
                this.newChatUser(idDest, nameDest, json.message);
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
            nome: this.nome,
            to: null
        }
        if(this.urlAdmin.verifyVarUrl('to')){
            // json.to = this.urlAdmin.getUrlParameterValue('to');
            json.to = localStorage.getItem('to');
            console.log(json.to);
        }
        console.log('------------------------------------')
        console.log(this.urlAdmin.getUrlParameterValue('to'))
        console.log('------------------------------------')

        if(this.conn!=null && this.conn != undefined){
            // Enviar a mensagem com o ID da sala
            // this.conn.send(roomId + '|' + message + '|' + nam);
            this.conn.send(JSON.stringify(json));
        }
        
        // messageInput.value = ''; // Limpar o campo de mensagem
    }
    newChatUser(id, nome, message){
        if(document.getElementById('geral_'+id)){
            document.getElementById('text_'+id).innerHTML+='<p>'+message+'</p>';
        }else{
            let divGeneral = document.createElement('div');
            divGeneral.setAttribute('id', 'geral_'+id);
            divGeneral.setAttribute('class', 'geral');
            let divTitle = document.createElement('div');
            divTitle.setAttribute('id', 'title_'+id);
            divTitle.setAttribute('class', 'title');
            divTitle.innerHTML = '<strong>'+nome+'</strong>';
            let divContent = document.createElement('div');
            divContent.setAttribute('id', 'content_'+id);
            divContent.setAttribute('class', 'content');
            let divText = document.createElement('div');
            divText.setAttribute('id', 'text_'+id);
            divText.setAttribute('class', 'text');
            //insere a mensagem na divText
            divText.innerHTML+='<p>'+message+'</p>';
            let divSend = document.createElement('div');
            divSend.setAttribute('id', 'send_'+id);
            divSend.setAttribute('class', 'send');
            let inputMsg = document.createElement('textArea');
            inputMsg.setAttribute('style', 'width:calc(100% - 30px); min-height:30px;');
            inputMsg.setAttribute('placeholder', 'Digite a mensagem...');
            let btSend = document.createElement('button');
            btSend.setAttribute('onclik', 'sendMessageUser(this)');
            btSend.setAttribute('class', 'btsend');
            btSend.innerHTML='>';
            //insere o textarea e o btSend na divSend
            divSend.append(inputMsg);
            divSend.append(btSend);
            //insere a divText e a divSend na divContent
            divContent.append(divText);
            divContent.append(divSend);
            //insere a divTitle e a divContent na divGeneral
            divGeneral.append(divTitle);
            divGeneral.append(divContent);
            //insere a divGeneral na div conversations
            document.getElementById('conversations').append(divGeneral);
        }
    }
}