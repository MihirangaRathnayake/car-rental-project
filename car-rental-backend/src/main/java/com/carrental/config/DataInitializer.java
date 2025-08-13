package com.carrental.config;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import com.carrental.model.Customer;
import com.carrental.repository.CarRepository;
import com.carrental.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize sample cars
        if (carRepository.count() == 0) {
            Car car1 = new Car("Toyota", "Camry", 2023, "ABC123", new BigDecimal("45.00"));
            car1.setFuelType("Gasoline");
            car1.setTransmissionType("Automatic");
            car1.setSeatingCapacity(5);
            car1.setStatus(CarStatus.AVAILABLE);

            Car car2 = new Car("Honda", "Civic", 2022, "XYZ789", new BigDecimal("40.00"));
            car2.setFuelType("Gasoline");
            car2.setTransmissionType("Manual");
            car2.setSeatingCapacity(5);
            car2.setStatus(CarStatus.AVAILABLE);

            Car car3 = new Car("BMW", "X5", 2023, "BMW001", new BigDecimal("85.00"));
            car3.setFuelType("Gasoline");
            car3.setTransmissionType("Automatic");
            car3.setSeatingCapacity(7);
            car3.setStatus(CarStatus.AVAILABLE);

            Car car4 = new Car("Tesla", "Model 3", 2023, "TSL001", new BigDecimal("75.00"));
            car4.setFuelType("Electric");
            car4.setTransmissionType("Automatic");
            car4.setSeatingCapacity(5);
            car4.setStatus(CarStatus.AVAILABLE);

            Car car5 = new Car("Ford", "Mustang", 2022, "FRD001", new BigDecimal("65.00"));
            car5.setFuelType("Gasoline");
            car5.setTransmissionType("Manual");
            car5.setSeatingCapacity(4);
            car5.setStatus(CarStatus.MAINTENANCE);

            carRepository.save(car1);
            carRepository.save(car2);
            carRepository.save(car3);
            carRepository.save(car4);
            carRepository.save(car5);
        }

        // Initialize sample customers
        if (customerRepository.count() == 0) {
            Customer customer1 = new Customer("John", "Doe", "john.doe@email.com", "555-0101", "DL123456789");
            customer1.setAddress("123 Main St, City, State 12345");

            Customer customer2 = new Customer("Jane", "Smith", "jane.smith@email.com", "555-0102", "DL987654321");
            customer2.setAddress("456 Oak Ave, City, State 12345");

            Customer customer3 = new Customer("Mike", "Johnson", "mike.johnson@email.com", "555-0103", "DL456789123");
            customer3.setAddress("789 Pine Rd, City, State 12345");

            customerRepository.save(customer1);
            customerRepository.save(customer2);
            customerRepository.save(customer3);
        }
    }
}