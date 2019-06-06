import {
    GET_PITCHER,
    GET_PITCHERS,
    PITCHERS_LOADING
} from '../actions/types';

const initialState = {
    pitcher: {},
    pitchers: [],
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PITCHER:
            return {
                ...state,
                pitcher: action.payload,
                loading: false
            };
        case GET_PITCHERS:
            return {
                ...state,
                pitchers: action.payload,
                pitcher: action.payload,
                loading: false
            };
        case PITCHERS_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}
