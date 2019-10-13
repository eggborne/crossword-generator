<?php include("config.php");
	$postData = json_decode(file_get_contents("php://input"), TRUE);
  $array = $postData['array'];
  $creator = $postData['creator'];

  $userSql="INSERT INTO `$db_name`.`diagrams` (`array`, `creator`) VALUES ('$array', '$creator');";
  $userResult=mysqli_query($link,$userSql);

  if ($userResult) {
    echo 'DIAGRAM SAVED :)'
  } else {
    echo 'DIAGRAM NOT SAVED.';
  }
	mysqli_close($link);
?>