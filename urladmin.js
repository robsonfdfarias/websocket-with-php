class AdminGetUrlRff{
    verifyPostsRffVar(){
        let url = window.location.href.split('?');
        let partes = url[1].split('&');
        let final = '';
        for(let i=0; i<partes.length; i++){
            if(!partes[i].includes('page=')){
                final = '&'+partes[i];
            }
            if(partes[i].includes('posts_rff')){
                return false;
            }
        }
        window.location.href = '?page=Posts_Rff&posts_rff=1'+final;
    }

    verifyVarUrl(varName){
        let url = window.location.href.split('?');
        let partes = url[1].split('&');
        for(let i=0; i<partes.length; i++){
            if(partes[i].includes(varName)){
                return true;
            }
        }
        return false;
    }

    removeUrlParameter(parameter) {
        // Obter a URL atual
        const url = window.location.href;
        // Criar um objeto URL
        const urlObj = new URL(url);
        // Remover o parâmetro
        urlObj.searchParams.delete(parameter);
        // Atualizar a URL sem recarregar a página
        window.history.replaceState({}, '', urlObj);
    }

    addUrlParameter(varName, value) {
        // Obter a URL atual
        const url = window.location.href;
        // Criar um objeto URL
        const urlObj = new URL(url);
        // Remover o parâmetro
        urlObj.searchParams.set(varName, value);
        // Atualizar a URL sem recarregar a página
        window.history.replaceState({}, '', urlObj);
    }

    getUrlParameterValue(varName) {
        // Obter a URL atual
        const url = window.location.href;
        // Criar um objeto URL
        const urlObj = new URL(url);
        // retorna o valor do parâmetro
        return urlObj.searchParams.get(varName);
    }


    returnUrlWithParameterUpdate(parameter, value) {
        // Obter a URL atual
        const url = window.location.href;
        // Criar um objeto URL
        const urlObj = new URL(url);
        //seta o parâmetro novamente
        urlObj.searchParams.set(parameter, value);
        return urlObj.toString();
    }
    
}