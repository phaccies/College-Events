<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

$inData = json_decode(file_get_contents("php://input"), true);

$rso_id = intval($inData["rso_id"]);
$user_id = intval($inData["user_id"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
  echo json_encode(["success" => false, "error" => $conn->connect_error]);
  exit();
}

$stmt = $conn->prepare("DELETE FROM RSO_Members WHERE rso_id = ? AND user_id = ?");
$stmt->bind_param("ii", $rso_id, $user_id);
$stmt->execute();

$success = $stmt->affected_rows > 0;
$stmt->close();
$conn->close();

echo json_encode(["success" => $success]);
?>