package com.compress.project.compress_project.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {

        System.out.println("✅ Upload API HIT");

        if (file.isEmpty()) {
            return "❌ File is empty";
        }

        try {
            String projectRoot = System.getProperty("user.dir");
            File uploadDir = new File(projectRoot, "upload");

            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            File savedFile = new File(uploadDir, file.getOriginalFilename());
            file.transferTo(savedFile);

            return "✅ Uploaded successfully: " + savedFile.getAbsolutePath();

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ ERROR: " + e.getMessage();
        }
    }
}
