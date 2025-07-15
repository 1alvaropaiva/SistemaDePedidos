package com.alvaropaiva.APIone.repositories;

import com.alvaropaiva.APIone.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

//@Repository
public interface UserRepository extends JpaRepository<User, Long> {}
