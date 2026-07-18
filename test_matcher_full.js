// Test the actual matching function with the modified matcher.ts
import type { QuoteExtraction } from './src/lib/quote/types';

async function testMatcher() {
  try {
    // Dynamically import the matcher module
    const matcherModule = await import('./src/lib/quote/matcher.js');
    
    console.log('=== LOADING MATCHER FUNCTION ===');
    const matchQuote = matcherModule.matchQuote;
    
    // Create test data matching the actual types
    const testExtraction: QuoteExtraction = {
      projectType: 'roof',
      contractor: 'Test Contractor',
      materials: [
        { name: 'Drip Edge', quantity: 10, unit: 'ft', unitPrice: 25, totalPrice: 250 },
        { name: 'Synthetic Underlayment', quantity: 5, unit: 'roll', unitPrice: 100, totalPrice: 500 },
      ],
      scopeItems: [
        { name: 'Drip Edge', description: 'Metal flashing', quantity: 10, unit: 'ft', totalPrice: 250 },
        { name: 'Synthetic Underlayment', description: 'Roof protection', quantity: 5, unit: 'roll', totalPrice: 500 },
      ],
      permits: [],
      warranties: [],
      exclusions: [],
      totalPrice: 750,
      confidence: 0.8,
    };
    
    console.log('\n=== RUNNING MATCHER WITH TEST DATA ===');
    console.log('Test extraction projectType:', testExtraction.projectType);
    
    const result = await matchQuote(testExtraction);
    
    console.log('\n=== MATCHER RESULTS ===');
    console.log('Matched materials:', result.matchedMaterials.length);
    console.log('Matched scope items:', result.matchedScopeItems.length);
    console.log('Unmatched materials:', result.unmatchedMaterials.length);
    console.log('Unmatched scope items:', result.unmatchedScopeItems.length);
    
    if (result.matchedMaterials.length > 0) {
      console.log('\n=== MATCHED MATERIALS ===');
      console.table(result.matchedMaterials.map(m => ({ 
        extractedName: m.original.name,
        knowledgeName: m.knowledge.name,
        confidence: m.confidence,
        status: m.status
      })));
    }
    
    if (result.unmatchedMaterials.length > 0) {
      console.log('\n=== UNMATCHED MATERIALS ===');
      console.table(result.unmatchedMaterials);
    }
    
  } catch (error) {
    console.log('Matcher test error:', error.message);
    console.log('Stack:', error.stack);
  }
}

testMatcher();
