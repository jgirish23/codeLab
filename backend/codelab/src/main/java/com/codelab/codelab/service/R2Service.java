package com.codelab.codelab.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
public class R2Service {

    private final S3Client s3Client;
    private static String BUCKET_NAME = "sample-template";

    public R2Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public Path downloadAndExtractZip(String bucketName, String fileName, String downloadDir) throws IOException {
        BUCKET_NAME = bucketName;
        Path zipPath = Path.of(downloadDir, fileName);
        Path extractDir = Path.of(downloadDir, fileName.replace(".zip", "")); // Extracted folder

        // ✅ Ensure parent directory exists
        if (!Files.exists(zipPath.getParent())) {
            Files.createDirectories(zipPath.getParent());
        }

        // 🟢 Step 1: Download ZIP file
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(BUCKET_NAME)
                .key(fileName)
                .build();

        try (InputStream responseStream = s3Client.getObject(request)) {
            Files.copy(responseStream, zipPath, StandardCopyOption.REPLACE_EXISTING);
        }

        // 🟢 Step 2: Extract ZIP
        unzipFile(zipPath, extractDir);

        // ✅ Cleanup: Delete ZIP after extraction (optional)
        Files.deleteIfExists(zipPath);

        return extractDir;
    }

    private void unzipFile(Path zipFilePath, Path extractDir) throws IOException {
        if (!Files.exists(extractDir)) {
            Files.createDirectories(extractDir);
        }

        try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(zipFilePath))) {
            ZipEntry zipEntry;
            while ((zipEntry = zis.getNextEntry()) != null) {
                Path extractedFile = extractDir.resolve(zipEntry.getName());

                // ✅ Ensure extracted file path is inside extractDir (avoid Zip Slip vulnerability)
                if (!extractedFile.startsWith(extractDir)) {
                    throw new IOException("Bad ZIP entry: " + zipEntry.getName());
                }

                // ✅ Handle directories
                if (zipEntry.isDirectory()) {
                    Files.createDirectories(extractedFile);
                } else {
                    // ✅ Ensure parent directory exists before writing the file
                    Files.createDirectories(extractedFile.getParent());

                    // ✅ Extract file
                    Files.copy(zis, extractedFile, StandardCopyOption.REPLACE_EXISTING);
                }

                zis.closeEntry();
            }
        }
    }
}

