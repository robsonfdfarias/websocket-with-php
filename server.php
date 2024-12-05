<?php
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
    public function sendMessageForUsers($ar, $function){
        foreach ($this->clientsByRoom[$ar["roomId"]] as $client) {
            $ar["client"] = $client;
            $function($ar);
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
            $conn->send(json_encode(array("message"=>"", "peoplo"=>$peoplo)));
        }
    }

    // Quando uma mensagem é recebida
    public function onMessage(ConnectionInterface $from, $msg) {
        $dados = json_decode($msg, true); //true é para o array ser associativo
        $roomId = $dados['roomId'];
        $message = $dados['message'];
        $nome = $dados['nome'];
        // Verifica se o cliente já está na sala
        if (!isset($this->clientsByRoom[$roomId])) {
            $this->clientsByRoom[$roomId] = [];
        }

        // Adiciona o cliente à sala
        $this->users[$roomId][$from->resourceId]["nome"] = $nome;
        $this->users[$roomId][$from->resourceId]["id"] = $from->resourceId;
        $this->clientsByRoom[$roomId][$from->resourceId] = $from;

        // Envia a mensagem para todos os clientes na mesma sala
        $this->sendMessageForUsers(array("roomId"=>$roomId, "message"=>$message, "from"=>$from, "nome"=>$nome), function($ar){
            if ($ar["from"] !== $ar["client"]) {
                if(strpos($ar['message'], '//;;!!@@##') !== false){
                    $me = "<b style='color:green;'>{$ar["nome"]} entrou na sala.</b>";
                }else{
                    $me = "<b>{$ar["nome"]}</b>: {$ar['message']}";
                }
                $ar["client"]->send(json_encode(array("message"=>$me, "peoplo"=>$this->getUsersByIdRoom($ar["roomId"]))));
            }
        });

        // Enviar para o próprio cliente também, caso queira
        if(strpos($message, '//;;!!@@##') === false){
            $from->send(json_encode(array("message"=>"<b>{$nome}</b>: {$message}")));
        }
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
            $ar["client"]->send(json_encode(array("message"=>"<p style='color:red;'>".$this->users[$ar["roomId"]][$ar["idUser"]]["nome"]." saiu da sala.</p>", "peoplo"=>$this->getUsersByIdRoom($ar["roomId"]))));
        });
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
