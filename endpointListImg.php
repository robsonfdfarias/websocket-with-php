<?php

$imgsFile = 'emotions/';

function getImages($directory){
    $imageFiles = [];
    $exts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webm' ];
    $files = scandir($directory);
    foreach($files as $file){
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if(in_array($ext, $exts)){
            $imageFiles[] = $file;
        }
    }
    return $imageFiles;
}
$images = getImages($imgsFile);
echo json_encode($images);
// echo '<pre>'.print_r($images, true).'</pre>';