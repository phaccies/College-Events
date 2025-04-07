<?php
session_start();
if (!isset($_SESSION['user_id'])) {
  header("Location: login.html");
  exit;
}
?>

<!DOCTYPE html>
<html>
<head><title>Dashboard</title></head>
<body>
  <h1>Welcome, <?php echo htmlspecialchars($_SESSION['name']); ?>!</h1>
  <p>Role: <?php echo $_SESSION['role']; ?></p>
  <p>University ID: <?php echo $_SESSION['university_id']; ?></p>
  <a href="logout.php">Log out</a>
</body>
</html>