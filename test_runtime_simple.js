const fs = require('fs');

// Show actual runtime data
(async () => {
  // Read the types to see the actual property structure
  const typesCode = fs.readFileSync('src/lib/quote/types.ts', 'utf-8');
  
  console.log('=== ACTUAL TYPE DEFINITIONS ===');
  console.log('ExtractedMaterial interface:');
  const materialInterface = typesCode.match(/export interface ExtractedMaterial\s*\{([^}]+)\}/s)?.[1];
  if (materialInterface) {
    console.log(materialInterface.trim());
  }
  
  console.log('\nExtractedScopeItem interface:');
  const scopeInterface = typesCode.match(/export interface ExtractedScopeItem\s*\{([^}]+)\}/s)?.[1];
  if (scopeInterface) {
    console.log(scopeInterface.trim());
  }
  
  console.log('\n=== KNOWLEDGE PROJEcTKNOWLEDGE INTERFACE ===');
  const projectKnowledgeCode = fs.readFileSync('src/lib/knowledge-provider.ts', 'utf-8');
  const projectKnowledgeInterface = projectKnowledgeCode.match(/export interface ProjectKnowledge\s*\{([^}]+)\}/s)?.[1];
  if (projectKnowledgeInterface) {
    console.log(projectKnowledgeInterface.trim());
  }
  
  console.log('\n=== LOAD ACTUAL DATA ===');
  try {
    const { roofingMaterials } = require('./src/knowledge/roofing/materials');
    const { roofingScopeItems } = require('./src/knowledge/roofing/scope');
    
    console.log('Materials loaded:', roofingMaterials.length);
    console.log('Scope items loaded:', roofingScopeItems.length);
    
    console.log('\n=== FIRST MATERIAL STRUCTURE ===');
    console.log('First material:', roofingMaterials[0]);
    console.log('keys:', Object.keys(roofingMaterials[0]));
    
    console.log('\n=== FIRST SCOPE ITEM STRUCTURE ===');
    console.log('First scope item:', roofingScopeItems[0]);
    console.log('keys:', Object.keys(roofingScopeItems[0]));
    
    console.log('\n=== SIMULATE ACTUAL EXTRACTION ===');
    // Simulate what extraction might produce
    const extractedMaterial = { name: 'Drip edge', quantity: 10, unit: 'ft', unitPrice: 25, totalPrice: 250 };
    const extractedScopeItem = { name: 'Drip Edge', description: 'Metal flashing', quantity: 10, unit: 'ft', totalPrice: 250 };
    
    console.log('Extracted material:', extractedMaterial);
    console.log('Extracted scope item:', extractedScopeItem);
    
    // Match materials logic
    console.log('\n=== MATERIALS MATCHING ===');
    let matchFound = false;
    for (let i = 0; i < roofingMaterials.length && !matchFound; i++) {
      const m = roofingMaterials[i];
      const extractedNormalized = extractedMaterial.name.toLowerCase().trim();
      const knowledgeNormalized = m.name.toLowerCase().trim();
      
      console.log('\nComparison:', i + 1);
      console.log('  Extracted:', JSON.stringify(extractedMaterial));
      console.log('  Knowledge:', JSON.stringify(m));
      console.log('  extracted.name:', extractedMaterial.name);
      console.log('  knowledge.name:', m.name);
      console.log('  extracted.name is undefined:', extractedMaterial.name === undefined);
      console.log('  extracted.name?.toLowerCase():', extractedMaterial.name?.toLowerCase());
      console.log('  extracted.name?.toLowerCase().includes(...)?', extractedMaterial.name?.toLowerCase().includes(knowledgeNormalized));
      console.log('  knowledge.name.toLowerCase().includes(...)?', knowledgeNormalized.includes(extractedMaterial.name?.toLowerCase()));
      
      if (extractedMaterial.name?.toLowerCase().includes(knowledgeNormalized) || knowledgeNormalized.includes(extractedMaterial.name?.toLowerCase())) {
        matchFound = true;
        console.log('  *** MATCH FOUND ***');
      } else {
        console.log('  No match');
      }
    }
    
    console.log('\n=== SCOPE ITEMS MATCHING ===');
    matchFound = false;
    for (let i = 0; i < roofingScopeItems.length && !matchFound; i++) {
      const s = roofingScopeItems[i];
      const extractedNormalized = extractedScopeItem.name.toLowerCase().trim();
      const knowledgeNormalized = s.name.toLowerCase().trim();
      
      console.log('\nComparison:', i + 1);
      console.log('  Extracted:', JSON.stringify(extractedScopeItem));
      console.log('  Knowledge:', JSON.stringify(s));
      console.log('  extracted.name:', extractedScopeItem.name);
      console.log('  knowledge.name:', s.name);
      console.log('  extracted.name is undefined:', extractedScopeItem.name === undefined);
      console.log('  extracted.name?.toLowerCase():', extractedScopeItem.name?.toLowerCase());
      console.log('  extracted.name?.toLowerCase().includes(...)?', extractedScopeItem.name?.toLowerCase().includes(knowledgeNormalized));
      console.log('  knowledge.name.toLowerCase().includes(...)?', knowledgeNormalized.includes(extractedScopeItem.name?.toLowerCase()));
      
      if (extractedScopeItem.name?.toLowerCase().includes(knowledgeNormalized) || knowledgeNormalized.includes(extractedScopeItem.name?.toLowerCase())) {
        matchFound = true;
        console.log('  *** MATCH FOUND ***');
      } else {
        console.log('  No match');
      }
    }
    
  } catch (error) {
    console.log('Error loading data:', error.message);
  }
})();