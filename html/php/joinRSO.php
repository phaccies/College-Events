<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$inData = json_decode(file_get_contents("php://input"), true);
$user_id = intval($inData["user_id"]);
$rso_id = intval($inData["rso_id"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => $conn->connect_error]);
    exit();
}

// Check if user is already a member
$check = $conn->prepare("SELECT 1 FROM RSO_Members WHERE user_id = ? AND rso_id = ?");
$check->bind_param("ii", $user_id, $rso_id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "Already a member."]);
    $check->close();
    $conn->close();
    exit();
}
$check->close();

// Insert membership
$stmt = $conn->prepare("INSERT INTO RSO_Members (rso_id, user_id) VALUES (?, ?)");
$stmt->bind_param("ii", $rso_id, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Join failed."]);
}

$stmt->close();
$conn->close();
?>