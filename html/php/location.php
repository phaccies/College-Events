<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ✅ Read raw JSON input
$inData = json_decode(file_get_contents("php://input"), true);

$lname = trim($inData["lname"]);
$address = trim($inData["address"]);
$latitude = trim($inData["latitude"]);
$longitude = trim($inData["longitude"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Check if the location already exists based on lname
    $stmt = $conn->prepare("SELECT * FROM Location WHERE lname = ?");
    $stmt->bind_param("s", $lname);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // If location already exists
        returnWithError("Location already exists");
    } else {
        // Insert new location
        $stmt = $conn->prepare("INSERT INTO Location (lname, address, latitude, longitude) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssdd", $lname, $address, $latitude, $longitude);

        if ($stmt->execute()) {
            returnWithInfo("Location added successfully");
        } else {
            returnWithError("Error adding location");
        }
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
