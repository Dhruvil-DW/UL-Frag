import axios from "axios";
import { useCallback, useContext } from "react";
import { authContext } from "../context/authContext";
// import { promptShow } from "../redux/features";

export function useAxios() {
  // const dispatch = useDispatch();
  const { authState } = useContext(authContext);
  const token = authState.token;

  console.log(token);

  const getData = useCallback(
    (API, params = {}, thenFn, catchFn) => {
      axios
        .get(API, { headers: { Authorization: "Bearer " + token }, ...params })
        .then((res) => {
          console.debug(API, { DATA: res.data });
          thenFn && thenFn(res.data);
        })
        .catch((err) => {
          // const msg = err.response?.data?.message ?? "Error while fetching data";
          // dispatch(promptShow({ message: msg }));
          console.error(err);
          catchFn && catchFn(err);
        });
    },
    [token]
  );

  const postData = useCallback(
    (API, data, thenFn, catchFn) => {
      axios
        .post(API, data, { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          console.debug(API, { DATA: res.data });
          // const msg = res.data?.message ?? "Added succesfully";
          // dispatch(promptShow({ type: 'success', message: msg }));
          thenFn && thenFn(res.data);
        })
        .catch((err) => {
          // const msg = err.response?.data?.message ?? "Error while Adding data";
          // dispatch(promptShow({ message: msg }));
          catchFn && catchFn(err);
        });
    },
    [token]
  );

  const updateData = useCallback(
    (API, data, thenFn, catchFn) => {
      axios
        .put(API, data, { headers: { Authorization: "Bearer " + token } })
        .then((res) => {
          console.debug(API, { DATA: res.data });
          // const msg = res.data?.message ?? "Updated succesfully";
          // dispatch(promptShow({ type: 'success', message: msg }));
          thenFn && thenFn(res.data);
        })
        .catch((err) => {
          // const msg = err.response?.data?.message ?? "Error while updating data";
          // dispatch(promptShow({ message: msg }));
          catchFn && catchFn(err);
        });
    },
    [token]
  );

  return { getData, postData, updateData };
}