<?php
if (!isset($_SERVER['HTTP_REFERER']) || strpos($_SERVER['HTTP_REFERER'],$_SERVER["SERVER_NAME"]) === false) {
	header("HTTP/1.0 418 Im a teapot");
	$RET = Array();
	$RET['text'] = 'No Tea for you!';
	$RET['code'] = 418;
	$RET['url'] = 'http://www.freakzero.com';

	echo json_encode($RET);
	exit();
}

require_once('auth.php');
require_once('../config.php');
setlocale(LC_TIME, 'en_EN');

function parseTweet($rawTxt) {		
	$parsed = preg_replace('@(https?://([-\w\.]+[-\w])+(:\d+)?(/([\w/_\.#-]*(\?\S+)?[^\.\s])?)?)@', '<a href="$1" target="_blank">$1</a>', $rawTxt);
	$parsed = preg_replace('/(^|\s)@([a-z0-9_]+)/i','$1<a target="_blank" href="http://www.twitter.com/$2">@$2</a>',$parsed);
	$parsed = preg_replace('/(^|\s)#([a-z0-9_]+)/i','$1<a target="_blank" href="http://www.twitter.com/search?q=$2">#$2</a>',$parsed);

	return $parsed;
}

$CACHE = 'mycache.txt';
$CACHELIMIT = 400;

$notweets = 1;
if(!(file_exists($CACHE) && is_readable($CACHE)) || (time()-filemtime($CACHE)>$CACHELIMIT)) {
	
	try {
		$connection = new TwitterOAuth($CONSUMER_KEY,$CONSUMER_SECRET,$ACCESS_TOKEN,$ACCESS_TOKEN_SECRET);
		$tweet = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=91910177"."&count=".$notweets);

		if (strtolower($tweet[0]->text) !== 'null') {
			$RET = Array();
			$RET["date"] = strftime("%a, %d %b %Y", strtotime($tweet[0]->created_at));
			$RET['retweet'] = $tweet[0]->retweet_count;
			$RET['favs'] = $tweet[0]->favorite_count;
			$RET["text"] = parseTweet($tweet[0]->text);
			$RET["url"] = 'https://twitter.com/freakzerodotcom/status/'.$tweet[0]->id_str;

			$data = json_encode($RET);
			file_put_contents($CACHE,$data);

		} else {
			$data = file_get_contents($CACHE);
		}

	} catch(OAuthException $e) {
		$data = file_get_contents($CACHE);
	}

} else {
		$data = file_get_contents($CACHE);
}

echo $data;

?>