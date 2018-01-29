<?php

if (isset($_POST) && count($_POST) > 0) {
  require_once('../config.php');


  $MESSAGE = "*Name:* ".$_POST["name"]."\n";
  $MESSAGE .= "*Email:* ".$_POST['email']."\n";
  $MESSAGE .= "*Website:* ".$_POST["website"]."\n";
  $MESSAGE .= $_POST["message"];
  
  $jsonMsg = array(
    'payload' => json_encode(
      array('text' => $MESSAGE)
    )
  );

  $c = curl_init($SLACK_WEBHOOK);

  curl_setopt($c, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($c, CURLOPT_POST, true);
  curl_setopt($c, CURLOPT_POSTFIELDS, $jsonMsg);
  curl_exec($c);
  curl_close($c);
}
?>