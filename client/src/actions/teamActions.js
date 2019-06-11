import axios from 'axios';

import { CREATE_TEAM, GET_TEAM, GET_TEAMS, TEAMS_LOADING, DELETE_TEAM, UPDATE_TEAM } from "./types";


export const createTeam = team => (dispatch, getState) => {
  axios
    .post('/api/teams', team, getState)
    .then(response =>
      dispatch({
        type: CREATE_TEAM,
        payload: response.data
      })
    );
};

export const deleteTeam = id => dispatch => {
  axios.delete(`/api/teams/${id}`).then(() => dispatch({
    type: DELETE_TEAM,
    payload: id
  }));
}

export const getTeam = id => dispatch => {
  dispatch(setTeamsLoading());
  axios.get(`/api/teams/${id}`).then(response => dispatch({
    type: GET_TEAM,
    payload: response.data
  }));
}

export const getTeams = () => dispatch => {
  dispatch(setTeamsLoading());
  axios.get('/api/teams').then(response => dispatch({
    type: GET_TEAMS,
    payload: response.data
  }));
}

export const updateTeam = team => (dispatch, getState) => {
  axios
    .put(`/api/teams/${team._id}`, team, getState)
    .then(response =>
      dispatch({
        type: UPDATE_TEAM,
        payload: response.data
      })
    );
};

export const setTeamsLoading = () => ({
  type: TEAMS_LOADING
});
