import React from 'react'
import {
    HashRouter as Router,
    Route,
    Link
} from 'react-router-dom'

const ParamsExample = () => (
    <Router>
        <div>
            <h2>Accounts</h2>
            <ul>
                <li><Link to="/netflix/movie1">Netflix - 1</Link></li>
                <li><Link to="/netflix/movie2">Netflix - 2</Link></li>
                <li><Link to="/netflix/movie3">Netflix - 3</Link></li>
                <li><Link to="/zillow-group">Zillow Group</Link></li>
                <li><Link to="/yahoo">Yahoo</Link></li>
                <li><Link to="/modus-create">Modus Create</Link></li>
            </ul>

            <Route path="/:id/:id2?" component={Child} />
        </div>
    </Router>
)

const Child = ({ match }) => (
    <div>
        <h3>ID: {match.params.id}</h3>
        <h3>ID2: {match.params.id2}</h3>
    </div>
)

export default ParamsExample