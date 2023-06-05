'use strict';

/** @type {import('sequelize-cli').Migration} */
const questions = [
  // Category:- Overview

  {category_id:1, question: "Do you have a project allocated for the brief?", question_type_id:3, question_opt:'["project name", "no project", "proactive brief"]', status:1, parent_id: 0},
  {category_id:1, question:"Select category", question_type_id:3, question_opt:'["Fabric clean(FCL)", "Fabric Enhancer(FEN)", "Home & Hygiene(H&H)"]', status:1, parent_id: 0},
  {category_id:1, question:"Select format", question_type_id:3, question_opt:'["Liquid", "Bar", "Powder", "Capsule"]', status:1, parent_id: 0},
  {category_id:1, question:"Select business unit", question_opt:'["Europe", "Americas", "South Asia", "SEAA"]', question_type_id:4, status:1, parent_id: 0},
  {category_id:1, question:"Select country", question_opt:'["United Kingdom", "France", "Turkey", "Netherlands"]', question_type_id:6, status:1, parent_id: 0},
  {category_id:1, question:"Markets for the project", question_type_id:12, status:1, parent_id: 0},
  {category_id:1, question:"Lead markets", question_opt:'["United Kingdom", "France", "Turkey", "Netherlands, None"]', question_type_id:0, status:1, parent_id: 6},
  {category_id:1, question:"Rollout markets", question_opt:'["United Kingdom", "France", "Turkey", "Netherlands, None"]', question_type_id:0, status:1, parent_id: 6},
  {category_id:1, question:"Impacted markets", question_opt:'["United Kingdom", "France", "Turkey", "Netherlands, None"]', question_type_id:0, status:1, parent_id: 6},
  {category_id:1, question:"What are the expected launch date per market?", question_type_id:12, status:1, parent_id: 0},
  {category_id:1, question:"Lead markets", question_type_id:0, status:1, parent_id: 10},
  {category_id:1, question:"Rollout markets", question_type_id:0, status:1, parent_id: 10},
  {category_id:1, question:"Impacted markets", question_type_id:0, status:1, parent_id: 10},
  {category_id:1, question:"Brand position", question_type_id:7, status:1, parent_id: 0},
  {category_id:1, question:"Select product cell", question_type_id:10, question_opt:'["Guardrail", "Power growth", "Unsure"]', status:1, parent_id: 0},

  // Category:- Section 1
  {category_id:2, question: "What is your business ambition with the project above? Please explain the context of this ambition", question_type_id:1, status:1, parent_id: 0},
  {category_id:2, question: "What role do you expect fragrance to play in achieving the business ambition?", question_type_id:1, status:1, parent_id: 0},
  {category_id:2, question: "Why do you think the current fragrance is not doing the job?", question_type_id:1, status:1, parent_id: 0},
  {category_id:2, question: "Before proceeding please confirm you have smelled few in market products along with your CBFMs", question_type_id:10, question_opt:'["I confirm"]', status:1, parent_id: 0},

  // Category:- Section 2
  {category_id:3, question: "Please outline the specific consumer segment that you intend to influence with the new fragrance", question_type_id:1, status:1, parent_id: 0},
  {category_id:3, question: "Describe the experience you wish to give consumers with the new fragrance", question_type_id:1, status:1, parent_id: 0},
  {category_id:3, question: "Select the moments where you would expect the fragrance to do its best", question_type_id:1, status:1, parent_id: 0},
  
// Category:- Section 3
{category_id:4, question: "What is the investment you are wanting to make?", question_type_id:10, question_opt:'["Incremental", "At current level", "Below current level"]', status:1, parent_id: 0},
{category_id:4, question: "How long do you plan to sustain the investment before expecting an optimization?", question_opt:'["Only for launch phase(3 to 6 months)", "Beyond for launch phase(6 to 24 months)", "Any other"]', question_type_id:10, status:1, parent_id: 0},
{category_id:4, question: "Describe the experience you wish to give consumers with the new fragrance", question_type_id:1, status:1, parent_id: 0},
{category_id:4, question: "Specific variant name & high resolution pack shot", question_type_id:9, status:1, parent_id: 0},
{category_id:4, question: "Competitive benchmark-name & high resolution pack shot", question_type_id:9, status:1, parent_id: 0},
{category_id:4, question: "What is your project concept", question_type_id:13, status:1, parent_id: 0},
{category_id:4, question: "What are the claims you wish to make, for a new fragrances", question_type_id:1, status:1, parent_id: 0},
{category_id:4, question: "Do you plan to celebrate this claim within your comms", question_type_id:8, status:1, parent_id: 0},
]
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('questions', questions);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('questions', null,{});
  }
};
