<?php
include("config.php");

$postData = json_decode(file_get_contents("php://input"), TRUE);
$tbl_name = $postData['length'];

// Retrieve data from database
$sql="SELECT * FROM `$tbl_name`";
$result=mysqli_query($link,$sql);
// Start looping rows in mysql database.
while($rows=mysqli_fetch_assoc($result)){
    echo json_encode($rows);
    echo ' || ';
}
mysqli_close($link);
?>