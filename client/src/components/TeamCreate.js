import React, { Component } from 'react';
import {
    Button,
    Modal,
    Form
} from 'react-bootstrap';
import { connect } from 'react-redux';
import mixpanel from 'mixpanel-browser';
import { createTeam } from '../actions/teamActions';


class TeamCreate extends Component {
    state = {
        modal: false,
        name: '',
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

    onSubmit = event => {
        event.preventDefault();

        const form = event.currentTarget;
        if (!form.checkValidity()) {
          event.stopPropagation();
          this.setState({ validated: true });
        } else {
            const newTeam = {
                name: this.state.name
            };
            this.props.createTeam(newTeam);
            this.toggle();
            this.setState({
                name: ''
            });
            this.setState({ validated: false });
            mixpanel.track('Team Created', newTeam);
        }
    };

    render() {
        const { validated } = this.state;
        return (
            <div>
                <Button style={{ marginBottom: '2rem' }} onClick={this.toggle}>
                        Create Team
                </Button>
                <Modal show={this.state.modal} onHide={this.toggle}>
                    <Modal.Header>Create Team</Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={this.onSubmit} noValidate validated={validated}>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Name"
                                    onChange={this.onChange}
                                    required
                                />
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
    team: state.team
});

export default connect(
    mapStateToProps,
    { createTeam }
)(TeamCreate);
