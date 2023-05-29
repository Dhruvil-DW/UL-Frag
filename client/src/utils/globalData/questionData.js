// export const questions = [
//   {
//     categoryName: "Overview",
//     questions: [
//       {
//         id: 1,
//         question: "Do you have a project allocated for the brief ?",
//         question_type: "singleselect",
//         options: ["Project name", "No project", "Proactive brief", "Any other"]
//       },
//       {
//         id: 2,
//         question: "Select Category",
//         question_type: "singleselect",
//         options: ["Fabric Clean (FCL)", "Fabric Enhancer (FEN)", "Home & Hygiene (H&H)", "Add other"]
//       },
//       {
//         id: 3,
//         question: "Select Format",
//         question_type: "multiselect",
//         options: ["Liquid", "Bar", "Powder", "Capsule"]
//       },
//       {
//         id: 4,
//         question: "Select Business Unit",
//         question_type: "singleselect",
//         options: ["Europe", "America", "South Asia", "SEAA"]
//       },
//       {
//         id: 5,
//         question: "Select Country",
//         question_type: "singleselect",
//         options: ["Europe", "America", "South Asia", "SEAA"]
//       }
//     ]
//   },
//   {
//     categoryName: "Marketing",
//     questions: [
//       {
//         id: 1,
//         question: "Do you have a project allocated for the brief ?",
//         question_type: "singleselect",
//         options: ["Project name", "No project", "Proactive brief", "Any other"]
//       },
//       {
//         id: 2,
//         question: "Select Category",
//         question_type: "singleselect",
//         options: ["Fabric Clean (FCL)", "Fabric Enhancer (FEN)", "Home & Hygiene (H&H)", "Add other"]
//       },
//       {
//         id: 3,
//         question: "Select Format",
//         question_type: "multiselect",
//         options: ["Liquid", "Bar", "Powder", "Capsule"]
//       },
//       {
//         id: 4,
//         question: "Select Business Unit",
//         question_type: "singleselect",
//         options: ["Europe", "America", "South Asia", "SEAA"]
//       },
//       {
//         id: 5,
//         question: "Select Country",
//         question_type: "singleselect",
//         options: ["Europe", "America", "South Asia", "SEAA"]
//       }
//     ]
//   }
// ]

export const questionsData = [
  {
    id: 1,
    question: "Do you have a project allocated for the brief ?",
    question_type_id: "singleselect",
    question_opt: ["Project name", "No project", "Proactive brief", "Any other"],
    category: 1,
    Category: { id: 1, name: "Overview"},
  },
  {
    id: 2,
    question: "Select Category",
    question_type_id: "singleselect",
    question_opt: ["Fabric Clean (FCL)", "Fabric Enhancer (FEN)", "Home & Hygiene (H&H)", "Add other"],
    category_id: 1,
    Category: { id: 1, name: "Overview"},
  },
  {
    id: 3,
    question: "Select Format",
    question_type_id: "multiselect",
    question_opt: ["Liquid", "Bar", "Powder", "Capsule"],
    category_id: 1,
    Category: { id: 1, name: "Overview"},
  },
  {
    id: 4,
    question: "Select Business Unit",
    question_type_id: "singleselect",
    question_opt: ["Europe", "America", "South Asia", "SEAA"],
    category_id: 1,
    Category: { id: 1, name: "Overview"},
  },
  {
    id: 5,
    question: "Select Country",
    question_type_id: "singleselect",
    question_opt: ["Europe", "America", "South Asia", "SEAA"],
    category_id: 1,
    Category: { id: 1, name: "Overview"},
  },
  {
    id: 6,
    question: "Do you have a project allocated for the brief ?",
    question_type_id: "singleselect",
    question_opt: ["Project name", "No project", "Proactive brief", "Any other"],
    category_id: 2,
    Category: { id: 2, name: "Marketing"},
  },
  {
    id: 7,
    question: "Select Category",
    question_type_id: "singleselect",
    question_opt: ["Fabric Clean (FCL)", "Fabric Enhancer (FEN)", "Home & Hygiene (H&H)", "Add other"],
    category_id: 2,
    Category: { id: 2, name: "Marketing"},
  },
  {
    id: 8,
    question: "Select Format",
    question_type_id: "multiselect",
    question_opt: ["Liquid", "Bar", "Powder", "Capsule"],
    category_id: 2,
    Category: { id: 2, name: "Marketing"},
  },
  {
    id: 9,
    question: "Select Business Unit",
    question_type_id: "singleselect",
    question_opt: ["Europe", "America", "South Asia", "SEAA"],
    category_id: 2,
    Category: { id: 2, name: "Marketing"},
  },
  {
    id: 10,
    question: "Select Country",
    question_type_id: "singleselect",
    question_opt: ["Europe", "America", "South Asia", "SEAA"],
    category_id: 2,
    Category: { id: 2, name: "Marketing"},
  }
]