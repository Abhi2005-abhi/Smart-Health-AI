const assert = require('assert');

// Test the rule-based prediction logic (ported from Java models/services)
const predictDiseaseAndRecommendDoctor = (symptomsStr) => {
    const symptoms = symptomsStr.toLowerCase();
    let diseaseName = 'Unknown';
    let riskLevel = 'Low';
    let recommendedDoctor = 'Consult a General Physician.';

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

console.log('--- STARTING SMART HEALTH AI UNIT TESTS ---');

try {
    // Test Case 1: Flu Symptoms
    const result1 = predictDiseaseAndRecommendDoctor('I have a high fever and a persistent cough.');
    assert.strictEqual(result1.predictedDisease, 'Flu');
    assert.strictEqual(result1.riskLevel, 'Medium');
    assert.strictEqual(result1.recommendedDoctor, 'Dr. Smith (General Physician)');
    console.log('✅ Test Case 1 Passed: Flu symptoms matched correctly.');

    // Test Case 2: Heart Disease Symptoms
    const result2 = predictDiseaseAndRecommendDoctor('I am experiencing severe chest pain and severe shortness of breath.');
    assert.strictEqual(result2.predictedDisease, 'Heart Disease');
    assert.strictEqual(result2.riskLevel, 'High');
    assert.strictEqual(result2.recommendedDoctor, 'Dr. Brown (Cardiologist)');
    console.log('✅ Test Case 2 Passed: Heart Disease symptoms matched correctly.');

    // Test Case 3: Unknown / Mild Symptoms
    const result3 = predictDiseaseAndRecommendDoctor('My leg blocks after walking, mild back pain.');
    assert.strictEqual(result3.predictedDisease, 'Unknown');
    assert.strictEqual(result3.riskLevel, 'Low');
    assert.strictEqual(result3.recommendedDoctor, 'Consult a General Physician.');
    console.log('✅ Test Case 3 Passed: Unknown/mild symptoms defaulted correctly.');

    console.log('\n🎉 ALL RULE-BASED PREDICTION TESTS PASSED SUCCESSFULLY! 🎉');
} catch (err) {
    console.error('❌ Tests failed:', err.message);
    process.exit(1);
}
