<?php
/**
 * Instruções de uso: 
 * primeiro é preciso rodar o servidor usando o comando: php server.php
 * depois é necessário rodar o logar.html abrindo no navegador, você pode usar o plugin Go Live do VS Code ou
 * usar um aplicativo que simule um servidor para rodar a página.
 * Abra o arquivo logar.html em quantas páginas você quiser e em quantos navegadores precisar, 
 * cada aba e navegador será reconhecido como um cliente diferente e poderão interagir na sala.
 */
require 'vendor/autoload.php'; // Carregar as dependências do Composer
require 'class_write_file.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;  
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

class WebSocketServer implements MessageComponentInterface {
    // Armazenar as conexões dos clientes por sala
    protected $clientsByRoom = [];
    protected $users = [];

    public function __construct() {
        // Inicialização
    }

    public function getUsersByIdRoom($sala){
        $peoplo = [];
        foreach($this->users[$sala] as $p){
            $peoplo[$p['id']] = $p;
        }
        return $peoplo;
    }
    public function sendMessageForUsers($ar, $function, $obj){
        foreach ($obj[$ar["roomId"]] as $client) {
            $ar["client"] = $client;
            $val = $function($ar);
            if($val!=null){
                return $val;
            }
        }
    }

    // Quando um novo cliente se conecta
    public function onOpen(ConnectionInterface $conn) {
        // Acessando os parâmetros da URL (como "usuario" e "sala")
        $url = $conn->httpRequest->getUri();  // Obter a URL da requisição
        parse_str(parse_url($url, PHP_URL_QUERY), $queryParams);  // Parse da query string
        $usuario = isset($queryParams['usuario']) ? $queryParams['usuario'] : 'Desconhecido';
        $sala = isset($queryParams['sala']) ? $queryParams['sala'] : 'Desconhecido';
        echo "Conexão aberta: Usuário: $usuario, Sala: $sala\n";
        echo "Novo cliente conectado ({$conn->resourceId})\n";
        if(count($this->users)>0){
            $peoplo = $this->getUsersByIdRoom($sala);
            $conn->send(json_encode(array("fromName"=>null, "message"=>"", "peoplo"=>$peoplo)));
        }
    }

    // Quando uma mensagem é recebida
    public function onMessage(ConnectionInterface $from, $msg) {
        $dados = json_decode($msg, true); //true é para o array ser associativo
        $roomId = $dados['roomId'];
        $message = $dados['message'];
        $iv = $dados['iv'];
        $nome = $dados['nome'];
        $to = $dados['to'];
        $newCon = $dados['newCon'];
        // echo '<pre>'.print_r($message, true).'</pre>';

        $conv = json_encode($message);
        $ivConv = json_encode($iv);
        // echo '(((('.$newCon.'))))';
        // Verifica se o cliente já está na sala
        if (!isset($this->clientsByRoom[$roomId])) {
            $this->clientsByRoom[$roomId] = [];
        }
        // echo '<pre>'.print_r($this->users, false).'</pre>';

        // Adiciona o cliente à sala
        $this->users[$roomId][$from->resourceId]["nome"] = $nome;
        $this->users[$roomId][$from->resourceId]["id"] = $from->resourceId;
        $this->clientsByRoom[$roomId][$from->resourceId] = $from;

        // Envia a mensagem para todos os clientes na mesma sala
        $this->sendMessageForUsers(array("roomId"=>$roomId, "message"=>$conv, "iv"=>$ivConv, "newCon"=>$newCon, "from"=>$from, "nome"=>$nome, "to"=>$to), function($ar){
            if ($ar["from"] !== $ar["client"]) {
                //checa se a mensagem tem um destionatário específico ou é para todos da sala
                if($ar['to']!=null){
                    if($ar['to']==$ar['client']->resourceId){
                        $ar["client"]->send(json_encode(array(
                            "message"=>$ar['message'], 
                            "iv"=>$ar['iv'],
                            "fromName"=>$ar['nome'],
                            "peoplo"=>$this->getUsersByIdRoom($ar["roomId"]), 
                            "fromId"=>$ar['from']->resourceId, 
                            "fromName"=>$ar['nome'],
                            "roomId"=>$ar["roomId"],
                            "myId"=>null
                        )));
                        return;
                    }
                }else{
                    if($ar['newCon'] == 1){
                        $me = null;
                    }else{
                        $me = $ar['message'];
                    }
                    // echo '===========>>>>>'.$ar['client']->resourceId.'=='.$ar["from"]->resourceId.'<<<<<<<===================';
                    $ar["client"]->send(json_encode(array("message"=>$me, "fromName"=>$ar['nome'], "iv"=>$ar['iv'], "peoplo"=>$this->getUsersByIdRoom($ar["roomId"]), "fromId"=>null, "roomId"=>$ar["roomId"])));
                }
            }
            return null;
        }, $this->clientsByRoom);
        $mens = array(
            "message"=>$conv,
            "iv"=>$ivConv,
            "fromName"=>$nome,
            "to"=>null,
            "peoplo"=>$this->getUsersByIdRoom($roomId),
            "roomId"=>$roomId,
            "myId"=>$from->resourceId
        );
        if($to!=null){
            $mens['to'] = $to;
            $nomeDest = $this->getNameTo($to, $roomId);
            // echo $nomeDest;
            if($nomeDest!=null || $nomeDest!=''){
                $mens['toName']=$nomeDest;
            }
        }

        // Testa se a mensagem é diferente da abertura de conexão ('//;;!!@@##')
        if($newCon != 1){
            // echo 'Testando se false: '.$newCon.' **********';
            // Enviar para o próprio cliente também, caso queira
            $from->send(json_encode($mens));
        }
    }

    public function getNameTo($id, $sala){
        return $this->sendMessageForUsers(array("roomId"=>$sala, "id"=>$id), function ($ar){
            if(($ar['id']==$ar['client']['id'])==1){
            print_r('Valor: '.($ar['id']==$ar['client']['id']));
                return $ar['client']['nome'];
            }
        }, $this->users);
    }

    // Quando um cliente se desconecta
    public function onClose(ConnectionInterface $conn) {
        echo "Cliente desconectado ({$conn->resourceId})\n";
        $room='';
        // Remover o cliente de todas as salas
        foreach ($this->clientsByRoom as $roomId => $clients) {
            if (isset($clients[$conn->resourceId])) {
                $room=$roomId;
                unset($this->clientsByRoom[$roomId][$conn->resourceId]);
            }
        }
        $this->sendMessageForUsers(array("roomId"=>$room, "idUser"=>$conn->resourceId), function($ar){
            // $ar["client"]->send(json_encode(array("message"=>"<p style='color:red;'>".$this->users[$ar["roomId"]][$ar["idUser"]]["nome"]." saiu da sala.</p>", "peoplo"=>$this->getUsersByIdRoom($ar["roomId"]))));
            $ar["client"]->send(json_encode(array("message"=>"saiu", "nome"=>$this->users[$ar["roomId"]][$ar["idUser"]]["nome"], "peoplo"=>$this->getUsersByIdRoom($ar["roomId"]))));
            return null;
        }, $this->clientsByRoom);
        // Remover o usuário de todas as salas
        foreach ($this->users as $roomId => $clients) {
            if (isset($clients[$conn->resourceId])) {
                unset($this->users[$roomId][$conn->resourceId]);
            }
        }
    }

    // Quando ocorre um erro
    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Erro: {$e->getMessage()}\n";
        $conn->close();
    }
}

// Iniciar o servidor WebSocket
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new WebSocketServer()
        )
    ),
    8080 // Porta onde o servidor vai escutar
);

echo "Servidor WebSocket rodando em ws://localhost:8080\n";
$server->run();
