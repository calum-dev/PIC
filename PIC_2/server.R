library(data.table)
library(shiny)
library(reactable)
library(readr)
library(plotly)
library(dplyr)
library(rsdmx)
library(data.table)
library(DT)
library(fontawesome)

#- PREPERATION----
# cpi_groups <- fread("groups4.csv")
# #read dsd
# #"https://api.data.abs.gov.au/dataflow/ABS/CPI/1.0.0?references=all"
# dsdUrl <- "abs_cpi_dsd.sdmx"
# dsd <- readSDMX(dsdUrl, isURL=FALSE)
#
# #read dataset
# myUrl <- "test_data.xml"
# dataset <- readSDMX(myUrl, isURL = FALSE, dsd = TRUE)
# dataset <- setDSD(dataset, dsd)
#
# cpi_all_data <- as.data.frame(dataset) %>%  #labels=TRUE
# mutate(INDEX = as.numeric(INDEX))
#
# print(head(cpi_all_data))
# print(head(cpi_groups))
#
# cpi_all_data <-
#   dplyr::full_join(x = cpi_groups, y = cpi_all_data, by = "INDEX")
# print(head(cpi_all_data))
#
# fwrite(cpi_all_data, "cpi_all_data.csv")
cpi_all_data <- fread("cpi_all_data.csv")

regions <- c(
  'Australia (Weighted average)' = 50,
  'Sydney, New South Wales' = 1,
  'Melbourne, Victoria' = 2,
  'Brisbane, Queensland' = 3,
  'Adelaide, South Australia' = 4,
  'Perth, Western Australia' = 5,
  'Hobart, Tasmania' = 6,
  'Darwin, Northern Territory' = 7,
  'Canberra, Australian Capital Territory' = 8
)

bar_chart <-
  function(label,
           width = "100%",
           height = "16px",
           fill = "#00bfc4",
           background = NULL) {
    bar <-
      div(style = list(
        background = fill,
        width = width,
        height = height
      ))
    chart <-
      div(style = list(
        flexGrow = 1,
        marginLeft = "8px",
        background = background
      ),
      bar)
    div(style = list(display = "flex", alignItems = "center"), label, chart)
  }

fix_nan <- function(x) {
  if (is.nan(x)) {
    return (0)
  } else {
    return(x)
  }
}

#- SERVER LOGIC ----
server <- function(input, output) {
  # Setup reactive vars
  rv <- reactiveValues()
  rv$cpi_all_data <- cpi_all_data
  rv$total_consumption <- 0
  # rv$filtered_data <-
  #   cpi_all_data %>% dplyr::filter(REGION == 50 &
  #                                    LEVEL == 1 &
  #                                    MEASURE == 3) %>%
  #   group_by(INDEX) %>%
  #   summarise_all(last)
  
  rv$pi_rate_ts <-
    cpi_all_data %>% dplyr::filter(REGION == 50 &
                                     LEVEL == 1 &
                                     MEASURE == 3) %>%
    group_by(TIME_PERIOD) %>%
    summarise(PI_RATE = 0)
  
  
  output$pi_rate <- renderText({
    if (rv$pi_rate_ts$PI_RATE[1] == 0) {
      "-.-%"
    } else {
      paste0(round(tail(rv$pi_rate_ts$PI_RATE, 1), digits = 1), " %")
    }
    
  })
  
  output$cpi_region <- renderText({
    paste0("CPI: ", names(regions)[which(regions == input$region)])
  })
  
  output$cpi_rate <- renderText({
    rv$cpi_all_groups <-
      cpi_all_data %>% dplyr::filter(INDEX == 10001 &
                                       MEASURE == 3 &
                                       REGION == input$region) %>%
      group_by(INDEX) %>%
      summarise_all(last)
    paste0(rv$cpi_all_groups$obsValue[1], "%")
  })
  
  observeEvent(input$reset, {
    rv$filtered_data$CONSUMPTION <- 0
    rv$pi_rate_ts <- 0
  })
  
  observeEvent(input$region, {
    rv$filtered_data <-
      rv$cpi_all_data %>% dplyr::filter(REGION == input$region &
                                          LEVEL != 0 &
                                          MEASURE == 3) %>%
      group_by(GROUP, SUBGROUP, CLASS) %>%
      summarise_all(last)
    
    rv$proxy <- rv$filtered_data %>% select(
      "GROUP",
      "SUBGROUP",
      "CLASS",
      "obsValue",
      "CONSUMPTION",
      "WEIGHT"
    )
  })
  
  observeEvent(input$js.input_keyup, {
    id <- input$js.input_keyup$id
    value <- as.numeric(input$js.input_keyup$value)
    message(id, ": ", value)
    rv$cpi_all_data$CONSUMPTION[rv$cpi_all_data$INDEX == id] <-
      value
    
    rv$filtered_data <-
      rv$cpi_all_data %>% dplyr::filter(REGION == input$region &
                                          LEVEL != 0 &
                                          MEASURE == 3) %>%
      group_by(INDEX, LEVEL) %>%
      summarise_all(last)
    
    rv$total_consumption <-
      sum(rv$filtered_data$CONSUMPTION, na.rm = T)
    updateReactable("cpi_table", data = rv$filtered_data)
    
    
    rv$pi_rate_ts <-
      rv$cpi_all_data %>% dplyr::filter(REGION == input$region &
                                          #LEVEL == 1 &
                                          MEASURE == 3) %>%
      group_by(TIME_PERIOD) %>%
      summarise(PI_RATE = sum((CONSUMPTION / rv$total_consumption) * obsValue))
    
  })
  
  callback_js <- JS(
    "
    $('tbody').on('change', 'input.user-input',function(e){
     //console.log(this.value)
    });
    
    $('tbody').on('click', 'td.dtrg-group-toggle', function() {
        var name = $(this).data('name');
        collapsedGroups[name] = !collapsedGroups[name];
        table.draw(false);
    });
    
    /*$('tbody').on('change', 'td input', function () {
      //console.log('cell update');
      var val = $(this).val();
      var td = $(this).closest('td');
      var row = table.row( $(td) );
      var data = row.data();
      
      //var myString = val + ': ' + data.School;
      
      table.cell( td ).data(val).draw();

    } );*/
    
    "
  )
  
  startRender_js <- JS(
    "
    function(rows, group, level) {
    
     var consumption = 0;
      
      groupData = rows.data()
      
      console.log(group);
      
      for (let i = 0; i < groupData.length; i++ ){
        let rLevel = 0;
        if (groupData[i][0].length > 0){
          //rLevel ++;
        }
        if (groupData[i][1].length > 0){
          rLevel ++;
        }
        if (groupData[i][2].length > 0){
          rLevel ++;
        }
        console.log('row level: ' + rLevel + ' group level: ' + level);
        if (level == rLevel){
          consumption = consumption + groupData[i][4]
        }
      }
      
      console.log(consumption)
      
      
      //rows.data()[4]=consumption;

     // add to group Parent array
     groupParent[level] = group;

     // new string to build up
     var groupAll = '';


     for (var i = 0; i < level; i++) {
         groupAll += groupParent[i];
         if (collapsedGroups[groupAll]) {
         //console.log(groupAll);
             return;
         }
         //console.log(group, groupAll);
     }

     groupAll += group;


     if ((typeof(collapsedGroups[groupAll]) == 'undefined') || (collapsedGroups[groupAll] === null)) {
         collapsedGroups[groupAll] = true; 
     }

     var collapsed = collapsedGroups[groupAll];

      for (let i = 0; i<rows.nodes().length; i++){
        let r = rows.nodes()[i]
        //if (i != 0){
          r.style.display = (collapsed ? 'none' : '');
        //} else {
          //r.style.display = '';
        //}
      }
      
      var toggleClass = collapsed ? 'fa-plus-square' : 'fa-minus-square';
      var consumptionInput = collapsed ? '<input class=\"user-input\" type=\"text\" data-row=\"'  + '\" data-col=\"'  + '\" value=\"' + consumption + '\">' : 'sum ' + consumption
      //console.log(rows.data())
      
      //$(rows.nodes()[0]).hide();
      /*return $('<tr/>')
        .append('<td>' + '<i class=\"fa fa-fw ' + toggleClass + ' toggler\"></i>' + ' ' + group + '</td>')
        .append('<td>' + rows.data()[0][3] + '</td>')
        .append('<td>' + consumptionInput + '</td>')
        .append('<td>' + rows.data()[0][5] + '</td>')
        .toggleClass('collapsed', collapsed)
        .attr('data-name', groupAll);*/
      
      let parentRow = $(rows.nodes()[0]);
      
      parentRow.show()
        .toggleClass('collapsed', collapsed)
        .attr('data-name', groupAll)
      parentRow.children('td:first')
         .prepend('<i class=\"fa fa-fw ' + toggleClass + ' toggler\"></i>')
         .attr('data-name', groupAll)
         .removeClass()
         .addClass('dtrg-group-toggle')
         .css('background-color', 'red')
         .show()
      
      if (collapsed){
        parentRow.children('td:nth-child(3)')
          .find('input:first')
          .val(consumption)
          .prop('disabled', false)
      } else {
        //parentRow.children('td:nth-child(3)').html('hello there')
        parentRow.children('td:nth-child(3)')
          .find('input:first')
          .val(consumption)
          .prop('disabled', true)
      }
      
         
         
      return parentRow
    }
    "
  )
  
  # Column 1 group label renderer
  colRenderer0_js <- JS(
    "
    function (data, type, row, meta) {
    //console.log(type)
    let _group = row[0];
    let _subgroup = row[1];
    let _class = row[2];
    
    if (_class.length > 0) {
      return _class;
    } else if(_subgroup.length > 0){
      return _subgroup;
    } else {
      return _group
    }
    
    }
    "
  )
  
  
  colRenderer2_js <- JS(
    "
    function (data, type, row, meta) {
    //console.log(data);
    //if(collapsedGroups)
        var _row = meta.row;
        var _col = meta.col;
        return '<input class=\"user-input\" type=\"text\" data-row=\"' + _row + '\" data-col=\"' + _col + '\" value=\"' + data + '\">';
      return data;
    }
    "
  )
  
  
  output$cpi_table <- DT::renderDataTable(
    isolate(rv$proxy),
    editable = TRUE,
    rownames = FALSE,
    style = 'bootstrap5',
    extensions = 'RowGroup',
    
    options = list(
      
      columnDefs  = list(
        list(
             visible = FALSE,
             targets = c(1, 2)
        ),
        list(
            render = colRenderer0_js,
            targets = c(0)
        ),
        list(targets = c(4),
             #defaultContent: '',
             render = colRenderer2_js
             ),
        list(
          orderable = FALSE,
          targets = c(0, 1, 2, 3, 4)
        )
      ),
      
      pageLength = 1000,
      rowGroup = list(dataSrc = c(0, 1),
                      startRender = startRender_js),
      order = c(c(1, 'asc')),
      dom = 't',
      ordering = 2
    ),
    callback = callback_js,
    selection = 'none',
    
    server = TRUE
    
  )
  
  proxy = dataTableProxy('cpi_table')
  
  # observeEvent(input$cpi_table_cell_edit, {
  #   row <- input$cpi_table_cell_edit$row
  #   col <- input$cpi_table_cell_edit$col + 1 # subtract 1 to correct for names col being disabled
  #   rv$proxy[row, col] <- as.numeric(input$cpi_table_cell_edit$value)
  #   DT::replaceData(proxy, rv$proxy, rownames=FALSE)
  # })
  
  observeEvent(input$js.input_keyup, {
    row <- as.numeric(input$js.input_keyup$row) + 1
    col <- as.numeric(input$js.input_keyup$col) + 1 # subtract 1 to correct for names col being disabled
    value <- as.numeric(input$js.input_keyup$value)
    message("r", row, "c", col, ": ", value)
    rv$proxy[row, col] <- value
    DT::replaceData(proxy, rv$proxy, rownames=FALSE)
  })

  
  output$graph <- renderPlotly({
    cpi_all_groups <-
      rv$cpi_all_data %>% dplyr::filter(REGION == input$region &
                                          INDEX  == 10001 &
                                          MEASURE == 3)
    cpi_all_groups_50 <-
      rv$cpi_all_data %>% dplyr::filter(REGION == 50 &
                                          INDEX  == 10001 &
                                          MEASURE == 3)
    
    cpi_graph <- plotly::plot_ly(
      x = rv$pi_rate_ts$TIME_PERIOD,
      y = rv$pi_rate_ts$PI_RATE,
      type = 'scatter',
      mode = 'lines',
      name = 'Personal inflation rate',
      line = list(
        width = 2.5,
        dash = 'dash',
        color = "blue"
      )
    )
    
    cpi_graph <- plotly::add_trace(
      cpi_graph,
      x = cpi_all_groups$TIME_PERIOD,
      y = cpi_all_groups$obsValue,
      type = 'scatter',
      mode = 'lines',
      name = paste0("CPI: ", names(regions)[which(regions == input$region)]),
      line = list(
        width = 2.5,
        dash = 'solid',
        color = "red"
      )
    )
    
    if (input$region != 50) {
      cpi_graph <- plotly::add_trace(
        cpi_graph,
        x = cpi_all_groups_50$TIME_PERIOD,
        y = cpi_all_groups_50$obsValue,
        type = 'scatter',
        mode = 'lines',
        name = 'CPI: Australia (weighted agerage)',
        line = list(
          width = 2.5,
          dash = 'solid',
          color = "grey"
        )
      )
    }
    
    cpi_graph <- plotly::layout(cpi_graph,
                                legend = list(
                                  orientation = "h",
                                  # show entries horizontally
                                  xanchor = "center",
                                  # use center of legend as anchor
                                  x = 0.5
                                ))
    
    
  })
  
  
}

#   renderReactable({
#   reactable(
#     rv$filtered_data %>% select(
#       "INDEX",
#       "GROUP",
#       "SUBGROUP",
#       "CLASS",
#       "obsValue",
#       "CONSUMPTION",
#       #"MEASURE",
#       "WEIGHT"
#     ),
#     selection = "multiple",
#     defaultSelected = c(1, 3),
#     groupBy = c("GROUP"),
#     striped = TRUE,
#     highlight = TRUE,
#     pagination = FALSE,
#     rowStyle = JS("
#         function(rowInfo, state) {
#         }
#       "),
#     defaultColDef = colDef(
#       header = function(value)
#         gsub(".", " ", value, fixed = TRUE),
#       #cell = function(value) format(value, nsmall = 1), #Something strange is going on when enabled
#       align = "center",
#       minWidth = 70
#       #headerStyle = list(background = "#12a09a")
#     ),
#     columns = list(
#       "INDEX" = colDef(show = TRUE),
#       "GROUP" = colDef(name = "Group"),
#       "SUBGROUP" = colDef(name =  "Sub Group", show = TRUE),
#       "CLASS" = colDef(name =  "Expenditure Class", show = TRUE),
#       "obsValue" = colDef(name = paste0("Annual inflation in ", rv$filtered_data$TIME_PERIOD[1])),
#       "CONSUMPTION" = colDef(
#         name = "Your average monthly consumption ($)",
#         html = TRUE,
#         # aggregate  = "sum",
#         # #cell info has expanded bool
#         # aggregated = JS(
#         #   "
#         #     function(cellInfo, state) {
#         #       var row = cellInfo.subRows[0];
#         #       console.log(state);
#         #       //return row[cellInfo.column.id]
#         #       //return (row.GROUP + '; ' + row.SUB_GROUP + '; ' + row.EXPENDITURE_CLASS);
#         #       cellInfo.expanded = true;
#         #       if (cellInfo.expanded) {
#         #       console.log(cellInfo);
#         #         return '<input class=\"consumption-input\" data-group=\"' + cellInfo.row.group + '\" data-subgroup =\"' + cellInfo.row.subgroup + '\" data-class =\"' + cellInfo.row.class + '\" type=\"number\" value=\"' + cellInfo.value + '\" d=\"fname\" name=\"fname\">'
#         #       } else {
#         #         return '<input class=\"consumption-input\" data-group=\"' + cellInfo.row.group + '\" data-subgroup =\"' + cellInfo.row.subgroup + '\" data-class =\"' + cellInfo.row.class + '\" type=\"number\" value=\"' + cellInfo.value + '\" d=\"fname\" name=\"fname\" disabled>'
#         #       }
#         #   }
#         #  "
#         # ),
#         cell = JS(
#           "
#           function(cellInfo) {
#             //console.log(cellInfo);
#             return '<input id=\"' + cellInfo.row.INDEX + '\"class=\"consumption-input\" data-group=\"' + cellInfo.row.GROUP + '\" data-subgroup =\"' + cellInfo.row.SUBGROUP + '\" data-class =\"' + cellInfo.row.CLASS + '\" type=\"number\" value=\"' + cellInfo.value + '\" d=\"fname\" name=\"fname\" min=0 value=0 onfocus=\"this.value = null;\" >'
#           }
#         "
#         )
#
#       ),
#       "WEIGHT" = colDef(
#         name = "Comparison to average consumption (%)",
#         cell = function(value, index, name)
#         {
#           user_weight = paste0(fix_nan(
#             rv$filtered_data$CONSUMPTION[index] / rv$total_consumption * 100
#           ),
#           "%")
#           cpi_weight = paste0(value, "%")
#           div(
#             style = list(flexGrow = 1, marginLeft = "8px"),
#             #user_weight,
#             bar_chart("", width = user_weight, fill = "blue"),
#             #cpi_weight,
#             bar_chart("", width = cpi_weight, fill = "red")
#           )
#         }
#       )
#     )
#   )
# })
