package com.compress.project.compress_project.controller;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;

// @CrossOrigin(origins = "http://localhost:5173")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/files")
public class FileController {

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
            headers.setContentDispositionFormData("attachment", "merged.pdf");

            return new ResponseEntity<>(mergedPdf, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /*  IMAGE COMPRESSION */
    @PostMapping("/compress-image")
    public ResponseEntity<byte[]> compressImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "0.6") double quality) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            Thumbnails.of(file.getInputStream())
                    .scale(1.0)               // keep original dimensions
                    .outputQuality(quality)   // compression level
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

    /* PDF → WORD  */
    @PostMapping("/pdf-to-word")
    public ResponseEntity<byte[]> pdfToWord(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            // Read PDF and extract text
            PDDocument pdfDocument = PDDocument.load(file.getInputStream());
            PDFTextStripper stripper = new PDFTextStripper();
            String pdfText = stripper.getText(pdfDocument);
            pdfDocument.close();

            // Create Word document
            XWPFDocument wordDoc = new XWPFDocument();
            XWPFParagraph paragraph = wordDoc.createParagraph();
            XWPFRun run = paragraph.createRun();
            run.setText(pdfText);

            // Convert Word to byte[]
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            wordDoc.write(outputStream);
            wordDoc.close();

            byte[] wordBytes = outputStream.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData(
                    "attachment",
                    "converted.docx"
            );

            return new ResponseEntity<>(wordBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
