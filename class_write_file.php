<?php

class WriteFileMessage{
    private $file;
    function __construct(){
        $this->file='';
    }
    function createFileIfNotExists($dir, $nameFile){
        if(!file_exists($dir)){
            mkdir($dir, 0777, true);
        }
        $this->file = $dir.$nameFile;
        if(!file_exists($this->file)){
            // Cria o arquivo vazio
            // fopen($this->file, 'w'); 
            file_put_contents($this->file, ""); // Cria o arquivo vazio
        }
    }
    function getFilePath() {
        return $this->file;
    }
    function writeFile($roomId, $message, $nome){
        $content = $roomId.'|'.$message.'|'.$nome;
        if($this->file!=''){
            if(strpos($message, '//;;!!@@##') === false){
                // Abre o arquivo para escrita (modo 'a' para adicionar no final)
                $fileHandle = fopen($this->file, 'a');  
                fwrite($fileHandle, $content . PHP_EOL);  // Escreve no arquivo
                // fwrite($fileHandle, $content);  // Escreve no arquivo
                fclose($fileHandle);  // Fecha o arquivo após escrever
                // echo $content;
            }
        }else{
            echo "Erro: O arquivo não foi criado ainda.";
        }
    }
}