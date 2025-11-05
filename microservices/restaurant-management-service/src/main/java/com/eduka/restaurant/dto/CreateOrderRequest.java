package com.eduka.restaurant.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private Long userId;
    private Long restaurantId;
    private List<Long> menuItemIds;
    private String notes;
    private String deliveryAddress;
}
