import React, { Component } from 'react';
import {
    Button,
    Modal
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { deleteTeam } from '../actions/teamActions';

class TeamDelete extends Component {
    state = {
        modal: false
    };

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    deleteRecord = () => {
        this.props.deleteTeam(this.props.record._id);
        this.toggle();
    };

    render() {
        const record = this.props.record;
        return (
            <span>
                <Button variant="secondary" onClick={this.toggle}>
                    <i className="material-icons md-18">delete</i>
                </Button>
                <Modal show={this.state.modal} onHide={this.toggle}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Team</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Are you sure you wish to delete {record.name}?
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

export default connect(mapStateToProps, { deleteTeam })(TeamDelete);
