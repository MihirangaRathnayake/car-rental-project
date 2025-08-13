package com.carrental.controller;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import com.carrental.service.CarService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/cars")
@CrossOrigin(origins = "http://localhost:3000")
public class CarController {

    @Autowired
    private CarService carService;

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        List<Car> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        return carService.getCarById(id)
                .map(car -> ResponseEntity.ok(car))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Car> createCar(@Valid @RequestBody Car car) {
        try {
            Car createdCar = carService.createCar(car);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCar);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @Valid @RequestBody Car carDetails) {
        try {
            Car updatedCar = carService.updateCar(id, carDetails);
            return ResponseEntity.ok(updatedCar);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        try {
            carService.deleteCar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Car>> getAvailableCars() {
        List<Car> availableCars = carService.getAvailableCars();
        return ResponseEntity.ok(availableCars);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Car>> searchCars(@RequestParam String keyword) {
        List<Car> cars = carService.searchCars(keyword);
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Car>> getCarsByPriceRange(
            @RequestParam BigDecimal minRate,
            @RequestParam BigDecimal maxRate) {
        List<Car> cars = carService.getCarsByPriceRange(minRate, maxRate);
        return ResponseEntity.ok(cars);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Car> updateCarStatus(@PathVariable Long id, @RequestParam CarStatus status) {
        try {
            Car updatedCar = carService.updateCarStatus(id, status);
            return ResponseEntity.ok(updatedCar);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/make/{make}/model/{model}")
    public ResponseEntity<List<Car>> getCarsByMakeAndModel(
            @PathVariable String make,
            @PathVariable String model) {
        List<Car> cars = carService.getCarsByMakeAndModel(make, model);
        return ResponseEntity.ok(cars);
    }
}