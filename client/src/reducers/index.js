import { combineReducers } from 'redux';
import hitterReducer from './hitterReducer';

export default combineReducers({
    hitter: hitterReducer
});
