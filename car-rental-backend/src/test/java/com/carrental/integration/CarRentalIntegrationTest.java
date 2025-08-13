package com.carrental.integration;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import com.carrental.model.Customer;
import com.carrental.model.Rental;
import com.carrental.repository.CarRepository;
import com.carrental.repository.CustomerRepository;
import com.carrental.repository.RentalRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class CarRentalIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Car testCar;
    private Customer testCustomer;

    @BeforeEach
    void setUp() {
        // Clean up
        rentalRepository.deleteAll();
        carRepository.deleteAll();
        customerRepository.deleteAll();

        // Create test data
        testCar = new Car("Toyota", "Camry", 2023, "TEST123", new BigDecimal("45.00"));
        testCar.setStatus(CarStatus.AVAILABLE);
        testCar = carRepository.save(testCar);

        testCustomer = new Customer("John", "Doe", "john.test@email.com", "555-0101", "DL123456789");
        testCustomer = customerRepository.save(testCustomer);
    }

    @Test
    void completeCarRentalWorkflow_ShouldWorkEndToEnd() throws Exception {
        // 1. Get available cars
        mockMvc.perform(get("/cars/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(testCar.getId()))
                .andExpect(jsonPath("$[0].status").value("AVAILABLE"));

        // 2. Create a rental
        Rental rental = new Rental();
        rental.setCustomer(testCustomer);
        rental.setCar(testCar);
        rental.setStartDate(LocalDate.now());
        rental.setEndDate(LocalDate.now().plusDays(3));
        rental.setTotalCost(new BigDecimal("135.00"));

        mockMvc.perform(post("/rentals")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(rental)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customer.id").value(testCustomer.getId()))
                .andExpect(jsonPath("$.car.id").value(testCar.getId()));

        // 3. Verify car status changed to RENTED
        mockMvc.perform(get("/cars/" + testCar.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RENTED"));

        // 4. Get rentals by customer
        mockMvc.perform(get("/rentals/customer/" + testCustomer.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].customer.id").value(testCustomer.getId()));
    }

    @Test
    void createCar_WithValidData_ShouldPersistCar() throws Exception {
        Car newCar = new Car("Honda", "Civic", 2022, "HONDA123", new BigDecimal("40.00"));
        newCar.setFuelType("Gasoline");
        newCar.setTransmissionType("Manual");
        newCar.setSeatingCapacity(5);

        mockMvc.perform(post("/cars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newCar)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.make").value("Honda"))
                .andExpect(jsonPath("$.model").value("Civic"))
                .andExpect(jsonPath("$.licensePlate").value("HONDA123"));
    }

    @Test
    void createCustomer_WithValidData_ShouldPersistCustomer() throws Exception {
        Customer newCustomer = new Customer("Jane", "Smith", "jane.test@email.com", "555-0102", "DL987654321");
        newCustomer.setAddress("456 Oak Ave, City, State 12345");

        mockMvc.perform(post("/customers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newCustomer)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("Jane"))
                .andExpect(jsonPath("$.lastName").value("Smith"))
                .andExpect(jsonPath("$.email").value("jane.test@email.com"));
    }

    @Test
    void searchCars_WithKeyword_ShouldReturnMatchingCars() throws Exception {
        mockMvc.perform(get("/cars/search")
                .param("keyword", "Toyota"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].make").value("Toyota"));
    }

    @Test
    void calculateRentalCost_ShouldReturnCorrectCost() throws Exception {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = LocalDate.now().plusDays(2);

        mockMvc.perform(get("/rentals/calculate-cost")
                .param("carId", testCar.getId().toString())
                .param("startDate", startDate.toString())
                .param("endDate", endDate.toString()))
                .andExpect(status().isOk())
                .andExpect(content().string("135.00")); // 3 days * 45.00
    }
}