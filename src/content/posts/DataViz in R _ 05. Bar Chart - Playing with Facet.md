---
author: Mindx
pubDate: 2023-06-01T01:00:00+07:00
title: "DataViz in R | 05. Bar Chart - Playing with Facet"
image: "@assets/05-Bar-char-facet/6.1.7_Bar_char_Facet.svg"

category: 'ggplot'
draft: false
tags:
- dataviz
- learning
description: "Let's play with facet and theming"

---


## Target result

http://www.datavisualisation-r.com/pdf/barcharts_multiple_all_grouped.pdf

Long time no see.Today's target seems weird but I would like to challenge myself to become proficient in ggplot.


```r
#Load extra font first to avoid geom_text font error
library(extrafont)
#Load neccessary lib
library(ggplot2)
library(dplyr)
#Setting width and height. This graph has very long height

options(repr.plot.width=10, repr.plot.height=12)
theme_set(theme_minimal(base_family = "Lato Light"))
```
   

The data originate from a survey on the international comparison of school
performance study by the Programme for International Student Assessment (PISA)
from 2009. This survey, conducted on behest of the Organisation for Economic Co-
operation and Development (OECD), recorded the abilities of 15-year-old students
in the areas of reading competency, mathematical competency, and scientiﬁc
competency in the OECD states and in 33 OECD partner countries. Since 2000, the
survey has been conducted every 3 years.

Searching through the official website of OECD does not return any downloadable dataset.
Fortunately, someone made it as a package since 11 years ago: https://github.com/jbryer/pisa. 
We take the `pisa.student.rda` dataset and start the work. 

*Note: We can dive into PISA 2018 data at here: https://www.oecd.org/pisa/data/2018database/*

We tried to use `readRDS` function but it returns `unknown input format`.
Thus we use the traditional `load` function. However, unlike `readRDS` which 
convert directly to a dataframe, `load()` does not return the object.

It produces a side effect where the objects saved in the file are loaded into the environment.
Assigning the `load` to a variable and we have the data loaded `pisa.student` and `pisa.catalog.student`.


```r
#Load data
load("./myData/pisa-master/data/pisa.student.rda")
```


```r
#Calling our dataframe
head(pisa.student)
```

<DataFrame>
 <caption>A data.frame: 6 × 305</caption>
|   | CNT     | COUNTRY | OECD     | SUBNATIO | SCHOOLID | StIDStd | ST01Q01 | ST02Q01 | ST03Q02 | ST03Q03 | ⋯ | PV4READ | PV5READ | PV1SCIE | PV2SCIE | PV3SCIE | PV4SCIE | PV5SCIE | W_FSTUWT | TESTLANG | CNTFAC |
| - | ------- | ------- | -------- | -------- | -------- | ------- | ------- | ------- | ------- | ------- | - | ------- | ------- | ------- | ------- | ------- | ------- | ------- | -------- | -------- | ------ |
|   | **fct**   | **fct**   | **fct**    | **fct**    | **fct**    | **fct**   | **fct**   | **fct**   | **fct**   | **fct**   | ⋯ | **dbl**   | **dbl**   | **dbl**   | **dbl**   | **dbl**   | **dbl**   | **dbl**   | **dbl**    | **fct**    | **dbl**  |
| 1 | Albania | Albania | Non-OECD | Albania  | 1        | 1       | NA      | NA      | 3       | NA      | ⋯ | 291.86  | 242.16  | 359.7   | 280.44  | 323.33  | 383.01  | 364.36  | 5.4037   | ALBANIAN | 0.0293 |
| 2 | Albania | Albania | Non-OECD | Albania  | 1        | 2       | NA      | NA      | 1       | NA      | ⋯ | 216.02  | 320.24  | 277.08  | 227.66  | 261.23  | 291.07  | 341.42  | 5.4037   | ALBANIAN | 0.0293 |
| 3 | Albania | Albania | Non-OECD | Albania  | 1        | 3       | NA      | NA      | 6       | NA      | ⋯ | 399.6   | 418.04  | 420.68  | 461.71  | 414.16  | 442.13  | 421.62  | 5.4037   | ALBANIAN | 0.0293 |
| 4 | Albania | Albania | Non-OECD | Albania  | 1        | 4       | NA      | NA      | 9       | NA      | ⋯ | 446.51  | 460.81  | 454.81  | 448.28  | 420.31  | 439.89  | 445.49  | 5.7039   | ALBANIAN | 0.0293 |
| 5 | Albania | Albania | Non-OECD | Albania  | 1        | 5       | NA      | NA      | 7       | NA      | ⋯ | 372.95  | 395.99  | 428.7   | 411.92  | 394.2   | 413.78  | 415.65  | 5.7039   | ALBANIAN | 0.0293 |
| 6 | Albania | Albania | Non-OECD | Albania  | 1        | 6       | NA      | NA      | 9       | NA      | ⋯ | 506.63  | 505.83  | 549.37  | 585.73  | 585.73  | 535.38  | 509.27  | 5.4037   | ALBANIAN | 0.0293 |
</DataFrame>




```r
dim(pisa.student)
```

` 475460 · 305 `




```r
unique(pisa.student$COUNTRY)
```


<DataFrame>
|Output|
|---|
| Albania · Argentina · Australia · Austria · Azerbaijan · Belgium · Bulgaria · Brazil · Canada · Switzerland · Chile · Colombia · Czech  · Republic · Germany · Denmark · Spain · Estonia · Finland · France · United  · Kingdom · Greece · Hong Kong-China · Croatia · Hungary · Indonesia · Ireland · Iceland · Israel · Italy · Jordan · Japan · Kazakhstan · Kyrgyzstan · Korea · Liechtenstein · Lithuania · Luxembourg · Latvia · Macao-China · Mexico · Montenegro · Netherlands · Norway · New Zealand · Panama · Peru · Poland · Portugal · Dubai (UAE) · Qatar · Shanghai-China · Romania · Russian  · Federation · Singapore · Serbia · Slovak  · Republic · Slovenia · Sweden · Chinese  · Taipei · Thailand · Trinidad and Tobago · Tunisia · Turkey · Uruguay · United States
Levels:
'Albania '· 'Azerbaijan '· 'Argentina '· 'Australia '· 'Austria '· 'Belgium '· 'Brazil '· 'Bulgaria '· 'Canada '· 'Chile '· 'Shanghai-China '· 'Chinese Taipei '· 'Colombia '· 'Croatia '· 'Czech Republic '· 'Denmark '· 'Estonia '· 'Finland '· 'France '· 'Germany '· 'Greece '· 'Hong Kong-China '· 'Hungary '· 'Iceland '· 'Indonesia '· 'Ireland '· 'Israel '· 'Italy '· 'Japan '· 'Kazakhstan '· 'Jordan '· 'Korea '· 'Kyrgyzstan '· 'Latvia '· 'Liechtenstein '· 'Lithuania '· 'Luxembourg '· 'Macao-China '· 'Mexico '· 'Montenegro '· 'Netherlands '· 'New Zealand '· 'Norway '· 'Panama '· 'Peru '· 'Poland '· 'Portugal '· 'Qatar '· 'Romania '· 'Russian Federation '· 'Serbia '· 'Singapore '· 'Slovak Republic '· 'Slovenia '· 'Spain '· 'Sweden '· 'Switzerland '· 'Thailand '· 'Trinidad and Tobago '· 'Dubai (UAE) '· 'Tunisia '· 'Turkey '· 'United Kingdom '· 'United States '· 'Uruguay' |


</DataFrame>

Because our graph only represents the data for the USA, Canada and Mexico (USMCA), we filtered it and compared the total number of respondents in the book (66,690). In addition, there are more than 300 questions but our graph extracted only the items of question group 28, i.e variables whose name starts with **“ST24Q”** (or 11 questions based on the targeted result image).


```r
pisa <- pisa.student %>% 
    dplyr::filter(COUNTRY %in% c('United States', 'Canada', 'Mexico')) %>%
    select(2,5, starts_with("ST24Q"))
dim(pisa)
head(pisa)
```

`66690 · 13`

<DataFrame>
<caption>A data.frame: 6 × 13</caption>
|   | COUNTRY | SCHOOLID | ST24Q01           | ST24Q02           | ST24Q03           | ST24Q04           | ST24Q05           | ST24Q06           | ST24Q07           | ST24Q08           | ST24Q09           | ST24Q10           | ST24Q11           |
| - | ------- | -------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- | ----------------- |
|   | **fct**   | **fct**    | **fct**             | **fct**             | **fct**             | **fct**             | **fct**             | **fct**             | **fct**             | **fct**             | **fct**             | **fct**             | **fct**             |
| 1 | Canada  | 1        | Disagree          | Strongly agree    | Strongly agree    | Strongly disagree | Strongly agree    | Strongly disagree | Agree             | Disagree          | Strongly disagree | Agree             | Agree             |
| 2 | Canada  | 1        | Agree             | Strongly disagree | Strongly disagree | Strongly agree    | Strongly disagree | Agree             | Strongly disagree | Agree             | Strongly agree    | Strongly disagree | Strongly disagree |
| 3 | Canada  | 1        | Strongly agree    | Strongly disagree | Strongly disagree | Agree             | Strongly disagree | Strongly agree    | Strongly disagree | Agree             | Disagree          | Disagree          | Strongly disagree |
| 4 | Canada  | 1        | Disagree          | Disagree          | Agree             | Strongly disagree | Disagree          | Disagree          | Agree             | Strongly disagree | Strongly disagree | Agree             | Agree             |
| 5 | Canada  | 1        | Strongly disagree | Disagree          | Strongly disagree | Disagree          | Strongly disagree | Disagree          | Disagree          | Agree             | Agree             | Agree             | Strongly disagree |
| 6 | Canada  | 1        | Agree             | Strongly disagree | Strongly disagree | Agree             | Strongly disagree | Agree             | Strongly disagree | Agree             | Strongly agree    | Strongly disagree | Strongly disagree |
</DataFrame>



```r
load("./myData/pisa-master/data/pisa.catalog.student.rda")
```


```r
#Get the desc of questions
#Check type of `pisa.catalog.student`
dim(pisa.catalog.student)
is.vector(pisa.catalog.student)
```


`NULL`
`TRUE`



```r
#Using grep as regex searching with ^
#unname return the value of vector only
pisa.catalog.student[grep("^ST24Q", names(pisa.catalog.student))]
```

<DataFrame>
|Output|
|---|
| ST24Q01:
    'Read Attitude - Only if I have to'
ST24Q02:
    'Read Attitude - Favourite hobbies'
ST24Q03:
    'Read Attitude - Talk about books'
ST24Q04:
    'Read Attitude - Hard to finish'
ST24Q05:
    'Read Attitude - Happy as present'
ST24Q06:
    'Read Attitude - Waste of time'
ST24Q07:
    'Read Attitude - Enjoy library'
ST24Q08:
    'Read Attitude - Need information'
ST24Q09:
    'Read Attitude - Cannot sit still'
ST24Q10:
    'Read Attitude - Express opinions'
ST24Q11:
    'Read Attitude - Exchange |
</DataFrame>

```r
#But the question description for our plot need to be written in a full insightful sentence
#So the above code is for the purpose of checking only

question_desc <- c("I read only if I have to.",
                        "Reading is one of my favorite hobbies.",
                        "I like talking about books with other people.",
                        "I find it hard to finish books.",
                        "I feel happy if I receive a book as a present.",
                        "For me, reading is a waste of time.",
                        "I enjoy going to a bookstore or a library.",
                        "I read only to get information that I need.",
                        "I cannot sit still and read for more than a few minutes.",
                        "I like to express my opinions about books I have read.",
                        "I like to exchange books with my friends.")
names(question_desc) <- paste0("ST24Q", sprintf("%02d", 1:11))

question_desc
```

<DataFrame>
|Output|
|---|
| ST24Q01
    'I read only if I have to.'
ST24Q02
    'Reading is one of my favorite hobbies.'
ST24Q03
    'I like talking about books with other people.'
ST24Q04
    'I find it hard to finish books.'
ST24Q05
    'I feel happy if I receive a book as a present.'
ST24Q06
    'For me, reading is a waste of time.'
ST24Q07
    'I enjoy going to a bookstore or a library.'
ST24Q08
    'I read only to get information that I need.'
ST24Q09
    'I cannot sit still and read for more than a few minutes.'
ST24Q10
    'I like to express my opinions about books I have read.'
ST24Q11
    'I like to exchange books with my friends.' |
</DataFrame>

Now we need to make our data readable by ggplot, or switch it into a longer form using `pivot_longer()`


```r
library(tidyr)
```


```r
pisa_longer <- pisa %>%
    pivot_longer(cols=c(-1,-2), names_to = "Question", values_to = "Answer") %>%
    #We dropped SCHOOLID here
    group_by(COUNTRY, Question, Answer, .add=T) %>%
    #the default .add=FALSE in group_by() will override existing groups.
    summarize(Count = n(), .groups = 'drop') %>%
    #We dropped NA Answer here
    filter(Answer != 'NA')

head(pisa_longer, 10)
```


<DataFrame>
<caption>A tibble: 10 × 4</caption>
| COUNTRY | Question | Answer            | Count |
| ------- | -------- | ----------------- | ----- |
| **fct**   | **chr**    | **fct**             | **int** |
| Canada  | ST24Q01  | Strongly disagree | 5807  |
| Canada  | ST24Q01  | Disagree          | 7938  |
| Canada  | ST24Q01  | Agree             | 5623  |
| Canada  | ST24Q01  | Strongly agree    | 3229  |
| Canada  | ST24Q02  | Strongly disagree | 6052  |
| Canada  | ST24Q02  | Disagree          | 7953  |
| Canada  | ST24Q02  | Agree             | 5568  |
| Canada  | ST24Q02  | Strongly agree    | 3028  |
| Canada  | ST24Q03  | Strongly disagree | 5697  |
| Canada  | ST24Q03  | Disagree          | 7154  |

</DataFrame>


```r
#Create percentage column
pisa_617 <- pisa_longer %>%
    group_by(COUNTRY, Question, .add=T) %>%
    mutate(Perc = Count / sum(Count))

head(pisa_617, 10)
```


<DataFrame>
<caption>A grouped_df: 10 × 5</caption>
| COUNTRY | Question | Answer            | Count | Perc      |
| ------- | -------- | ----------------- | ----- | --------- |
| **fct**   | **chr**    | **fct**             | **int** | **dbl**     |
| Canada  | ST24Q01  | Strongly disagree | 5807  | 0.256981  |
| Canada  | ST24Q01  | Disagree          | 7938  | 0.3512856 |
| Canada  | ST24Q01  | Agree             | 5623  | 0.2488383 |
| Canada  | ST24Q01  | Strongly agree    | 3229  | 0.1428951 |
| Canada  | ST24Q02  | Strongly disagree | 6052  | 0.2677758 |
| Canada  | ST24Q02  | Disagree          | 7953  | 0.3518871 |
| Canada  | ST24Q02  | Agree             | 5568  | 0.2463608 |
| Canada  | ST24Q02  | Strongly agree    | 3028  | 0.1339764 |
| Canada  | ST24Q03  | Strongly disagree | 5697  | 0.2522917 |
| Canada  | ST24Q03  | Disagree          | 7154  | 0.316815  |
</DataFrame>




```r
#The main idea is using the facet element

pisa_617 %>%
ggplot(aes(x=Perc, y=COUNTRY)) + 
    geom_col(mapping=aes(fill=Answer), position = position_stack(reverse = TRUE)) +
    facet_grid(Question ~ .)
```


    
![png](@assets/05-Bar-char-facet/output_18_0.png)


```r
#Create custom color vector based on origin graph(using eye-dropper)
color_pisa <- c("Strongly agree" = "#8b8878", 
               "Agree" = "#fff8dc", 
               "Disagree" = "#ffb6c1", 
               "Strongly disagree" = "#8b475d")
```


```r
pisa_617 %>%
ggplot(aes(x=Perc, y=COUNTRY)) + 
    geom_col(mapping=aes(fill=Answer), position = position_stack(reverse = TRUE)) +
    scale_fill_manual(values=color_pisa) +
    scale_y_discrete(labels=function(x) paste0(x, "-")) +
    facet_grid(Question ~ .)
```


    
![png](@assets/05-Bar-char-facet/output_20_0.png)
    


We try to edit the y - label by creating a new column.


```r
pisa_test <- pisa_617 %>%
    group_by(COUNTRY, Question, .add=T) %>%
    mutate(neg_perc = sprintf("%.0f%%",sum(Count[Answer %in% c("Strongly disagree", "Disagree")]) / sum(Count) * 100)
          )
head(pisa_test,10)
```

<DataFrame>

<caption>A grouped_df: 10 × 6</caption>
| COUNTRY | Question | Answer            | Count | Perc      | neg_perc |
| ------- | -------- | ----------------- | ----- | --------- | -------- |
| **fct**   | **chr**    | **fct**             | **int** | **dbl**     | **chr**    |
| Canada  | ST24Q01  | Strongly disagree | 5807  | 0.256981  | 61%      |
| Canada  | ST24Q01  | Disagree          | 7938  | 0.3512856 | 61%      |
| Canada  | ST24Q01  | Agree             | 5623  | 0.2488383 | 61%      |
| Canada  | ST24Q01  | Strongly agree    | 3229  | 0.1428951 | 61%      |
| Canada  | ST24Q02  | Strongly disagree | 6052  | 0.2677758 | 62%      |
| Canada  | ST24Q02  | Disagree          | 7953  | 0.3518871 | 62%      |
| Canada  | ST24Q02  | Agree             | 5568  | 0.2463608 | 62%      |
| Canada  | ST24Q02  | Strongly agree    | 3028  | 0.1339764 | 62%      |
| Canada  | ST24Q03  | Strongly disagree | 5697  | 0.2522917 | 57%      |
| Canada  | ST24Q03  | Disagree          | 7154  | 0.316815  | 57%      |

</DataFrame>


```r
pisa_test %>%
ggplot(aes(x=Perc, y=COUNTRY)) + 
    geom_col(mapping=aes(fill=Answer), position = position_stack(reverse = TRUE)) +
    scale_fill_manual(values=color_pisa) +
    geom_text(data=pisa_test, mapping=aes(x=-0.05, y=COUNTRY, label=neg_perc), size=3, hjust=1) +
    facet_grid(Question ~ .)
```


    
![png](@assets/05-Bar-char-facet/output_23_0.png)
    


The problem arises, because the `neg_perc` was drawn 4 times for each country in each question. It makes the text seems bolder and aliasing. The proposed solution I found from ChatGPT is to create another column contains the desired labels (eg. `Canada - 61%`), but it was plotted 4 times repeatedly again.

In general, I think those are not a elegant solutions and waste of memory. So I will try to use the setting `scale_y_discrete` with custom function as below.


```r
my_function <- function(breaks) {
    result <- pisa_test %>% 
    group_by(COUNTRY, Question) %>%
    summarise(Percentage_Disagree = round(sum(Count[Answer %in% c("Strongly disagree", "Disagree")]) / sum(Count) * 100,0),
              .groups = 'drop')
    labels <- paste0(breaks, " - ", result$Percentage_Disagree,"%")
  return(labels)
}
```


```r
my_function(c('Canada', 'Mexico'))
```

```
'Canada - 61%''Mexico - 62%''Canada - 57%''Mexico - 72%''Canada - 50%''Mexico - 76%''Canada - 48%''Mexico - 61%''Canada - 76%''Mexico - 47%''Canada - 60%''Mexico - 59%''Canada - 52%''Mexico - 53%''Canada - 61%''Mexico - 43%''Canada - 88%''Mexico - 54%''Canada - 44%''Mexico - 77%''Canada - 37%''Mexico - 52%''Canada - 50%''Mexico - 70%''Canada - 59%''Mexico - 69%''Canada - 62%''Mexico - 74%''Canada - 47%''Mexico - 53%''Canada - 71%''Mexico - 49%''Canada - 66%'
```

However, the problem with `breaks` parameter in `scale_y_discrete(labels = my_function)` is:
- For each **facet** `Question`, breaks will return a **vector** naming the label y - `COUNTRY`. And that's all.
- So for all `Question`, we have the same `breaks` vector, which is `c('United States', 'Mexico', 'Canada')`
- Regardless of what we try in the custom `my_function`, our function will never know what exactly the `Question` are, given the useless of Mr. `breaks`
- As a result, we can not concatenate the specific percentage of each **facet** as in the targeted result.

So, I think we should move to solution using `geom_text` with `axis.text.y = element_blank()` in theme to turn of the labels of y-axis.


```r
pisa_label <- pisa_617 %>%
    group_by(COUNTRY, Question, .add=T) %>%
    summarize(neg_perc = sum(Count[Answer %in% c("Strongly disagree", "Disagree")]) / sum(Count) * 100,
             .groups = "drop") %>%
    mutate(right_labels = sprintf("%.0f%%", 100 - neg_perc),
           left_labels = paste0(COUNTRY, " - ", sprintf("%.0f%%", neg_perc)))
head(pisa_label)
```


<DataFrame>
<caption>A tibble: 6 × 5</caption>
| COUNTRY | Question | neg_perc | right_labels | left_labels  |
| ------- | -------- | -------- | ------------ | ------------ |
| **fct**   | **chr**    | **dbl**    | **chr**        | **chr**        |
| Canada  | ST24Q01  | 60.82666 | 39%          | Canada - 61% |
| Canada  | ST24Q02  | 61.96628 | 38%          | Canada - 62% |
| Canada  | ST24Q03  | 56.91068 | 43%          | Canada - 57% |
| Canada  | ST24Q04  | 71.77194 | 28%          | Canada - 72% |
| Canada  | ST24Q05  | 50.13961 | 50%          | Canada - 50% |
| Canada  | ST24Q06  | 75.72334 | 24%          | Canada - 76% |
</DataFrame>


```r
p1 <-
pisa_617 %>%
ggplot(aes(x=Perc, y=COUNTRY)) + 
    #geom_col creates bar and customize bar color
    geom_col(mapping=aes(fill=Answer), color = "black", linewidth = 0.2, width = 0.8, position = position_stack(reverse = TRUE)) +
    scale_fill_manual(values=color_pisa) +
    #break into facet, but use facet_wrap instead of facet_grid to modify position of strip text
    facet_wrap(Question ~ ., nrow = 11, strip.position = "top",
               labeller = as_labeller(question_desc)) +
    
    #custom label, on the left and the right
    geom_text(data=pisa_label, mapping=aes(x=-0.01, y=COUNTRY, label=left_labels), size=3, hjust=1, family = "Lato Light") +
    geom_text(data=pisa_label, mapping=aes(x=1.01, y=COUNTRY, label=right_labels), size=3, hjust=0, family = "Lato Light") +
       
    #Add custom axis by geom_segment
    geom_segment(data=data.frame(x = 0, xend = 1, y = 0, yend = 0, Question = "ST24Q11"),
               aes(x=x,y=y,yend=yend,xend=xend), inherit.aes=FALSE)+

    #To move the panel area to the right, we increase the xlim while limiting the display label
    coord_cartesian(xlim=c(-0.1,1), clip="off")
                       
p1
```


    
![png](@assets/05-Bar-char-facet/output_29_0.png)
    



```r
#Formating
p1  +
    #Title
    labs(x=NULL, y=NULL,
         title="Reading attitude",
         subtitle = "How much do you disagree or agree with these statements about reading?",
         caption= "Source: PISA 2009 Assessment Framework - Key Competencies in Reading, Mathematics, and Science
                    \n © OECD 2009, Data: bryer.org") +
    #Labelling x-axis 
    scale_x_continuous(breaks = seq(0, 1, 0.25), labels= function(x) round(abs(x)*100,0)) +
    #Add padding between bar and x-axis
    scale_y_discrete(expand = expansion(add = .8)) +
    #Theme element
    theme(axis.text.y = element_blank(),
          panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          #strip text aligned with the bar. 
          #Don't know the relationship btw l=30 and l=50
          strip.text.x = element_text(hjust = 0, size = 3 *14/5,
                                      margin = margin(l=90)),
          legend.position = "bottom",
          legend.title = element_blank(),
          plot.caption = element_text(face="italic"),
          plot.title.position = "plot",
          plot.title = element_text(size = 20, family="Lato Black"),
          #Add some margin to final svg output
          plot.margin = margin(t=10, l=10),
          #Show the x-axis line and ticks
          axis.ticks.x = element_line(color = "black"),
          legend.spacing.x = unit(50, "pt"),
          #Increase the distance between legend keys
          legend.text = element_text(margin = margin(l = -40)),
         )
```


    
![png](@assets/05-Bar-char-facet/output_30_0.png)
    


Note: I found some useful tips in below links:
- Naming facet - labeller using another vector: https://stackoverflow.com/questions/3472980/how-to-change-facet-labels
- `element_text()`: https://ggplot2.tidyverse.org/reference/element.html?q=margin#null
- Alignment of Plot title: https://stackoverflow.com/questions/25401111/left-adjust-title-in-ggplot2-or-absolute-position-for-ggtitle
- Play with the facet axis line by using library `lemon`: https://cran.r-project.org/web/packages/lemon/vignettes/facet-rep-labels.html
- Add some padding around the data to ensure that they are placed some distance away from the axes: https://ggplot2.tidyverse.org/reference/scale_discrete.html
- example for using expansion vector: https://ggplot2.tidyverse.org/reference/expansion.html
- No easy way to manipulate the axis length, without external package (Apr'23): https://stackoverflow.com/questions/76091540/ggplot-axis-change-total-length, so I use geom_segment instead
- Add geom_segment to the last facet only: https://stackoverflow.com/questions/24578352/add-a-segment-only-to-one-facet-using-ggplot2. Unfortunately, we need to create a separate dataframe for the segment.
- And why size of 10 in geom_text() is different from that in theme(text=element_text()): https://stackoverflow.com/questions/25061822/ggplot-geom-text-font-size-control. The ratio is **14/5**. 1 point is 1/72 inch=0.35mm, so 1 in geom_text() is 1mm, 1/0.35 =~ 14/5
- Changing the font for geom_text: https://stackoverflow.com/questions/14733732/cant-change-fonts-in-ggplot-geom-text


```r
#As we set the option of IRKernel at 10 x 12 inches, we set the same para for ggsave
ggsave("6.1.7 Bar char Grouping all responses.svg", last_plot(), device=svg, width = 10, height = 12, units="in")
```
SVG image result (Open in new tab to zoom in)
![Barchart Facet Starter](@assets/05-Bar-char-facet/6.1.7_Bar_char_Facet.svg)

TODO:
- [x] Change geom_text to annotate for global font: The Answer is NO.
    + This function adds geoms to a plot, but unlike a typical geom function, the properties of the geoms are **not mapped from variables of a data frame**, but are instead passed in as **vectors**.
    + https://ggplot2.tidyverse.org/reference/annotate.html


