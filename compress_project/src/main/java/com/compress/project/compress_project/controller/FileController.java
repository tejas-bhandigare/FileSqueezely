package com.compress.project.compress_project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/files")
public class FileController {

  @PostMapping("/upload-multiple")
public String uploadFiles(@RequestParam("files") MultipartFile[] files) {

    System.out.println("FILES RECEIVED: " + files.length);

    if (files == null || files.length == 0) {
        return "No files uploaded";
    }

    try {
        File uploadDir = new File(System.getProperty("user.dir"), "upload");
        if (!uploadDir.exists()) uploadDir.mkdirs();

        for (MultipartFile file : files) {
            System.out.println("Saving: " + file.getOriginalFilename());
            file.transferTo(new File(uploadDir, file.getOriginalFilename()));
        }

        return "Uploaded " + files.length + " files successfully";

    } catch (Exception e) {
        e.printStackTrace();
        return "ERROR: " + e.getMessage();
    }
}
}