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
$name = trim($inData["name"]);
$email = trim($inData["email"]);
$password = isset($inData["password"]) ? trim($inData["password"]) : "";

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");
if ($conn->connect_error) {
  echo json_encode(["success" => false, "error" => $conn->connect_error]);
  exit();
}

if ($password !== "") {
  $stmt = $conn->prepare("UPDATE Users SET name = ?, email = ?, password = ? WHERE user_id = ?");
  $stmt->bind_param("sssi", $name, $email, $password, $user_id);
} else {
  $stmt = $conn->prepare("UPDATE Users SET name = ?, email = ? WHERE user_id = ?");
  $stmt->bind_param("ssi", $name, $email, $user_id);
}

$stmt->execute();

if ($stmt->affected_rows >= 0) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => "Update failed."]);
}

$stmt->close();
$conn->close();
?>