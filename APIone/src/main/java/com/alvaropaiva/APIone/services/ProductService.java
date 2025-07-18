package com.alvaropaiva.APIone.services;

import com.alvaropaiva.APIone.entities.Product;
import com.alvaropaiva.APIone.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    public List<Product> findALl(){
        return repository.findAll();
    }
    public Product findById(Long id){
        Optional<Product> obj = repository.findById(id);
        return  obj.get();
    }
}