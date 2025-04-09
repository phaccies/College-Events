<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

header('Content-Type: application/json');

$inData = json_decode(file_get_contents("php://input"), true);

$user_id = $inData["user_id"];

if (!isset($user_id)) {
    echo json_encode(["error" => "Missing user_id"]);
    exit;
}

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

$stmt = $conn->prepare("
    SELECT 
        Events.event_date,
        Events.name AS event_name,
        Events.privacy,
        Events.location_name,
        Events.description,
        Events.category,
        Events.contact_email,
        Events.contact_phone,
        RSO.name AS rso_name
    FROM Events
    LEFT JOIN RSO ON Events.rso_id = RSO.rso_id
    WHERE Events.created_by = ?
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$events = [];

while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode(["events" => $events]);

$stmt->close();
$conn->close();
?>
