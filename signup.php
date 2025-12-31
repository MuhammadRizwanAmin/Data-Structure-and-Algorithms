<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $conn = new mysqli("localhost", "root", "", "my_project");

    if ($conn->connect_error) {
        die("Connection Failed: " . $conn->connect_error);
    }

    $name  = $_POST['name'];
    $email = $_POST['email'];
    $cnic  = $_POST['cnic'];
    $phone = $_POST['phone'];
    $dob   = $_POST['dob'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO register (name, email, cnic, phone, dob, password)
            VALUES ('$name', '$email', '$cnic', '$phone', '$dob', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Record Inserted Successfully'); window.location.href='signup.html';</script>";
    } else {
        echo "<script>alert('Insert Failed: " . $conn->error . "');</script>";
    }

    $conn->close();
}
?>
