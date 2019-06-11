import React, { Component } from 'react';
import {
    Button,
    Modal,
    Form
} from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getTeams, updateTeam } from '../actions/teamActions';


class PlayerAdd extends Component {
    static propTypes = {
        playerAdded: PropTypes.func.isRequired,
        playerType: PropTypes.string.isRequired
    };

    state = {
        modal: false,
        team: '',
        validated: false
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    componentDidMount() {
       this.props.getTeams();
    }

    onSubmit = event => {
        event.preventDefault();

        const form = event.currentTarget;
        if (!form.checkValidity()) {
            event.stopPropagation();
            this.setState({ validated: true });
        } else {
            const team = this.props.teams.find(team => team._id === this.state.team);
            const players = this.props.players;
            this.props.updateTeam({
                //[this.props.playerType]: [...team[this.props.playerType], players],
                name: team.name,
                _id: team._id
            });
            this.toggle();
            this.setState({
                team: ''
            });
            this.setState({ validated: false });
            mixpanel.track('Players Added', {
                team,
                players
            });
        }
    };

    render() {
        const { validated } = this.state;
        const { teams } = this.props;
        return (
            <div>
                <Button style={{ marginBottom: '2rem' }} onClick={this.toggle}>
                    Add Player(s) to Team
                </Button>
                <Modal show={this.state.modal} onHide={this.toggle}>
                    <Modal.Header>Select Team</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.onSubmit} noValidate validated={validated}>
                            <Form.Group>
                                <Form.Control as="select" onChange={this.onChange} name="team" id="team" required>
                                    <option value="">Select a Team</option>
                                    {
                                        teams.map(team => (
                                            <option key={team._id} value={team._id}>{team.name}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Button type="submit" block>
                                Submit
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    teams: state.team.teams
});

export default connect(mapStateToProps, { getTeams, updateTeam })(PlayerAdd);
