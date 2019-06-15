import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { Card, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

import { getPitchers } from '../actions/pitcherActions';
import PlayerAdd from './PlayerAdd';
import PlayerDetailModal from './PlayerDetailModal';

const defaultSorted = [{
    dataField: 'price',
    order: 'desc'
}];

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
            activePitcher: {},
            selected: []
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

    handleOnSelect = (row, isSelect) => {
        if (isSelect) {
            this.setState(() => ({
                selected: [...this.state.selected, row._id]
            }));
        } else {
            this.setState(() => ({
                selected: this.state.selected.filter(x => x !== row._id)
            }));
        }
    }

    handleOnSelectAll = (isSelect, rows) => {
        const ids = rows.map(r => r._id);
        if (isSelect) {
            this.setState(() => ({
                selected: ids
            }));
        } else {
            this.setState(() => ({
                selected: []
            }));
        }
    }

    render() {
        const { pitchers } = this.props.pitcher;
        const selectRow = {
            mode: 'checkbox',
            clickToSelect: true,
            selected: this.state.selected,
            onSelect: this.handleOnSelect,
            onSelectAll: this.handleOnSelectAll
        };
        const { activePitcher, show } = this.state;

        return (
            <Card body>
                <Card.Title>Pitcher List</Card.Title>
                <PlayerAdd playerType="pitchers" players={this.state.selected}></PlayerAdd>
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
                <PlayerDetailModal player={activePitcher}
                    playerType='pitcher'
                    show={show}
                    closeModal={this.handleClose}>
                </PlayerDetailModal>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    pitcher: state.pitcher
});

export default connect(mapStateToProps, { getPitchers })(PitcherList);