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

    public function __construct() {
        // Inicialização
    }

    // Quando um novo cliente se conecta
    public function onOpen(ConnectionInterface $conn) {
        echo "Novo cliente conectado ({$conn->resourceId})\n";
        // print_r($conn);
        $conn->send(json_encode(array("message"=>"", "peoplo"=>count($this->clientsByRoom))));
    }

    // Quando uma mensagem é recebida
    public function onMessage(ConnectionInterface $from, $msg) {
        // Supomos que a mensagem seja algo como: "salaId|mensagem|name"
        list($roomId, $message, $nome) = explode('|', $msg);
        
        // Verifica se o cliente já está na sala
        if (!isset($this->clientsByRoom[$roomId])) {
            $this->clientsByRoom[$roomId] = [];
        }

        // Adiciona o cliente à sala
        $this->clientsByRoom[$roomId][$from->resourceId] = $from;

        // Envia a mensagem para todos os clientes na mesma sala
        foreach ($this->clientsByRoom[$roomId] as $client) {
            if ($from !== $client) {
                if(strpos($message, '//;;!!@@##') !== false){
                    $me = "<b>{$nome} entrou na sala.</b>";
                }else{
                    $me = "<b>{$nome}</b>: {$message}";
                }
                $client->send($me);
            }
        }

        // Enviar para o próprio cliente também, caso queira
        if(strpos($message, '//;;!!@@##') === false){
            $from->send("<b>{$nome}</b>: {$message}");
        }
    }

    // Quando um cliente se desconecta
    public function onClose(ConnectionInterface $conn) {
        echo "Cliente desconectado ({$conn->resourceId})\n";

        // Remover o cliente de todas as salas
        foreach ($this->clientsByRoom as $roomId => $clients) {
            if (isset($clients[$conn->resourceId])) {
                unset($this->clientsByRoom[$roomId][$conn->resourceId]);
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
