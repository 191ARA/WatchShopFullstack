package com.example.watches.controller;

import com.example.watches.dto.OrderRequestDTO;
import com.example.watches.model.Order;
import com.example.watches.model.User;
import com.example.watches.model.Watch;
import com.example.watches.repository.OrderRepository;
import com.example.watches.repository.UserRepository;
import com.example.watches.repository.WatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WatchRepository watchRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDTO dto) {
        try {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            Watch watch = watchRepository.findById(dto.getWatchId())
                    .orElseThrow(() -> new IllegalArgumentException("Watch not found"));

            if (watch.getStock() < dto.getQuantity()) {
                throw new IllegalStateException("Not enough stock available");
            }

            Order order = new Order();
            order.setUser(user);
            order.setWatch(watch);
            order.setQuantity(dto.getQuantity());
            order.setOrderDate(new Date());
            order.setTotalPrice(watch.getPrice() * dto.getQuantity());

            watch.setStock(watch.getStock() - dto.getQuantity());
            watchRepository.save(watch);
            orderRepository.save(order);

            return ResponseEntity.ok(Map.of("success", true, "orderId", order.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @PutMapping("/admin/orders/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setQuantity(orderDetails.getQuantity());
                    order.setTotalPrice(order.getWatch().getPrice() * orderDetails.getQuantity());
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
