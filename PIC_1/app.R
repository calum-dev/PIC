library(data.table)
library(shiny)
library(reactable)
library(readr)
library(plotly)
library(dplyr)
library(rsdmx)
library(data.table)

#- PREPERATION----
cpi_groups <- fread("groups4.csv")
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


#- USER INTERFACE ----
ui <- fluidPage(
  tags$script(
    HTML(
      "
      $(document).on('change', 'input', function(e) {
        let dataset = e.target.dataset;
        dataset.value = e.target.value;
        dataset.id = e.target.id;
        console.log(dataset);
         e.stopPropagation()
          Shiny.setInputValue(\"js.input_keyup\", dataset);
      });
      "
    )
  ),
  
  # Application title
  titlePanel("Personal Inflation Calculator"),
  
  fluidRow(
    column(
      12,
      wellPanel(
        actionButton("reset", "Reset input"),
        
        h4("Select your region"),
        selectInput('region', NULL, regions),
        
        h4("Enter your consumption for each group"),
        reactableOutput("cpi_table")
        
      )
    ),
    column(6,
           wellPanel(
             h4("Your personal inflation rate"),
             span(textOutput("pi_rate")),
             tags$head(
               tags$style(
                 "#pi_rate{color: blue;
                                 font-size: 40px;
                                 font-weight: bold;
                                 text-align: center;
                                 }"
               )
             )
           )),
    column(6,
           wellPanel(
             h4(textOutput("cpi_region")),
             span(textOutput("cpi_rate")),
             tags$head(
               tags$style(
                 "#cpi_rate{color: red;
                                 font-size: 40px;
                                 font-weight: bold;
                                 text-align: center;
                                 }"
               )
             )
           )),
    column(12,
           wellPanel(
             h4("Time series"),
             plotlyOutput("graph")
           ))
  )
  
  
)


#- SERVER LOGIC ----
server <- function(input, output) {
  # Setup reactive vars
  rv <- reactiveValues()
  rv$cpi_all_data <- cpi_all_data
  rv$total_consumption <- 0
  rv$filtered_data <-
    cpi_all_data %>% dplyr::filter(REGION == 50 &
                                     LEVEL == 1 & 
                                     MEASURE == 3) %>%
    group_by(INDEX) %>%
    summarise_all(last)
 
  rv$pi_rate_ts <-
    cpi_all_data %>% dplyr::filter(REGION == 50 &
                                     LEVEL == 1 &
                                     MEASURE == 3) %>%
    group_by(TIME_PERIOD) %>%
    summarise(PI_RATE = 0)
  
  
  output$pi_rate <- renderText({
    if (rv$pi_rate_ts$PI_RATE[1] == 0){
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
                                          LEVEL == 1 &
                                          MEASURE == 3) %>%
      group_by(INDEX) %>%
      summarise_all(last)
  })
  
  observeEvent(input$js.input_keyup, {
    id <- input$js.input_keyup$id
    value <- as.numeric(input$js.input_keyup$value)
    message(id, ": ", value)
    rv$cpi_all_data$CONSUMPTION[rv$cpi_all_data$INDEX == id] <-
      value
    
    rv$filtered_data <-
      rv$cpi_all_data %>% dplyr::filter(REGION == input$region &
                                          LEVEL == 1 &
                                          MEASURE == 3) %>%
      group_by(INDEX) %>%
      summarise_all(last)
    
    rv$total_consumption <-
      sum(rv$filtered_data$CONSUMPTION, na.rm = T)
    updateReactable("cpi_table", data = rv$filtered_data)
    
    
    rv$pi_rate_ts <-
      rv$cpi_all_data %>% dplyr::filter(REGION == input$region &
                                          LEVEL == 1 &
                                          MEASURE == 3) %>%
      group_by(TIME_PERIOD) %>%
      summarise(PI_RATE = sum((CONSUMPTION / rv$total_consumption) * obsValue))
    
  })
  
  output$cpi_table <- renderReactable({
    reactable(
      rv$filtered_data %>% select(
        "INDEX",
        "GROUP",
        "SUBGROUP",
        "CLASS",
        "obsValue",
        "CONSUMPTION",
        #"MEASURE",
        "WEIGHT"
      ),
      #groupBy = c("GROUP", "SUBGROUP"),
      striped = TRUE,
      highlight = TRUE,
      pagination = FALSE,
      rowStyle = JS("
          function(rowInfo, state) {
          }
        "),
      defaultColDef = colDef(
        header = function(value)
          gsub(".", " ", value, fixed = TRUE),
        #cell = function(value) format(value, nsmall = 1), #Something strange is going on when enabled
        align = "center",
        minWidth = 70
        #headerStyle = list(background = "#12a09a")
      ),
      columns = list(
        "INDEX" = colDef(show = FALSE),
        "GROUP" = colDef(name = "Group"),
        "SUBGROUP" = colDef(name =  "Sub Group", show = FALSE),
        "CLASS" = colDef(name =  "Expenditure Class", show = FALSE),
        "obsValue" = colDef(name = paste0("Annual inflation in ", rv$filtered_data$TIME_PERIOD[1])),
        "CONSUMPTION" = colDef(
          name = "Your average monthly consumption ($)",
          html = TRUE,
          # aggregate  = "sum",
          # #cell info has expanded bool
          # aggregated = JS(
          #   "
          #     function(cellInfo, state) {
          #       var row = cellInfo.subRows[0];
          #       console.log(state);
          #       //return row[cellInfo.column.id]
          #       //return (row.GROUP + '; ' + row.SUB_GROUP + '; ' + row.EXPENDITURE_CLASS);
          #       cellInfo.expanded = true;
          #       if (cellInfo.expanded) {
          #       console.log(cellInfo);
          #         return '<input class=\"consumption-input\" data-group=\"' + cellInfo.row.group + '\" data-subgroup =\"' + cellInfo.row.subgroup + '\" data-class =\"' + cellInfo.row.class + '\" type=\"number\" value=\"' + cellInfo.value + '\" d=\"fname\" name=\"fname\">'
          #       } else {
          #         return '<input class=\"consumption-input\" data-group=\"' + cellInfo.row.group + '\" data-subgroup =\"' + cellInfo.row.subgroup + '\" data-class =\"' + cellInfo.row.class + '\" type=\"number\" value=\"' + cellInfo.value + '\" d=\"fname\" name=\"fname\" disabled>'
          #       }
          #   }
          #  "
          # ),
          cell = JS(
            "
            function(cellInfo) {
              //console.log(cellInfo);
              return '<input id=\"' + cellInfo.row.INDEX + '\"class=\"consumption-input\" data-group=\"' + cellInfo.row.GROUP + '\" data-subgroup =\"' + cellInfo.row.SUBGROUP + '\" data-class =\"' + cellInfo.row.CLASS + '\" type=\"number\" value=\"' + cellInfo.value + '\" d=\"fname\" name=\"fname\" min=0 value=0 onfocus=\"this.value = null;\" >'
            }
          "
          )
          
        ),
        "WEIGHT" = colDef(
          name = "Comparison to average consumption (%)",
          cell = function(value, index, name)
          {
            user_weight = paste0(fix_nan(
              rv$filtered_data$CONSUMPTION[index] / rv$total_consumption * 100
            ),
            "%")
            cpi_weight = paste0(value, "%")
            div(
              style = list(flexGrow = 1, marginLeft = "8px"),
              #user_weight,
              bar_chart("", width = user_weight, fill = "blue"),
              #cpi_weight,
              bar_chart("", width = cpi_weight, fill = "red")
            )
          }
        )
      )
    )
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

# Run the application
shinyApp(ui = ui, server = server)
