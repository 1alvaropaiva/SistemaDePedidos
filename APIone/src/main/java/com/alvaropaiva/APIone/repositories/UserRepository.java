package com.alvaropaiva.APIone.repositories;

import com.alvaropaiva.APIone.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {


}
