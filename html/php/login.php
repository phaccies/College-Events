//login
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

$email = trim($inData["email"]);
$password = trim($inData["password"]);

$conn = new mysqli("localhost", "knight_user", "activate!", "knightsocial");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT user_id, name, email, password, role, university_id FROM Users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if ($password === $row['password']) { // Use password_verify() if hashed
            $_SESSION['email'] = $row['email'];
            $_SESSION['role'] = $row['role'];
            $_SESSION['user_id'] = $row['user_id'];
            $_SESSION['university_id'] = $row['university_id'];
            $_SESSION['name'] = $row['name'];
            returnWithInfo($row['user_id'], $row['name'], $row['email'], $row['role'], $row['university_id']);


        } else {
            returnWithError("Invalid Password");
        }
    } else {
        returnWithError("No Records Found");
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
    $retValue = '{"name":"","email":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($user_id, $name, $email, $role, $university_id)
{
    $retValue = json_encode([
        "user_id" => $user_id,
        "name" => $name,
        "email" => $email,
        "role" => $role,
        "university_id" => $university_id,
        "error" => ""
    ]);
    sendResultInfoAsJson($retValue);
}

?>