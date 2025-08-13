package com.carrental.repository;

import com.carrental.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByEmail(String email);
    
    Optional<Customer> findByDriverLicense(String driverLicense);
    
    List<Customer> findByFirstNameAndLastName(String firstName, String lastName);
    
    @Query("SELECT c FROM Customer c WHERE LOWER(c.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Customer> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT c FROM Customer c WHERE c.phoneNumber = :phoneNumber")
    Optional<Customer> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);
}