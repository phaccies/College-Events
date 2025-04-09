<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// --- Handle preflight OPTIONS request ---
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- Enable error reporting (for dev) ---
error_reporting(E_ALL);
ini_set('display_errors', 1);

// --- Connect to database ---
$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => $conn->connect_error]);
    exit();
}

// --- Query all universities ---
$sql = "SELECT * FROM University";
$result = $conn->query($sql);

$universities = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $universities[] = $row;
    }
    echo json_encode(["success" => true, "universities" => $universities]);
} else {
    echo json_encode(["success" => false, "error" => "Query failed"]);
}

$conn->close();
?>
