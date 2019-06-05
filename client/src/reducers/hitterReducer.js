import {
    GET_HITTER,
    GET_HITTERS,
    HITTERS_LOADING
} from '../actions/types';

const initialState = {
    hitter: {},
    hitters: [],
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_HITTER:
            return {
                ...state,
                hitter: action.payload,
                loading: false
            };
        case GET_HITTERS:
            return {
                ...state,
                hitters: action.payload,
                hitter: action.payload,
                loading: false
            };
        case HITTERS_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}
