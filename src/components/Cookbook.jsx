import React from 'react'
import PropTypes from 'prop-types'
// UI Components
import { Mobile, MobileXs, getScreenSize } from './ResponsiveDevice'// react-responsive
import Paper from 'material-ui/Paper'
import { Tabs, Tab } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views' // swipable tabs
import CircularProgress from 'material-ui/CircularProgress' // data fetch/loading
import Badge from 'material-ui/Badge' // recipe gum count
import Toggle from 'material-ui/Toggle' // recipes view mode
import Chip from 'material-ui/Chip' // recipe dates
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'; // browse toolbar for recipes
import { Datepicker } from 'material-ui/Datepicker'; // date filter for recipes
// Style
import style from '!style-loader!css-loader!sass-loader!../sass/gobblegums.scss'
// Data
import moment from 'moment' // MomentJS
import gums from '../data/gobblegums.js' // Gobblegums data
import { loadCookbookData, getCookbookDays } from '../data/cookbook.js' // Cookbook recipes data

// Inline styles & values
const styleValues = {
    Recipe: {
        ArrowColor: '#6B6B6B',
        GumImageSize: {
            MobileXs: 64,
            Mobile: 82,
            Tablet: 96,
            Desktop: 96
        },
        GumBadgeSize: {
            MobileXs: 24,
            Mobile: 24,
            Tablet: 32,
            Desktop: 32
        }
    }
}
const styles = {
    Tabs: {
        Container: {
            position: 'sticky',
            top: 64,
            zIndex: 1
        }
    },
    CookbookDay: {
        Recipe: {
            Detail: {
                Container: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                Input: {
                    display: 'flex',
                    flex: '0 1 auto'
                },
                Output: {
                    display: 'inline-block',
                    flex: '0 0 auto'
                },
                GumImage: {
                    maxWidth: 100,
                    maxHeight: 100,
                },
                GumBadge: {
                    top: 4,
                    right: 4,
                    width: 32,
                    height: 32,
                    fontSize: 20
                },
                Paper: {
                    display: 'block',
                    height: 'auto',
                    width: '90%',
                    margin: 'auto',
                    marginTop: 10,
                    textAlign: 'center',
                }
            },
            Compact: {
                Container: {
                    display: 'block'
                },
                Output: {
                    display: 'block'
                },
                GumImage: {
                    maxWidth: 64,
                    maxHeight: 64,
                },
                GumBadge: {
                    top: 8,
                    right: 8,
                    width: 24,
                    height: 24,
                    fontSize: 16
                },
                Paper: {
                    display: 'block',
                    height: 'auto',
                    width: 'auto',
                    margin: 'auto',
                    textAlign: 'center',
                }
            }
        },
        RecipeDates: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 16
        },
        RecipesContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%'
        },
        Paper: {
            display: 'block',
            height: 'auto',
            width: '95%',
            margin: 'auto',
            marginTop: 20,
            padding: 20,
            textAlign: 'center',
        }
    }
}

const CookbookRecipe = (props) => {
    const { recipe, viewMode } = props
    // recipe styles
    const recipeStyles = viewMode.startsWith('compact') ? // get styles for compact/detail view
        styles.CookbookDay.Recipe.Compact : styles.CookbookDay.Recipe.Detail
    // gum data to item component/element
    const toGumItem = (recipeGum, idx) => {
        let gum = gums.getGumByName(recipeGum.name)
        gum || console.log('cannot find gum:', recipeGum.name) // TODO: debug log
        return (
            <Badge key={idx && ('item' + idx)}
                badgeContent={recipeGum.count} primary={true} badgeStyle={recipeStyles.GumBadge}>
                <img style={recipeStyles.GumImage} src={gum.img} alt={recipeGum.name} />
            </Badge>
        )
    }
    // recipe container styles
    const stylesRecipeContainer = recipeStyles.Paper
    stylesRecipeContainer.margin = viewMode === 'compact' ? '0 8px' : 'auto'

    return (
        <div>
            {viewMode === 'compact-xs' && // compact-xs view : gum output only, no Paper container
                <div style={recipeStyles.Container}>
                    <div style={recipeStyles.Output}>{toGumItem(recipe.output)}</div>
                </div>}
            {viewMode === 'compact' && // compact view : gum output only
                <Paper style={stylesRecipeContainer} zDepth={2} transitionEnabled={true}>
                    <div style={recipeStyles.Container}>
                        <div style={recipeStyles.Output}>{toGumItem(recipe.output)}</div>
                    </div>
                </Paper>}
            {viewMode === 'detail' && // detail view : gum input & output
                <Paper style={stylesRecipeContainer} zDepth={2} transitionEnabled={true}>
                    <div style={recipeStyles.Container}>
                        <div style={recipeStyles.Input}>{recipe.inputs.map(toGumItem)}</div>
                        <svg width="100" height="50" viewBox="0 0 100 20">
                            <defs>
                                <marker id="arrow" markerWidth="10" markerHeight="10"
                                    refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <path d="M0,0 L0,6 L9,3 z" fill="black" />
                                </marker>
                            </defs>
                            <line x1="0" y1="10" x2="60" y2="10" stroke="black" strokeWidth="3"
                                markerEnd="url(#arrow)" />
                        </svg>
                        <div style={recipeStyles.Output}>{toGumItem(recipe.output)}</div>
                    </div>
                </Paper>}
        </div>
    )
}
CookbookRecipe.propTypes = {
    recipe: PropTypes.object,
    viewMode: PropTypes.string
}

class CookbookDay extends React.Component {
    constructor(props) {
        super(props)
        this.getViewMode = this.getViewMode.bind(this)
        this.getClosestDateIdx = this.getClosestDateIdx.bind(this)
        this.state = {
            viewMode: this.getViewMode(),
            selectedDateIdx: props.selectedDateIdx || this.getClosestDateIdx(props.dates)
        }
        this.toggleRecipeViewMode = this.toggleRecipeViewMode.bind(this)
        this.showDetailToggle = this.showDetailToggle.bind(this)
        this.getDates = this.getDates.bind(this)
        this.getRelativeDate = this.getRelativeDate.bind(this)
    }

    componentWillReceiveProps() {
        this.setState({ viewMode: this.getViewMode() })
    }

    getViewMode() {
        return window.innerWidth < MobileXs.MaxWidth ? 'compact-xs' : 'compact'
    }

    toggleRecipeViewMode(event, value) {
        this.setState({ viewMode: value ? 'detail' : this.getViewMode() })
    }

    showDetailToggle() {
        return window.innerWidth >= Mobile.MaxWidth
    }

    getClosestDateIdx(dates) {
        return dates.map(date => moment(date, 'YYYY-MM-DD')).reduce((closest, date, idx) => {
            const diff = Math.abs(date.diff(moment(), 'days')) // take absolute difference
            // take date closer to today
            return diff < closest.diffDays ? { diffDays: diff, idx: idx } : closest
        }, { diffDays: 365, idx: 0 }).idx // return array index of date
    }

    getDates() {
        const { dates } = this.props
        // convert recipe dates to appropriate strings
        const isThisYear = date => date.isSame(moment(), 'year')
        let datesStrs = dates.map(d => moment(d)).map(moment => // map to moment() first
            moment.format(isThisYear(moment) ? 'MMMM D' : 'D MMM YYYY')) // format dates
        // only show 1 date chip for 'compact-xs' layout
        if (this.state.viewMode === 'compact-xs') datesStrs = datesStrs.slice(datesStrs.length - 1)
        // if date is in this year, format to '(month) (day)', else '(day) (month) (year)'
        return <span style={{ display: 'flex' }}>{datesStrs.map((str, i) =>
            <Chip key={i} style={{ margin: 4 }}>{str}</Chip>)}</span>
    }

    getRelativeDate() {
        const date = moment(this.props.dates[this.state.selectedDateIdx])
        const now = moment(), fromNowTo = toMoment => toMoment.calendar(now)
        // display different relative date for different dates
        if (date.isSame(now, 'day')) { // recipe date is same as today
            // show 'Today (ends [time left until tomorrow])'
            return <span>Today <span style={{ fontSize: 14 }}>ends {
                now.endOf('day').fromNow()}</span></span>
        } else if (date.isAfter(now, 'day')) { // date is in the future
            return <i>{fromNowTo(date)}</i> // show date in italic
        } else { // date is history: show time passed from date
            return fromNowTo(date) // show date in italic
        }
    }

    render() {
        const { recipes } = this.props
        const { Paper: paperStyles, RecipesContainer: containerStyles } = styles.CookbookDay
        // 'compact' views shows recipe outputs in a row; 'detail' view shows in column
        containerStyles.flexDirection = this.state.viewMode.startsWith('compact') ? 'row' : 'column'

        return (
            <Paper style={paperStyles} zDepth={1}>
                <div style={styles.CookbookDay.RecipeDates}>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>{this.getDates()}</div>
                    <div style={{ fontSize: 18 }}>{this.getRelativeDate()}</div>
                    {this.showDetailToggle() &&
                        <div style={{ display: 'inline-block', float: 'right' }}>
                            <Toggle label="Detail" onToggle={this.toggleRecipeViewMode} />
                        </div>}
                </div>
                <div style={containerStyles}>
                    {recipes.map((recipe, idx) =>
                        <CookbookRecipe key={'recipe' + idx}
                            recipe={recipe} viewMode={this.state.viewMode} />)}
                </div>
            </Paper>
        )
    }
}
CookbookDay.propTypes = {
    selectedDateIdx: PropTypes.number,
    dates: PropTypes.array,
    recipes: PropTypes.array
}
// List of given days in cookbook
const CookbookDaysList = (props) => (
    <div style={{ paddingBottom: 20 }}>
        {props.days.map((day, idx) =>
            <CookbookDay key={idx} dates={day.dates} recipes={day.recipes} />)}
    </div>
)
CookbookDaysList.propTypes = {
    days: PropTypes.array
}
// Featured cookbook info i.e. days/recipes
function CookbookFeatured(props) {
    // show recipes of today & 'predicted' recipes in future days
    const cookbook = props.cookbookData, today = moment()
    // get cookbook days of today/future date
    const todayAndFutureDays = getCookbookDays(cookbook, dates =>
        dates.find(date => moment(date).isSameOrAfter(today, 'day')))
    return <CookbookDaysList days={todayAndFutureDays} />
}
CookbookFeatured.propTypes = {
    cookbookData: PropTypes.object
}
// Cookbook lookup - lookup any recipes/days & TODO: search by gum (input/output)
function CookbookBrowse(props) {
    const cookbook = props.cookbookData, yesterday = moment().subtract(1, 'day')
    // get cookbook days of past week
    const aWeekEarlier = yesterday.clone().subtract(7, 'days')
    const todayAndPastWeek = getCookbookDays(cookbook, dates =>
        dates.find(date => moment(date).isBetween(aWeekEarlier, moment(), 'day')))
    return (

        <CookbookDaysList days={todayAndPastWeek.reverse()} />
        // TODO: 'load more' action
    )

    function BrowseToolbar(props) {
        return (
            <Toolbar>
                <ToolbarGroup firstChild={true}>

                </ToolbarGroup>
            </Toolbar>
        )
    }
}
CookbookBrowse.propTypes = {
    cookbookData: PropTypes.object
}

export default class Cookbook extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cookbook: {
                data: {
                    downloading: false,
                    parsing: false,
                    parseProgress: 0,
                    content: null
                }
            },
            tabIndex: 0
        }
        this.setRecipeGumImageSize = this.setRecipeGumImageSize.bind(this)
        this.setRecipeGumImageSize()
        this.changeTab = this.changeTab.bind(this)
    }

    componentWillUpdate() {
        this.setRecipeGumImageSize() // resize recipe gum image to screen size
    }

    componentDidMount() {
        // Get recipes data from cookbook.js
        loadCookbookData(() => { // 'downloading' state
            this.setState({ cookbook: { data: { downloading: true } } })
        }, () => { // 'parsing' state
            this.setState({ cookbook: { data: { downloading: false, parsing: true } } })
        }, progressPercent => { // update 'parse progress' state
            this.setState({ cookbook: { data: { parseProgress: progressPercent } } })
        }).then(cookbookData => { // cookbook data obtained!
            this.setState({
                cookbook: {
                    data: {
                        downloading: false, parsing: false, parseProgress: 100,
                        content: cookbookData
                    }
                }
            })
            // console.log('Cookbook data: %o', cookbookData)
        }).catch(error => { console.log(error); })
    }

    setRecipeGumImageSize() {
        const screenSize = getScreenSize()
        const { GumImageSize } = styleValues.Recipe
        styles.CookbookDay.Recipe.Compact.GumImage.maxWidth = GumImageSize[screenSize]
        styles.CookbookDay.Recipe.Compact.GumImage.maxHeight = GumImageSize[screenSize]
        styles.CookbookDay.Recipe.Detail.GumImage.maxWidth = GumImageSize[screenSize]
        styles.CookbookDay.Recipe.Detail.GumImage.maxHeight = GumImageSize[screenSize]
    }

    changeTab(value) {
        this.setState({ tabIndex: value })
    }

    render() {
        return (
            <div>
                {!this.state.cookbook.data.content &&
                    <CircularProgress
                        mode={this.state.cookbook.data.downloading ? 'indeterminate' : 'determinate'}
                        value={this.state.cookbook.data.parseProgress} />}
                {this.state.cookbook.data.content &&
                    <div>
                        <Tabs value={this.state.tabIndex} onChange={this.changeTab}
                            style={styles.Tabs.Container}>
                            <Tab label="Featured" value={0} />
                            <Tab label="Browse" value={1} />
                        </Tabs>
                        <SwipeableViews
                            index={this.state.tabIndex}
                            onChangeIndex={this.changeTab}>
                            <CookbookFeatured cookbookData={this.state.cookbook.data.content} />
                            <CookbookBrowse cookbookData={this.state.cookbook.data.content} />
                        </SwipeableViews>
                    </div>
                }
            </div>
        )
    }
}
