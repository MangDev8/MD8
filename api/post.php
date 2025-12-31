<?php
header("Content-Type: application/json");

$file = "../data/posts.json";

// Ambil data dari JS
$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data["user"]) ||
    empty($data["title"]) ||
    empty($data["content"])
) {
    echo json_encode(["status" => "error", "msg" => "Data tidak lengkap"]);
    exit;
}

// Ambil data lama
$posts = [];
if (file_exists($file)) {
    $posts = json_decode(file_get_contents($file), true);
}

// Tambah post baru
$posts[] = [
    "user" => htmlspecialchars($data["user"]),
    "title" => htmlspecialchars($data["title"]),
    "content" => htmlspecialchars($data["content"]),
    "time" => time()
];

// Simpan lagi
file_put_contents($file, json_encode($posts, JSON_PRETTY_PRINT));

echo json_encode(["status" => "success"]);