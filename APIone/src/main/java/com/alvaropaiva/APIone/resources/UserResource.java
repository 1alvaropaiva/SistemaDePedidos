package com.alvaropaiva.APIone.resources;

import com.alvaropaiva.APIone.entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/users")
public class UserResource {

    @GetMapping
    public ResponseEntity<User> findAll(){
        User u = new User(1L, "maria", "maria@maria.com", "251651", "12345");
        return ResponseEntity.ok().body(u);
    }

}
