<?php
// Enable full error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    returnWithError("Invalid request method");
}

// ✅ Read raw JSON input
$inData = json_decode(file_get_contents("php://input"), true);

// If no input data received, show error
if (!$inData) {
    returnWithError("Invalid or empty input data");
}

// Event details from the request
$name = trim($inData["name"]);
$description = trim($inData["description"]);
$category = trim($inData["category"]);
$event_date = trim($inData["event_date"]);
$event_time = trim($inData["event_time"]);
$privacy = trim($inData["privacy"]);
$location_name = trim($inData["location_name"]);
$rso_id = trim($inData["rso_id"]);
$university_id = trim($inData["university_id"]);
$created_by = trim($inData["created_by"]);
$contact_phone = trim($inData["contact_phone"]);
$contact_email = trim($inData["contact_email"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    returnWithError("Database connection failed: " . $conn->connect_error);
} else {
    // Check if location exists (by lname) to ensure it’s in the Location table
    $stmt = $conn->prepare("SELECT lname FROM Location WHERE lname = ?");
    if ($stmt === false) {
        returnWithError("Failed to prepare statement: " . $conn->error);
    }

    $stmt->bind_param("s", $location_name);
    if (!$stmt->execute()) {
        returnWithError("Failed to execute statement: " . $stmt->error);
    }

    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        // If location exists, proceed with adding the event
        // Adjust privacy logic: set 'rso' if private, 'public' if public
        if ($privacy === "private") {
            $privacy = "rso";
        } elseif ($privacy === "public") {
            $privacy = "public";
        } else {
            returnWithError("Invalid privacy value");
        }

        $stmt = $conn->prepare("INSERT INTO Events (name, description, category, event_date, event_time, privacy, location_name, rso_id, university_id, created_by, contact_phone, contact_email) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        if ($stmt === false) {
            returnWithError("Failed to prepare statement for inserting event: " . $conn->error);
        }

        $stmt->bind_param("ssssssssssss", $name, $description, $category, $event_date, $event_time, $privacy, $location_name, $rso_id, $university_id, $created_by, $contact_phone, $contact_email);

        if (!$stmt->execute()) {
            returnWithError("Failed to execute insert event statement: " . $stmt->error);
        }

        returnWithInfo("Event added successfully");
    } else {
        returnWithError("Location not found");
    }

    $stmt->close();
    $conn->close();
}

function sendResultInfoAsJson($obj)
{
    header('Content-Type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($message)
{
    $retValue = json_encode(["message" => $message, "error" => ""]);
    sendResultInfoAsJson($retValue);
}
?>
