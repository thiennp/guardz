#!/usr/bin/env ts-node

/**
 * Run all GuardZ examples
 * 
 * Usage:
 * npx ts-node examples/run-all.ts
 */

console.log('🚀 Running GuardZ Examples\n');

// Import and run all examples
async function runExamples() {
  const examples = [
    'basic-usage',
    'array-validation', 
    'number-validation',
    'string-validation',
    'union-and-composite',
    'nullable-and-special',
    'utility-types',
    'advanced-features'
  ];

  for (const example of examples) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📖 Running: ${example}`);
    console.log(`${'='.repeat(50)}`);
    
    try {
      // Dynamic import to run each example
      await import(`./${example}.ts`);
    } catch (error) {
      console.error(`❌ Error running ${example}:`, error);
    }
    
    console.log('\n');
  }
  
  console.log('✅ All examples completed!');
  console.log('\n📚 For more information, see the README.md in this folder.');
}

// Run all examples
runExamples().catch(console.error); 