<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$event_id = intval($data["event_id"]);
$user_id = intval($data["user_id"]);
$comment = trim($data["comment"]);
$rating = intval($data["rating"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
  echo json_encode(["success" => false, "error" => $conn->connect_error]);
  exit();
}

$stmt = $conn->prepare("INSERT INTO EventComments (event_id, user_id, comment, rating) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iisi", $event_id, $user_id, $comment, $rating);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>