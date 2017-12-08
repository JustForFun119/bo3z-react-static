import React from 'react'

// import style from '!style-loader!css-loader!sass-loader!../sass/quiz.scss' // SCSS stylesheet

import gobblegums from '../data/gobblegums' // Gobblegums data

export default class Quiz extends React.Component {
    componentDidMount() {
        console.log('Quiz : componentDidMount', this.props.match, this.props.match.params)
    }

    render() {
        return (
            <div>
                Quiz coming soon!
            </div>
        )
    }
}