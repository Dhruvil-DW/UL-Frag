'use strict';

/** @type {import('sequelize-cli').Migration} */
const questions = [
  // Category:- Overview

  { category_id: 1, question: "Do you have a project allocated for the brief?", question_type_id: 14, question_opt: '["Project name", "No project", "Proactive brief"]', require: 0, status: 1, parent_id: 0 },
  { category_id: 1, question: "Does this brief have GBVP sign off?", question_type_id: 10, question_opt: '["Yes", "No", "In progress"]', require: 0, status: 1, parent_id: 0 },
  { category_id: 1, question: "Select category", question_type_id: 3, question_opt: '["Fabric clean(FCL)", "Fabric Enhancer(FEN)", "Home & Hygiene(H&H)", "Other"]', require: 1, status: 1, parent_id: 0 },
  { category_id: 1, question: "Select format", question_type_id: 5, question_opt: '["Liquid", "Bar", "Powder", "Capsule"]', require: 0, status: 1, parent_id: 0 },
  { category_id: 1, question: "Select business unit", question_opt: '["Europe", "Americas", "South Asia", "SEAA"]', question_type_id: 4, require: 0, status: 1, parent_id: 0 },
  { category_id: 1, question: "Select country", question_opt: '["United Kingdom", "France", "Turkey", "Netherlands"]', question_type_id: 6, require: 1, status: 1, parent_id: 0 },
  { category_id: 1, question: "Markets for the project", question_type_id: 12, require: 0, status: 1, parent_id: 0 },
  { category_id: 1, question: "Lead markets", question_opt: '["United Kingdom", "France", "Turkey", "Netherlands", "None"]', question_type_id: 0, require: 0, status: 1, parent_id: 7 },
  { category_id: 1, question: "Rollout markets", question_opt: '["United Kingdom", "France", "Turkey", "Netherlands", "None"]', question_type_id: 0, require: 0, status: 1, parent_id: 7 },
  { category_id: 1, question: "Impacted markets", question_opt: '["United Kingdom", "France", "Turkey", "Netherlands", "None"]', question_type_id: 0, require: 0, status: 1, parent_id: 7, description: 'You will get this from your TPL' },
  { category_id: 1, question: "What are the expected launch date per market?", question_type_id: 12, require: 0, status: 1, parent_id: 0 },
  { category_id: 1, question: "Lead markets", question_type_id: 0, question_opt: 8, require: 0, status: 1, parent_id: 11 },
  { category_id: 1, question: "Rollout markets", question_type_id: 0, question_opt: 9, require: 0, status: 1, parent_id: 11 },
  { category_id: 1, question: "Impacted markets", question_type_id: 0, question_opt: 10, require: 0, status: 1, parent_id: 11 },
  { category_id: 1, question: "Brand position", question_opt: '["brand_sunlight.png", "brand_domestos.png", "brand_brilhante.png", "brand_cif.png", "brand_dirtisgood.png"]', question_type_id: 7, require: 0, status: 1, parent_id: 0 },
  { category_id: 1, question: "Select product cell", question_type_id: 10, question_opt: '["Guardrail", "Power growth", "Unsure"]', require: 0, status: 1, parent_id: 0 },

  // Category:- About the Fragrance
  { category_id: 2, question: "What is your business ambition with the project above? Please explain the context of this ambition.", question_type_id: 1, require: 0, status: 1, parent_id: 0, description: 'This should be the larger ambition for the Brand/variant. It’s the overall Job to be done. You will need to articulate what is happening today wrt Consumer choice and how you would expect it to change with this project. The market dynamics and the consumer need gap you are attempting to resolve has to be clearly mentioned here.' },
  { category_id: 2, question: "What role do you expect fragrance to play in achieving the business ambition?", question_type_id: 1, require: 0, status: 1, parent_id: 0, description: 'There needs to be a good reason for you to demand change in fragrance. The problem statement needs to go beyond "Competition fragrance is better". Why do consumers prefer another fragrance needs to be clear for you to fill this section. This problem statement needs to come from Consumer work/ 6P analysis/ Dip sticks/ PDC Analysis and other sources recommended by CMI.' },
  { category_id: 2, question: "Why do you think the current fragrance is not doing the job?", question_type_id: 1, require: 0, status: 1, parent_id: 0, description: 'There needs to be a good reason for you to demand change in fragrance. The problem statement needs to go beyond "Competition fragrance is better". Why do consumers prefer another fragrance needs to be clear for you to fill this section. This problem statement needs to come from Consumer work/ 6P analysis/ Dip sticks/ PDC Analysis and other sources recommended by CMI.' },
  { category_id: 2, question: "Before proceeding please confirm you have smelled few in market products along with your CBFMs.", question_type_id: 11, question_opt: '["I confirm"]', require: 0, status: 1, parent_id: 0, description: 'In Home Care, we will hereon brief, design and assess fragrance superiority using the Performance-Character-Liking (P-C-L) framework. Your input below will shape the fragrance experience you have visualized for your Brand in this brief. Do not fill this section unless you have smelled a few in-market products along with your CBFMs.' },

  // Category:- About the Consumers
  { category_id: 3, question: "Please outline the specific consumer segment that you intend to influence with the new fragrance.", question_type_id: 1, require: 0, status: 1, parent_id: 0, description: 'It is an assumption that all other consumer segments that you will test with, will aim for minimum parity. The consumer segment in which you wish to win needs to be sharp and sizeable enough to drive growth. If you are struggling with this, please speak to your CMI partner for input.' },
  { category_id: 3, question: "Describe the experience you wish to give consumers with the new fragrance.", question_type_id: 1, require: 0, status: 1, parent_id: 0, description: 'This section will input into the character section for the CBFMs. How do you want your consumers to FEEL as they experience the fragrance? How do you visualize them in terms of their physiological response to the experience? Are they smiling, relaxed with their eyes shut, jumping with joy? How do you expect the experience to be different from the current experience? e.g. a narration of From & amp; To is important here. The starting point for this understanding can be built by brand teams via engagement with consumers. Your CBFMs can help you sharpen this section as well. Please do not ask CBFMs to write this section for you!' },
  { category_id: 3, question: "Select the moments where you would expect the fragrance to do its best", question_opt: '["Pre-wash", "During wash", "After wash (wet)", "After wash (dry)"]', question_type_id: 8, require: 0, status: 1, parent_id: 0, description: 'Consumers experience fragrance through the use and post use of the product. Each stage is not required to be a delight stage. You need to choose the moments where you would expect the fragrance to undeniably do its best. The choice of this moment will come from a combination of understanding Fragrance experience Map from Consumers, Fragrance claim you wish to make and the inherent understanding of how consumers perceive fragrances through the interaction. The Central Fragrance team will aim to provide a Book of Magic Moments as a starting point.' },

  // Category:- About the investment
  { category_id: 4, question: "What is the investment you are wanting to make?", question_type_id: 10, question_opt: '["Incremental", "At current level", "Below current level"]', require: 0, status: 1, parent_id: 0, description: 'You should have done some work to check affordability. Please do not issue unrealistic cost targets and  do discuss with your procurement partners and CBFMs your negotiation approach, if any with the fragrance house.' },
  { category_id: 4, question: "How long do you plan to sustain the investment before expecting an optimization?", question_opt: '["Only for launch phase(3 to 6 months)", "Beyond launch phase(6 to 24 months)", "Any other"]', question_type_id: 10, require: 0, status: 1, parent_id: 0, description: 'This is what typically happens across innovations from launch onwards. It is something that erodes superiority and ideally should be avoided. The business context may still require this optimization to manage margins and the intent needs to be stated upfront. This gives the opportunity for CBFMs to consider if the FH should be briefed for 2 levels of submission | At launch & a few months post launch. This will also avoid new optimization briefs being issued by BUs separately to the Global ones.' },
  { category_id: 4, question: "What evidence are you looking for to make fragrance selection?", question_type_id: 1, require: 0, status: 1, parent_id: 0, description: 'This section needs to be filled in along with your CI partner. The final test design, target audience, methodology and action standards using the P-C-L Framework need to be included here. There will be a difference in validation investment for PGC v/s other cells. The CI team is thereafter expected to agree the end to end testing plan with the FH to ensure that we do not duplicate tests.' },
  { category_id: 4, question: "Specific variant name & high resolution pack shot", question_type_id: 9, require: 0, status: 1, parent_id: 0, description: 'Front and back pack shot. Please ensure you clearly mention the variant name especially if it specifies an ingredient like surf passion fruit. If you don’t have the new artwork ready, please share the concept.' },
  { category_id: 4, question: "Competitive benchmark-name & high resolution pack shot", question_type_id: 9, require: 0, status: 1, parent_id: 0, description: 'Front and Back pack shot It is possible that you have an "eye ball" competition to beat overall but from a fragrance perspective, you may have another player who is a stronger contender. Please call this out. You may also face a situation of having no direct competition, in which case you need to articulate | what is consumer doing now and what you wish them to do in the future.' },
  { category_id: 4, question: "What is your project concept?", question_type_id: 13, require: 0, status: 1, parent_id: 0, description: 'If you have a selected concept, please provide it here. If a final concept is not available, the lead options are good enough. Pls do not issue fragrance briefs if you have no idea what you plan to say to consumers.' },
  { category_id: 4, question: "What are the claims you wish to make, for a new fragrances?", question_type_id: 1, require: 0, status: 1, parent_id: 0, description: 'Please include sustainability claims that may impact fragrance ingredients. If you have many claims in the project (which in reality you shouldn’t), please highlight the one most potent to resonate with consumers. As reference, the types of claims could be: long lasting, malodour coverage on a specific type of fabric, biodegradable, hypoallergenic, Halal, Essential Oils and Emotive claims like Happy, Relaxing, Joyful.' },
  { category_id: 4, question: "Do you plan to celebrate this claim in your comms?", question_opt: '["TV", "Digital", "Pack", "Point of sale"]', question_type_id: 8, require: 0, status: 1, parent_id: 0, description: 'It is important to know if a claim is just intended to be on BOP or it is the hero of your Brand Comms. Early artwork prototypes to provide a sense of colours, textures, language and emotion are important to provide.' },
]
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('questions', questions);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('questions', null, {});
  }
};
