import React, { Component } from 'react';
import './App.css';

class FilterLocations extends Component {

    markerAnimation (whiskeyPubs) {
        const { markers } = this.props
        markers.forEach(function (marker) {
            marker.title === whiskeyPubs ? window.google.maps.event.trigger(marker, 'click') : ''
        })
    }


    render () {
        const { searchPubs, query, searchedPubs } = this.props
        return (
            <div className="filter-container" role="menu">
                <h1 className="main-heading" aria-label="Heading">Welcome to Edinburgh</h1>
                
                <p className="sub-heading">Best Pubs for Whiskey Tasting</p>

                {/*search bar*/}
                <div className="filter-pubs">
                    <div className="filter-pubs-bar">
                        <div className="filter-pubs-input"
                             tabIndex="0">
                            <input
                                type="text"
                                placeholder="Search for pubs..."
                                aria-label="Search for pubs"
                                role="search"
                                value={query}
                                onChange={(event) => searchPubs(event.target.value)}
                                />
                        </div>
                    </div>
                </div>

                {/*location list*/}
                <div className="filter-pubs-container" role="listbox">
                    <ul className="filter-pubs-list">
                            {searchedPubs.map((whiskeyPubs) =>
                                <li key={whiskeyPubs.id}>
                                    <a role="listitem"
                                       tabIndex="0"
                                       onClick={(event) => this.markerAnimation(whiskeyPubs.name)}>
                                       {whiskeyPubs.name}
                                    </a>
                                </li>
                            )}
                    </ul>
                </div>
            </div>
        )
    }
}

export default FilterLocations; 