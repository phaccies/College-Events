<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);


//echo "PHP is working!";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


$inData = json_decode(file_get_contents("php://input"), true);

$user_id = isset($inData["user_id"]) ? intval($inData["user_id"]) : 0;

if ($user_id == 0) {
    echo json_encode(["error" => "Missing user_id"]);
    exit();
}

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit();
}

$stmt = $conn->prepare("
  SELECT 
    r.rso_id, r.name, r.status, r.admin_id, r.university_id,
    EXISTS (
      SELECT 1 FROM RSO_Members rm 
      WHERE rm.rso_id = r.rso_id AND rm.user_id = ?
    ) AS joined
  FROM RSO r
  JOIN Users u ON u.university_id = r.university_id
  WHERE u.user_id = ?
");

$stmt->bind_param("ii", $user_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

$rsos = [];

while ($row = $result->fetch_assoc()) {
    $rsos[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(["rsos" => $rsos]);
?>