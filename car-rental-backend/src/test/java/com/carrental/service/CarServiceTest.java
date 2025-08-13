package com.carrental.service;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import com.carrental.repository.CarRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarServiceTest {

    @Mock
    private CarRepository carRepository;

    @InjectMocks
    private CarService carService;

    private Car testCar;

    @BeforeEach
    void setUp() {
        testCar = new Car("Toyota", "Camry", 2023, "ABC123", new BigDecimal("45.00"));
        testCar.setId(1L);
        testCar.setStatus(CarStatus.AVAILABLE);
    }

    @Test
    void getAllCars_ShouldReturnAllCars() {
        // Given
        List<Car> cars = Arrays.asList(testCar);
        when(carRepository.findAll()).thenReturn(cars);

        // When
        List<Car> result = carService.getAllCars();

        // Then
        assertEquals(1, result.size());
        assertEquals(testCar, result.get(0));
        verify(carRepository).findAll();
    }

    @Test
    void getCarById_WhenCarExists_ShouldReturnCar() {
        // Given
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));

        // When
        Optional<Car> result = carService.getCarById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testCar, result.get());
        verify(carRepository).findById(1L);
    }

    @Test
    void getCarById_WhenCarDoesNotExist_ShouldReturnEmpty() {
        // Given
        when(carRepository.findById(1L)).thenReturn(Optional.empty());

        // When
        Optional<Car> result = carService.getCarById(1L);

        // Then
        assertFalse(result.isPresent());
        verify(carRepository).findById(1L);
    }

    @Test
    void createCar_ShouldSaveAndReturnCar() {
        // Given
        when(carRepository.save(any(Car.class))).thenReturn(testCar);

        // When
        Car result = carService.createCar(testCar);

        // Then
        assertEquals(testCar, result);
        verify(carRepository).save(testCar);
    }

    @Test
    void updateCar_WhenCarExists_ShouldUpdateAndReturnCar() {
        // Given
        Car updatedDetails = new Car("Honda", "Civic", 2022, "XYZ789", new BigDecimal("40.00"));
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));
        when(carRepository.save(any(Car.class))).thenReturn(testCar);

        // When
        Car result = carService.updateCar(1L, updatedDetails);

        // Then
        assertEquals("Honda", result.getMake());
        assertEquals("Civic", result.getModel());
        verify(carRepository).findById(1L);
        verify(carRepository).save(testCar);
    }

    @Test
    void updateCar_WhenCarDoesNotExist_ShouldThrowException() {
        // Given
        Car updatedDetails = new Car("Honda", "Civic", 2022, "XYZ789", new BigDecimal("40.00"));
        when(carRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> carService.updateCar(1L, updatedDetails));
        verify(carRepository).findById(1L);
        verify(carRepository, never()).save(any(Car.class));
    }

    @Test
    void deleteCar_ShouldCallRepositoryDelete() {
        // When
        carService.deleteCar(1L);

        // Then
        verify(carRepository).deleteById(1L);
    }

    @Test
    void getAvailableCars_ShouldReturnAvailableCars() {
        // Given
        List<Car> availableCars = Arrays.asList(testCar);
        when(carRepository.findByStatus(CarStatus.AVAILABLE)).thenReturn(availableCars);

        // When
        List<Car> result = carService.getAvailableCars();

        // Then
        assertEquals(1, result.size());
        assertEquals(testCar, result.get(0));
        verify(carRepository).findByStatus(CarStatus.AVAILABLE);
    }

    @Test
    void updateCarStatus_WhenCarExists_ShouldUpdateStatus() {
        // Given
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));
        when(carRepository.save(any(Car.class))).thenReturn(testCar);

        // When
        Car result = carService.updateCarStatus(1L, CarStatus.RENTED);

        // Then
        assertEquals(CarStatus.RENTED, result.getStatus());
        verify(carRepository).findById(1L);
        verify(carRepository).save(testCar);
    }

    @Test
    void isCarAvailable_WhenCarIsAvailable_ShouldReturnTrue() {
        // Given
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));

        // When
        boolean result = carService.isCarAvailable(1L);

        // Then
        assertTrue(result);
        verify(carRepository).findById(1L);
    }

    @Test
    void isCarAvailable_WhenCarIsNotAvailable_ShouldReturnFalse() {
        // Given
        testCar.setStatus(CarStatus.RENTED);
        when(carRepository.findById(1L)).thenReturn(Optional.of(testCar));

        // When
        boolean result = carService.isCarAvailable(1L);

        // Then
        assertFalse(result);
        verify(carRepository).findById(1L);
    }
}