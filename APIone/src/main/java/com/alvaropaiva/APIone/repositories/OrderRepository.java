package com.alvaropaiva.APIone.repositories;

import com.alvaropaiva.APIone.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {}
