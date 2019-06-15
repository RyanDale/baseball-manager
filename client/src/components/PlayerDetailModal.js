import React, { Component } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';


function renderResultField(field) {
    if (!field || !field.length) {
        // Empty field, display as such
        return '--';
    } else if (field[0] === field[1]) {
        // Same value so we don't want to display as a range
        return field[0];
    } else if (field[1] === 50) {
        // This means a player maxes out at the first value
        return `${field[0]}+`;
    } else {
        // Default, two different value fields
        return field.join('-');
    }
}


class ShowPlayerModal extends Component {
    static propTypes = {
        player: PropTypes.object,
        show: PropTypes.bool,
        playerType: PropTypes.string.isRequired,
        closeModal: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.props.closeModal();
    }

    render() {
        const { player, playerType, show } = this.props;

        return (
            <Modal show={show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {player.firstName} {player.lastName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img height="400"
                        src={`/api/${playerType}s/${player._id}/card`}
                        style={{ display: 'block', margin: '0 auto' }} />
                    <br />
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>X-R</th>
                                <th>K</th>
                                <th>GB</th>
                                <th>FB</th>

                                <th>BB</th>
                                <th>1B</th>
                                <th>2B</th>
                                <th>HR</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{renderResultField(player.xRange)}</td>
                                <td>{renderResultField(player.k)}</td>
                                <td>{renderResultField(player.gb)}</td>
                                <td>{renderResultField(player.fb)}</td>

                                <td>{renderResultField(player.bb)}</td>
                                <td>{renderResultField(player._1B)}</td>
                                <td>{renderResultField(player._2B)}</td>
                                <td>{renderResultField(player.hr)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                        </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ShowPlayerModal;