package com.alvaropaiva.APIone.services;

import com.alvaropaiva.APIone.entities.Category;
import com.alvaropaiva.APIone.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repository;

    public List<Category> findALl(){
        return repository.findAll();
    }
    public Category findById(Long id){
        Optional<Category> obj = repository.findById(id);
        return  obj.get();
    }


}