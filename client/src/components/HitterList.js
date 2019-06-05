import React, { Component } from 'react';
import { Card, Table, Nav, Spinner, Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getHitters } from '../actions/hitterActions';

class HitterList extends Component {
    static propTypes = {
        getHitters: PropTypes.func.isRequired,
        hitter: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
            activeHitter: {}
        };
    }

    handleClose() {
        this.setState({
            show: false,
            activeHitter: {}
        });
    }

    handleShow(hitter) {
        this.setState({
            show: true,
            activeHitter: hitter
        });
    }

    componentDidMount() {
        this.props.getHitters();
    }

    render() {
        const { hitters, loading } = this.props.hitter;
        return (
            <Card body>
                <Card.Title>Hitter List</Card.Title>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Card</th>
                            <th>Set</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>Team</th>
                            <th>Salary</th>
                            <th>Bats</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? <tr>
                                <td className="text-center" colSpan="7">
                                    <Spinner animation="border" />
                                </td>
                            </tr>
                            :
                            hitters.map(hitter => (
                                <tr key={hitter._id}>
                                    <td>
                                        <img onClick={() => this.handleShow(hitter)}
                                            height="100"
                                            src={`/api/hitters/${hitter._id}/card`} />
                                    </td>
                                    <td>{hitter.set}</td>
                                    <td>
                                        <Nav.Link onClick={() => this.handleShow(hitter)}>
                                            {hitter.firstName} {hitter.lastName}
                                        </Nav.Link>
                                    </td>
                                    <td>{hitter.positionList.join(', ')}</td>
                                    <td>{hitter.team}</td>
                                    <td>{hitter.salary}</td>
                                    <td>{hitter.hand}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                        {this.state.activeHitter.firstName} {this.state.activeHitter.lastName}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img height="400"
                            src={`/api/hitters/${this.state.activeHitter._id}/card`}
                            style={{display: 'block', margin: '0 auto'}} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    hitter: state.hitter
});

export default connect(mapStateToProps, { getHitters })(HitterList);