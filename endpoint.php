<?php
// Definindo o cabeçalho para informar que a resposta é JSON
header('Content-Type: application/json');
// Permitir que qualquer domínio acesse o recurso
header("Access-Control-Allow-Origin: *"); // Permite todos os domínios. Pode limitar a domínios específicos como: "https://meusite.com"

// Permitir métodos específicos, como GET, POST, etc.
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

// Permitir cabeçalhos específicos
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Se for uma requisição OPTIONS (usada pelo navegador para pré-checar a requisição), retorne um 200 OK imediatamente
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
// Suponha que você recebeu os dados via POST
$data = json_decode(file_get_contents("php://input"));
$nome = $data->nome;
$message = $data->mensagem;
$sala = $data->sala;
$dir = __FILE__;
$dir2 = str_replace("endpoint.php","", $dir);
$dir3 ='file/';
$dir4 = $dir3.date('Y/m/d/');

// mkdir($dir4.''.$sala, 0777, true);

include_once('class_write_file.php');
$file = new WriteFileMessage();
$file->createFileIfNotExists($dir4, $sala.'.txt');
$file->writeFile($sala, $message, $nome);
echo json_encode(array(
    "status"=>"Sucesso",
    "nome"=>$nome,
    "sala"=>$dir4.$sala,
    "Mensagem"=>$data->mensagem
));


// Vamos simular que o PHP processe esses dados
// $response = array(
//     'status' => 'success',
//     'message' => 'Dados recebidos com sucesso!',
//     'user' => array(
//         'sala' => $data->sala,
//         'name' => $data->nome,
//         'mensagem' => $data->mensagem
//     )
// );

// // Retornando a resposta como JSON
// echo json_encode($response);
// echo json_encode(array("nome"=>"Robson"));