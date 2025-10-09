package com.ski.eduka.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileUploadResponse {
    private boolean success;
    private String message;
    private String fileId;
    private String fileName;
    private String fileType;
    private long fileSize;
    private String downloadUrl;
    private String thumbnailUrl;
}
