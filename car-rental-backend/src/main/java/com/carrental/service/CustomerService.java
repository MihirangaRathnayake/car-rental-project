package com.carrental.service;

import com.carrental.model.Customer;
import com.carrental.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Customer createCustomer(Customer customer) {
        // Check if email already exists
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Customer with email " + customer.getEmail() + " already exists");
        }
        
        // Check if driver license already exists
        if (customerRepository.findByDriverLicense(customer.getDriverLicense()).isPresent()) {
            throw new RuntimeException("Customer with driver license " + customer.getDriverLicense() + " already exists");
        }
        
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        return customerRepository.findById(id)
                .map(customer -> {
                    // Check if email is being changed and if new email already exists
                    if (!customer.getEmail().equals(customerDetails.getEmail()) &&
                        customerRepository.findByEmail(customerDetails.getEmail()).isPresent()) {
                        throw new RuntimeException("Customer with email " + customerDetails.getEmail() + " already exists");
                    }
                    
                    // Check if driver license is being changed and if new license already exists
                    if (!customer.getDriverLicense().equals(customerDetails.getDriverLicense()) &&
                        customerRepository.findByDriverLicense(customerDetails.getDriverLicense()).isPresent()) {
                        throw new RuntimeException("Customer with driver license " + customerDetails.getDriverLicense() + " already exists");
                    }
                    
                    customer.setFirstName(customerDetails.getFirstName());
                    customer.setLastName(customerDetails.getLastName());
                    customer.setEmail(customerDetails.getEmail());
                    customer.setPhoneNumber(customerDetails.getPhoneNumber());
                    customer.setDriverLicense(customerDetails.getDriverLicense());
                    customer.setAddress(customerDetails.getAddress());
                    return customerRepository.save(customer);
                })
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    public Optional<Customer> getCustomerByDriverLicense(String driverLicense) {
        return customerRepository.findByDriverLicense(driverLicense);
    }

    public List<Customer> searchCustomers(String keyword) {
        return customerRepository.searchByKeyword(keyword);
    }

    public boolean customerExists(Long id) {
        return customerRepository.existsById(id);
    }
}