import axios from 'axios';

import { GET_HITTER, GET_HITTERS, HITTERS_LOADING } from "./types";


export const getHitter = id => dispatch => {
  dispatch(setHittersLoading());
  axios.get(`/api/hitters/${id}`).then(response => dispatch({
    type: GET_HITTER,
    payload: response.data
  }));
}

export const getHitters = () => dispatch => {
  dispatch(setHittersLoading());
  axios.get('/api/hitters').then(response => dispatch({
    type: GET_HITTERS,
    payload: response.data
  }));
}

export const setHittersLoading = () => ({
  type: HITTERS_LOADING
});
