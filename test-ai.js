const axios = require('axios');
const openRouterService = require('./services/openRouterService');
require('dotenv').config();

// Test configuration
const BASE_URL = 'http://localhost:3000/api';
const TEST_API_KEY = process.env.OPENROUTER_API_KEY;

async function runTests() {
  console.log('🧪 Starting AI Integration Tests for Aditya Medical Web');
  console.log('=' .repeat(60));

  // Test 1: Check if API key is configured
  console.log('\n📋 Test 1: API Key Configuration');
  if (!TEST_API_KEY) {
    console.log('❌ OPENROUTER_API_KEY not found in environment variables');
    console.log('💡 Please update your .env file with your actual API key');
    console.log('   OPENROUTER_API_KEY=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');
    return;
  } else {
    console.log('✅ API key is configured');
  }

  // Test 2: OpenRouter Service Health Check
  console.log('\n📋 Test 2: OpenRouter Service Health Check');
  try {
    const health = await openRouterService.healthCheck();
    if (health.status === 'healthy') {
      console.log('✅ OpenRouter service is healthy');
      console.log(`📡 Model: ${health.model || 'Unknown'}`);
      console.log(`🤖 Response: ${health.response || 'OK'}`);
    } else {
      console.log('❌ OpenRouter service is unhealthy');
      console.log('🔍 Error:', health.error);
    }
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 3: Simple Medical Consultation
  console.log('\n📋 Test 3: Simple Medical Consultation');
  try {
    const response = await openRouterService.getMedicalConsultation(
      "I have a headache and fever. What should I do?",
      [],
      { age: 30, gender: 'male' }
    );
    
    if (response.success) {
      console.log('✅ Medical consultation successful');
      console.log('💬 AI Response:', response.message.substring(0, 200) + '...');
      console.log('📊 Token Usage:', response.usage?.total_tokens || 'Unknown');
    } else {
      console.log('❌ Medical consultation failed');
      console.log('🔍 Error:', response.error);
    }
  } catch (error) {
    console.log('❌ Consultation test failed:', error.message);
  }

  // Test 4: Medicine Recommendations
  console.log('\n📋 Test 4: Medicine Recommendations');
  try {
    const sampleMedicines = [
      { name: 'Paracetamol', type: 'Painkiller', description: 'Pain relief and fever reducer' },
      { name: 'Ibuprofen', type: 'Anti-inflammatory', description: 'Pain and inflammation relief' },
      { name: 'Amoxicillin', type: 'Antibiotic', description: 'Bacterial infection treatment' }
    ];

    const recommendations = await openRouterService.getMedicineRecommendations(
      'I have severe headache and body aches with mild fever',
      sampleMedicines,
      { age: 25 }
    );

    if (recommendations.success) {
      console.log('✅ Medicine recommendations successful');
      console.log('💊 Recommendations count:', recommendations.recommendations?.length || 0);
      if (recommendations.recommendations && recommendations.recommendations.length > 0) {
        console.log('🏥 First recommendation:', recommendations.recommendations[0].medicine);
      }
      console.log('⚠️  General advice available:', !!recommendations.generalAdvice);
    } else {
      console.log('❌ Medicine recommendations failed');
      console.log('🔍 Error:', recommendations.error);
    }
  } catch (error) {
    console.log('❌ Medicine recommendation test failed:', error.message);
  }

  // Test 5: Prescription Analysis
  console.log('\n📋 Test 5: Prescription Analysis');
  try {
    const samplePrescription = `
      Dr. John Smith, MD
      Patient: Jane Doe
      Date: ${new Date().toLocaleDateString()}
      
      Rx:
      1. Paracetamol 500mg - Take 1 tablet every 6 hours for fever
      2. Amoxicillin 250mg - Take 1 capsule twice daily for 7 days
      3. Rest and adequate fluids
    `;

    const analysis = await openRouterService.analyzePrescription(
      samplePrescription,
      sampleMedicines
    );

    if (analysis.success) {
      console.log('✅ Prescription analysis successful');
      console.log('📄 Extracted medicines count:', analysis.extractedMedicines?.length || 0);
      console.log('🏪 Availability status:', analysis.availability || 'Unknown');
      console.log('💰 Cost estimate available:', !!analysis.totalCost);
    } else {
      console.log('❌ Prescription analysis failed');
      console.log('🔍 Error:', analysis.error);
    }
  } catch (error) {
    console.log('❌ Prescription analysis test failed:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎯 AI Integration Test Summary Complete');
  console.log('\n💡 Next Steps:');
  console.log('   1. Update .env file with your actual OpenRouter API key');
  console.log('   2. Start the server: npm run dev');
  console.log('   3. Test the endpoints using the examples below');
  console.log('\n📚 Available AI Endpoints:');
  console.log('   POST /api/chat/consult - Medical consultations');
  console.log('   POST /api/chat/recommend-medicines - Medicine recommendations');
  console.log('   POST /api/chat/analyze-prescription - Prescription analysis');
  console.log('   POST /api/medicines/ai-recommendations - Enhanced medicine search');
  console.log('   POST /api/medicines/interaction-check - Drug interaction analysis');
  console.log('   GET  /api/medicines/ai-info/:name - Detailed medicine information');
}

// Example API calls for manual testing
function showExampleCalls() {
  console.log('\n📖 Example API Calls:');
  console.log('\n1. Medical Consultation:');
  console.log(`curl -X POST ${BASE_URL}/chat/consult \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{
    "message": "I have a headache and mild fever. What should I do?",
    "userContext": {"age": 30, "gender": "male"}
  }'`);

  console.log('\n2. Medicine Recommendations:');
  console.log(`curl -X POST ${BASE_URL}/medicines/ai-recommendations \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{
    "symptoms": "headache and fever",
    "age": 30,
    "severityLevel": "mild"
  }'`);

  console.log('\n3. Drug Interaction Check:');
  console.log(`curl -X POST ${BASE_URL}/medicines/interaction-check \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{
    "medications": ["Paracetamol", "Ibuprofen", "Aspirin"]
  }'`);
}

// Run the tests
if (require.main === module) {
  runTests().then(() => {
    showExampleCalls();
    console.log('\n🚀 Ready to revolutionize medical consultation with AI!');
  }).catch(error => {
    console.error('❌ Test execution failed:', error);
  });
}

module.exports = { runTests };