import React from 'react';
import PropTypes from 'prop-types';
// UI Components
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon'; // tab icons
import DatePicker from 'material-ui/Datepicker'; // date filter for seraching recipes
import AutoComplete from 'material-ui/AutoComplete'; // gum filter for seraching recipes
import MenuItem from 'material-ui/MenuItem'; // gum filter menu item for searching recipes
import RaisedButton from 'material-ui/RaisedButton'; // recipes search box button
import FlatButton from 'material-ui/FlatButton'; // gum rarity filter selection button
import { CookbookDay } from '../Cookbook'; // cookbook recipe components
// Data
import moment from 'moment'; // MomentJS
import gums from '../../data/gobblegums.js'; // Gobblegums data
import CookbookData from '../../data/cookbook.js'; // Cookbook recipes data
// inline styles
const styles = {
    Paper: {
        display: 'block',
        height: 'auto',
        width: '95%',
        margin: 'auto',
        marginTop: 10,
        padding: 20,
        textAlign: 'center',
    }
};

// Recipes search box
function RecipeSearchCard(props) {
    // inline styles
    const searchCardStyle = {
        margin: 8,
        padding: 8,
        textAlign: 'center',
    };
    const searchTypeButtonStyle = {
        Container: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexFlow: 'row wrap'
        },
        Item: {
            margin: 4
        }
    };
    // clicked button of a search type
    function onSearchTypeButtonClicked(searchType) {
        props.onSearch({ type: searchType, value: null });
    }

    function onGumRaritySelected(rarityValue) {
        props.onSearch({
            type: 'rarity',
            value: rarityValue
        });
    }

    function onGumTextEntered(text) {
        props.onSearch({
            type: 'gum',
            value: text
        });
    }

    function onDateChanged(evt, date) {
        props.onSearch({
            type: 'date',
            value: moment(date)
        });
    }

    function isSearchType(type) {
        return props.searchQuery && props.searchQuery.type === type;
    }
    const isSearching = {
        rarity: isSearchType('rarity'),
        gum: isSearchType('gum'),
        date: isSearchType('date')
    };

    // show button icon if screen is 'wide enough' (icons make buttons wrap to next line)
    function shouldShowIcon() { return window.innerWidth > 350; }
    // max height of AutoComplete list
    // currently: adapt to screen height; ends above bottom nav bar
    function getListMaxHeight() { return window.innerHeight - 350; }

    return (
        <Paper style={searchCardStyle}>
            <div>
                <div style={searchTypeButtonStyle.Container}>
                    <RaisedButton
                        label="Rarity"
                        disabled={isSearching.rarity}
                        icon={shouldShowIcon() && <FontIcon className="material-icons">insert_chart</FontIcon>}
                        onClick={() => onSearchTypeButtonClicked('rarity')}
                        style={searchTypeButtonStyle.Item} />
                    <RaisedButton
                        label="Gum"
                        disabled={isSearching.gum}
                        icon={shouldShowIcon() && <FontIcon className="material-icons">bubble_chart</FontIcon>}
                        onClick={() => onSearchTypeButtonClicked('gum')}
                        style={searchTypeButtonStyle.Item} />
                    <RaisedButton
                        label="Date"
                        disabled={isSearching.date}
                        icon={shouldShowIcon() && <FontIcon className="material-icons">today</FontIcon>}
                        onClick={() => onSearchTypeButtonClicked('date')}
                        style={searchTypeButtonStyle.Item} />
                </div>
                <div>
                    {isSearching.rarity &&
                        props.raritySearchList.map(rarity =>
                            <FlatButton key={rarity.value} label={rarity.text} primary={true}
                                disabled={props.searchQuery.value === rarity.value}
                                onClick={evt => onGumRaritySelected(rarity.value)}
                                style={{ minWidth: 0 }} />)}
                    {isSearching.gum &&
                        <div>
                            <AutoComplete
                                floatingLabelText="Select Gobblegum"
                                hintText="Type name e.g. Aftertaste"
                                dataSource={props.gumSearchDataSource}
                                searchText={props.searchQuery.value}
                                filter={AutoComplete.caseInsensitiveFilter}
                                onNewRequest={chosenRequest => onGumTextEntered(chosenRequest.value.key)}
                                onUpdateInput={value => onGumTextEntered(value)}
                                onFocus={evt => onGumTextEntered('') /* clear text field */}
                                openOnFocus={true}
                                menuStyle={{ maxHeight: getListMaxHeight() }} />
                        </div>}
                    {isSearching.date &&
                        <DatePicker style={{ display: 'inline-block' }}
                            floatingLabelText="Open Datepicker..."
                            minDate={moment(props.startDate).toDate()}
                            maxDate={moment(props.endDate).toDate()}
                            autoOk={true}
                            value={props.searchQuery.value ? props.searchQuery.value.toDate() : undefined}
                            onChange={onDateChanged} />}
                </div>
            </div>
        </Paper>
    );
}
RecipeSearchCard.propTypes = {
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    raritySearchList: PropTypes.array,
    gumSearchDataSource: PropTypes.array,
    searchQuery: PropTypes.object,
    onSearch: PropTypes.func,
};
function RecipeSearchResult(props) {
    const { searchQuery, cookbookData } = props;
    const results = searchCookbook(searchQuery);
    // console.log('RecipeSearchResult', results)
    // sort recipes by descending order of dates (new to old)
    if (results && results.length > 1) results.sort((a, b) =>
        moment(latestDate(b.dates)).unix() - moment(latestDate(a.dates)).unix());

    function searchCookbook(query) {
        if (query.type === 'rarity') {
            return CookbookData.SearchBy.Rarity(cookbookData, query.value);
        } else if (query.type === 'gum') {
            return CookbookData.SearchBy.Gum(cookbookData, query.value);
        } else if (query.type === 'date') {
            return CookbookData.SearchBy.Date(cookbookData, query.value);
        } else {
            return null;
        }
    }
    function latestDate(dates) {
        const earliest = dates.reduce((curMinDate, date, i) => {
            const dateUnix = moment(date).unix();
            if (dateUnix > curMinDate.min) return { min: dateUnix, idx: i };
            else return curMinDate;
        }, { min: 0, idx: 0 });
        return dates[earliest.idx];
    }
    return (
        <div>
            {results && results.length > 0 ?
                <div>
                    {results.map((day, idx) =>
                        <CookbookDay key={idx} dates={day.dates} recipes={day.recipes}
                            selectedDate={searchQuery.type === 'date' ? searchQuery.value : null}
                            showRecipeDetails={props.showRecipeDetails}
                            recipeHighlightIndices={day.recipeIndices} />)}
                </div> :
                <Paper style={styles.Paper}>
                    No recipes found...
                </Paper>}
        </div>
    )
}
RecipeSearchResult.propTypes = {
    searchQuery: PropTypes.object,
    cookbookData: PropTypes.object,
    showRecipeDetails: PropTypes.func
};
// Cookbook lookup - lookup any recipes/days
export default class CookbookSearch extends React.Component {
    constructor(props) {
        super(props);
        // cookbook search: date range of recipes (start & end)
        const cookbookDates = CookbookData.GetDates(props.cookbookData);
        // gum rarities in recipes
        const recipeGumRarities = Object.keys(gums.tree) // 'gums.tree' {key: (gum rarity), value: (gum object)}
            // TODO: pull out rarity strings somewhere?
            .filter(rarity => ['mega', 'rare', 'ultra_rare'].indexOf(rarity) >= 0); // rarities found in recipes
        // Make data source for auto complete field: list of gum names
        const recipesGums = [];
        recipeGumRarities // get gums with rarity found in recipes
            .map(rarity => gums.tree[rarity]) // get gum object from tree (with 'rarity' as key)
            .forEach(gums => gums.forEach(gum => {
                // search cookbook for the gobblegum; see if it's an output of any recipe
                const gumIsFoundInRecipes = CookbookData.SearchBy.Gum(props.cookbookData, gum.name).length > 0
                if (gumIsFoundInRecipes) { // only shows gums present in recipe output in search filter
                    // make data source item
                    recipesGums.push({
                        text: gum.name,
                        value: (
                            <MenuItem
                                key={gum.name} // 'key' as item value on input update
                                primaryText={gum.name}
                                secondaryText={<img src={gum.img} alt={gum.name}
                                    style={{ maxWidth: 32, maxHeight: 32, paddingTop: 8 }} />}
                            />)
                    })
                }
            }));
        // Gum rarity search : list of rarities for DropDownMenu
        const raritySearchList = recipeGumRarities.map(
            rarity => ({
                text: gums.rarity[rarity].text.toLowerCase().capitalize(), // use rarity text as menu item
                value: rarity // value of item is key for 'gums.tree'
            }));
        this.state = {
            searchQuery: {
                type: 'gum'
            },
            cookbookDates: {
                start: moment(cookbookDates[0]),
                end: moment(cookbookDates[cookbookDates.length - 1]),
            },
            raritySearchList: raritySearchList,
            gumDataSource: recipesGums // AutoComplete data source : gums found in recipes
        };
        this.catchUrlParams(props.match.params);
        this.onSearch = this.onSearch.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.catchUrlParams(nextProps.match.params);
    }

    catchUrlParams(urlParams) {
        // Change to tab from URL param (if any)
        const query = this.state.searchQuery;
        if (urlParams.query) query.type = decodeURIComponent(urlParams.query);
        if (urlParams.searchQuery) query.value = decodeURIComponent(urlParams.searchQuery);
        // convert 'date' query from URL param string to MomentJS date object
        if (query.type === 'date' && query.value) query.value = moment(query.value);
        Object.assign(this.state, { searchQuery: query });
    }

    onSearch(query) {
        this.setState({ searchQuery: query });
        let urlFragment = '/cookbook/search'; // TODO: refactor component URL path and handling
        if (query.type) urlFragment += '/' + query.type;
        if (query.value) {
            let queryValue = query.value;
            if (query.type === 'date') {
                // convert 'date' query param value from MomentJS to string format
                queryValue = query.value.format('YYYY-MM-DD');
            }
            urlFragment += '/' + queryValue;
        }
        if (this.props.history.location.pathname === urlFragment) return; // no need to push URL if same
        this.props.history.push(urlFragment);
    }

    render() {
        return (
            <div>
                <RecipeSearchCard
                    startDate={this.state.cookbookDates.start}
                    endDate={this.state.cookbookDates.end}
                    raritySearchList={this.state.raritySearchList}
                    gumSearchDataSource={this.state.gumDataSource}
                    searchQuery={this.state.searchQuery}
                    onSearch={this.onSearch} />
                {this.state.searchQuery.value &&
                    <RecipeSearchResult
                        cookbookData={this.props.cookbookData}
                        searchQuery={this.state.searchQuery}
                        showRecipeDetails={this.props.showRecipeDetails} />}
            </div>
        );
    }
}
CookbookSearch.propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    cookbookData: PropTypes.object,
    daysListView: PropTypes.any,
    showRecipeDetails: PropTypes.func
};

export { RecipeSearchResult };