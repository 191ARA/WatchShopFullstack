package com.example.watches.repository;

import com.example.watches.model.Order;
import com.example.watches.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    boolean existsByUser(User user);
}
