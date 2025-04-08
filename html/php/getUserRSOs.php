<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inData = json_decode(file_get_contents("php://input"), true);

if (isset($inData["user_id"])) {
    $user_id = trim($inData["user_id"]);

    $conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        // Get the RSOs the user is part of
        $stmt = $conn->prepare("SELECT RSO.rso_id, RSO.name 
                                FROM RSO_Members RM
                                JOIN RSO ON RM.rso_id = RSO.rso_id
                                WHERE RM.user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $rsoList = [];
        while ($row = $result->fetch_assoc()) {
            $rsoList[] = [
                "rso_id" => $row['rso_id'],
                "name" => $row['name']
            ];
        }

        if (count($rsoList) > 0) {
            sendResultInfoAsJson($rsoList);
        } else {
            returnWithError("No RSOs found for this user.");
        }

        $stmt->close();
        $conn->close();
    }
} else {
    returnWithError("Missing user_id");
}

function sendResultInfoAsJson($obj)
{
    header('Content-Type: application/json');
    echo json_encode($obj);
}

function returnWithError($err)
{
    $retValue = json_encode(["error" => $err]);
    sendResultInfoAsJson($retValue);
}
?>
