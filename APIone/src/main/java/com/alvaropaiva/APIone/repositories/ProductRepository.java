package com.alvaropaiva.APIone.repositories;

import com.alvaropaiva.APIone.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {}
