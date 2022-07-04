#if (interactive()) {
  
  library(plotly)
  library(shiny)
  library(reactable)
  library(DT)
  

  
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
  ui <- fluidPage(
    tags$script(
      HTML(
        "
        $(document).on('change', 'input', function(e) {
          console.log(
          $('#DataTables_Table_0').DataTable()
          // .column( 4 )
           .rows().ids()
          )
          let dataset = e.target.dataset;
          //console.log(dataset);
          dataset.value = e.target.value;
          dataset.id = e.target.id;
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
          #reactableOutput("cpi_table")
          DT::dataTableOutput("cpi_table"),
          
          tags$head(
            tags$style(type="text/css", "#cpu_table.recalculating { opacity: 1.0; }"),
            tags$script(HTML(
              "
              var collapsedGroups = [];
              var groupParent = [];
              "
            )),
            tags$style(
              "
              @import url(https://use.fontawesome.com/releases/v6.0.0/css/all.css);
              tr.odd td:first-child,
              tr.even td:first-child {
                padding-left: 4em;
              }
              "
            )
          )
          
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
#}