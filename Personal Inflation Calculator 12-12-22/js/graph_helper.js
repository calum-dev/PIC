function buildGraph(sName, xData, tID) {
    var theElement = document.getElementById(tID);
	var rows = [];
	var columns = [
		{ title: 'Quarter' },
		{ title: 'Personal inflation (%)', className: 'text-align-right' },
		{ title: 'All groups CPI (%)', className: 'text-align-right' }
	];	
	for (let x of xData) {
		rows.push([x, 0, 0]);
	}
	
	var table = $('#chart-data-table_J0vCHlqo7x').DataTable({
		paging: false,
		ordering: false,
		searching: false,
		info: false,
		data: rows,
		columns: columns
	});
    
    var template = {
        credits: {
            enabled: false
        },
        title: {
            margin: 80,
            useHTML: true,
            style: {
                color: "#222222",
                fontSize: "1.2rem",
                fontWeight: 600
            }
        },
        plotOptions: {
            series: {
                marker: {
                    radius: 6,
                    fillColor: "#FFFFFF",
                    lineWidth: 3,
                    lineColor: null
                },
                connectNulls: false
            }
        },
        chart: {
            marginTop: 80,
            type: "line",
            style: {
                fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif;"
            },
            height: 550
        },
        colors: [
            "#3d9dd1",
            "#134a71",
            "#de7c13",
            "#901216",
            "#fb5e5b",
            "#553488",
            "#aa83be",
            "#969696",
            "#333333"
        ],
        yAxis: {
            title: {
                style: {
                    color: "#222222",
                    fontSize: "1rem",
                    fontWeight: 600
                },
                text: 'Percentage change (%)'
            },
            labels: {
                style: {
                    color: "#555",
                    fontSize: "14"
                },
                format: "{value}"
            },
            startOnTick: false,
            minPadding: 0.05,
            tickInterval: 1
        },
        xAxis: {
            tickInterval: 12,
            title: {
                style: {
                    color: "#222222",
                    fontSize: "1rem",
                    fontWeight: 600
                },
                text: 'Quarter'
            },
            labels: {
                style: {
                    color: "#555",
                    fontSize: "14"
                }
            },
            categories: xData
        },
        series: [
            {
                name: 'Personal inflation',
            },
            {
                name: sName
            }
        ],
        tooltip: {
            style: {
                fontSize: "14px"
            },
            useHTML: true,
            headerFormat: "<span style=\"font-size: 16px; font-weight:600;\"> {point.key} </span>",
            pointFormatter: function() {
                var tip = `<span style="color:${this.color}">\u25CF</span> ${this.series.name} (%): <b>${Highcharts.numberFormat(this.y, 1)}</b><br/>`;
                return tip;
            }
        },
        legend: {
            align: "center",
            verticalAlign: "bottom",
            layout: "horizontal",
            x: 0,
            y: 0,
            itemStyle: {
                color: "#222222",
                fontSize: "1rem",
                fontWeight: 600
            }
        }
    }

    const tableID = theElement.getAttribute("id");
    const chartID = tableID + "_chart";
    const chartWrapperID = chartID + "_wrapper";
    const tableWrapper = document.querySelector("#" + tableID + "_wrapper");

    const chartTableGroup = tableWrapper.parentNode;

    let chartWrapper = document.createElement('div');

    chartWrapper.setAttribute('role', 'tabpanel');
    chartWrapper.setAttribute('id', chartWrapperID);
    chartWrapper.setAttribute('aria-labelledby', 'tab_graph_' + tableID);
    chartWrapper.classList.add('abs-file-field-chart-wrapper');

    let chartDiv = document.createElement('div')
    chartDiv.setAttribute('id', chartID);
    chartDiv.classList.add('abs-field-field-chart', 'full-print-svg');

    setWidth(chartDiv, "100%");
    setWidth(chartWrapper, "100%");
    chartWrapper.appendChild(chartDiv);

    chartTableGroup.insertBefore(chartWrapper, tableWrapper.nextSibling);

    let tabs = document.createElement('div');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('id', 'chart_toggle_' + tableID);
    tabs.classList.add('chart-tabs');
    tabs.setAttribute('target', tableID);

    let chartButton = document.createElement('button');
    chartButton.setAttribute('id', 'tab_graph_' + tableID);
    chartButton.classList.add('tab', 'graph-tab', 'active');
    chartButton.setAttribute('role', 'tab');
    chartButton.setAttribute('aria-selected', 'true');
    chartButton.setAttribute('aria-controls', chartWrapperID);
    chartButton.setAttribute('tabIndex', 0);
    chartButton.setAttribute('type', 'button');
    chartButton.innerHTML = `<span>Graph</span>`;
    tabs.appendChild(chartButton);

    let tableButton = document.createElement('button');
    tableButton.setAttribute('id', 'tab_table_' + tableID);
    tableButton.classList.add('tab', 'table-tab');
    tableButton.setAttribute('role', 'tab');
    tableButton.setAttribute('aria-selected', 'false');
    tableButton.setAttribute('aria-controls', tableWrapper.getAttribute('id'));
    tableButton.setAttribute('tabIndex', -1);
    tableButton.setAttribute('type', 'button');
    tableButton.innerHTML = `<span>Table</span>`;
    tabs.appendChild(tableButton);

    chartTableGroup.insertBefore(tabs, chartTableGroup.firstChild);

    tableWrapper.setAttribute("role", "tabpanel");
    tableWrapper.setAttribute("aria-labelledby", "tab_table_" + tableID);

    tableWrapper.style.display = 'none';

    var chart = Highcharts.chart(chartID, template);

    chartButton.addEventListener('click', function (event) {
        const theTabButton = this;
        if (theTabButton.classList.contains("active")) {
            event.preventDefault();
            return true;
        }
        toggleTab(theTabButton);
    });
    tableButton.addEventListener('click', function (event) {
        const theTabButton = this;
        if (theTabButton.classList.contains("active")) {
            event.preventDefault();
            return true;
        }
        toggleTab(theTabButton);
    });
    chartButton.addEventListener('keydown', function (event) {
        handleTabArrowKeys(event, this);
    });
    tableButton.addEventListener('keydown', function (event) {
        handleTabArrowKeys(event, this);
    });
    return chart;
}

function toggleDisplay(element) {
	if ( element.style.display == '' || element.style.display == 'block' ) {
	  element.style.display = 'none';
	}
	else{
	  element.style.display = 'block';
	}
}

function toggleTab(tabButton) {
	const tableID = tabButton.parentNode.getAttribute("target");

	// Toggle the display of the tabs.
	toggleDisplay(document.getElementById(tableID + "_wrapper"));
	toggleDisplay(document.getElementById(tableID + "_chart"));

	// Toggle the attributes on the tabs.
	const tabGraph = document.getElementById("tab_graph_" + tableID);
	const tabTable = document.getElementById("tab_table_" + tableID);
	tabGraph.classList.toggle('active');
	tabTable.classList.toggle('active');
	tabGraph.setAttribute('aria-selected', tabGraph.getAttribute('aria-selected') == 'false' ? 'true' : 'false');
	tabTable.setAttribute('aria-selected', tabTable.getAttribute('aria-selected') == 'false' ? 'true' : 'false');
	tabGraph.setAttribute('tabIndex', tabGraph.getAttribute('tabIndex') == '-1' ? '0' : '-1');
	tabTable.setAttribute('tabIndex', tabTable.getAttribute('tabIndex') == '-1' ? '0' : '-1');
}

function handleTabArrowKeys(event, theTabButton) {
	const tableID = theTabButton.parentNode.getAttribute("target");

	const tabGraph = document.getElementById("tab_graph_" + tableID);
	const tabTable = document.getElementById("tab_table_" + tableID);

	switch (event.key) {
	  case 'ArrowLeft': // 'ArrowLeft','Left'
	  case 'ArrowRight': // 'ArrowRight', 'Right'
	    event.preventDefault();
	    if (theTabButton.getAttribute('id') == "tab_table_" + tableID) {
	      tabGraph.click();
	      tabGraph.focus();
	    }
	    else if (theTabButton.getAttribute('id') == "tab_graph_" + tableID) {
	      tabTable.click();
	      tabTable.focus();
	    }
	    break;
	}
}

function setWidth(el, val) {
	if (typeof val === "function") {
	  val = val();
	}
	if (typeof val === "string") {
	  el.style.width = val;
	}
	else {
	  el.style.width = val + "px";
	}
}