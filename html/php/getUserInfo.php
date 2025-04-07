<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['email'])) {
  echo json_encode(['error' => 'Not logged in']);
  exit;
}

echo json_encode([
  'name' => $_SESSION['name'],
  'role' => $_SESSION['role'],
  'email' => $_SESSION['email']
]);
?>