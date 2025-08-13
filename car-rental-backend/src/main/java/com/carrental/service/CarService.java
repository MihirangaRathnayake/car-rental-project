package com.carrental.service;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import com.carrental.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Optional<Car> getCarById(Long id) {
        return carRepository.findById(id);
    }

    public Car createCar(Car car) {
        return carRepository.save(car);
    }

    public Car updateCar(Long id, Car carDetails) {
        return carRepository.findById(id)
                .map(car -> {
                    car.setMake(carDetails.getMake());
                    car.setModel(carDetails.getModel());
                    car.setYear(carDetails.getYear());
                    car.setLicensePlate(carDetails.getLicensePlate());
                    car.setDailyRate(carDetails.getDailyRate());
                    car.setStatus(carDetails.getStatus());
                    car.setFuelType(carDetails.getFuelType());
                    car.setTransmissionType(carDetails.getTransmissionType());
                    car.setSeatingCapacity(carDetails.getSeatingCapacity());
                    return carRepository.save(car);
                })
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }

    public List<Car> getAvailableCars() {
        return carRepository.findByStatus(CarStatus.AVAILABLE);
    }

    public List<Car> getCarsByMakeAndModel(String make, String model) {
        return carRepository.findByMakeAndModel(make, model);
    }

    public List<Car> searchCars(String keyword) {
        return carRepository.searchByKeyword(keyword);
    }

    public List<Car> getCarsByPriceRange(BigDecimal minRate, BigDecimal maxRate) {
        return carRepository.findByDailyRateBetween(minRate, maxRate);
    }

    public Car updateCarStatus(Long id, CarStatus status) {
        return carRepository.findById(id)
                .map(car -> {
                    car.setStatus(status);
                    return carRepository.save(car);
                })
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
    }

    public boolean isCarAvailable(Long carId) {
        return carRepository.findById(carId)
                .map(car -> car.getStatus() == CarStatus.AVAILABLE)
                .orElse(false);
    }
}