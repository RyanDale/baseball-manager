import { combineReducers } from 'redux';
import hitterReducer from './hitterReducer';
import pitcherReducer from './pitcherReducer';

export default combineReducers({
    hitter: hitterReducer,
    pitcher: pitcherReducer
});
