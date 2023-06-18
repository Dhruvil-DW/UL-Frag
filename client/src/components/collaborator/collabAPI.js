import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import { useContext } from 'react';
import { authContext } from '../../context/authContext';
import { promptActions, promptContext } from '../../context/promptContext';

export function useListCollab(applicationID) {
  const { authState } = useContext(authContext);
  const token = authState.token;

  return useQuery({
    queryKey: ["collaborators", applicationID],
    queryFn: async () => {
      const { data } = await axios.get(`collaborator/get/${applicationID}`, { headers: { Authorization: "Bearer " + token } });
      return data;
    }
  })
}

export function useMutateInvite(applicationID) {
  const { promptDispatch } = useContext(promptContext);
  const { authState } = useContext(authContext);
  const token = authState.token;
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: (data) => {
      return axios.post(`collaborator/invite/${applicationID}`, data, { headers: { Authorization: "Bearer " + token } });
    },
    onSuccess: async (res, postData) => {
      console.log({postData});
      const msg = res.data?.message ?? "Added succesfully";
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { type: 'success', message: msg } });
      queryClient.invalidateQueries({ queryKey: ["collaborators", applicationID] });
    },
    onError: async (err, postData) => {
      const msg = err.response?.data?.message ?? "Error while Adding data";
      promptDispatch({ type: promptActions.SHOW_PROMPT, payload: { message: msg } });
    }
  })
}