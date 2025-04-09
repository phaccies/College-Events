<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(200);
  exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$comment_id = intval($data["comment_id"]);
$user_id = intval($data["user_id"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
  echo json_encode(["success" => false, "error" => $conn->connect_error]);
  exit();
}

// Only delete if comment belongs to the user
$stmt = $conn->prepare("DELETE FROM EventComments WHERE comment_id = ? AND user_id = ?");
$stmt->bind_param("ii", $comment_id, $user_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>