import React, { Component } from 'react';
import { Card, Table, Nav, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import { getTeams } from '../actions/teamActions';
import TeamCreate from './TeamCreate';
import TeamDelete from './TeamDelete';

class TeamList extends Component {
    static propTypes = {
        getTeams: PropTypes.func.isRequired,
        team: PropTypes.object.isRequired
    };

    componentDidMount() {
        this.props.getTeams();
    }

    render() {
        const { teams, loading } = this.props.team;
        return (
            <Card body>
                <Card.Title>Team List</Card.Title>
                <TeamCreate></TeamCreate>
                <Table responsive>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? <tr>
                                <td className="text-center" colSpan="3">
                                    <Spinner animation="border" />
                                </td>
                            </tr>
                            :
                            teams.map(team => (
                                <tr key={team._id}>
                                <td>
                                    <TeamDelete record={team}></TeamDelete>
                                </td>
                                    <td>
                                        <Nav.Link href={`#/team-detail/${team._id}`}>
                                            {team.name}
                                        </Nav.Link>
                                    </td>
                                    <td>{moment(team.created).format('LL')}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    team: state.team
});

export default connect(mapStateToProps, { getTeams })(TeamList);