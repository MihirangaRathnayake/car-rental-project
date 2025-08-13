package com.carrental.service;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import com.carrental.model.Customer;
import com.carrental.model.Rental;
import com.carrental.model.RentalStatus;
import com.carrental.repository.RentalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class RentalService {

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private CarService carService;

    @Autowired
    private CustomerService customerService;

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    public Optional<Rental> getRentalById(Long id) {
        return rentalRepository.findById(id);
    }

    @Transactional
    public Rental createRental(Rental rental) {
        // Validate customer exists
        if (!customerService.customerExists(rental.getCustomer().getId())) {
            throw new RuntimeException("Customer not found with id: " + rental.getCustomer().getId());
        }

        // Validate car exists and is available
        Car car = carService.getCarById(rental.getCar().getId())
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + rental.getCar().getId()));

        if (car.getStatus() != CarStatus.AVAILABLE) {
            throw new RuntimeException("Car is not available for rental");
        }

        // Check for conflicting rentals
        List<Rental> conflictingRentals = rentalRepository.findConflictingRentals(
                rental.getCar().getId(), rental.getStartDate(), rental.getEndDate());
        
        if (!conflictingRentals.isEmpty()) {
            throw new RuntimeException("Car is already rented for the selected dates");
        }

        // Calculate total cost
        long days = ChronoUnit.DAYS.between(rental.getStartDate(), rental.getEndDate()) + 1;
        BigDecimal totalCost = car.getDailyRate().multiply(BigDecimal.valueOf(days));
        rental.setTotalCost(totalCost);

        // Set car status to rented
        carService.updateCarStatus(car.getId(), CarStatus.RENTED);

        // Save rental
        return rentalRepository.save(rental);
    }

    public Rental updateRental(Long id, Rental rentalDetails) {
        return rentalRepository.findById(id)
                .map(rental -> {
                    rental.setStartDate(rentalDetails.getStartDate());
                    rental.setEndDate(rentalDetails.getEndDate());
                    rental.setActualReturnDate(rentalDetails.getActualReturnDate());
                    rental.setStatus(rentalDetails.getStatus());
                    rental.setNotes(rentalDetails.getNotes());
                    
                    // Recalculate total cost if dates changed
                    long days = ChronoUnit.DAYS.between(rental.getStartDate(), rental.getEndDate()) + 1;
                    BigDecimal totalCost = rental.getCar().getDailyRate().multiply(BigDecimal.valueOf(days));
                    rental.setTotalCost(totalCost);
                    
                    return rentalRepository.save(rental);
                })
                .orElseThrow(() -> new RuntimeException("Rental not found with id: " + id));
    }

    @Transactional
    public void deleteRental(Long id) {
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found with id: " + id));
        
        // If rental is active, make car available again
        if (rental.getStatus() == RentalStatus.ACTIVE) {
            carService.updateCarStatus(rental.getCar().getId(), CarStatus.AVAILABLE);
        }
        
        rentalRepository.deleteById(id);
    }

    @Transactional
    public Rental completeRental(Long id, LocalDate actualReturnDate) {
        return rentalRepository.findById(id)
                .map(rental -> {
                    rental.setActualReturnDate(actualReturnDate);
                    rental.setStatus(RentalStatus.COMPLETED);
                    
                    // Make car available again
                    carService.updateCarStatus(rental.getCar().getId(), CarStatus.AVAILABLE);
                    
                    return rentalRepository.save(rental);
                })
                .orElseThrow(() -> new RuntimeException("Rental not found with id: " + id));
    }

    public List<Rental> getRentalsByCustomer(Long customerId) {
        return rentalRepository.findByCustomerId(customerId);
    }

    public List<Rental> getRentalsByCar(Long carId) {
        return rentalRepository.findByCarId(carId);
    }

    public List<Rental> getRentalsByStatus(RentalStatus status) {
        return rentalRepository.findByStatus(status);
    }

    public List<Rental> getOverdueRentals() {
        return rentalRepository.findOverdueRentals(LocalDate.now());
    }

    public List<Rental> getRentalsByDateRange(LocalDate startDate, LocalDate endDate) {
        return rentalRepository.findByStartDateBetween(startDate, endDate);
    }

    public BigDecimal calculateRentalCost(Long carId, LocalDate startDate, LocalDate endDate) {
        Car car = carService.getCarById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + carId));
        
        long days = ChronoUnit.DAYS.between(startDate, endDate) + 1;
        return car.getDailyRate().multiply(BigDecimal.valueOf(days));
    }
}