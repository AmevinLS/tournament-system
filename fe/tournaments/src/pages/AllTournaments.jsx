import { useState, useEffect } from "react";
import { Pagination, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TournamentsTable from "../components/TournamentsTable";
import { backendUrl } from "../components/common";
import "./AllTournaments.css";

const ITEMS_PER_PAGE = 2;

function Tournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchBoxText, setSearchBoxText] = useState("");
    const [searchValue, setSearchValue] = useState("");
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems(currentPage, ITEMS_PER_PAGE, searchValue);
    }, [currentPage, searchValue]);

    const fetchItems = async (page, pageSize, nameContainsValue) => {
        try {
            const response = await fetch(`${backendUrl}/tournaments/paged?page=${page}&pageSize=${pageSize}&nameContains=${nameContainsValue}`);
            const data = await response.json();
            if (response.ok) {
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
        navigate(`/tournament_details?tourn_id=${tourn_id}`);
    }

    const handleSearchChange = (e) => {
        setSearchBoxText(e.currentTarget.value);
    }

    const handleSearchClick = async (e) => {
        setSearchValue(searchBoxText);
    }

    const handleResetClick = (e) => {
        setSearchValue("");
        setSearchBoxText("");
    }

    return (
        <>
            <div className="search-div">
                <Form.Control type="text" id="searchText" placeholder="Search tournament names" value={searchBoxText} onChange={handleSearchChange}/>
                <Button variant="primary" onClick={handleSearchClick}>Search</Button>
                <Button variant="secondary" onClick={handleResetClick}>Reset</Button>
            </div>

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