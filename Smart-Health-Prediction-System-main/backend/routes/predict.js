const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');

// Rule-based disease prediction and doctor recommendation based on symptoms
const predictDiseaseAndRecommendDoctor = (symptomsStr) => {
    const symptoms = symptomsStr.toLowerCase();
    let diseaseName = 'Unknown';
    let riskLevel = 'Low';
    let recommendedDoctor = 'Consult a General Physician.';

    // Check symptoms (following Java PredictionModel and DoctorService rules)
    if (symptoms.includes('fever') && symptoms.includes('cough')) {
        diseaseName = 'Flu';
        riskLevel = 'Medium';
        recommendedDoctor = 'Dr. Smith (General Physician)';
    } else if (symptoms.includes('chest pain') && symptoms.includes('shortness of breath')) {
        diseaseName = 'Heart Disease';
        riskLevel = 'High';
        recommendedDoctor = 'Dr. Brown (Cardiologist)';
    }

    return { predictedDisease: diseaseName, riskLevel, recommendedDoctor };
};

// @route   POST api/predict
// @desc    Perform disease prediction based on symptoms and save record
// @access  Private
router.post('/', auth, async (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms) {
        return res.status(400).json({ message: 'Symptoms are required' });
    }

    try {
        // Run prediction
        const { predictedDisease, riskLevel, recommendedDoctor } = predictDiseaseAndRecommendDoctor(symptoms);

        // Save health record
        const newRecord = new HealthRecord({
            userId: req.user.id,
            symptoms,
            predictedDisease,
            riskLevel,
            recommendedDoctor
        });

        await newRecord.save();

        res.json(newRecord);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/predict/history
// @desc    Get prediction history for logged in user
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const history = await HealthRecord.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
