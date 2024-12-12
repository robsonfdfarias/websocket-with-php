class ChatWindow{
    constructor(){
        this.emotions = new Emotions();
        this.galery = this.emotions.printEmotions();
    }
    newChatUser(id, nome, message){
        if(document.getElementById('geral_'+id)){
            // Já existe, não precisa criar...
        }else{
            let divGeneral = document.createElement('div');
            divGeneral.setAttribute('id', 'geral_'+id);
            divGeneral.setAttribute('class', 'geral');
            divGeneral.setAttribute('onclick', 'confirmNotification(this)');
            let divEmotions = document.createElement('div');
            divEmotions.setAttribute('id', 'emotions_'+id);
            divEmotions.setAttribute('class', 'divEmotions');
            divEmotions.innerHTML=this.galery;
            let divCloseEmotion = document.createElement('div');
            divCloseEmotion.setAttribute('id', 'closeEmotion');
            divCloseEmotion.setAttribute('onclick', 'closeDivEmotions(this)');
            divCloseEmotion.setAttribute('class', 'btCloseDivEmotions');
            divCloseEmotion.innerHTML='X';
            let divTitle = document.createElement('div');
            divTitle.setAttribute('id', 'title_'+id);
            divTitle.setAttribute('class', 'title');
            divTitle.setAttribute('onclick', 'maxMinizar(this)');
            divTitle.innerHTML = '<strong>'+nome+'</strong>';
            let divClose = document.createElement('div');
            divClose.setAttribute('id', 'close');
            divClose.setAttribute('onclick', 'closeWindow(this)');
            divClose.setAttribute('class', 'btCloseWindow');
            divClose.innerHTML='X';
            let divContent = document.createElement('div');
            divContent.setAttribute('id', 'content_'+id);
            divContent.setAttribute('class', 'content');
            let divText = document.createElement('div');
            divText.setAttribute('id', 'text_'+id);
            divText.setAttribute('class', 'text');
            let divSend = document.createElement('div');
            divSend.setAttribute('id', 'send_'+id);
            divSend.setAttribute('class', 'send');
            let inputMsg = document.createElement('div');
            inputMsg.setAttribute('class', 'divMsg');
            inputMsg.setAttribute('contentEditable', true);
            inputMsg.setAttribute('id', 'fieldText_'+id);
            let btSend = document.createElement('button');
            btSend.setAttribute('class', 'btsend');
            btSend.setAttribute('onclick', 'sendMessageTo(this)');
            btSend.innerHTML='>';
            let btImg = document.createElement('img');
            btImg.src="emotions/sorrindo.png";
            btImg.setAttribute('onclick', 'document.getElementById(\''+divEmotions.getAttribute("id")+'\').style.display=\'block\'')
            //insere o textarea e o btSend na divSend
            divSend.append(inputMsg);
            divSend.append(btSend);
            divSend.append(btImg);
            //insere a divText e a divSend na divContent
            divContent.append(divText);
            divContent.append(divSend);
            //Insere o bt close no title
            divTitle.append(divClose);
            //Insere a divCloseEmotions na divEmotions
            divEmotions.append(divCloseEmotion);
            //insere a divTitle, divContent e a divEmotions na divGeneral
            divGeneral.append(divTitle);
            divGeneral.append(divContent);
            divGeneral.append(divEmotions);
            //insere a divGeneral na div conversations
            document.getElementById('conversations').append(divGeneral);
        }

        if(message!=null){
            // Se message não for null, então insere a mensagem na div text_id
            document.getElementById('text_'+id).innerHTML+='<p>'+message+'</p>';
        }
    }
}