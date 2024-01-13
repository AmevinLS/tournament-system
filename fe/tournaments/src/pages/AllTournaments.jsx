import { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import TournamentsTable from "../components/TournamentsTable";
import { backendUrl } from "../components/common";


const ITEMS_PER_PAGE = 2;

function Tournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        fetchItems(currentPage, ITEMS_PER_PAGE);
    }, [currentPage]);

    const fetchItems = async (page, pageSize) => {
        try {
            const response = await fetch(`${backendUrl}/tournaments/paged?page=${page}&pageSize=${pageSize}`);
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                if (currentPage > data.totalPages) {
                    setCurrentPage(data.totalPages);
                }
                setTournaments(data.tournaments);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            alert(error);
        }
    }
    
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    }

    const handleTournamentClick = (tourn_id) => {
        alert(`Clicked on tournament with id: ${tourn_id}`);
    }

    return (
        <>
            <TournamentsTable tournaments={tournaments} onTournamentClick={handleTournamentClick}/>

            <Pagination>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item key={index+1} active={index+1 === currentPage} onClick={() => handlePageChange(index+1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </>
    )
}

export default Tournaments;