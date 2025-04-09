<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inData = json_decode(file_get_contents("php://input"), true);
$university_id = intval($inData["university_id"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => $conn->connect_error]);
    exit();
}

// Optional: make sure no dependent records exist before deleting
$stmt = $conn->prepare("DELETE FROM University WHERE university_id = ?");
$stmt->bind_param("i", $university_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Delete failed or university not found."]);
}

$stmt->close();
$conn->close();
?>