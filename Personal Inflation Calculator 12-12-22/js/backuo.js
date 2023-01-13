//OTHER THINGS TO FIX 
//scaled consumption values are slighly off after initial update
//export function broken on edge and firefox
//https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/annual-weight-update-cpi-and-living-cost-indexes/2021#data-download
//https://explore.data.abs.gov.au/vis?tm=selected%20living%20cost%20indexes&pg=0&df[ds]=ECONOMY_TOPICS&df[id]=LCI&df[ag]=ABS&df[vs]=1.0.0&pd=2021-Q1%2C&dq=3.131278..50.Q&ly[cl]=TIME_PERIOD
//https://api.data.abs.gov.au/data/ABS,LCI,1.0.0/3.131278..50.Q?firstNObservations=0&lastNObservations=20&format=jsondata

const CONSUMPTION_TABLE_ID = '#content_table';
const REGION_SELECT_ID = '#region_select';
const REGION_LABEL_ID = '#city_legend_label';
const CHART_TABLE_ID = '#chart-data-table_J0vCHlqo7x';
const QUERTER_MAP = Object.freeze({
    Q1: 'Mar',
    Q2: 'Jun',
    Q3: 'Sep',
    Q4: 'Dec'
});
const TOOLTIP_ID = '#group_tooltip';
// Where does the json come from? weights csv?
managerSource = {
  "ids": [
    "20001",
    "30002",
    "30003",
    "30001",
    "114120",
    "131179",
    "131180",
    "30007",
    "20006",
    "30026",
    "30027",
    "20002",
    "131181",
    "30012",
    "97556",
    "20003",
    "115522",
    "131278",
    "131187",
    "30016",
    "20004",
    "131184",
    "131182",
    "97561",
    "97563",
    "97565",
    "115486",
    "131188",
    "131189",
    "20005",
    "30024",
    "30025",
    "115488",
    "30022",
    "115489",
    "131193",
    "131191",
    "30033",
    "115492",
    "115493",
    "40106",
    "126670",
    "115528",
    "131195",
    "10001"
  ],
  "groups": [
    {
      "id": "20001",
      "name": "Food and non-alcoholic beverages",
      "description": "Includes expenditure on eggs, spreads, condiments, oils, snacks and confectionary, baby food and prepared meals. �",
      "children": [
        {
          "id": "30002",
          "name": "Bread and cereal products",
          "description": "",
          "children": [],
          "weights": [
            "1.33",
            "1.43",
            "1.44",
            "1.57",
            "1.52",
            "1.63",
            "1.25",
            "1.44",
            "1.42"
          ],
          "period": "month"
        },
        {
          "id": "30003",
          "name": "Meat and seafoods",
          "description": "",
          "children": [],
          "weights": [
            "2.22",
            "2.28",
            "2.39",
            "2.48",
            "2.74",
            "2.37",
            "2.89",
            "2.36",
            "2.33"
          ],
          "period": "month"
        },
        {
          "id": "30001",
          "name": "Dairy and related products",
          "description": "",
          "children": [],
          "weights": [
            "0.88",
            "1.01",
            "1.13",
            "1.21",
            "1.11",
            "1.23",
            "1.17",
            "0.99",
            "1.01"
          ],
          "period": "month"
        },
        {
          "id": "114120",
          "name": "Fruit and vegetables",
          "description": "",
          "children": [],
          "weights": [
            "2.38",
            "2.31",
            "2.41",
            "2.38",
            "2.44",
            "2.31",
            "2.86",
            "2.54",
            "2.37"
          ],
          "period": "month"
        },
        {
          "id": "131179",
          "name": "Food products n.e.c.",
          "description": "",
          "children": [],
          "weights": [
            "1.89",
            "2.1",
            "2.15",
            "2.31",
            "2.47",
            "2.44",
            "2.03",
            "2.01",
            "2.09"
          ],
          "period": "month"
        },
        {
          "id": "131180",
          "name": "Non-alcoholic beverages",
          "description": "",
          "children": [],
          "weights": [
            "1.06",
            "1.05",
            "1.27",
            "1.21",
            "1.35",
            "1.31",
            "1.48",
            "1.11",
            "1.15"
          ],
          "period": "month"
        },
        {
          "id": "30007",
          "name": "Meals out and take away foods",
          "description": "",
          "children": [],
          "weights": [
            "7.46",
            "6.89",
            "6.04",
            "6.35",
            "6.01",
            "6.12",
            "6.85",
            "7.12",
            "6.81"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "17.22",
        "17.07",
        "16.83",
        "17.51",
        "17.64",
        "17.41",
        "18.53",
        "17.57",
        "17.18"
      ],
      "period": "month"
    },
    {
      "id": "20006",
      "name": "Alcohol and tobacco",
      "description": "Includes expenditure on all types of beverages containing alcohol such as beer, wine and spirits; and all products containing tobacco such as cigarettes, cigars and cigarette tobacco.",
      "children": [
        {
          "id": "30026",
          "name": "Alcoholic beverages",
          "description": "",
          "children": [],
          "weights": [
            "4.83",
            "5.16",
            "5.48",
            "5.09",
            "5.23",
            "5.75",
            "7.67",
            "4.63",
            "5.12"
          ],
          "period": "month"
        },
        {
          "id": "30027",
          "name": "Tobacco",
          "description": "",
          "children": [],
          "weights": [
            "2.36",
            "2.94",
            "3.23",
            "3.31",
            "2.44",
            "4.2",
            "4.09",
            "1.7",
            "2.75"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "7.19",
        "8.1",
        "8.71",
        "8.4",
        "7.67",
        "9.95",
        "11.76",
        "6.33",
        "7.87"
      ],
      "period": "month"
    },
    {
      "id": "20002",
      "name": "Clothing and footwear",
      "description": "Includes expenditure on clothing, footwear, accessories such as watches and jewellery and services such as dry cleaning and shoe repair services.",
      "children": [
        {
          "id": "131181",
          "name": "Garments",
          "description": "",
          "children": [],
          "weights": [
            "1.98",
            "1.99",
            "2.02",
            "2.03",
            "1.95",
            "2.09",
            "1.77",
            "1.91",
            "1.98"
          ],
          "period": "month"
        },
        {
          "id": "30012",
          "name": "Footwear",
          "description": "",
          "children": [],
          "weights": [
            "0.46",
            "0.49",
            "0.49",
            "0.51",
            "0.47",
            "0.65",
            "0.43",
            "0.65",
            "0.48"
          ],
          "period": "month"
        },
        {
          "id": "97556",
          "name": "Accessories and clothing services",
          "description": "",
          "children": [],
          "weights": [
            "0.98",
            "0.9",
            "1.06",
            "0.67",
            "0.78",
            "0.53",
            "0.48",
            "0.68",
            "0.91"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "3.42",
        "3.38",
        "3.57",
        "3.21",
        "3.2",
        "3.27",
        "2.68",
        "3.24",
        "3.37"
      ],
      "period": "month"
    },
    {
      "id": "20003",
      "name": "Housing",
      "description": "Includes expenditure on rents, utilities, new dwelling purchases and other expenditures on shelter-related goods and services. \nFor simplicity, the personal inflation calculator replaces new dwelling purchases with mortgage interest charges. ",
      "children": [
        {
          "id": "115522",
          "name": "Rents",
          "description": "",
          "children": [],
          "weights": [
            "6.59",
            "5.42",
            "6.1",
            "5.54",
            "3.85",
            "5.58",
            "5.65",
            "6.3",
            "5.75"
          ],
          "period": "month"
        },
        {
          "id": "131278",
          "name": "Mortgage interest charges",
          "description": "Includes expenditure on the interest component of mortgage repayments only, and excludes the principal. �",
          "children": [],
          "weights": [
            "1",
            "1",
            "1",
            "1",
            "1",
            "1",
            "1",
            "1",
            "1"
          ],
          "period": "year"
        },
        {
          "id": "131187",
          "name": "Other housing",
          "description": "Includes expenditure on state and local council property rates and charges (excluding water and sewerage); and materials and tradesmen services for minor maintenance and repair of dwellings. ",
          "children": [],
          "weights": [
            "3.83",
            "3.84",
            "3.4",
            "3.65",
            "3.92",
            "4.2",
            "4.21",
            "4.11",
            "3.79"
          ],
          "period": "month"
        },
        {
          "id": "30016",
          "name": "Utilities",
          "description": "Includes expenditure on supply and usage charges for water and sewerage, electricity, and gas (including mains and bottled gas); and other household fuels such as firewood. ",
          "children": [],
          "weights": [
            "3.93",
            "4.65",
            "2.84",
            "5.86",
            "3.17",
            "3.84",
            "3.72",
            "5.34",
            "4.08"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "23.64",
        "22.59",
        "20.28",
        "23.62",
        "18.83",
        "20.38",
        "18.42",
        "24.56",
        "22.24"
      ],
      "period": "month"
    },
    {
      "id": "20004",
      "name": "Furnishings, household equipment and services",
      "description": "Incudes expenditure on all goods and services used in the operation and regular use of dwellings; plus personal goods and services, including those delivered outside the home.",
      "children": [
        {
          "id": "131184",
          "name": "Furniture and furnishings",
          "description": "",
          "children": [],
          "weights": [
            "1.84",
            "1.79",
            "1.83",
            "1.97",
            "1.99",
            "1.75",
            "2.19",
            "1.79",
            "1.86"
          ],
          "period": "month"
        },
        {
          "id": "131182",
          "name": "Household textiles",
          "description": "",
          "children": [],
          "weights": [
            "0.52",
            "0.47",
            "0.52",
            "0.55",
            "0.57",
            "0.49",
            "0.42",
            "0.35",
            "0.51"
          ],
          "period": "month"
        },
        {
          "id": "97561",
          "name": "Household appliances, utensils and tools",
          "description": "",
          "children": [],
          "weights": [
            "1.64",
            "1.45",
            "1.48",
            "1.42",
            "1.77",
            "1.96",
            "2.07",
            "1.41",
            "1.56"
          ],
          "period": "month"
        },
        {
          "id": "97563",
          "name": "Non-durable household products",
          "description": "Includes expenditure on cleaning and personal care products, and other non-durable household products such as toilet paper and garden supplies. ",
          "children": [],
          "weights": [
            "2.3",
            "2.34",
            "2.51",
            "2.65",
            "2.8",
            "2.76",
            "2.55",
            "2.26",
            "2.43"
          ],
          "period": "month"
        },
        {
          "id": "97565",
          "name": "Domestic and household services",
          "description": "Incudes expenditure on child care, hairdressing and personal grooming services, and other household services such as gardeners and pest extermination. ",
          "children": [],
          "weights": [
            "2.91",
            "2.28",
            "2.97",
            "1.98",
            "2.38",
            "1.95",
            "2.4",
            "2.77",
            "2.58"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "9.21",
        "8.33",
        "9.31",
        "8.57",
        "9.51",
        "8.91",
        "9.63",
        "8.58",
        "8.94"
      ],
      "period": "month"
    },
    {
      "id": "115486",
      "name": "Health",
      "description": "Includes expenditure relating to health goods and services.",
      "children": [
        {
          "id": "131188",
          "name": "Medical products, appliances and equipment",
          "description": "",
          "children": [],
          "weights": [
            "1.1",
            "1.2",
            "1.25",
            "1.35",
            "1.37",
            "1.24",
            "1.32",
            "1.12",
            "1.2"
          ],
          "period": "month"
        },
        {
          "id": "131189",
          "name": "Medical, dental and hospital services",
          "description": "Includes expenditure on general or specialist practitioner consultations, hospital charges, and medical insurance.",
          "children": [],
          "weights": [
            "5.21",
            "4.5",
            "4.93",
            "5.22",
            "6.03",
            "5.46",
            "3.99",
            "5.01",
            "5.05"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "6.31",
        "5.7",
        "6.18",
        "6.57",
        "7.4",
        "6.7",
        "5.31",
        "6.13",
        "6.25"
      ],
      "period": "month"
    },
    {
      "id": "20005",
      "name": "Transport",
      "description": "Includes expenses related to owning and operating private motor vehicles and travel by public transport within the capital cities. It does not cover public transport used for intercity travel.",
      "children": [
        {
          "id": "30024",
          "name": "Private motoring",
          "description": "Includes expenditure on motor vehicles purchases (including stamp duty fees), motor vehicle registration, spare parts and accessories, automotive fuel, maintenance and repair of motor vehicles, and other fees such as drivers license fees. �",
          "children": [],
          "weights": [
            "9.98",
            "10.78",
            "11.38",
            "9.9",
            "11.42",
            "11.71",
            "11.17",
            "11.37",
            "10.64"
          ],
          "period": "month"
        },
        {
          "id": "30025",
          "name": "Urban transport fares",
          "description": "",
          "children": [],
          "weights": [
            "0.49",
            "0.34",
            "0.28",
            "0.21",
            "0.22",
            "0.25",
            "0.11",
            "0.19",
            "0.35"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "10.47",
        "11.12",
        "11.66",
        "10.11",
        "11.64",
        "11.96",
        "11.28",
        "11.56",
        "10.99"
      ],
      "period": "month"
    },
    {
      "id": "115488",
      "name": "Communication",
      "description": "Includes expenditure on postal services, and telecommunication equipment and services such as mobile phone purchases and internet and broadband services. ",
      "children": [
        {
          "id": "30022",
          "name": "Communication",
          "description": "",
          "children": [],
          "weights": [
            "2.21",
            "2.33",
            "2.43",
            "2.35",
            "2.39",
            "2.26",
            "2.68",
            "2.24",
            "2.31"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "2.21",
        "2.33",
        "2.43",
        "2.35",
        "2.39",
        "2.26",
        "2.68",
        "2.24",
        "2.31"
      ],
      "period": "month"
    },
    {
      "id": "115489",
      "name": "Recreation and culture",
      "description": "Incudes expenditure on recreational products, sporting and recreational activities and holiday travel and accommodation is in the Recreation and culture group.",
      "children": [
        {
          "id": "131193",
          "name": "Audio, visual and computing equipment and services",
          "description": "",
          "children": [],
          "weights": [
            "1.85",
            "1.92",
            "1.99",
            "2.09",
            "2.05",
            "2.28",
            "2.4",
            "2.1",
            "1.95"
          ],
          "period": "month"
        },
        {
          "id": "131191",
          "name": "Newspapers, books and stationery",
          "description": "",
          "children": [],
          "weights": [
            "0.5",
            "0.52",
            "0.53",
            "0.56",
            "0.62",
            "0.82",
            "0.46",
            "0.59",
            "0.53"
          ],
          "period": "month"
        },
        {
          "id": "30033",
          "name": "Holiday travel and accommodation",
          "description": "",
          "children": [],
          "weights": [
            "4.28",
            "4.25",
            "4.32",
            "4.25",
            "4.3",
            "4.3",
            "4.29",
            "4.32",
            "4.28"
          ],
          "period": "month"
        },
        {
          "id": "115492",
          "name": "Other recreation, sport and culture",
          "description": "Incudes expenditure on sports equipment, games, toys, hobbies, pet products, veterinary services, sports participation and admission fees. ",
          "children": [],
          "weights": [
            "3.53",
            "3.97",
            "4.88",
            "4.24",
            "4.73",
            "4.6",
            "4.43",
            "4.17",
            "4.08"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "10.16",
        "10.66",
        "11.72",
        "11.14",
        "11.7",
        "12",
        "11.58",
        "11.18",
        "10.84"
      ],
      "period": "month"
    },
    {
      "id": "115493",
      "name": "Education",
      "description": "Includes expenditure on primary, secondary and tertiary education and preschool services. Child care is included in �Domestic and household services�.",
      "children": [
        {
          "id": "40106",
          "name": "Education",
          "description": "",
          "children": [],
          "weights": [
            "4.34",
            "4.81",
            "4.45",
            "3.72",
            "4.45",
            "3.28",
            "3.02",
            "4.08",
            "4.43"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "4.34",
        "4.81",
        "4.45",
        "3.72",
        "4.45",
        "3.28",
        "3.02",
        "4.08",
        "4.43"
      ],
      "period": "month"
    },
    {
      "id": "126670",
      "name": "Insurance and financial services",
      "description": "Includes expenditure on actual charges for financial services of banks and other institutions such as transaction fees; and fees charged by stockbrokers, real estate agents, accountants, legal practitioners, and taxes on transfers for real estate.",
      "children": [
        {
          "id": "115528",
          "name": "Insurance",
          "description": "Includes expenditure on comprehensive motor vehicle insurance, compulsory third party motor vehicle insurance, and house and contents insurance.",
          "children": [],
          "weights": [
            "1.06",
            "1.08",
            "1.28",
            "1.27",
            "1.4",
            "1.42",
            "1.45",
            "0.98",
            "1.16"
          ],
          "period": "month"
        },
        {
          "id": "131195",
          "name": "Financial services",
          "description": "Includes expenditure on actual charges for financial services of banks and other institutions such as transaction fees; and fees charged by stockbrokers, real estate agents, accountants, legal practitioners, and taxes on transfers for real estate. ",
          "children": [],
          "weights": [
            "4.8",
            "4.86",
            "3.56",
            "3.54",
            "4.14",
            "2.49",
            "3.67",
            "3.61",
            "4.4"
          ],
          "period": "month"
        }
      ],
      "weights": [
        "5.86",
        "5.94",
        "4.84",
        "4.81",
        "5.54",
        "3.91",
        "5.12",
        "4.59",
        "5.56"
      ],
      "period": "month"
    },
    {
      "id": "10001",
      "name": "All groups CPI",
      "description": "",
      "children": [],
      "weights": [
        "100",
        "100",
        "100",
        "100",
        "100",
        "100",
        "100",
        "100",
        "100"
      ],
      "period": "month"
    }
  ]
};
var managerChart;   
var managerConsumption = [];

var managerConsumptionTable;
var managerRegionSelect;
var managerRegionLabel;
var managerChartTable;
var managerScaleDiv;
var managerTooltip;

$(document).ready(function() {
    //fetch(`https://api.data.abs.gov.au/data/ABS,CPI,1.1.0/3.${managerSource.ids.join('+')}.10.1+2+3+4+5+6+7+8+50.Q?startPeriod=1974&format=jsondata`)
    // Get last 5 years of data (4 quaters * 5 years = 20 obs)

    Promise.all([
        fetch(`https://api.data.abs.gov.au/data/ABS,CPI,1.1.0/3.${managerSource.ids.join('+')}.10.1+2+3+4+5+6+7+8+50.Q?firstNObservations=0&lastNObservations=20&format=jsondata`),
        fetch(`https://api.data.abs.gov.au/data/ABS,LCI,1.0.0/3.131278.P1.1+2+3+4+5+6+7+8+50.Q?firstNObservations=0&lastNObservations=20&format=jsondata`)
    ]).then(function (responses) {
        // Get a JSON object from each of the responses
        return Promise.all(responses.map(function (response) {
            return response.json();
        }));
    }).then(function (data) {
        console.log(data);
        let cpi_json = data[0];
        let lci_json = data[1];
        //console.log(lci_json.data.dataSets[0].series);
        //console.log(data[0]);
        initialiseTable();
        managerScaleDiv = managerConsumptionTable.find('.scale');
        addRegions(cpi_json.data.structure.dimensions.series[3].values);
        addQuarters(cpi_json.data.structure.dimensions.observation['0'].values);
        appendData(cpi_json.data.structure.dimensions.series[1].values, cpi_json.data.dataSets[0].series);
        appendData(lci_json.data.structure.dimensions.series[1].values, lci_json.data.dataSets[0].series);
        console.log(managerSource);
        var graphX = [];
        for (let i = 0; i < managerSource.quarters.length; i++) {
            graphX.push(managerSource.quarters[i].name);
        }
        managerChartTable = $(CHART_TABLE_ID);
        managerChart = buildGraph(managerSource.groups[managerSource.groups.length - 1].name, graphX, managerChartTable.attr('id'));
        buildSelect();
        let latestQ = managerSource.quarters[managerSource.quarters.length - 1].name;
        $('#personal_quarter').html(latestQ);
        $('#consumer_quarter').html(latestQ);
        assignGroupHovers();
        collapsibleSetup();
        disableLoader();
    }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
        displayAlert('No valid connection to API service. \r\n\r\nPlease try again later.')
    });
    
});

//Page functions
function initialiseTable() {
    managerConsumptionTable = $(CONSUMPTION_TABLE_ID);
    var tbody = managerConsumptionTable.find('tbody');
    var odd = false;
    for (let group of managerSource.groups) {
        if (group.id == '10001' ) { continue; }
        if(group.description.length > 0){
            tbody.append(`<tr class="${(odd) ? 'odd' : 'even'}"><td${group.children.length > 0 ? ' class="expand"' : ''}></td><td><span data-tooltip="${group.description}" tabindex="0">${group.name}</span></td><td class="text-align-right"></td><td><div class="input-wrapper"><div class="prefix">$</div><input type="number" placeholder="0" min="0" onblur="inputUpdated(this)" /><div class="suffix">/${group.period}</div></td><td class="basket"><span tabindex="0"><div></div></span><span tabindex="0"><div></div></span></td></tr>`);
        } else {
            tbody.append(`<tr class="${(odd) ? 'odd' : 'even'}"><td${group.children.length > 0 ? ' class="expand"' : ''}></td><td><span tabindex="0">${group.name}</span></td><td class="text-align-right"></td><td><div class="input-wrapper"><div class="prefix">$</div><input type="number" placeholder="0" min="0" onblur="inputUpdated(this)" /><div class="suffix">/${group.period}</div></td><td class="basket"><span tabindex="0"><div></div></span><span tabindex="0"><div></div></span></td></tr>`);
        }
        managerConsumption.push([0, 0]);
        if (group.children.length > 0){
            for (let child of group.children) {
                managerConsumption.push([0, 0]);
                if(child.description.length > 0){
                    tbody.append(`<tr class="hidden ${(odd) ? 'odd' : 'even'} child"><td></td><td class="indent"><span data-tooltip="${child.description}" tabindex="0">${child.name}</span></td><td class="text-align-right"></td><td><div class="input-wrapper"><div class="prefix">$</div><input type="number" placeholder="0" min="0" onblur="inputUpdated(this)" /><div class="suffix">/${group.period}</div></td><td class="basket"><span tabindex="0"><div></div></span><span tabindex="0"><div></div></span></td></tr>`);
                } else {
                    tbody.append(`<tr class="hidden ${(odd) ? 'odd' : 'even'} child"><td></td><td class="indent"><span tabindex="0">${child.name}</span></td><td class="text-align-right"></td><td><div class="input-wrapper"><div class="prefix">$</div><input type="number" placeholder="0" min="0" onblur="inputUpdated(this)" /><div class="suffix">/${group.period}</div></td><td class="basket"><span tabindex="0"><div></div></span><span tabindex="0"><div></div></span></td></tr>`);

                }
            }
        }
        odd = !odd;
    }
    tbody.on('click', 'td.expand', function() {
        var tr = $(this).closest('tr');
        if (tr.attr('show') == '') {
            tr.find('input').removeAttr('disabled');
            tr.children().last().removeAttr('rowspan');
            tr.removeAttr('show');
            tr = tr.next('tr');
            while (tr.hasClass('child')) {
                tr.toggleClass('hidden');
                tr = tr.next('tr');
            }
        } else {
            tr.attr('show', '');
            tr.find('input').attr('disabled', 'disabled');
            tr = tr.next('tr');
            var count = 1;
            while (tr.hasClass('child')) {
                tr.toggleClass('hidden');
                tr = tr.next('tr');
                count++;
            }
            //$(this).closest('tr').children().last().attr('rowspan', count);
        }
    });
}

function disableLoader() {
    var loader = $('#page_loader');
    loader.removeAttr('show');
    loader.parent().parent().children().each(function() {
        $(this).toggleClass('hidden');
    });
}

function buildSelect() {
    var sortedRegions = [];
    for (let i = 0; i < managerSource.regions.length; i++) {
        sortedRegions.push({
            index: i,
            name: managerSource.regions[i].name,
            order: managerSource.regions[i].order
        });
    }
    sortedRegions.sort((a, b) => {
        if ( parseInt(a.order) < parseInt(b.order) ) { return -1; }
        if ( parseInt(a.order) > parseInt(b.order) ) { return 1; }
        return 0;
    });
    managerRegionSelect = $(REGION_SELECT_ID);
    managerRegionLabel = $(REGION_LABEL_ID);
    managerRegionSelect.append(`<option value="${sortedRegions[0].index}">${sortedRegions[0].name}</option>`);
    for (let i = 1; i < sortedRegions.length; i++) {
        managerRegionSelect.append(`<option value="${sortedRegions[i].index}">${sortedRegions[i].name}</option>`);
    }
    managerRegionSelect.on('change', function() {
        var regionIndex = $(this).val();
        var weightIndex = managerSource.regions[regionIndex].order - 1;
        weightIndex = (weightIndex < 0) ? managerSource.regions.length - 1 : weightIndex;
        var inflationRates = [];
        var index = 0;
        // for (let group of managerSource.groups) {
        //     if (group.id == '10001') { continue; }
        //     inflationRates.push(group.values[regionIndex][group.values[regionIndex].length - 1].toFixed(1));
        //     managerConsumption[index][1] = parseFloat(group.weights[weightIndex]);
        //     for (let subGroup of group.children) {
        //         inflationRates.push(subGroup.values[regionIndex][subGroup.values[regionIndex].length - 1].toFixed(1));
        //     }
        //     index++;
        // }
        for (let group of managerSource.groups) {
            if (group.id == '10001') { continue; }
            //console.log(group.values)
            if (group.values[regionIndex][group.values[regionIndex].length - 1].toFixed(1)){
              //TODO check region exists 
            }
            inflationRates.push(group.values[regionIndex][group.values[regionIndex].length - 1].toFixed(1));
            managerConsumption[index][1] = parseFloat(group.weights[weightIndex]);
            index++;
            console.log(group.values, group.children)
            //if (typeof group.children !== 'undefined' && group.children.length > 0 ){
                for (let subGroup of group.children) {
                  console.log(subGroup)
                    inflationRates.push(subGroup.values[regionIndex][subGroup.values[regionIndex].length - 1].toFixed(1));
                    managerConsumption[index][1] = parseFloat(subGroup.weights[weightIndex]);
                    index++;
                }
            //}
            
        }

        updateTableColumn(2, inflationRates);
        managerRegionLabel.html(managerRegionSelect.find('option:selected').html() + ' consumption');
        calculateScale();
    });
    managerRegionSelect.next().on('click', function() {
        managerConsumptionTable.find('input').each(function () {
            $(this).val('');
        });
        for (consumption of managerConsumption) {
            consumption[0] = 0;
        }
        calculateScale();
    });
    importValuesSetup(managerRegionSelect.next().next());
    exportValuesSetup(managerRegionSelect.next().next().next());
    managerRegionSelect.trigger('change');
}

function updateTableColumn(colIndex, values, ignoreChildren = false) {
    var rows = managerConsumptionTable.find('tbody').children();
    var index = 0;
    rows.each(function() {
        var row = $(this);
        if (ignoreChildren) {
            if (row.hasClass('child')) { return; }
        }
        var cell = row.children().eq(colIndex)
        switch (colIndex) {
            case 3:
                cell.children().first().val(values[index]);
                break;
            case 4:
                if (values[index][0] != null) { 
                    cell.children().first().attr('style', `width: ${values[index][0]}%`);
                    cell.children().first().children().first().html(`Personal consumption: ${(managerConsumption[index][0]) ? managerConsumption[index][0].toFixed(1) : 0}%`);
                }
                if (values[index][1] != null) { 
                    cell.children().last().attr('style', `width: ${values[index][1]}%`);
                    cell.children().last().children().first().html(`City consumption: ${(managerConsumption[index][1]) ? managerConsumption[index][1].toFixed(1) : 0}%`);
                }
                break;
            default:
                cell.html(values[index]);
                break;
        }
        index++;
    });
}

function populateIndicators(personal, consumer) {
    if (isNaN(personal)) { personal = 0; }
    $('#personal_value').html(`${personal.toFixed(1)}%`);
    $('#consumer_value').html(`${consumer.toFixed(1)}%`);
}

function updateGraph(title, personal, consumer) {
    var newTitle = `Annual movement - ${title}`;
    managerChartTable.find('caption').html(newTitle);
    managerChart.update({
        title : {
            text: newTitle
        },
        series: [
            {
                data: personal
            },
            {
                data: consumer
            }
        ]
    });
    managerChartTable.DataTable().rows().every(function(row, tLoop, rLoop) {
        var data = this.data();
        data[1] = personal[row].toFixed(1);
        data[2] = consumer[row].toFixed(1);
        this.data(data);
    });
}

function importValuesSetup(input) {
    input.find('input').on('change', function() {
        if (this.files.length <= 0) { return; }
        var reader = new FileReader();
        reader.onload = function(e) {
            var arr = $.csv.toArrays(e.target.result);
            var message = 'Invalid CSV.\r\n\r\nPlease try a different CSV.';
            if (arr.length == 0) { displayAlert(message); return; }
            if (arr[0].length == 0) { displayAlert(message); return; }
            managerConsumptionTable.find('input').each(function (index) {
                if (index > arr.length - 1) { return; }
                var value = parseFloat(arr[index][1]);
                if (isNaN(value)) {
                    $(this).val('');
                } else {
                    $(this).val(value);
                }
            });
            inputUpdated(null);
        };
        reader.readAsText(this.files[0]);
    });
}

function exportValuesSetup(btn) {
    btn.on('click', function() {
        var output = [];
        managerConsumptionTable.find('tbody').children().each(function() {
            var row = $(this);
            var name = (row.hasClass('child')) ? ` ${row.children().eq(1).html()}` : `${row.children().eq(1).html()}`;
            var value = (row.find('input').val()) ? parseFloat(row.find('input').val()) : 0;
            var row = [name, value];
            output.push(row);
        });
        var element = document.createElement('a');
        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent($.csv.fromArrays(output))}`);
        element.setAttribute('download', 'consumption.csv');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    });
}

function displayAlert(message) {
    alert(message);
}

function assignGroupHovers() {
    managerTooltip = $(TOOLTIP_ID);
    managerConsumptionTable.find('[data-tooltip]').each((i, obj) => {
        $(obj).on('mouseenter', () => {
            managerTooltip.html($(obj).attr('data-tooltip'));
            let left = $(obj).offset().left;
            let top = $(obj).offset().top - ($(obj).height() * 2) - managerTooltip.height() - 8;
            managerTooltip.attr('style', `visibility: visible; left: ${left}px; top: ${top}px;`);
        });
        $(obj).on('mouseleave', () => {
            managerTooltip.html('');
            managerTooltip.removeAttr('style');
        });
    });
}

function collapsibleSetup() {
    $('.collapsible-closed').each((i, obj) => {
        var col = $(obj);
        col.on('click', (e) => { e.preventDefault(); collapseClick(obj, obj.lastElementChild); });
        col.on('keyup', (e) => { if ("Enter" === e.key) return collapseClick(obj, obj.lastElementChild), !1 });
    });
}

function collapseClick(e,a) {
    e.classList.toggle("collapsible-closed");
    var r = e.querySelector(".abs-content-title > .abs-subsection-title");
    r.setAttribute("aria-expanded", "false" == r.getAttribute("aria-expanded") ? "true" : "false"), $(a).slideToggle("fast"), a.setAttribute("aria-hidden", "false" == a.getAttribute("aria-hidden") ? "true" : "false");
}


//Data structure manipulation functions
function addRegions(regions) {
    managerSource['regions'] = regions
}

function addQuarters(quarters) {
    var newQuarters = [];
    quarters.forEach(q => {
        let temp = q.name.split('-');
        newQuarters.push({
            id: q.id,
            name: `${QUERTER_MAP[temp[1]]}-${temp[0]}`
        });
    });
    managerSource['quarters'] = newQuarters;
}
// groups -> structure, series -> data
function appendData(groups, series) {
  //console.log(groups, series)
    for(let i = 0; i < groups.length; i++) {
        if (groups[i].parent && groups[i].parent != '10001') {
            matchChild(groups[i], i, series);
        } else {
            matchGroup(groups[i], i, series);
        }
    }
}

function matchGroup(group, index, series) {
    for (let i = 0; i < managerSource.groups.length; i++) {
        if (group.id != managerSource.groups[i].id) { continue; }
        appendValues(managerSource.groups[i], index, series);
        break;
    }
}

function matchChild(group, index, series) {
    for (let i = 0; i < managerSource.groups.length; i++) {
        if (group.parent != managerSource.groups[i].id) { continue; }
        for (let j = 0; j < managerSource.groups[i].children.length; j++) {
            if (group.id != managerSource.groups[i].children[j].id) { continue; }
            appendValues(managerSource.groups[i].children[j], index, series);
            break;
        }
        break;
    }
}

function appendValues(dest, sourceIndex, series) {
    var groupValues = [];
    for (let i = 0; i < managerSource.regions.length; i++) {
        var regionValues = [];
        // lci data is only avaliable at national level
        if(series.hasOwnProperty(`0:${sourceIndex}:0:${i}:0`)){
          var regionSeries = series[`0:${sourceIndex}:0:${i}:0`].observations;
        } else {
          // if state level data is not avaliable, assume national level data instead
          var regionSeries = series[`0:${sourceIndex}:0:0:0`].observations;
        }
          let length = managerSource.quarters.length;
          for (let j = 0; j < length; j++) {
              if (regionSeries.hasOwnProperty(j)) {
                  regionValues.push(parseFloat(regionSeries[`${j}`][0]));
              } else {
                  regionValues.push(0);
              }
          }
          groupValues.push(regionValues);
        
       
    }
    dest['values'] = groupValues;
}

//Calculation functions
function inputUpdated(input) {
    // Tally up subgroups at group level
    if (input != null) {
        console.log(input);
        var tr = $(input).closest('tr');
        //if its a child row, find the first child within the group and start tallying
        if (tr.hasClass('child')) {
            while (tr.prev().hasClass('child')) {
                tr = tr.prev();
            }
            var parent = tr.prev();
            var subGroupsTotal = 0;
            while (tr.hasClass('child')) {
                var i = tr.find('input');
                var iVal = tr.find
                subGroupsTotal += (i.val()) ? parseFloat(i.val()) : 0;
                tr = tr.next();
            }

            parent.find('input').val(subGroupsTotal);
            parent.find('input').data('lastValue', subGroupsTotal);
            parent.find('input').data('hasSubgroupData', true);
        // if its the parent row clear the children rows
        } else {
            //console.log($(input).data('lastValue'), tr.find('input').val());
            if ($(input).data('lastValue') != tr.find('input').val()) {
                tr = tr.next('tr');
                while (tr.hasClass('child')) {
                    tr.find('input').val('');
                    tr = tr.next();
                }
                //$(input).data('hasSubgroupData', false);
            }
            
        }
        $(input).data('lastValue', input.value);
    }
    //console.log(subGroupsTotal)

    // Store group consumption and tally up total consumption (needed for sparkline graph).
    var personalTotal = 0;
    var groupValues = [];
    managerConsumptionTable.find('tbody').children().each(function() {
        var i = $(this).find('input');
        var val = (i.val()) ? parseFloat(i.val()) : 0;
        groupValues.push(val);  
        if (!$(this).hasClass('child')) { 
            personalTotal += val;
        }      
    });
    // Calculate percent for each group and store for later use
    var index = 0;
    //console.log("ptotal",personalTotal)
    for (value of groupValues) {
        // managerConsumption: personal consumption, consumer consumption
        managerConsumption[index][0] = (personalTotal > 0) ? (value / personalTotal) * 100 : 0;
        //console.log(value, managerConsumption[index][0]);
        index++;
    }
    calculateScale();
}

function calculateScale() {
    var highestValue = 0;
    for (consumption of managerConsumption) {
        if (consumption[0] > highestValue) {
            highestValue = consumption[0];
        }
        if (consumption[1] > highestValue) {
            highestValue = consumption[1];
        }
    }
    highestValue = Math.ceil(highestValue);
    var scaleTopEnd = 100;
    for (let i = highestValue; i < 100; i++) {
        if (i % 5 == 0) {
            if (i % 4 == 0) { 
                scaleTopEnd = i;
                break;
            }
        }
    }
    var interval = scaleTopEnd / 4;
    managerScaleDiv.children().each(function(index) {
        var x = $(this).find('span');
        x.html(0 + index * interval);
    });
    var scaledValues = [];
    for (consumption of managerConsumption) {
        scaledValues.push([(consumption[0] / scaleTopEnd) * 100, (consumption[1] / scaleTopEnd ) * 100]);
    }
    console.log("scaled",scaledValues);
    //updateTableColumn(4, scaledValues, true);
    updateTableColumn(4, scaledValues, false);
    calculatePersonalRate();
}

function calculatePersonalRate() {
    var selectRegionIndex = managerRegionSelect.val();
    var personalY = [];
    var consumerY = [];  
    //var allGroupsIndex = managerSource.groups.findIndex(group => group.id==="10001");
    //console.log(allGroupsIndex);
    // do this for all quarters - required for the graph
    for (let i = 0; i < managerSource.quarters.length; i++) {
        var personalQuarterRate = 0;
        let index = 0;
        // aggregate all the groups
        for (let j = 0; j < managerSource.groups.length - 1; j++) {
            
            let hasSubgroupData = false;
            let groupRate = managerSource.groups[j].values[selectRegionIndex][i] * getPeriodMultipler(managerSource.groups[j]) * (managerConsumption[index][0] / 100);
            //console.log("group index ", index, managerConsumption[index][0]);
            // check for sub groups
            if(managerSource.groups[j].children.length > 0){
              let periodRate = 0;
                for (let k = 0; k < managerSource.groups[j].children.length; k++) { 
                    index++;
                    //console.log("subgroup index ", index,managerConsumption[index][0]);
                    if (managerConsumption[index][0] > 0){
                        hasSubgroupData = true;
                        let subgroupRate = managerSource.groups[j].children[k].values[selectRegionIndex][i] * getPeriodMultipler(managerSource.groups[j].children[k]) * (managerConsumption[index][0] / 100);
                        //console.log("has subgroup data", managerConsumption[index][0])
                        personalQuarterRate += subgroupRate;
                        
                    }
                }
            }
            // managerConsumption is a percentage -> convert to fraction
            if (!hasSubgroupData) {
              
                personalQuarterRate += groupRate;
                //console.log("no subgroup data ", groupRate);
            }
            index++;
            
        }

        personalY.push(personalQuarterRate);
        consumerY.push(managerSource.groups[managerSource.groups.length - 1].values[selectRegionIndex][i]);
    }
    console.log(personalY, consumerY);
    // Display last data point (most recent)
    populateIndicators(personalY[[personalY.length - 1]], consumerY[consumerY.length - 1]);
    updateGraph(managerSource.regions[selectRegionIndex].name, personalY, consumerY);
}

function getPeriodMultipler (group) {
  let periodMultipler = 0;
  if (group.period === "month"){
    periodMultipler = 1;
  } else if (group.period === "quarter"){
    periodMultipler = 1 / 3;
  } else if (group.period === "year"){
    periodMultipler = 1 / 12;
  } 
  console.log(group.period)
  return periodMultipler
}