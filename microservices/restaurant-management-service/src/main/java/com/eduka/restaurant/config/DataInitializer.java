package com.eduka.restaurant.config;

import com.eduka.restaurant.model.Restaurant;
import com.eduka.restaurant.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if we need to initialize data
        if (restaurantRepository.count() == 0) {
            System.out.println("Initializing test data...");
            
            // Create sample restaurants
            Restaurant restaurant1 = new Restaurant();
            restaurant1.setName("store shope");
            restaurant1.setAddress("123 Downtown Street");
            restaurant1.setType("Fast Food");
            restaurant1.setPhoneNumber("123-456-7890");
            restaurant1.setEmail("store@example.com");
            restaurant1.setDescription("A wonderful restaurant serving delicious food");
            restaurant1.setImageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4");
            restaurant1.setOpeningHours("Mon-Fri: 9am-10pm, Sat-Sun: 10am-11pm");
            restaurant1.setIsActive(true);
            restaurantRepository.save(restaurant1);
            
            Restaurant restaurant2 = new Restaurant();
            restaurant2.setName("Pizza Palace");
            restaurant2.setAddress("456 City Center Ave");
            restaurant2.setType("Fine Dining");
            restaurant2.setPhoneNumber("123-456-7891");
            restaurant2.setEmail("pizza@example.com");
            restaurant2.setDescription("Best pizza in town");
            restaurant2.setImageUrl("https://images.unsplash.com/photo-1555396273-367ea4eb4db5");
            restaurant2.setOpeningHours("Daily: 11am-11pm");
            restaurant2.setIsActive(true);
            restaurantRepository.save(restaurant2);
            
            Restaurant restaurant3 = new Restaurant();
            restaurant3.setName("Sushi Bar");
            restaurant3.setAddress("789 East Side Blvd");
            restaurant3.setType("Cafeteria");
            restaurant3.setPhoneNumber("123-456-7892");
            restaurant3.setEmail("sushi@example.com");
            restaurant3.setDescription("Fresh sushi and Japanese cuisine");
            restaurant3.setImageUrl("https://images.unsplash.com/photo-1579584425555-c3ce17fd4351");
            restaurant3.setOpeningHours("Tue-Sun: 12pm-10pm");
            restaurant3.setIsActive(true);
            restaurantRepository.save(restaurant3);
            
            System.out.println("Test data initialized successfully!");
            System.out.println("Created " + restaurantRepository.count() + " restaurants");
        } else {
            System.out.println("Database already contains data. Skipping initialization.");
        }
    }
}
