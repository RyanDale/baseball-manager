import axios from 'axios';

import { GET_PITCHER, GET_PITCHERS, PITCHERS_LOADING } from "./types";


export const getPitcher = id => dispatch => {
  dispatch(setPitchersLoading());
  axios.get(`/api/pitchers/${id}`).then(response => dispatch({
    type: GET_PITCHER,
    payload: response.data
  }));
}

export const getPitchers = () => dispatch => {
  dispatch(setPitchersLoading());
  axios.get('/api/pitchers').then(response => dispatch({
    type: GET_PITCHERS,
    payload: response.data
  }));
}

export const setPitchersLoading = () => ({
  type: PITCHERS_LOADING
});
