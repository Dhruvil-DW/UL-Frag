'use strict';

/** @type {import('sequelize-cli').Migration} */
const question_type = [
  {id: 1, question_type: "Text", description:"Single text input"},
  {id: 2, question_type: "Date", description:"Date selection"},
  {id: 3, question_type: "Select Dropdown predefined", description:"Single select dropdown predefined options"},
  {id: 4, question_type: "Select Dropdown dynamic", description:"Single select dropdown dynamic options"},
  {id: 5, question_type: "Multiselect Dropdown predefined", description:"Multiselect dropdown predefined options"},
  {id: 6, question_type: "Multiselect dropdown dynamic", description:"Multiselect dropdown dynamic options"},
  {id: 7, question_type: "Picture Choice predefined", description:"Select single image with radio button or checkboxes with predefined options"},
  {id: 8, question_type: "Multiselect Picture Choice", description:"Multiselect image with checkboxes"},
  {id: 9, question_type: "Add Multiple section", description:"Add more sections"},
  {id: 10, question_type: "Multiple Choice predefined", description:"Radio button, checkboxes or simple MCQ type question with predefined options"},
  {id: 11, question_type: "Multiple Choice dynamic", description:"Radio button or simple MCQ type question with dynamic options"},
  {id: 12, question_type: "Nested questions", description:"Nested questions"},
  {id: 13, question_type: "Textarea with file upload", description:"Textarea with file upload"},
  {id: 14, question_type: "Select with TextBox", description:"One Select Field and One Text Field"},
  {id: 15, question_type: "Confirm Checkbox", description:"I agree Checkbox"},
]
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('question_types', question_type);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('question_types', null,{});
  }
};
