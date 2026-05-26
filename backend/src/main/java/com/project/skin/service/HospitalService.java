package com.project.skin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.skin.model.Hospital;
import com.project.skin.repository.HospitalRepository;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public List<Hospital> getHospitalsByCity(String city) {
        return hospitalRepository.findByCityIgnoreCase(city);
    }
}