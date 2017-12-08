// @ts-check
import moment from 'moment';
import gums from './gobblegums.js';

// URL to local cookbook data
const localCookbookDataUrl = 'data/json.txt';
// time until cookbook update
const next_cookbook_update_moment = moment("08 00 00", "HH mm ss").add(1, 'day');

// MomentJS locale & .calendar() formats
moment.updateLocale('en',
    // @ts-ignore
    {
        calendar: {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: function (now) {
                return `[${now.to(this)}]`
            }
        },
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: 'a few seconds',
            ss: '%d seconds',
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours"
        }
    }
);

// Cookbook data from online Google Sheets file
let key = "1zpMpR7deHB4fQByw45g7mVzTo0iE17lSmDeu66XpXyQ", // key for Google Sheets file
    query = "&tqx=out:json", // query
    gsheets_csv_url = "https://spreadsheets.google.com/tq?key=" + key + query; // CORS-enabled server
var proxyUrl = 'https://cors-anywhere.herokuapp.com/', // use CORS proxy to fetch data
    targetUrl = gsheets_csv_url;
// Cookbook data handler (download & parse)
const BROWSER_STORAGE_KEY = 'bo3z_cb_data';
const WEB_STORAGE = window.sessionStorage;

const CookbookData = {
    fetch: () => {
        return new Promise((resolve, reject) => {
            httpGet(proxyUrl + targetUrl).then(resolveCookbookData).catch(function (url) {
                if (url === proxyUrl + targetUrl) { // Cannot fetch Google Sheets data via CORS proxy
                    console.log('Failed to fetch online data; loading local data...');
                    // check if local storage has any data
                    fetch(localCookbookDataUrl).then(res => res.text())
                        .then(resolveCookbookData).catch(reject);
                } else reject(url);
            });

            function resolveCookbookData(resText) {
                // grab Google Sheets data from response text
                let content = resText.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
                if (content[1]) resolve(JSON.parse(content[1]));
                else reject('Invalid data');
            }
        });
    },
    parse: (jsonResult, updateProgress) => {
        let cookbookDataRaw = jsonResult.table;
        let cookbookData = parseRecipesJson(cookbookDataRaw, (rowsParsed, total) => {
            updateProgress(Math.round(rowsParsed / total * 100)); // convert to percentage
        });
        let cookbookJsonStr = JSON.stringify(cookbookData); // stringify cookbook JSON data
        let saved = saveToWebStorage(WEB_STORAGE, BROWSER_STORAGE_KEY, cookbookJsonStr);
        console.log('cookbookData.parse: recipes data', (saved ? '' : 'NOT') + ' SAVED');
        return cookbookData;
        // TODO: detect parse error?

        function saveToWebStorage(webStorage, key, value) {
            if (webStorage) { // check Web Storage API availability
                webStorage.setItem(key, value); // store data in storage
                return webStorage.getItem(key) === value; // validate stored data
            }
            return false; // fail if Web Storage is not available
        }
    },
    loadFromStorage: () => {
        // get data from web storage
        let cookbookJsonStr = WEB_STORAGE.getItem(BROWSER_STORAGE_KEY);
        // parse JSON data from storage, or just fail
        return cookbookJsonStr ? JSON.parse(cookbookJsonStr) : false;
    }
}
// exported function for loading cookbook data
function loadCookbookData(onDownloading, onParsing, updateParseProgress) {
    const storedData = CookbookData.loadFromStorage(); // check & load from web storage
    if (storedData) { // stored data found: immediately resolve
        console.log('cookbook data found in storage!');
        return new Promise(resolve => { resolve(storedData) });
    } else { // no data in storage: download and parse online data
        console.log('no cookbook data in storage; loading...');
        return new Promise((resolve, reject) => {
            onDownloading();
            CookbookData.fetch().then(jsonResult => { // fetch/download cookbook data
                onParsing();
                const data = CookbookData.parse(jsonResult, updateParseProgress); // parse cookbook data
                resolve(data); // data obtained!
            }).catch(reject); // something went wrong!
        });
    }
}
// flattening cookbook data into array of all cycles
function getCookbookCycles(cookbookData) {
    // get all cycles from cookbook object (flat map cycles with Array.reduce() using object keys)
    const cycles = Object.keys(cookbookData).reduce(
        (cycles, cycleKey) => cycles.concat(cookbookData[cycleKey]), []).slice(0, -1);
    return Array.prototype.slice.call(cycles); // copy array
    // remove last item: 'cookbookData.lastCycle' (key for last cycle in cookbook object)
}
// get days of cookbook data, given a filter of dates
function getCookbookDays(cookbookData, datesFilter) {
    const allDays = getCookbookCycles(cookbookData); // get all cookbook cycles
    if (!datesFilter) return allDays; // return all days if no date filter
    // find days given a date filter
    return allDays.map(day => ({
        date: datesFilter(day.dates), // filter 'day.dates' to one date only
        dayRef: day // hold a reference to the 'day' object
    })).filter(day => day.date) // filter: keep desired days ('day' with 'day.date')
        .sort((a, b) => moment(a.date).diff(moment(b.date), 'day')) // sort in chronological order
        .map(day => day.dayRef); // map back to original 'day' object
}
function getCookbookDates(cookbookData) {
    var dates = [];
    getCookbookCycles(cookbookData).forEach(day => { dates = dates.concat(day.dates) });
    return dates.sort((a, b) => moment(a).diff(moment(b), 'day'));
}
// Cookbook search functions
const SearchBy = {
    // Cycle 'number' and recipe day 'number'
    CycleDay: (cookbookData, cycleId, recipeDayId) => {
        if (cycleId && recipeDayId) {
            const days = getCookbookCycles(cookbookData);
            return days.find(day => { // find day in cookbook of corresponding cycle and day
                const recipe = day.recipes[0];
                return recipe.cycleId === cycleId && recipe.recipeDayId === recipeDayId;
            });
        }
    },
    // Gum rarity e.g. Mega/Rare/Ultra-Rare
    Rarity: (cookbookData, rarity) => {
        const days = getCookbookCycles(cookbookData);
        const gumsOfRarity = gums.tree[rarity];
        if (gumsOfRarity) {
            const gumNames = gumsOfRarity.map(gum => gum.name); // name of all gums of given rarity
            const recipeOutputHasGum = recipe => gumNames.includes(recipe.output.name); // output gum is of the rarity
            // filter days with recipes' output matching given rarity
            return days.map(day => {
                // find recipes(indices) that has output of gum rarity
                day.recipeIndices = [];
                day.recipes.forEach((recipe, idx) => {
                    if (recipeOutputHasGum(recipe)) day.recipeIndices.push(idx)
                });
                return day;
            });
        }
        return null; // gums of given rarity is not found i.e. invalid gum rarity
    },
    // Gum name
    Gum: (cookbookData, gumName) => {
        const days = getCookbookCycles(cookbookData);
        // filter days with recipes' ouput matching given gum (by name)
        return days.map(day => {
            const foundIdx = day.recipes.findIndex(recipe => recipe.output.name === gumName);
            day.recipeIndices = [foundIdx];
            return day;
        }).filter(day => day.recipeIndices[0] >= 0);
    },
    // Recipe date
    Date: (cookbookData, searchDate) => {
        return getCookbookDays(cookbookData, dates =>
            dates.some(date => moment(date).isSame(searchDate, 'day')));
    }
}
export default {
    LoadData: loadCookbookData,
    GetDays: getCookbookDays,
    GetDates: getCookbookDates,
    SearchBy: SearchBy,
    UpdateMoment: next_cookbook_update_moment
};

function parseRecipesJson(json, updateProgress) {
    console.log('Recipes loaded %o : %s rows', json, json.rows.length);
    let cycles = {}, dayOfCycle = { dates: [], recipes: [] }, recipe;
    let lastCycle = 0, rowsDone = 0, recipeCount = 0;
    for (let row of json.rows) {
        let [numCycle, numRecipe,
            input1_count, input1_item,
            input2_count, input2_item,
            input3_count, input3_item,
            output_count, output_item, ...dates] = row.c.map(item => item ? item.f || item.v : null);
        if (numCycle) { // cycle number check; ignore otherwise (not valid recipe data)
            if (numCycle > lastCycle) lastCycle = numCycle; // mark as last cycle if later than previous
            // init the cycle array
            if (!Array.isArray(cycles[numCycle])) cycles[numCycle] = [];
            // add dates of the recipe to 'day of cycle'
            for (let date of dates) { if (date && recipeCount === 0) dayOfCycle.dates.push(moment(date)); }
            // init recipe object
            recipe = { cycleId: numCycle, recipeDayId: numRecipe, inputs: [], output: {} };
            // Process & populate recipe I/O
            // add gum input to recipe
            if (input1_count && input1_item) recipe.inputs.push({ name: input1_item, count: parseInt(input1_count) });
            if (input2_count && input2_item) recipe.inputs.push({ name: input2_item, count: parseInt(input2_count) });
            if (input3_count && input3_item) recipe.inputs.push({ name: input3_item, count: parseInt(input3_count) });
            // add gum output to recipe
            recipe.output = { name: output_item, count: parseInt(output_count) };
            dayOfCycle.recipes.push(recipe); // add recipe to cycle
            if (++recipeCount === 3) { // wrap up 'day of cycle' - 3 recipes per day
                cycles[numCycle].push(dayOfCycle); // add 'day of cycle' to cycle
                dayOfCycle = { dates: [], recipes: [] }; // reset 'day of cycle'
                recipeCount = 0; // reset recipe count for next recipe
            }
        }
        updateProgress(++rowsDone, json.rows.length);
    }
    cycles.lastCycle = lastCycle; // set 'last recipe cycle' for reference
    return cycles;
}

// Utilities

function httpGet(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = function () {
            reject(url);
        };
        xhr.send();
    });
}