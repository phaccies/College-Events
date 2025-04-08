<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit();
}

$inData = json_decode(file_get_contents("php://input"), true);
$user_id = intval($inData["user_id"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
  echo json_encode(["error" => $conn->connect_error]);
  exit();
}

// Get ALL public events (not filtered by university)
$public = [];
$stmt = $conn->prepare("SELECT * FROM Events WHERE privacy = 'public'");
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
  $public[] = $row;
}
$stmt->close();

// Get events from RSOs the user joined
$rsoEvents = [];
$stmt = $conn->prepare("
  SELECT e.*
  FROM Events e
  JOIN RSO_Members rm ON e.rso_id = rm.rso_id
  WHERE rm.user_id = ?
");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
  $rsoEvents[] = $row;
}
$stmt->close();
$conn->close();

echo json_encode([
  "public" => $public,
  "rso" => $rsoEvents
]);
?>