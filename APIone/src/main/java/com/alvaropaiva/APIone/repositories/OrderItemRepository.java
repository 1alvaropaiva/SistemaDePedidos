package com.alvaropaiva.APIone.repositories;

import com.alvaropaiva.APIone.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

//@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}
