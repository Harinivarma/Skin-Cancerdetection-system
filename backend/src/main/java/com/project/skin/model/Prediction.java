package com.project.skin.model;

public class Prediction {

    private String prediction;
    private double confidence;

    public Prediction() {}

    public Prediction(String prediction, double confidence) {
        this.prediction = prediction;
        this.confidence = confidence;
    }

    public String getPrediction() {
        return prediction;
    }

    public double getConfidence() {
        return confidence;
    }
}