import { Table } from "react-bootstrap";
import "./TournamentsTable.css";

function TournamentsTable({ tournaments, onTournamentClick }) {
    const handleItemClick = (e) => {
        onTournamentClick(e.currentTarget.getAttribute("data-key"));
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Tournament Time</th>
                    <th>Max participants</th>
                    <th>Application Deadline</th>
                </tr>
            </thead>
            <tbody>
                {tournaments.map(tournament => {
                    return (
                        <tr className="tournament-tr" key={tournament.tourn_id} data-key={tournament.tourn_id} onClick={handleItemClick}>
                            <td>{tournament.name}</td>
                            <td>{tournament.time}</td>
                            <td>{tournament.max_participants}</td>
                            <td>{tournament.apply_deadline}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}

export default TournamentsTable;