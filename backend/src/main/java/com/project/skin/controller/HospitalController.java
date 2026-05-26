package com.project.skin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project.skin.model.Hospital;
import com.project.skin.service.HospitalService;

@RestController
@CrossOrigin(origins = "*")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    // GET hospitals by city
    @GetMapping("/hospitals")
    public List<Hospital> getHospitals(@RequestParam String city) {
        return hospitalService.getHospitalsByCity(city);
    }
}