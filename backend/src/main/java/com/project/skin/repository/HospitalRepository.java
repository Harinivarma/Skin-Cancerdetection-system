package com.project.skin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.skin.model.Hospital;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    List<Hospital> findByCityIgnoreCase(String city);
}
