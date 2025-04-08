<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

// Get JSON input
$inData = json_decode(file_get_contents("php://input"), true);

// Sanitize input
$name = trim($inData["name"]);
$email = trim($inData["email"]);
$password = trim($inData["password"]);
$role = isset($inData["role"]) ? trim($inData["role"]) : "student";
$university_id = isset($inData["university_id"]) ? intval($inData["university_id"]) : 4;

// Connect to database
$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    sendJSON(["id" => 0, "error" => $conn->connect_error]);
    exit();
}

// Check for existing email
$stmt = $conn->prepare("SELECT email FROM Users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    sendJSON(["id" => -1, "error" => "Email already registered"]);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Insert new user (plain password for now)
$stmt = $conn->prepare("INSERT INTO Users (name, email, password, role, university_id) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssssi", $name, $email, $password, $role, $university_id);
$stmt->execute();

$user_id = $stmt->insert_id;

$stmt->close();
$conn->close();

sendJSON(["id" => $user_id, "error" => ""]);


// Utility
function sendJSON($arr) {
    header("Content-Type: application/json");
    echo json_encode($arr);
}
?>