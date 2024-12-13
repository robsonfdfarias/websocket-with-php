class Crypto{
    // async gerarChave() {
    //     const chave = await window.crypto.subtle.generateKey(
    //         {
    //             name: "AES-GCM",
    //             length: 256, // Tamanho da chave (pode ser 128, 192 ou 256)
    //         },
    //         true, // Se a chave pode ser exportada
    //         ["encrypt", "decrypt"] // Operações permitidas com a chave
    //     );
    //     return chave;
    // }
    // Gerar a chave de 256 bits a partir de uma palavra (como "minhachave")
    async gerarChave(palavra) {
        // Criar um encoder para transformar a palavra em um ArrayBuffer
        const encoder = new TextEncoder();
        const dados = encoder.encode(palavra);

        // Gerar o hash SHA-256 da palavra
        const hash = await window.crypto.subtle.digest("SHA-256", dados);

        // Importar a chave do hash gerado
        const chave = await window.crypto.subtle.importKey(
            "raw", // Tipo de chave (neste caso, chave bruta)
            hash, // O hash SHA-256
            {
                name: "AES-GCM", // O algoritmo que a chave vai usar
            },
            false, // A chave não pode ser exportada
            ["encrypt", "decrypt"] // Operações permitidas
        );

        return chave;
    }

    async criptografarMensagem(chave, mensagem) {
        // Geração de um vetor de inicialização (IV) aleatório para AES-GCM
        const iv = window.crypto.getRandomValues(new Uint8Array(12)); // IV com 12 bytes

        const encoder = new TextEncoder();
        const dados = encoder.encode(mensagem);

        const mensagemCriptografada = await window.crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv, // Vetor de inicialização (IV)
            },
            chave,
            dados
        );

        // Retorna a criptografia (incluir o IV para ser usado na descriptografia)
        return { mensagemCriptografada, iv };
    }

    async descriptografarMensagem(chave, mensagemCriptografada, iv) {
        const dadosDescriptografados = await window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv, // Usar o mesmo IV da criptografia
            },
            chave,
            mensagemCriptografada
        );

        const decoder = new TextDecoder();
        return decoder.decode(dadosDescriptografados);
    }

    async runCrypto(mensagem, key) {
        // const mensagem = document.getElementById("mensagem").value;
        const chave = await this.gerarChave(key);
        // const chave = key;

        // Criptografar a mensagem
        const { mensagemCriptografada, iv } = await this.criptografarMensagem(chave, mensagem);
        // console.log(new Uint8Array(mensagemCriptografada));
        const cryptoMessage = new Uint8Array(mensagemCriptografada);
        // console.log(iv)
        return {"message":cryptoMessage, "iv":iv};
    }

    async runDecrypto(mensagem, key, iv) {
        const chave = await this.gerarChave(key);
        const mensagemDescriptografada = await this.descriptografarMensagem(chave, mensagem, iv);
        // console.log("Mensagem Descriptografada:", mensagemDescriptografada);
        return mensagemDescriptografada;
    }

    async runDecryptoEx(mensagem, key) {
        // const mensagem = document.getElementById("mensagem").value;
        const chave = await this.gerarChave(key);
        // const chave = key;

        // Criptografar a mensagem
        const { mensagemCriptografada, iv } = await this.criptografarMensagem(chave, mensagem);
        console.log(mensagemCriptografada)
        // console.log("Mensagem Criptografada:", new Uint8Array(mensagemCriptografada));

        // Simulação de envio da mensagem para o servidor
        // (Você pode armazenar a criptografia e o IV no servidor)

        // Para efeito de exemplo, vamos descriptografar a mensagem imediatamente
        const mensagemDescriptografada = await this.descriptografarMensagem(chave, mensagemCriptografada, iv);
        // console.log("Mensagem Descriptografada:", mensagemDescriptografada);

        // Exibir a mensagem descriptografada
        // document.getElementById("resultado").innerText = "Mensagem Descriptografada: " + mensagemDescriptografada;
    }
}