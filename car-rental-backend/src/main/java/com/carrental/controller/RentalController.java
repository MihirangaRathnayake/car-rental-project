package com.carrental.controller;

import com.carrental.model.Rental;
import com.carrental.model.RentalStatus;
import com.carrental.service.RentalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/rentals")
@CrossOrigin(origins = "http://localhost:3000")
public class RentalController {

    @Autowired
    private RentalService rentalService;

    @GetMapping
    public ResponseEntity<List<Rental>> getAllRentals() {
        List<Rental> rentals = rentalService.getAllRentals();
        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rental> getRentalById(@PathVariable Long id) {
        return rentalService.getRentalById(id)
                .map(rental -> ResponseEntity.ok(rental))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Rental> createRental(@Valid @RequestBody Rental rental) {
        try {
            Rental createdRental = rentalService.createRental(rental);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRental);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rental> updateRental(@PathVariable Long id, @Valid @RequestBody Rental rentalDetails) {
        try {
            Rental updatedRental = rentalService.updateRental(id, rentalDetails);
            return ResponseEntity.ok(updatedRental);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRental(@PathVariable Long id) {
        try {
            rentalService.deleteRental(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Rental> completeRental(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate actualReturnDate) {
        try {
            Rental completedRental = rentalService.completeRental(id, actualReturnDate);
            return ResponseEntity.ok(completedRental);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Rental>> getRentalsByCustomer(@PathVariable Long customerId) {
        List<Rental> rentals = rentalService.getRentalsByCustomer(customerId);
        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<List<Rental>> getRentalsByCar(@PathVariable Long carId) {
        List<Rental> rentals = rentalService.getRentalsByCar(carId);
        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Rental>> getRentalsByStatus(@PathVariable RentalStatus status) {
        List<Rental> rentals = rentalService.getRentalsByStatus(status);
        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Rental>> getOverdueRentals() {
        List<Rental> overdueRentals = rentalService.getOverdueRentals();
        return ResponseEntity.ok(overdueRentals);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Rental>> getRentalsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Rental> rentals = rentalService.getRentalsByDateRange(startDate, endDate);
        return ResponseEntity.ok(rentals);
    }

    @GetMapping("/calculate-cost")
    public ResponseEntity<BigDecimal> calculateRentalCost(
            @RequestParam Long carId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            BigDecimal cost = rentalService.calculateRentalCost(carId, startDate, endDate);
            return ResponseEntity.ok(cost);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}