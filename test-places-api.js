#!/usr/bin/env node

// Simple test script to validate Places API fixes
// Run with: node test-places-api.js

const testCases = [
  { name: "Valid address", input: "17 humbert st nutley nj" },
  { name: "Short input", input: "17" },
  { name: "Empty input", input: "" },
  { name: "Invalid characters", input: "!@#$%^&*()" }
];

async function testPlacesAPI() {
  console.log("🧪 Testing Places API fixes...\n");
  
  const baseUrl = process.env.TEST_URL || "http://localhost:3000";
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    console.log(`Input: "${testCase.input}"`);
    
    try {
      const url = `${baseUrl}/api/places/autocomplete?input=${encodeURIComponent(testCase.input)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      console.log(`Status: ${response.status}`);
      console.log(`Response structure:`, {
        hasPredictions: Array.isArray(data.predictions),
        predictionsCount: data.predictions?.length || 0,
        hasError: !!data.error,
        error: data.error
      });
      
      // Validate response structure
      if (typeof data !== 'object' || !Array.isArray(data.predictions)) {
        console.log("❌ FAIL: Response doesn't have predictions array");
      } else {
        console.log("✅ PASS: Response has correct structure");
      }
      
    } catch (error) {
      console.log(`❌ FAIL: Network error - ${error.message}`);
    }
    
    console.log("---\n");
  }
}

// Run if called directly
if (require.main === module) {
  testPlacesAPI().catch(console.error);
}

module.exports = { testPlacesAPI };
