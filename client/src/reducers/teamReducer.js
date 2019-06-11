import {
    CREATE_TEAM,
    DELETE_TEAM,
    GET_TEAM,
    GET_TEAMS,
    TEAMS_LOADING,
    UPDATE_TEAM
} from '../actions/types';

const initialState = {
    team: {},
    teams: [],
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_TEAM:
            return {
                ...state,
                teams: [action.payload, ...state.teams]
            };
        case DELETE_TEAM:
            return {
                ...state,
                teams: state.teams.filter(team => team._id !== action.payload)
            };
        case GET_TEAM:
            return {
                ...state,
                team: action.payload,
                loading: false
            };
        case GET_TEAMS:
            return {
                ...state,
                teams: action.payload,
                team: action.payload,
                loading: false
            };
        case UPDATE_TEAM:
            return {
                ...state,
                team: action.payload,
            };
        case TEAMS_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}
