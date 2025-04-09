<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inData = json_decode(file_get_contents("php://input"), true);

if (isset($inData["name"]) && isset($inData["admin_id"]) && isset($inData["university_id"])) {
    $name = trim($inData["name"]);
    $admin_id = intval($inData["admin_id"]);
    $university_id = intval($inData["university_id"]);

    $conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        // Check for existing RSO with the same name
        $checkStmt = $conn->prepare("SELECT rso_id FROM RSO WHERE name = ?");
        $checkStmt->bind_param("s", $name);
        $checkStmt->execute();
        $checkStmt->store_result();

        if ($checkStmt->num_rows > 0) {
            returnWithError("An RSO with this name already exists.");
        } else {
            // Insert into RSO table
            $stmt = $conn->prepare("INSERT INTO RSO (name, admin_id, university_id) VALUES (?, ?, ?)");
            $stmt->bind_param("sii", $name, $admin_id, $university_id);

            if ($stmt->execute()) {
                $rso_id = $conn->insert_id;

                // Insert into RSO_Members
                $memberStmt = $conn->prepare("INSERT INTO RSO_Members (rso_id, user_id) VALUES (?, ?)");
                $memberStmt->bind_param("ii", $rso_id, $admin_id);

                if ($memberStmt->execute()) {
                    sendResultInfoAsJson([
                        "success" => "RSO created and admin added as member.",
                        "rso_id" => $rso_id
                    ]);
                } else {
                    returnWithError("RSO created, but failed to add admin as member.");
                }

                $memberStmt->close();
            } else {
                returnWithError("Failed to create RSO.");
            }

            $stmt->close();
        }

        $checkStmt->close();
        $conn->close();
    }
} else {
    returnWithError("Missing required fields.");
}

function sendResultInfoAsJson($obj)
{
    header('Content-Type: application/json');
    echo json_encode($obj);
}

function returnWithError($err)
{
    sendResultInfoAsJson(["error" => $err]);
}
?>
