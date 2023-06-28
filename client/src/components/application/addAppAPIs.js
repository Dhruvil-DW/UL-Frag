import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import { useContext } from 'react';
import { authContext } from '../../context/authContext';
// import { promptActions, promptContext } from '../../context/promptContext';

export function useGetCountry(countryID) {
  const { authState } = useContext(authContext);
  const token = authState.token;

  return useQuery({
    enabled: Boolean(countryID),
    cacheTime: Infinity,
    staleTime: Infinity,
    queryKey: ["country", countryID],
    queryFn: async () => {
      const { data } = await axios.get(`application/getcountry/${countryID}`, { headers: { Authorization: "Bearer " + token } });
      return data;
    }
  })
}

export function useGetRegion() {
  const { authState } = useContext(authContext);
  const token = authState.token;

  return useQuery({
    cacheTime: Infinity,
    staleTime: Infinity,
    queryKey: ["region"],
    queryFn: async () => {
      const { data } = await axios.get(`application/getregions`, { headers: { Authorization: "Bearer " + token } });
      return data;
    }
  })
}

export function useGetAnswer(appID) {
  const { authState } = useContext(authContext);
  const token = authState.token;

  return useQuery({
    queryKey: ["answer", appID],
    enabled: !!appID,
    queryFn: async () => {
      const { data } = await axios.get(`/application/getdraft/${appID}`, { headers: { Authorization: "Bearer " + token } });
      console.log("Manually", data);
      return data;
    },
  })
}

export function useGetQuestions() {
  const { authState } = useContext(authContext);
  const token = authState.token;

  return useQuery({
    cacheTime: Infinity,
    staleTime: Infinity,
    queryKey: ["questions"],
    queryFn: async () => {
      const { data } = await axios.get(`/application/questions/getall`, { headers: { Authorization: "Bearer " + token } });
      const catWiseQue = getCatWiseQues(data);
      return catWiseQue;
    }
  })
}

function getCatWiseQues(questions) {
  const result = [];
  let count = 0;
  let CatWiseQueIndex;
  questions.forEach((que, index) => {
    const imgData = img_data[que.id];
    if (result[que.category.id - 1]) {
      CatWiseQueIndex += 1;
      result[que.category.id - 1].questions = [...result[que.category.id - 1].questions, { ...que, imgData: imgData, serial: count++, CatWiseQueIndex: `${que.category.id}.${CatWiseQueIndex}` }];
    } else {
      CatWiseQueIndex = 1;
      result[que.category.id - 1] = { category_id: que.category.id, category_name: que.category.name, serial: count++, questions: [{ ...que, imgData: imgData, serial: count++, CatWiseQueIndex: `${que.category.id}.${CatWiseQueIndex}` }] }
    }
  });
  // console.log("Sidebar_CatWiseData: ", result);
  return result;
}


const img_data = {
  1: [
    { path: "question_1_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_1_small.svg", style: { bottom: '15vw', right: '3vw', width: '7vw' } },
  ],
  2: [
    { path: "question_2_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_2_small.svg", style: { bottom: '13vw', right: '8vw', width: '6vw' } },
  ],
  3: [
    { path: "question_3_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_3_small.svg", style: { bottom: '3vw', right: '15vw', width: '7vw' } },
  ],
  4: [
    { path: "question_4_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_4_small.svg", style: { bottom: '13vw', right: '7vw', width: '7vw' } },
  ],
  5: [
    { path: "question_5_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_5_small.svg", style: { bottom: '13vw', right: '2vw', width: '7vw' } },
  ],
  6: [
    { path: "question_6_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_6_small.svg", style: { bottom: '2vw', right: '17vw', width: '7vw' } },
  ],
  // 7: [
  //   { path: "question_7_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_7_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  // 8: [
  //   { path: "question_8_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_8_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  // 9: [
  //   { path: "question_9_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_9_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  10: [
    { path: "question_7_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_7_small.svg", style: { bottom: '3vw', right: '18vw', width: '7vw' } },
  ],
  // 11: [
  //   { path: "question_3_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_3_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  // 12: [
  //   { path: "question_4_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_4_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  // 13: [
  //   { path: "question_5_main.png", style: {right: 0, width: '15vw'}},
  //   { path: "question_5_small.svg", style: {bottom: '15vw', right: '3vw', width: '7vw'}},
  // ],
  14: [
    { path: "question_8_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_8_small.svg", style: { bottom: '3vw', right: '17vw', width: '7vw' } },
  ],
  15: [
    { path: "question_9_main.png", style: { right: 0, width: '13vw' } },
    { path: "question_9_small.svg", style: { bottom: '11vw', right: '13vw', width: '6vw' } },
  ],
  16: [
    { path: "question_1_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_1_small.svg", style: { bottom: '8vw', right: '16vw', width: '7vw' } },
  ],
  17: [
    { path: "question_2_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_2_small.svg", style: { bottom: '3vw', right: '14vw', width: '6vw' } },
  ],
  18: [
    { path: "question_3_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_3_small.svg", style: { bottom: '8vw', right: '13vw', width: '7vw' } },
  ],
  19: [
    { path: "question_4_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_4_small.svg", style: { bottom: '12vw', right: '10vw', width: '7vw' } },
  ],
  20: [
    { path: "question_5_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_5_small.svg", style: { bottom: '2vw', right: '14vw', width: '7vw' } },
  ],
  21: [
    { path: "question_6_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_6_small.svg", style: { bottom: '2vw', right: '17vw', width: '7vw' } },
  ],
  22: [
    { path: "question_1_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_1_small.svg", style: { bottom: '5vw', right: '16vw', width: '7vw' } },
  ],
  23: [
    { path: "question_2_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_2_small.svg", style: { bottom: '10vw', right: '12vw', width: '6vw' } },
  ],
  24: [
    { path: "question_3_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_3_small.svg", style: { bottom: '3vw', right: '14vw', width: '7vw' } },
  ],
  25: [
    { path: "question_4_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_4_small.svg", style: { bottom: '6vw', right: '15vw', width: '7vw' } },
  ],
  29: [
    { path: "question_5_main.png", style: { right: 0, width: '12vw' } },
    { path: "question_5_small.svg", style: { bottom: '3vw', right: '13vw', width: '7vw' } },
  ],
  30: [
    { path: "question_6_main.png", style: { right: 0, width: '15vw' } },
    { path: "question_6_small.svg", style: { bottom: '2vw', right: '17vw', width: '7vw' } },
  ]
};