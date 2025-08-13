package com.carrental.controller;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import com.carrental.service.CarService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CarController.class)
class CarControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CarService carService;

    @Autowired
    private ObjectMapper objectMapper;

    private Car testCar;

    @BeforeEach
    void setUp() {
        testCar = new Car("Toyota", "Camry", 2023, "ABC123", new BigDecimal("45.00"));
        testCar.setId(1L);
        testCar.setStatus(CarStatus.AVAILABLE);
    }

    @Test
    void getAllCars_ShouldReturnListOfCars() throws Exception {
        // Given
        when(carService.getAllCars()).thenReturn(Arrays.asList(testCar));

        // When & Then
        mockMvc.perform(get("/cars"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[0].model").value("Camry"));
    }

    @Test
    void getCarById_WhenCarExists_ShouldReturnCar() throws Exception {
        // Given
        when(carService.getCarById(1L)).thenReturn(Optional.of(testCar));

        // When & Then
        mockMvc.perform(get("/cars/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.make").value("Toyota"));
    }

    @Test
    void getCarById_WhenCarDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Given
        when(carService.getCarById(1L)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/cars/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createCar_WithValidData_ShouldCreateCar() throws Exception {
        // Given
        when(carService.createCar(any(Car.class))).thenReturn(testCar);

        // When & Then
        mockMvc.perform(post("/cars")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testCar)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.make").value("Toyota"))
                .andExpect(jsonPath("$.model").value("Camry"));
    }

    @Test
    void updateCar_WithValidData_ShouldUpdateCar() throws Exception {
        // Given
        when(carService.updateCar(eq(1L), any(Car.class))).thenReturn(testCar);

        // When & Then
        mockMvc.perform(put("/cars/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testCar)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.make").value("Toyota"));
    }

    @Test
    void deleteCar_ShouldReturnNoContent() throws Exception {
        // When & Then
        mockMvc.perform(delete("/cars/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void getAvailableCars_ShouldReturnAvailableCars() throws Exception {
        // Given
        when(carService.getAvailableCars()).thenReturn(Arrays.asList(testCar));

        // When & Then
        mockMvc.perform(get("/cars/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("AVAILABLE"));
    }

    @Test
    void updateCarStatus_ShouldUpdateStatus() throws Exception {
        // Given
        testCar.setStatus(CarStatus.RENTED);
        when(carService.updateCarStatus(1L, CarStatus.RENTED)).thenReturn(testCar);

        // When & Then
        mockMvc.perform(patch("/cars/1/status")
                .param("status", "RENTED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RENTED"));
    }
}