'use strict';

/** @type {import('sequelize-cli').Migration} */
const questions = [
  // Category:- Overview

  {category_id:1, question: "Do you have a project allocated for the brief?", question_type_id:3, question_opt:'["project name", "no project", "proactive brief"]', status:1},
  {category_id:1, question:"Select category", question_type_id:3, question_opt:'["Fabric clean(FCL)", "Fabric Enhancer(FEN)", "Home & Hygiene(H&H)"]', status:1},
  {category_id:1, question:"Select format", question_type_id:3, question_opt:'["Liquid", "Bar", "Powder", "Capsule"]', status:1},
  {category_id:1, question:"Select business unit", question_type_id:4, status:1},
  {category_id:1, question:"Select country", question_type_id:6, status:1},
  {category_id:1, question:"Markets for the project", question_type_id:12, status:1},
  {category_id:1, question:"Lead markets", question_type_id:0, status:1},
  {category_id:1, question:"Rollout markets", question_type_id:0, status:1},
  {category_id:1, question:"Impacted markets", question_type_id:0, status:1},
  {category_id:1, question:"What are the expected launch date per market?", question_type_id:12, status:1},
  {category_id:1, question:"Lead markets", question_type_id:0, status:1},
  {category_id:1, question:"Rollout markets", question_type_id:0, status:1},
  {category_id:1, question:"Impacted markets", question_type_id:0, status:1},
  {category_id:1, question:"Brand position", question_type_id:7, status:1},
  {category_id:1, question:"Select product cell", question_type_id:10, question_opt:'["Guardrail", "Power growth", "Unsure"]', status:1},

  // Category:- Marketing
  {category_id:2, question: "What is your business ambition with the project above? Please explain the context of this ambition", question_type_id:1, status:1},
  {category_id:2, question: "What role do you expect fragrance to play in achieving the business ambition?", question_type_id:1, status:1},
  {category_id:2, question: "Why do you think the current fragrance is not doing the job?", question_type_id:1, status:1},
  {category_id:2, question: "Before proceeding please confirm you have smelled few in market products along with your CBFMs", question_type_id:10, question_opt:'["I confirm"]', status:1},
]
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('questions', questions);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('questions', null,{});
  }
};
