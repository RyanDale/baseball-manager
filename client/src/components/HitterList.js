import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Card, Table, Nav, Spinner, Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

import { getHitters } from '../actions/hitterActions';

const defaultSorted = [{
    dataField: 'price',
    order: 'desc'
}];

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

        this.columns = [
            {
                dataField: 'card',
                text: 'Card',
                formatter: this.cardFormatter.bind(this)
            },
            {
                dataField: 'set',
                text: 'Set'
            },
            {
                dataField: 'firstName',
                text: 'First Name',
                sort: true
            },
            {
                dataField: 'lastName',
                text: 'Last Name',
                sort: true
            },
            {
                dataField: 'team',
                text: 'Team',
                sort: true
            },
            {
                dataField: 'position',
                text: 'Position',
                formatter: (cell, row) => row.positionList.join(', '),
                filter: selectFilter({
                    options: {
                        'C': 'Catcher',
                        '1B': 'First Base',
                        '2B': 'Second Base',
                        '3B': 'Third Base',
                        'SS': 'Short Stop',
                        'LF': 'Left Field',
                        'CF': 'Center Field',
                        'RF': 'Right Field',
                        'OF': 'Outfield'
                    },
                    onFilter: filterVal => filterVal ? this.props.hitter.hitters.filter(hitter => hitter.positionList.includes(filterVal)) : this.props.hitter.hitters
                })
            },
            {
                dataField: 'hand',
                text: 'Bats',
                filter: selectFilter({
                    options: {
                        'L': 'Left',
                        'R': 'Right',
                        'S': 'Switch Hitter'
                    }
                })
            },
            {
                dataField: 'salary',
                text: 'Salary',
                sort: true
            }
        ];
    }

    cardFormatter(cell, row) {
        return (
            <img onClick={() => this.handleShow(row)} height="100" src={`/api/hitters/${row._id}/card`} />
        );
    }

    nameFormatter(cell, row) {
        return (
            <Nav.Link onClick={() => this.handleShow(row)}>
                {row.firstName} {row.lastName}
            </Nav.Link>
        );
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

    handleTableChange = (type, { sortField, sortOrder, data }) => {
        console.log('table change', type, sortField, sortOrder, data);
        setTimeout(() => {
            let result;
            if (sortOrder === 'asc') {
                result = data.sort((a, b) => {
                    if (a[sortField] > b[sortField]) {
                        return 1;
                    } else if (b[sortField] > a[sortField]) {
                        return -1;
                    }
                    return 0;
                });
            } else {
                result = data.sort((a, b) => {
                    if (a[sortField] > b[sortField]) {
                        return -1;
                    } else if (b[sortField] > a[sortField]) {
                        return 1;
                    }
                    return 0;
                });
            }
            this.setState(() => ({
                //data: result
            }));
        }, 2000);
    }

    render() {
        const { hitters } = this.props.hitter;
        return (
            <Card body>
                <Card.Title>Hitter List</Card.Title>
                <BootstrapTable
                    striped
                    remote={{ sort: true }}
                    keyField="_id"
                    data={hitters}
                    columns={this.columns}
                    defaultSorted={defaultSorted}
                    filter={filterFactory()}
                    onTableChange={this.handleTableChange}
                    bootstrap4
                />
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.state.activeHitter.firstName} {this.state.activeHitter.lastName}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img height="400"
                            src={`/api/hitters/${this.state.activeHitter._id}/card`}
                            style={{ display: 'block', margin: '0 auto' }} />
                        <br />
                        <Table striped bordered>
                            <thead>
                                <tr>
                                    <th>K</th>
                                    <th>GB</th>
                                    <th>FB</th>

                                    <th>BB</th>
                                    <th>1B</th>
                                    <th>2B</th>
                                    <th>3B</th>
                                    <th>HR</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{renderResultField(this.state.activeHitter.k)}</td>
                                    <td>{renderResultField(this.state.activeHitter.gb)}</td>
                                    <td>{renderResultField(this.state.activeHitter.fb)}</td>

                                    <td>{renderResultField(this.state.activeHitter.bb)}</td>
                                    <td>{renderResultField(this.state.activeHitter._1B)}</td>
                                    <td>{renderResultField(this.state.activeHitter._2B)}</td>
                                    <td>{renderResultField(this.state.activeHitter._3B)}</td>
                                    <td>{renderResultField(this.state.activeHitter.hr)}</td>
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
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    hitter: state.hitter
});

export default connect(mapStateToProps, { getHitters })(HitterList);