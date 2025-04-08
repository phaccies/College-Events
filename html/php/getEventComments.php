<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

$inData = json_decode(file_get_contents("php://input"), true);

if (!isset($inData["event_id"])) {
    echo json_encode(["error" => "Missing event_id"]);
    exit();
}

$event_id = intval($inData["event_id"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit();
}

$stmt = $conn->prepare("
    SELECT c.comment_id, c.user_id, u.name AS user_name, c.comment, c.rating, c.created_at, c.updated_at
    FROM EventComments c
    JOIN Users u ON c.user_id = u.user_id
    WHERE c.event_id = ?
    ORDER BY c.created_at DESC
");
$stmt->bind_param("i", $event_id);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
while ($row = $result->fetch_assoc()) {
    $comments[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(["comments" => $comments]);
?>