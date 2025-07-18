package com.alvaropaiva.APIone.config;

import com.alvaropaiva.APIone.entities.Category;
import com.alvaropaiva.APIone.entities.Order;
import com.alvaropaiva.APIone.entities.Product;
import com.alvaropaiva.APIone.entities.User;
import com.alvaropaiva.APIone.entities.enums.OrderStatus;
import com.alvaropaiva.APIone.repositories.CategoryRepository;
import com.alvaropaiva.APIone.repositories.OrderRepository;
import com.alvaropaiva.APIone.repositories.ProductRepository;
import com.alvaropaiva.APIone.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.Instant;
import java.util.Arrays;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {

        Category cat1 = new Category(null, "Electronics");
        Category cat2 = new Category(null, "Books");
        Category cat3 = new Category(null, "Computers");

        Product p1 = new Product(null, 90.5, "Lorem ipsum dolor sit amet, consectetur.", "The Lord of the Rings");
        Product p2 = new Product(null, 2190.0, "Nulla eu imperdiet purus. Maecenas ante.", "Smart TV");
        Product p3 = new Product(null, 1250.0, "Nam eleifend maximus tortor, at mollis.", "Macbook Pro");
        Product p4 = new Product(null, 1200.0, "Donec aliquet odio ac rhoncus cursus.", "PC Gamer");
        Product p5 = new Product(null, 100.99, "Cras fringilla convallis sem vel faucibus.", "Rails for Dummies");

        User u1 = new User(null, "Maria Brown", "maria@gmail.com", "988888888", "123456");
        User u2 = new User(null, "Alex Green", "alex@gmail.com", "977777777", "123456");

        Order o1 = new Order(null, Instant.parse("2019-06-20T19:53:07Z"), OrderStatus.PAID.getCode(),  u1);
        Order o2 = new Order(null, Instant.parse("2019-07-21T03:42:10Z"), OrderStatus.WAITING_PAYMENT.getCode(), u2);
        Order o3 = new Order(null, Instant.parse("2019-07-22T15:21:22Z"), OrderStatus.WAITING_PAYMENT.getCode(), u1);

        categoryRepository.saveAll(Arrays.asList(cat1, cat2, cat3));
        productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));
        userRepository.saveAll(Arrays.asList(u1, u2));
        orderRepository.saveAll(Arrays.asList(o1, o2, o3));
    }
}
