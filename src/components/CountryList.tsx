import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import './pagination.css';

interface Country {
    name: string;
    region: string;
    area: number;
}

enum FilterType {
    SmallerThanLithuania = 'smallerThanLithuania',
    OceaniaRegion = 'oceaniaRegion',
}

const API_URL = 'https://restcountries.com/v2/all?fields=name,region,area';

const CountryList: React.FC = () => {
    // State variables
    const [countries, setCountries] = useState<Country[]>([]); // Stores all countries data
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]); // Stores countries data based on filters
    const [currentPage, setCurrentPage] = useState<number>(1); // Stores the current page number
    const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending'); // Stores the current sort order
    const countriesPerPage: number = 56; // Number of countries to display per page

    // Fetches country data from the API
    const fetchCountryData = async () => {
        try {
            const response = await axios.get<Country[]>(API_URL);
            const data = response.data;
            setCountries(data);
            setFilteredCountries(data);
        } catch (error) {
            console.log('Error fetching country data:', error);
        }
    };

    useEffect(() => {
        // Fetch country data when the component mounts
        fetchCountryData();
    }, []);

    // Handles the sorting of countries based on name
    const handleSort = () => {
        setFilteredCountries((prevFilteredCountries) => {
            const sortedCountries = [...prevFilteredCountries].sort((a, b) => a.name.localeCompare(b.name));

            if (sortOrder === 'ascending') {
                setSortOrder('descending');
                return sortedCountries;
            } else {
                setSortOrder('ascending');
                return sortedCountries.reverse();
            }
        });
    };

    // Handles filtering of countries based on the selected filter type
    const handleFilter = (filterType: FilterType) => {
        let filteredResults: Country[] = [];

        switch (filterType) {
            case FilterType.SmallerThanLithuania:
                filteredResults = countries.filter((country) => country.area < 65300); // Filters countries with area smaller than Lithuania
                break;
            case FilterType.OceaniaRegion:
                filteredResults = countries.filter((country) => country.region === 'Oceania'); // Filters countries in the Oceania region
                break;
            default:
                filteredResults = countries; // No filter applied, display all countries
                break;
        }

        setFilteredCountries(filteredResults);
        setCurrentPage(1); // Reset to the first page after applying a filter
    };

    // Handles pagination and sets the current page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Calculates the index of the last country and the index of the first country on the current page
    const indexOfLastCountry: number = currentPage * countriesPerPage;
    const indexOfFirstCountry: number = indexOfLastCountry - countriesPerPage;

    // Retrieves the countries to be displayed on the current page
    const currentCountries: Country[] = filteredCountries.slice(indexOfFirstCountry, indexOfLastCountry);

    return (
        <div>
            <h1 className="h1">REIZ TECH HOMEWORK ASSIGNMENT</h1>
            <h2 className="h2">Country List</h2>

            <div className="pagination-tabs">
                {/* Button to handle sorting */}
                <button className="pagination-number" onClick={handleSort}>
                    Sort {sortOrder === 'ascending' ? 'Ascending' : 'Descending'}
                </button>
                {/* Button to handle filtering countries smaller than Lithuania */}
                <button className="pagination-number" onClick={() => handleFilter(FilterType.SmallerThanLithuania)}>
                    Smaller than Lithuania
                </button>
                {/* Button to handle filtering countries in the Oceania region */}
                <button className="pagination-number" onClick={() => handleFilter(FilterType.OceaniaRegion)}>Oceania Region</button>
            </div>

            {/* Pagination component */}
            <Pagination
                countriesPerPage={countriesPerPage}
                totalCountries={filteredCountries.length}
                currentPage={currentPage}
                paginate={paginate}
            />

            <div className="country-list">
                {/* Render the list of countries */}
                {currentCountries.map(({ name, region, area }) => (
                    <div className="country-item" key={name}>
                        <div className="country-property">
                            <span className="property-label">Country Name:</span>
                            <span>{name}</span>
                        </div>
                        <div className="country-property">
                            <span className="property-label">Region:</span>
                            <span>{region}</span>
                        </div>
                        <div className="country-property">
                            <span className="property-label">Area Size:</span>
                            <span>{area}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CountryList;
