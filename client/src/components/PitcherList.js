import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Card, Table, Nav, Spinner, Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

import { getPitchers } from '../actions/pitcherActions';
import PlayerAdd from './PlayerAdd';

const defaultSorted = [{
    dataField: 'price',
    order: 'desc'
}];

const selectRow = {
    mode: 'checkbox',
    clickToSelect: true
};

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


class PitcherList extends Component {
    static propTypes = {
        getPitchers: PropTypes.func.isRequired,
        pitcher: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
            activePitcher: {}
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
                        'SP': 'Starting Pitcher',
                        'RP': 'Relief Pitcher'
                    },
                    onFilter: filterVal => filterVal ? this.props.pitcher.pitchers.filter(pitcher => pitcher.positionList.includes(filterVal)) : this.props.pitcher.pitchers
                })
            },
            {
                dataField: 'hand',
                text: 'Throws',
                filter: selectFilter({
                    options: {
                        'L': 'Left',
                        'R': 'Right'
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
            <img onClick={() => this.handleShow(row)} height="100" src={`/api/pitchers/${row._id}/card`} />
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
            activePitcher: {}
        });
    }

    handleShow(pitcher) {
        this.setState({
            show: true,
            activePitcher: pitcher
        });
    }

    componentDidMount() {
        this.props.getPitchers();
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

    playerAdded(player) {
        console.log('p', player);
        const { team } = this.props.team;
        this.props.updateContact({
            player: [...team.players, player],
            _id: team._id
        });
    }

    render() {
        const { pitchers } = this.props.pitcher;
        return (
            <Card body>
                <Card.Title>Pitcher List</Card.Title>
                <PlayerAdd playerType="hitters" playerAdded={this.playerAdded.bind(this)}></PlayerAdd>
                <BootstrapTable
                    striped
                    remote={{ sort: true }}
                    keyField="_id"
                    data={pitchers}
                    columns={this.columns}
                    defaultSorted={defaultSorted}
                    filter={filterFactory()}
                    onTableChange={this.handleTableChange}
                    selectRow={selectRow}
                    bootstrap4
                />
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.state.activePitcher.firstName} {this.state.activePitcher.lastName}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img height="400"
                            src={`/api/pitchers/${this.state.activePitcher._id}/card`}
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
                                    <td>{renderResultField(this.state.activePitcher.xRange)}</td>
                                    <td>{renderResultField(this.state.activePitcher.k)}</td>
                                    <td>{renderResultField(this.state.activePitcher.gb)}</td>
                                    <td>{renderResultField(this.state.activePitcher.fb)}</td>

                                    <td>{renderResultField(this.state.activePitcher.bb)}</td>
                                    <td>{renderResultField(this.state.activePitcher._1B)}</td>
                                    <td>{renderResultField(this.state.activePitcher._2B)}</td>
                                    <td>{renderResultField(this.state.activePitcher.hr)}</td>
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
    pitcher: state.pitcher
});

export default connect(mapStateToProps, { getPitchers })(PitcherList);