
selectedCities = []
let state = [
    breweries = [],
    filterByType = "",
    filterByCity = [],
    search = "",
    currentPage = 1
]

function getStatefromForm() {

    let formEl = document.querySelector('#select-state-form')
    formEl.addEventListener("submit", function (event) {
        event.preventDefault();

        const USState = formEl["select-state"].value;

        getBreweriesByState(USState).then(function (breweriesFromServer) {

            const filteredBreweries = breweriesFromServer.filter(brewery =>
                brewery.brewery_type === "brewpub" ||
                brewery.brewery_type === "micro" ||
                brewery.brewery_type === "regional"
            );

            // store those in state
            state.breweries = filteredBreweries;

            render()

        })

    })
}

function getBreweriesByState(state) {
    return fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}&per_page=50`)
        .then(function (response) {
            return response.json()
        })
}



function renderSideBar() {
    let mainEl = document.querySelector('main')

    let filtersSection = document.createElement('aside')
    filtersSection.setAttribute("class", "filters-section")

    let h2 = document.createElement('h2')
    h2.innerText = "Filter By:"

    let filterByTypeForm = document.createElement('form')
    filterByTypeForm.setAttribute("id", "filter-by-type-form")

    let filterLabel = document.createElement('label')
    filterLabel.setAttribute("for", "filter-by-type")
    filterLabel.innerText = "Type of Brewery"

    let selectForm = document.createElement('select')
    selectForm.setAttribute("class", "filter-by-type")
    selectForm.setAttribute("id", "filter-by-type")

    selectForm.addEventListener("change", function () {
        state.filterByType = selectForm.value
        render()
    })

    var selectAType = document.createElement("option");
    selectAType.setAttribute("value", "volvocar");
    selectAType.innerText = "Select a type..."

    var micro = document.createElement("option");
    micro.setAttribute("value", "micro");
    micro.innerText = "Micro"

    var regional = document.createElement("option");
    regional.setAttribute("value", "regional");
    regional.innerText = "Regional"

    var brewpub = document.createElement("option");
    brewpub.setAttribute("value", "brewpub");
    brewpub.innerText = "Brewpub"

    let filterByCity = document.createElement('div')
    filterByCity.setAttribute("class", "filter-by-city-heading")

    let h3 = document.createElement('h3')
    h3.innerText = "Cities"

    let clearAllBtn = document.createElement('button')
    clearAllBtn.innerText = "Clear all"

    let filterByCityForm = document.createElement('form')
    filterByCityForm.setAttribute("id", "filter-by-city-form")

    citiesCreated = []

    for (const brewery of state.breweries) {
        if (!citiesCreated.includes(brewery.city)) {
            citiesCreated.push(brewery.city)
            let checkBox = document.createElement('input')
            checkBox.setAttribute("type", "checkbox")
            checkBox.setAttribute("name", brewery.city)
            checkBox.setAttribute("value", brewery.city)

            let cityLabel = document.createElement('label')
            cityLabel.setAttribute("for", brewery.city)
            cityLabel.innerText = brewery.city

            filterByCityForm.append(checkBox, cityLabel)

            checkBox.addEventListener("click", function () {
                selectedCities.push(checkBox.value)
                state.filterByCity = selectedCities
                render()
            })
        }
        else {
            continue
        }
    }

    mainEl.append(filtersSection)
    filtersSection.append(h2, filterByTypeForm, filterByCity, filterByCityForm)
    filterByTypeForm.append(filterLabel, selectForm)
    selectForm.append(selectAType, micro, regional, brewpub)
    filterByCity.append(h3, clearAllBtn)

}



function renderBreweryList() {
    let mainEl = document.querySelector('main')
    mainEl.setAttribute("class", "mainEl")

    let searchHeader = document.createElement('header')
    searchHeader.setAttribute("class", "search-bar")

    let h1 = document.createElement('h1')
    h1.innerText = "List of Breweries"

    let form = document.createElement('form')
    form.setAttribute("id", "search-breweries-form")

    let label = document.createElement('label')
    label.setAttribute("for", "search-breweries")
    label.innerText = "Search breweries:"

    let input = document.createElement('input')
    input.setAttribute("id", "search-breweries")
    input.setAttribute("name", "search-breweries")
    input.setAttribute("type", "text")

    form.addEventListener("submit", function (event) {

        searchBox = []
        event.preventDefault()
        searchBox.push(input.value)
        state.search = searchBox
        render()
    });

    let article = document.createElement('article')

    let ul = document.createElement('ul')
    ul.setAttribute("class", "breweries-list")


    let breweriesToRender = state.breweries;

    if (state.filterByType !== undefined) {
        breweriesToRender = breweriesToRender.filter(function (brewery) {
            return brewery.brewery_type === state.filterByType;
        });
    }

    if (state.filterByCity !== undefined) {
        // code here depends on filter cities
        breweriesToRender = breweriesToRender.filter(function (brewery) {
            return state.filterByCity.includes(brewery.city);
        });
    }
    if (state.search !== undefined) {
        breweriesToRender = breweriesToRender.filter(function (brewery) {
            let lowerCaseBrewery = brewery.name.toLowerCase()
            return lowerCaseBrewery.includes(state.search)
        })
    }
    let perPageItem = 10
    let currentPageStart = (currentPage - 1) * perPageItem
    let currentPageEnd = currentPage * perPageItem

    breweriesToRender = breweriesToRender.slice(currentPageStart, currentPageEnd);

    for (const brewery of breweriesToRender) {
        let breweryListItem = renderBreweries(brewery)
        ul.append(breweryListItem)
    }

    mainEl.append(h1, searchHeader, article)
    searchHeader.append(form)
    form.append(label, input)
    article.append(ul)

    pagination()


}

function renderBreweries(brewery) {
    let list = document.createElement('li')

    let h2 = document.createElement('h2')
    h2.innerText = brewery.name

    let type = document.createElement('div')
    type.setAttribute("class", "type")
    type.innerText = brewery.brewery_type

    let addressSection = document.createElement('section')
    addressSection.setAttribute("class", "address")

    let addressLabel = document.createElement('h3')
    addressLabel.innerText = "Address:"

    let addressline1 = document.createElement('p')
    addressline1.innerText = brewery.street

    let addressline2 = document.createElement('p')
    addressline2.innerText = brewery.city

    let addressline3 = document.createElement('p')
    addressline3.innerText = brewery.state + brewery.postal_code

    let phoneSection = document.createElement('section')
    phoneSection.setAttribute("class", "phone")

    let phoneLabel = document.createElement('h3')
    phoneLabel.innerText = "Phone:"

    let telephoneNumber = document.createElement('p')
    telephoneNumber.innerText = brewery.phone

    let websiteSection = document.createElement('section')
    websiteSection.setAttribute("class", "link")

    let link = document.createElement('a')
    link.setAttribute("href", brewery.website_url)
    link.innerText = "Visit website"



    list.append(h2, type, addressSection, phoneSection, websiteSection)
    addressSection.append(addressLabel, addressline1, addressline2, addressline3)
    phoneSection.append(phoneLabel, telephoneNumber)
    websiteSection.append(link)

    return list

}

function pagination() {

    let mainEl = document.querySelector('.mainEl')
    console.log(mainEl)

    let footer = document.createElement('footer')

    let previousPageBtn = document.createElement('button')
    previousPageBtn.innerText = "Previous"
    previousPageBtn.onclick = previousPage

    let currentPageDislay = document.createElement('p')
    currentPageDislay = currentPage

    let nextPageBtn = document.createElement('button')
    nextPageBtn.innerText = "Next"
    nextPageBtn.onclick = nextPage

    mainEl.append(footer)
    footer.append(previousPageBtn, currentPageDislay, nextPageBtn)
}

function nextPage() {
    currentPage++
    render()
}

function previousPage() {
    console.log("ello")
    if (currentPage === 1) {
        return
    }
    else {
        currentPage--
        render()
    }
}

function render() {
    let mainEl = document.querySelector("main")
    mainEl.innerHTML = ""
    renderBreweryList()
    renderSideBar()
}

getStatefromForm()