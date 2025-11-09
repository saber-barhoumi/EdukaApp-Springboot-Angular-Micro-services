package com.ski.eduka.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentInsightsDTO {
    
    private Long studentId;
    private String studentName;

    private List<ProgressHistoryDTO> progressHistory;
    private List<AchievementBadgeDTO> achievementBadges;
    private List<LearningMilestoneDTO> learningMilestones;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProgressHistoryDTO {
        private LocalDateTime date;
        private Double overallScore;
        private List<String> improvements;
        private List<String> challenges;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AchievementBadgeDTO {
        private String name;
        private String description;
        private LocalDateTime earnedDate;
        private String icon;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningMilestoneDTO {
        private String milestone;
        private LocalDateTime targetDate;
        private String completionStatus;
        private Double progressPercentage;
    }
}
