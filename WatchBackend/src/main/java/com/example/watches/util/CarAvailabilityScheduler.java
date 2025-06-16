package com.example.watches.util;

import com.example.watches.repository.OrderRepository;
import com.example.watches.repository.WatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CarAvailabilityScheduler {

    @Autowired
    private OrderRepository bookingRepository;

    @Autowired
    private WatchRepository carRepository;



}