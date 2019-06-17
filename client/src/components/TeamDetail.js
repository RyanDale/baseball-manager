import React, { Component } from 'react';
import { Card, Table, Nav, Spinner, Modal, Button, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getTeam } from '../actions/teamActions';
import PlayerRemove from './PlayerRemove';
import PlayerDetailModal from './PlayerDetailModal';


class TeamDetail extends Component {
    static propTypes = {
        getTeam: PropTypes.func.isRequired,
        team: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            activePlayer: {},
            show: false
        };
    }

    handleClose() {
        this.setState({
            activePlayer: {},
            show: false
        });
    }

    handleShow(player) {
        this.setState({
            activePlayer: player,
            show: true
        });
    }

    componentDidMount() {
        this.props.getTeam(this.props.match.params.id);
    }

    render() {
        const { team, loading } = this.props.team;
        const { show, activePlayer } = this.state;
        const hitters = _.get(team, 'hitters', []);
        const pitchers = _.get(team, 'pitchers', []);
        const [startingPitchers, reliefPitchers] = _.partition(pitchers, pitcher => pitcher.primaryPosition === 'SP');
        const totalPoints = [...hitters, ...pitchers].reduce((sum, player) => sum + player.salary, 0);
        return (
            <Container>
                <h1>{team.name} ({hitters.length + pitchers.length} of 25 players), {totalPoints}/6000 points</h1>
                <Card body>
                    <Card.Title>Hitters ({hitters.length} of 12+) {hitters.reduce((value, p) => p.salary + value, 0)} points</Card.Title>
                    {
                        <Table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Position</th>
                                    <th>Salary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    hitters.map(player => (
                                        <tr key={player._id}>
                                            <td>
                                                <PlayerRemove
                                                    playerType="hitters"
                                                    player={player}>
                                                </PlayerRemove>
                                            </td>
                                            <td>{player.firstName}</td>
                                            <td>{player.lastName}</td>
                                            <td>{player.positionList.join(', ')}</td>
                                            <td>{player.salary}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    }
                </Card>
                <br />
                <Card body>
                    <Card.Title>Starting Pitchers ({startingPitchers.length} of 5), {startingPitchers.reduce((value, p) => p.salary + value, 0)} points</Card.Title>
                    {
                        <Table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Card</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Salary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    startingPitchers.map(player => (
                                        <tr key={player._id}>
                                            <td>
                                                <PlayerRemove
                                                    playerType="pitchers"
                                                    player={player}>
                                                </PlayerRemove>
                                            </td>
                                            <td>
                                                <img onClick={() => this.handleShow(player)} height="100" src={`/api/pitchers/${player._id}/card`} />
                                            </td>
                                            <td>{player.firstName}</td>
                                            <td>{player.lastName}</td>
                                            <td>{player.salary}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    }
                </Card>
                <br />
                <Card body>
                    <Card.Title>Relief Pitchers ({reliefPitchers.length} of 7+), {reliefPitchers.reduce((value, p) => p.salary + value, 0)} points</Card.Title>
                    {
                        <Table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Card</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Salary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    reliefPitchers.map(player => (
                                        <tr key={player._id}>
                                            <td>
                                                <PlayerRemove
                                                    playerType="pitchers"
                                                    player={player}>
                                                </PlayerRemove>
                                            </td>
                                            <td>
                                                <img onClick={() => this.handleShow(player)} height="100" src={`/api/pitchers/${player._id}/card`} />
                                            </td>
                                            <td>{player.firstName}</td>
                                            <td>{player.lastName}</td>
                                            <td>{player.salary}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    }
                </Card>
                <PlayerDetailModal player={activePlayer}
                    playerType='pitcher'
                    show={show}
                    closeModal={this.handleClose}>
                </PlayerDetailModal>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    team: state.team
});

export default connect(mapStateToProps, { getTeam/*, updateContact*/ })(TeamDetail);