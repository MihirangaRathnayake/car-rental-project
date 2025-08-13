package com.carrental.repository;

import com.carrental.model.Car;
import com.carrental.model.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    
    List<Car> findByStatus(CarStatus status);
    
    Optional<Car> findByLicensePlate(String licensePlate);
    
    List<Car> findByMakeAndModel(String make, String model);
    
    List<Car> findByYear(Integer year);
    
    @Query("SELECT c FROM Car c WHERE c.dailyRate BETWEEN :minRate AND :maxRate")
    List<Car> findByDailyRateBetween(@Param("minRate") BigDecimal minRate, @Param("maxRate") BigDecimal maxRate);
    
    @Query("SELECT c FROM Car c WHERE c.status = 'AVAILABLE' AND c.dailyRate <= :maxRate")
    List<Car> findAvailableCarsWithinBudget(@Param("maxRate") BigDecimal maxRate);
    
    @Query("SELECT c FROM Car c WHERE LOWER(c.make) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.model) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Car> searchByKeyword(@Param("keyword") String keyword);
}