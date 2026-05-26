package com.project.skin.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.skin.service.PredictionService;

@RestController
@CrossOrigin(origins = "*")  // <-- IMPORTANT
@RequestMapping("/detect")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @PostMapping
    public Map predict(@RequestParam("image") MultipartFile image) throws Exception {
        return predictionService.predict(image);
    }
}