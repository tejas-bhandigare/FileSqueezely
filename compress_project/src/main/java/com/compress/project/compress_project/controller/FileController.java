package com.compress.project.compress_project.controller;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/files")
public class FileController {

    /* SINGLE FILE UPLOAD */
    @PostMapping("/upload")
    public String uploadSingle(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return "File is empty";
        }

        try {
            File uploadDir = new File(System.getProperty("user.dir"), "upload");
            if (!uploadDir.exists()) uploadDir.mkdirs();

            File savedFile = new File(uploadDir, file.getOriginalFilename());
            file.transferTo(savedFile);

            return "Single file uploaded successfully";

        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed: " + e.getMessage();
        }
    }

    /* MULTIPLE FILE UPLOAD */
    @PostMapping("/upload-multiple")
    public String uploadMultiple(@RequestParam("files") MultipartFile[] files) {

        System.out.println("FILES RECEIVED: " + files.length);

        if (files == null || files.length == 0) {
            return "No files uploaded";
        }

        try {
            File uploadDir = new File(System.getProperty("user.dir"), "upload");
            if (!uploadDir.exists()) uploadDir.mkdirs();

            for (MultipartFile file : files) {
                File savedFile = new File(uploadDir, file.getOriginalFilename());
                file.transferTo(savedFile);
            }

            return "Uploaded " + files.length + " files successfully";

        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed: " + e.getMessage();
        }
    }

    /* PDF MERGE */
    @PostMapping("/merge-pdf")
    public ResponseEntity<byte[]> mergePdf(@RequestParam("files") MultipartFile[] files) {

        if (files == null || files.length < 2) {
            return ResponseEntity.badRequest().build();
        }

        try {
            PDFMergerUtility merger = new PDFMergerUtility();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            for (MultipartFile file : files) {
                merger.addSource(file.getInputStream());
            }

            merger.setDestinationStream(outputStream);
            merger.mergeDocuments(null);

            byte[] mergedPdf = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData(
                    "attachment",
                    "merged.pdf"
            );

            return new ResponseEntity<>(mergedPdf, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /* IMAGE COMPRESSION */
    
    @PostMapping("/compress-image")
    public ResponseEntity<byte[]> compressImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "0.6") double quality) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            // Compress image in memory
            Thumbnails.of(file.getInputStream())
                    .scale(1.0)              // keep original dimensions
                    .outputQuality(quality)  // compression level
                    .toOutputStream(outputStream);

            byte[] compressedImage = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData(
                    "attachment",
                    "compressed_" + file.getOriginalFilename()
            );

            return new ResponseEntity<>(compressedImage, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}

