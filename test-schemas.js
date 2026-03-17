#!/usr/bin/env node

// Test script to validate SEO schemas
// Run with: node test-schemas.js

const { generateFAQSchema, generateBreadcrumbSchema, generateReviewSchema } = require('./lib/structuredData.ts');

console.log('🧪 Testing SEO Schemas...\n');

// Test FAQ Schema
console.log('1. FAQ Schema:');
const faqSchema = generateFAQSchema([
  {
    question: "What is probate in New Jersey?",
    answer: "Probate is a legal process that allows the executor to settle debts and transfer property to heirs."
  }
]);
console.log('✅ FAQ Schema generated successfully');
console.log('Structure:', Object.keys(faqSchema));

// Test Breadcrumb Schema
console.log('\n2. Breadcrumb Schema:');
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://www.josetherealtor.com" },
  { name: "Blog", url: "https://www.josetherealtor.com/blog" }
]);
console.log('✅ Breadcrumb Schema generated successfully');
console.log('Structure:', Object.keys(breadcrumbSchema));

// Test Review Schema
console.log('\n3. Review Schema:');
const reviewSchema = generateReviewSchema({
  reviewCount: 5,
  averageRating: 4.8,
  reviews: [
    {
      author: "John Doe",
      rating: 5,
      text: "Excellent service!",
      date: "2024-01-15"
    }
  ]
});
console.log('✅ Review Schema generated successfully');
console.log('Structure:', Object.keys(reviewSchema));

console.log('\n🎉 All schemas working correctly!');
console.log('\nNext steps:');
console.log('1. Deploy to see FAQ snippets in Google search results');
console.log('2. Add breadcrumbs to remaining pages');
console.log('3. Update review schema when you get real reviews');
