package com.example.watches.controller;

import com.example.watches.model.User;
import com.example.watches.model.Watch;
import com.example.watches.model.Order;
import com.example.watches.repository.UserRepository;
import com.example.watches.repository.WatchRepository;
import com.example.watches.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UserRepository userRepository;
    private final WatchRepository watchRepository;
    private final OrderRepository orderRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AdminController(UserRepository userRepository,
                           WatchRepository watchRepository,
                           OrderRepository orderRepository,
                           BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.watchRepository = watchRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --------------------- USERS ---------------------
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User newUser) {
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        User savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(userDetails.getName());
                    user.setEmail(userDetails.getEmail());
                    user.setRole(userDetails.getRole());
                    User updatedUser = userRepository.save(user);
                    return ResponseEntity.ok(updatedUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);

        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();

        // Проверка: есть ли у пользователя заказы?
        if (orderRepository.existsByUser(user)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Нельзя удалить пользователя с активными заказами."));
        }

        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "Пользователь удален."));
    }

    // --------------------- WATCHES ---------------------
    @GetMapping("/watches")
    public List<Watch> getAllWatches() {
        return watchRepository.findAll();
    }

    @GetMapping("/watches/{id}")
    public ResponseEntity<Watch> getWatchById(@PathVariable Long id) {
        return watchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/watches")
    public ResponseEntity<Watch> createWatch(@RequestBody Watch newWatch) {
        if (newWatch.getYear() < 1900 || newWatch.getYear() > LocalDate.now().getYear()) {
            return ResponseEntity.badRequest().build();
        }
        Watch savedWatch = watchRepository.save(newWatch);
        return ResponseEntity.ok(savedWatch);
    }

    @PutMapping("/watches/{id}")
    public ResponseEntity<Watch> updateWatch(@PathVariable Long id, @RequestBody Watch watchDetails) {
        return watchRepository.findById(id)
                .map(watch -> {
                    watch.setBrand(watchDetails.getBrand());
                    watch.setModel(watchDetails.getModel());
                    watch.setYear(watchDetails.getYear());
                    watch.setPrice(watchDetails.getPrice());
                    watch.setStock(watchDetails.getStock());
                    Watch updatedWatch = watchRepository.save(watch);
                    return ResponseEntity.ok(updatedWatch);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/watches/{id}")
    public ResponseEntity<?> deleteWatch(@PathVariable Long id) {
        return watchRepository.findById(id)
                .map(watch -> {
                    watchRepository.delete(watch);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --------------------- ORDERS ---------------------
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }



    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔁 Метод для обновления заказа
    @PutMapping("/orders/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setQuantity(orderDetails.getQuantity());
                    order.setTotalPrice(orderDetails.getTotalPrice());
                    Order updatedOrder = orderRepository.save(order);
                    return ResponseEntity.ok(updatedOrder);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(order -> {
                    orderRepository.delete(order);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --------------------- PASSWORD HASHING ---------------------
    @PostMapping("/hash-password")
    public ResponseEntity<Map<String, String>> hashPassword(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        String hashedPassword = passwordEncoder.encode(password);
        Map<String, String> response = new HashMap<>();
        response.put("hashedPassword", hashedPassword);
        return ResponseEntity.ok(response);
    }
}