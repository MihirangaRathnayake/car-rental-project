package com.carrental.repository;

import com.carrental.model.Rental;
import com.carrental.model.RentalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    
    List<Rental> findByCustomerId(Long customerId);
    
    List<Rental> findByCarId(Long carId);
    
    List<Rental> findByStatus(RentalStatus status);
    
    @Query("SELECT r FROM Rental r WHERE r.startDate BETWEEN :startDate AND :endDate")
    List<Rental> findByStartDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT r FROM Rental r WHERE r.endDate < :currentDate AND r.status = 'ACTIVE'")
    List<Rental> findOverdueRentals(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT r FROM Rental r WHERE r.car.id = :carId AND r.status = 'ACTIVE' " +
           "AND ((r.startDate <= :endDate) AND (r.endDate >= :startDate))")
    List<Rental> findConflictingRentals(@Param("carId") Long carId, 
                                       @Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
    
    @Query("SELECT r FROM Rental r WHERE r.customer.id = :customerId AND r.status IN :statuses")
    List<Rental> findByCustomerIdAndStatusIn(@Param("customerId") Long customerId, 
                                            @Param("statuses") List<RentalStatus> statuses);
}