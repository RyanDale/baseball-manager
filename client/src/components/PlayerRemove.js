import React, { Component } from 'react';
import {
    Button,
    Modal
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateTeam } from '../actions/teamActions';


class PlayerRemove extends Component {
    static propTypes = {
        player: PropTypes.object,
        playerType: PropTypes.string.isRequired
    };

    state = {
        modal: false
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    deleteRecord = () => {
        const team = this.props.team.team;
        this.props.updateTeam({
            [this.props.playerType]: team[this.props.playerType]
                .filter(player => player._id !== this.props.player._id),
            _id: team._id
        });
        this.toggle();
    };

    render() {
        const player = this.props.player;
        return (
            <span>
                <Button variant="secondary" onClick={this.toggle}>
                    <i className="material-icons md-18">delete</i>
                </Button>
                <Modal show={this.state.modal} onHide={this.toggle}>
                    <Modal.Header closeButton>
                        <Modal.Title>Remove Player</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Are you sure you wish to remove {player.firstName} {player.lastName}?
                        This action cannot be undone.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.deleteRecord} variant="primary">Yes</Button>
                        <Button onClick={this.toggle} variant="secondary">No</Button>
                    </Modal.Footer>
                </Modal>
            </span>
        );
    }
}

const mapStateToProps = state => ({
    team: state.team
});

export default connect(mapStateToProps, { updateTeam })(PlayerRemove);
