package com.example.watches.dto;

public class OrderRequestDTO {
    private Long userId;
    private Long watchId;
    private int quantity;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getWatchId() { return watchId; }
    public void setWatchId(Long watchId) { this.watchId = watchId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
