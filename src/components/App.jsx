import React from 'react'
import PropTypes from 'prop-types'
// React Router
import { HashRouter as Router, Route, Link, withRouter } from 'react-router-dom'
// UI Components
import AppBar from 'material-ui/AppBar'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import FontIcon from 'material-ui/FontIcon'
import { MobileXs, Mobile, Tablet } from './ResponsiveDevice'// react-responsive
// Pages
import Gobblegums from './Gobblegums.jsx'
import Cookbook from './Cookbook.jsx'
import Quiz from './Quiz.jsx'
// Styles
const styles = {
    AppBar: {
        position: 'fixed',
        top: 0,
        width: '100%'
    },
    PageContent: {
        marginTop: '64px',
        marginBottom: '56px'
    },
    BottomNav: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 2
    }
}
// Icons for bottom nav items
const gumIcon = <FontIcon className="material-icons">bubble_chart</FontIcon>
const bookIcon = <FontIcon className="material-icons">book</FontIcon>
const quizIcon = <FontIcon className="material-icons">videogame_asset</FontIcon>
// App Pages
const appPages = [
    {
        path: '/gobblegums',
        params: '/:gum?',
        component: Gobblegums,
        bottomNav: {
            name: 'Gobblegums',
            icon: gumIcon
        }
    },
    {
        path: '/cookbook',
        params: '/:cycle/:day',
        component: Cookbook,
        bottomNav: {
            name: 'Cookbook',
            icon: bookIcon
        }
    },
    {
        path: '/quiz',
        params: '/:id?',
        component: Quiz,
        bottomNav: {
            name: 'Quiz',
            icon: quizIcon
        }
    }
]

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.getScreenSizes = this.getScreenSizes.bind(this)
        const screenWidth = window.innerWidth
        this.state = {
            screenSize: this.getScreenSizes(screenWidth)
        }
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange)
    }

    handleWindowSizeChange() {
        const screenWidth = window.innerWidth
        this.setState({
            screenSize: this.getScreenSizes(screenWidth)
        })
        console.log('Screen size is %s', this.state.screenSize.isDesktop ? 'dekstop' :
            this.state.screenSize.isTablet ? 'tablet' :
                this.state.screenSize.isMobile ? 'mobile' :
                    this.state.screenSize.isMobileXs ? 'mobile-xs' : 'unknown?');
    }

    getScreenSizes(screenWidth) {
        return {
            isMobileXs: screenWidth < MobileXs.MaxWidth,
            isMobile: screenWidth < Mobile.MaxWidth && screenWidth >= MobileXs.MaxWidth,
            isTablet: screenWidth < Tablet.MaxWidth && screenWidth >= Mobile.MaxWidth,
            isDesktop: screenWidth >= Tablet.MaxWidth
        }
    }

    render() {
        const pageProps = { screenSize: this.state.screenSize }

        return (
            <Router basename="/">
                <div>
                    <AppBar title="Black Ops 3 Zombies" showMenuIconButton={false} style={styles.AppBar} />
                    <div style={styles.PageContent}>
                        <Route path="/gobblegums/:gum?" render={() => <Gobblegums {...pageProps} />} />
                        <Route path="/cookbook/:cycle?/:day?" render={() => <Cookbook {...pageProps} />} />
                        <Route path="/quiz/:id?" render={() => <Quiz {...pageProps} />} />
                    </div>
                    <BottomNavRouter pages={appPages} />
                </div>
            </Router>
        )
    }
}

const BottomNavRouter = withRouter(BottomNav)

function BottomNav(props) {
    const { pages, location } = props
    const topLevelPath = location.pathname.match(/\/[\w]+/) // take top-level path (possible bottom nav paths)
    const selectedIndex = topLevelPath ? pages.findIndex(page => page.path === topLevelPath[0]) : 0

    return (
        <Paper zDepth={1} style={styles.BottomNav}>
            <BottomNavigation selectedIndex={selectedIndex}>
                {pages.map((page, idx) =>
                    <BottomNavigationItem
                        key={idx}
                        label={page.bottomNav.name}
                        icon={page.bottomNav.icon}
                        containerElement={<Link to={page.path} />}
                        style={{ textAlign: 'center' }}
                    />
                )}
            </BottomNavigation>
        </Paper>
    )
}
BottomNav.propTypes = {
    pages: PropTypes.array,
    location: PropTypes.object
}