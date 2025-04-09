<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inData = json_decode(file_get_contents("php://input"), true);

$name = trim($inData["name"]);
$location = trim($inData["location"]);
$description = trim($inData["description"]);
$num_students = intval($inData["num_students"]);
$image = trim($inData["image"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => $conn->connect_error]);
    exit();
}

$stmt = $conn->prepare("
    INSERT INTO University (name, location, description, num_students, image)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param("sssds", $name, $location, $description, $num_students, $image);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "id" => $stmt->insert_id]);
} else {
    echo json_encode(["success" => false, "error" => "Insert failed."]);
}

$stmt->close();
$conn->close();
?>
