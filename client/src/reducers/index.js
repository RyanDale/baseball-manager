import { combineReducers } from 'redux';
import hitterReducer from './hitterReducer';
import pitcherReducer from './pitcherReducer';
import teamReducer from './teamReducer';

export default combineReducers({
    hitter: hitterReducer,
    pitcher: pitcherReducer,
    team: teamReducer
});
