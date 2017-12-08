import React from 'react'
import PropTypes from 'prop-types'
// React Router
import { HashRouter as Router, Route, Link, withRouter } from 'react-router-dom'
// UI Components
import AppBar from 'material-ui/AppBar'
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation'
import Paper from 'material-ui/Paper'
import FontIcon from 'material-ui/FontIcon' // bottom nav icons
import { MobileXs, Mobile, Tablet } from './ResponsiveDevice'// react-responsive
import CircularProgress from 'material-ui/CircularProgress' // data fetch/loading
// App Pages
import Gobblegums from './Gobblegums.jsx'
import Cookbook from './Cookbook.jsx'
import Quiz from './Quiz.jsx'
// App Data
import CookbookData from '../data/cookbook.js' // Cookbook recipes data
// Styles
const styles = {
    AppBar: {
        position: 'sticky',
        top: 0,
        width: '100%'
    },
    PageContent: {
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
const landingPageIdx = 1
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
        /* 
        /featured
        /search/gum/Perkaholic
        /search/rarity/rare
        /search/date/2017-9-12
        /cycles/3
         */
        params: '/:tab?/:query?/:searchQuery?',
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
const landingPage = appPages[landingPageIdx];

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.getScreenSizes = this.getScreenSizes.bind(this);
        this.state = {
            screenSize: this.getScreenSizes(window.innerWidth),
            cookbook: {
                data: {
                    downloading: false,
                    parsing: false,
                    parseProgress: 0,
                    content: null
                }
            },
        };
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
    }

    componentWillMount() {
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentDidMount() {
        // Get recipes data from cookbook.js
        CookbookData.LoadData(() => { // 'downloading' state
            this.setState({ cookbook: { data: { downloading: true } } });
        }, () => { // 'parsing' state
            this.setState({ cookbook: { data: { downloading: false, parsing: true } } });
        }, progressPercent => { // update 'parse progress' state
            this.setState({ cookbook: { data: { parseProgress: progressPercent } } });
        }).then(cookbookData => { // cookbook data obtained!
            this.setState({
                cookbook: {
                    data: {
                        downloading: false, parsing: false, parseProgress: 100,
                        content: cookbookData
                    }
                },
            });
            // console.log('Cookbook data: %o', cookbookData);
        }).catch(error => { console.log('cannot load cookbook data', this.state.cookbook.data.content); });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange() {
        const screenWidth = window.innerWidth;
        this.setState({
            screenSize: this.getScreenSizes(screenWidth)
        });
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
        };
    }

    render() {
        const pageProps = {
            screenSize: this.state.screenSize,
            cookbookData: this.state.cookbook.data.content
        };

        return (
            <Router basename="/">
                <div>
                    <AppBar title="Black Ops 3 Zombies" showMenuIconButton={false} style={styles.AppBar} />
                    <div style={styles.PageContent}>
                        <Route path="/" exact render={() => <landingPage.component {...pageProps} />} />
                        {pageProps.cookbookData ? // cookbook data is available
                            // render app pages
                            appPages.map((page, idx) => (
                                <Route key={idx} path={page.path + page.params} render={
                                    () => <page.component {...pageProps} />} />
                            )) : // no cookbook data yet
                            // render data loading view
                            <div className="centerPseudo" style={{ width: '100%', height: 420 }}>
                                <Paper className="centerPseudo" style={{ padding: 24 }}>
                                    <CircularProgress />
                                    <div style={{ marginTop: 8 }}>{"Loading..."}</div>
                                </Paper>
                            </div>
                        }
                    </div>
                    <BottomNavRouter pages={appPages} />
                </div>
            </Router>
        );
    }
}

// Bottom nav needs to identify URL for setting selected tab
const BottomNavRouter = withRouter(BottomNav)

function BottomNav(props) {
    const { pages, location } = props;
    const topLevelPath = location.pathname.match(/\/[\w]+/); // take top-level path (possible bottom nav paths)
    const selectedIndex = topLevelPath ? pages.findIndex(page => page.path === topLevelPath[0]) : landingPageIdx;

    return (
        <Paper style={styles.BottomNav}>
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
    );
}
BottomNav.propTypes = {
    pages: PropTypes.array,
    location: PropTypes.object
};