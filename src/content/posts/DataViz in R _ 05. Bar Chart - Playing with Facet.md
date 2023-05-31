---

author: Mindx
date: 2023-06-01T01:00:00+07:00
title: "DataViz in R | 05. Bar Chart - Playing with Facet"
image: "/assets/05-Bar-char-facet/output_29_1.png"
postSlug: ""
featured: false
categories: ["ggplot"]
draft: false
tags:
- dataviz
- learning

ogImage: ""
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

    Registering fonts with R
    
    
    Attaching package: 'dplyr'
    
    
    The following objects are masked from 'package:stats':
    
        filter, lag
    
    
    The following objects are masked from 'package:base':
    
        intersect, setdiff, setequal, union
    
    
    

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


<table class="dataframe">
<caption>A data.frame: 6 × 305</caption>
<thead>
	<tr><th></th><th scope=col>CNT</th><th scope=col>COUNTRY</th><th scope=col>OECD</th><th scope=col>SUBNATIO</th><th scope=col>SCHOOLID</th><th scope=col>StIDStd</th><th scope=col>ST01Q01</th><th scope=col>ST02Q01</th><th scope=col>ST03Q02</th><th scope=col>ST03Q03</th><th scope=col>⋯</th><th scope=col>PV4READ</th><th scope=col>PV5READ</th><th scope=col>PV1SCIE</th><th scope=col>PV2SCIE</th><th scope=col>PV3SCIE</th><th scope=col>PV4SCIE</th><th scope=col>PV5SCIE</th><th scope=col>W_FSTUWT</th><th scope=col>TESTLANG</th><th scope=col>CNTFAC</th></tr>
	<tr><th></th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>⋯</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;dbl&gt;</th></tr>
</thead>
<tbody>
	<tr><th scope=row>1</th><td>Albania</td><td>Albania</td><td>Non-OECD</td><td>Albania</td><td>00001</td><td>00001</td><td>NA</td><td>NA</td><td>03</td><td>NA</td><td>⋯</td><td>291.86</td><td>242.16</td><td>359.70</td><td>280.44</td><td>323.33</td><td>383.01</td><td>364.36</td><td>5.4037</td><td>ALBANIAN</td><td>0.0293</td></tr>
	<tr><th scope=row>2</th><td>Albania</td><td>Albania</td><td>Non-OECD</td><td>Albania</td><td>00001</td><td>00002</td><td>NA</td><td>NA</td><td>01</td><td>NA</td><td>⋯</td><td>216.02</td><td>320.24</td><td>277.08</td><td>227.66</td><td>261.23</td><td>291.07</td><td>341.42</td><td>5.4037</td><td>ALBANIAN</td><td>0.0293</td></tr>
	<tr><th scope=row>3</th><td>Albania</td><td>Albania</td><td>Non-OECD</td><td>Albania</td><td>00001</td><td>00003</td><td>NA</td><td>NA</td><td>06</td><td>NA</td><td>⋯</td><td>399.60</td><td>418.04</td><td>420.68</td><td>461.71</td><td>414.16</td><td>442.13</td><td>421.62</td><td>5.4037</td><td>ALBANIAN</td><td>0.0293</td></tr>
	<tr><th scope=row>4</th><td>Albania</td><td>Albania</td><td>Non-OECD</td><td>Albania</td><td>00001</td><td>00004</td><td>NA</td><td>NA</td><td>09</td><td>NA</td><td>⋯</td><td>446.51</td><td>460.81</td><td>454.81</td><td>448.28</td><td>420.31</td><td>439.89</td><td>445.49</td><td>5.7039</td><td>ALBANIAN</td><td>0.0293</td></tr>
	<tr><th scope=row>5</th><td>Albania</td><td>Albania</td><td>Non-OECD</td><td>Albania</td><td>00001</td><td>00005</td><td>NA</td><td>NA</td><td>07</td><td>NA</td><td>⋯</td><td>372.95</td><td>395.99</td><td>428.70</td><td>411.92</td><td>394.20</td><td>413.78</td><td>415.65</td><td>5.7039</td><td>ALBANIAN</td><td>0.0293</td></tr>
	<tr><th scope=row>6</th><td>Albania</td><td>Albania</td><td>Non-OECD</td><td>Albania</td><td>00001</td><td>00006</td><td>NA</td><td>NA</td><td>09</td><td>NA</td><td>⋯</td><td>506.63</td><td>505.83</td><td>549.37</td><td>585.73</td><td>585.73</td><td>535.38</td><td>509.27</td><td>5.4037</td><td>ALBANIAN</td><td>0.0293</td></tr>
</tbody>
</table>




```r
dim(pisa.student)
```


<style>
.list-inline {list-style: none; margin:0; padding: 0}
.list-inline>li {display: inline-block}
.list-inline>li:not(:last-child)::after {content: "\00b7"; padding: 0 .5ex}
</style>
<ol class=list-inline><li>475460</li><li>305</li></ol>




```r
unique(pisa.student$COUNTRY)
```


<style>
.list-inline {list-style: none; margin:0; padding: 0}
.list-inline>li {display: inline-block}
.list-inline>li:not(:last-child)::after {content: "\00b7"; padding: 0 .5ex}
</style>
<ol class=list-inline><li>Albania</li><li>Argentina</li><li>Australia</li><li>Austria</li><li>Azerbaijan</li><li>Belgium</li><li>Bulgaria</li><li>Brazil</li><li>Canada</li><li>Switzerland</li><li>Chile</li><li>Colombia</li><li>Czech Republic</li><li>Germany</li><li>Denmark</li><li>Spain</li><li>Estonia</li><li>Finland</li><li>France</li><li>United Kingdom</li><li>Greece</li><li>Hong Kong-China</li><li>Croatia</li><li>Hungary</li><li>Indonesia</li><li>Ireland</li><li>Iceland</li><li>Israel</li><li>Italy</li><li>Jordan</li><li>Japan</li><li>Kazakhstan</li><li>Kyrgyzstan</li><li>Korea</li><li>Liechtenstein</li><li>Lithuania</li><li>Luxembourg</li><li>Latvia</li><li>Macao-China</li><li>Mexico</li><li>Montenegro</li><li>Netherlands</li><li>Norway</li><li>New Zealand</li><li>Panama</li><li>Peru</li><li>Poland</li><li>Portugal</li><li>Dubai (UAE)</li><li>Qatar</li><li>Shanghai-China</li><li>Romania</li><li>Russian Federation</li><li>Singapore</li><li>Serbia</li><li>Slovak Republic</li><li>Slovenia</li><li>Sweden</li><li>Chinese Taipei</li><li>Thailand</li><li>Trinidad and Tobago</li><li>Tunisia</li><li>Turkey</li><li>Uruguay</li><li>United States</li></ol>

<details>
	<summary style=display:list-item;cursor:pointer>
		<strong>Levels</strong>:
	</summary>
	<style>
	.list-inline {list-style: none; margin:0; padding: 0}
	.list-inline>li {display: inline-block}
	.list-inline>li:not(:last-child)::after {content: "\00b7"; padding: 0 .5ex}
	</style>
	<ol class=list-inline><li>'Albania'</li><li>'Azerbaijan'</li><li>'Argentina'</li><li>'Australia'</li><li>'Austria'</li><li>'Belgium'</li><li>'Brazil'</li><li>'Bulgaria'</li><li>'Canada'</li><li>'Chile'</li><li>'Shanghai-China'</li><li>'Chinese Taipei'</li><li>'Colombia'</li><li>'Croatia'</li><li>'Czech Republic'</li><li>'Denmark'</li><li>'Estonia'</li><li>'Finland'</li><li>'France'</li><li>'Germany'</li><li>'Greece'</li><li>'Hong Kong-China'</li><li>'Hungary'</li><li>'Iceland'</li><li>'Indonesia'</li><li>'Ireland'</li><li>'Israel'</li><li>'Italy'</li><li>'Japan'</li><li>'Kazakhstan'</li><li>'Jordan'</li><li>'Korea'</li><li>'Kyrgyzstan'</li><li>'Latvia'</li><li>'Liechtenstein'</li><li>'Lithuania'</li><li>'Luxembourg'</li><li>'Macao-China'</li><li>'Mexico'</li><li>'Montenegro'</li><li>'Netherlands'</li><li>'New Zealand'</li><li>'Norway'</li><li>'Panama'</li><li>'Peru'</li><li>'Poland'</li><li>'Portugal'</li><li>'Qatar'</li><li>'Romania'</li><li>'Russian Federation'</li><li>'Serbia'</li><li>'Singapore'</li><li>'Slovak Republic'</li><li>'Slovenia'</li><li>'Spain'</li><li>'Sweden'</li><li>'Switzerland'</li><li>'Thailand'</li><li>'Trinidad and Tobago'</li><li>'Dubai (UAE)'</li><li>'Tunisia'</li><li>'Turkey'</li><li>'United Kingdom'</li><li>'United States'</li><li>'Uruguay'</li></ol>
</details>


Because our graph only represents the data for the USA, Canada and Mexico (USMCA), we filtered it and compared the total number of respondents in the book (66,690). In addition, there are more than 300 questions but our graph extracted only the items of question group 28, i.e variables whose name starts with **“ST24Q”** (or 11 questions based on the targeted result image).


```r
pisa <- pisa.student %>% 
    dplyr::filter(COUNTRY %in% c('United States', 'Canada', 'Mexico')) %>%
    select(2,5, starts_with("ST24Q"))
dim(pisa)
head(pisa)
```


<style>
.list-inline {list-style: none; margin:0; padding: 0}
.list-inline>li {display: inline-block}
.list-inline>li:not(:last-child)::after {content: "\00b7"; padding: 0 .5ex}
</style>
<ol class=list-inline><li>66690</li><li>13</li></ol>




<table class="dataframe">
<caption>A data.frame: 6 × 13</caption>
<thead>
	<tr><th></th><th scope=col>COUNTRY</th><th scope=col>SCHOOLID</th><th scope=col>ST24Q01</th><th scope=col>ST24Q02</th><th scope=col>ST24Q03</th><th scope=col>ST24Q04</th><th scope=col>ST24Q05</th><th scope=col>ST24Q06</th><th scope=col>ST24Q07</th><th scope=col>ST24Q08</th><th scope=col>ST24Q09</th><th scope=col>ST24Q10</th><th scope=col>ST24Q11</th></tr>
	<tr><th></th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th></tr>
</thead>
<tbody>
	<tr><th scope=row>1</th><td>Canada</td><td>00001</td><td>Disagree         </td><td>Strongly agree   </td><td>Strongly agree   </td><td>Strongly disagree</td><td>Strongly agree   </td><td>Strongly disagree</td><td>Agree            </td><td>Disagree         </td><td>Strongly disagree</td><td>Agree            </td><td>Agree            </td></tr>
	<tr><th scope=row>2</th><td>Canada</td><td>00001</td><td>Agree            </td><td>Strongly disagree</td><td>Strongly disagree</td><td>Strongly agree   </td><td>Strongly disagree</td><td>Agree            </td><td>Strongly disagree</td><td>Agree            </td><td>Strongly agree   </td><td>Strongly disagree</td><td>Strongly disagree</td></tr>
	<tr><th scope=row>3</th><td>Canada</td><td>00001</td><td>Strongly agree   </td><td>Strongly disagree</td><td>Strongly disagree</td><td>Agree            </td><td>Strongly disagree</td><td>Strongly agree   </td><td>Strongly disagree</td><td>Agree            </td><td>Disagree         </td><td>Disagree         </td><td>Strongly disagree</td></tr>
	<tr><th scope=row>4</th><td>Canada</td><td>00001</td><td>Disagree         </td><td>Disagree         </td><td>Agree            </td><td>Strongly disagree</td><td>Disagree         </td><td>Disagree         </td><td>Agree            </td><td>Strongly disagree</td><td>Strongly disagree</td><td>Agree            </td><td>Agree            </td></tr>
	<tr><th scope=row>5</th><td>Canada</td><td>00001</td><td>Strongly disagree</td><td>Disagree         </td><td>Strongly disagree</td><td>Disagree         </td><td>Strongly disagree</td><td>Disagree         </td><td>Disagree         </td><td>Agree            </td><td>Agree            </td><td>Agree            </td><td>Strongly disagree</td></tr>
	<tr><th scope=row>6</th><td>Canada</td><td>00001</td><td>Agree            </td><td>Strongly disagree</td><td>Strongly disagree</td><td>Agree            </td><td>Strongly disagree</td><td>Agree            </td><td>Strongly disagree</td><td>Agree            </td><td>Strongly agree   </td><td>Strongly disagree</td><td>Strongly disagree</td></tr>
</tbody>
</table>




```r
load("./myData/pisa-master/data/pisa.catalog.student.rda")
```


```r
#Get the desc of questions
#Check type of `pisa.catalog.student`
dim(pisa.catalog.student)
is.vector(pisa.catalog.student)
```


    NULL



TRUE



```r
#Using grep as regex searching with ^
#unname return the value of vector only
pisa.catalog.student[grep("^ST24Q", names(pisa.catalog.student))]
```


<style>
.dl-inline {width: auto; margin:0; padding: 0}
.dl-inline>dt, .dl-inline>dd {float: none; width: auto; display: inline-block}
.dl-inline>dt::after {content: ":\0020"; padding-right: .5ex}
.dl-inline>dt:not(:first-of-type) {padding-left: .5ex}
</style><dl class=dl-inline><dt>ST24Q01</dt><dd>'Read Attitude - Only if I have to'</dd><dt>ST24Q02</dt><dd>'Read Attitude - Favourite hobbies'</dd><dt>ST24Q03</dt><dd>'Read Attitude - Talk about books'</dd><dt>ST24Q04</dt><dd>'Read Attitude - Hard to finish'</dd><dt>ST24Q05</dt><dd>'Read Attitude - Happy as present'</dd><dt>ST24Q06</dt><dd>'Read Attitude - Waste of time'</dd><dt>ST24Q07</dt><dd>'Read Attitude - Enjoy library'</dd><dt>ST24Q08</dt><dd>'Read Attitude - Need information'</dd><dt>ST24Q09</dt><dd>'Read Attitude - Cannot sit still'</dd><dt>ST24Q10</dt><dd>'Read Attitude - Express opinions'</dd><dt>ST24Q11</dt><dd>'Read Attitude - Exchange'</dd></dl>




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


<style>
.dl-inline {width: auto; margin:0; padding: 0}
.dl-inline>dt, .dl-inline>dd {float: none; width: auto; display: inline-block}
.dl-inline>dt::after {content: ":\0020"; padding-right: .5ex}
.dl-inline>dt:not(:first-of-type) {padding-left: .5ex}
</style><dl class=dl-inline><dt>ST24Q01</dt><dd>'I read only if I have to.'</dd><dt>ST24Q02</dt><dd>'Reading is one of my favorite hobbies.'</dd><dt>ST24Q03</dt><dd>'I like talking about books with other people.'</dd><dt>ST24Q04</dt><dd>'I find it hard to finish books.'</dd><dt>ST24Q05</dt><dd>'I feel happy if I receive a book as a present.'</dd><dt>ST24Q06</dt><dd>'For me, reading is a waste of time.'</dd><dt>ST24Q07</dt><dd>'I enjoy going to a bookstore or a library.'</dd><dt>ST24Q08</dt><dd>'I read only to get information that I need.'</dd><dt>ST24Q09</dt><dd>'I cannot sit still and read for more than a few minutes.'</dd><dt>ST24Q10</dt><dd>'I like to express my opinions about books I have read.'</dd><dt>ST24Q11</dt><dd>'I like to exchange books with my friends.'</dd></dl>



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


<table class="dataframe">
<caption>A tibble: 10 × 4</caption>
<thead>
	<tr><th scope=col>COUNTRY</th><th scope=col>Question</th><th scope=col>Answer</th><th scope=col>Count</th></tr>
	<tr><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;int&gt;</th></tr>
</thead>
<tbody>
	<tr><td>Canada</td><td>ST24Q01</td><td>Strongly disagree</td><td>5807</td></tr>
	<tr><td>Canada</td><td>ST24Q01</td><td>Disagree         </td><td>7938</td></tr>
	<tr><td>Canada</td><td>ST24Q01</td><td>Agree            </td><td>5623</td></tr>
	<tr><td>Canada</td><td>ST24Q01</td><td>Strongly agree   </td><td>3229</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Strongly disagree</td><td>6052</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Disagree         </td><td>7953</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Agree            </td><td>5568</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Strongly agree   </td><td>3028</td></tr>
	<tr><td>Canada</td><td>ST24Q03</td><td>Strongly disagree</td><td>5697</td></tr>
	<tr><td>Canada</td><td>ST24Q03</td><td>Disagree         </td><td>7154</td></tr>
</tbody>
</table>




```r
#Create percentage column
pisa_617 <- pisa_longer %>%
    group_by(COUNTRY, Question, .add=T) %>%
    mutate(Perc = Count / sum(Count))

head(pisa_617, 10)
```


<table class="dataframe">
<caption>A grouped_df: 10 × 5</caption>
<thead>
	<tr><th scope=col>COUNTRY</th><th scope=col>Question</th><th scope=col>Answer</th><th scope=col>Count</th><th scope=col>Perc</th></tr>
	<tr><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;dbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td>Canada</td><td>ST24Q01</td><td>Strongly disagree</td><td>5807</td><td>0.2569810</td></tr>
	<tr><td>Canada</td><td>ST24Q01</td><td>Disagree         </td><td>7938</td><td>0.3512856</td></tr>
	<tr><td>Canada</td><td>ST24Q01</td><td>Agree            </td><td>5623</td><td>0.2488383</td></tr>
	<tr><td>Canada</td><td>ST24Q01</td><td>Strongly agree   </td><td>3229</td><td>0.1428951</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Strongly disagree</td><td>6052</td><td>0.2677758</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Disagree         </td><td>7953</td><td>0.3518871</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Agree            </td><td>5568</td><td>0.2463608</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Strongly agree   </td><td>3028</td><td>0.1339764</td></tr>
	<tr><td>Canada</td><td>ST24Q03</td><td>Strongly disagree</td><td>5697</td><td>0.2522917</td></tr>
	<tr><td>Canada</td><td>ST24Q03</td><td>Disagree         </td><td>7154</td><td>0.3168150</td></tr>
</tbody>
</table>




```r
#The main idea is using the facet element

pisa_617 %>%
ggplot(aes(x=Perc, y=COUNTRY)) + 
    geom_col(mapping=aes(fill=Answer), position = position_stack(reverse = TRUE)) +
    facet_grid(Question ~ .)
```


    
![png](/assets/05-Bar-char-facet/output_18_0.png)
    



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


    
![png](/assets/05-Bar-char-facet/output_20_0.png)
    


We try to edit the y - label by creating a new column.


```r
pisa_test <- pisa_617 %>%
    group_by(COUNTRY, Question, .add=T) %>%
    mutate(neg_perc = sprintf("%.0f%%",sum(Count[Answer %in% c("Strongly disagree", "Disagree")]) / sum(Count) * 100)
          )
head(pisa_test,10)
```


<table class="dataframe">
<caption>A grouped_df: 10 × 6</caption>
<thead>
	<tr><th scope=col>COUNTRY</th><th scope=col>Question</th><th scope=col>Answer</th><th scope=col>Count</th><th scope=col>Perc</th><th scope=col>neg_perc</th></tr>
	<tr><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;chr&gt;</th></tr>
</thead>
<tbody>
	<tr><td>Canada</td><td>ST24Q01</td><td>Strongly disagree</td><td>5807</td><td>0.2569810</td><td>61%</td></tr>
	<tr><td>Canada</td><td>ST24Q01</td><td>Disagree         </td><td>7938</td><td>0.3512856</td><td>61%</td></tr>
	<tr><td>Canada</td><td>ST24Q01</td><td>Agree            </td><td>5623</td><td>0.2488383</td><td>61%</td></tr>
	<tr><td>Canada</td><td>ST24Q01</td><td>Strongly agree   </td><td>3229</td><td>0.1428951</td><td>61%</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Strongly disagree</td><td>6052</td><td>0.2677758</td><td>62%</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Disagree         </td><td>7953</td><td>0.3518871</td><td>62%</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Agree            </td><td>5568</td><td>0.2463608</td><td>62%</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>Strongly agree   </td><td>3028</td><td>0.1339764</td><td>62%</td></tr>
	<tr><td>Canada</td><td>ST24Q03</td><td>Strongly disagree</td><td>5697</td><td>0.2522917</td><td>57%</td></tr>
	<tr><td>Canada</td><td>ST24Q03</td><td>Disagree         </td><td>7154</td><td>0.3168150</td><td>57%</td></tr>
</tbody>
</table>




```r
pisa_test %>%
ggplot(aes(x=Perc, y=COUNTRY)) + 
    geom_col(mapping=aes(fill=Answer), position = position_stack(reverse = TRUE)) +
    scale_fill_manual(values=color_pisa) +
    geom_text(data=pisa_test, mapping=aes(x=-0.05, y=COUNTRY, label=neg_perc), size=3, hjust=1) +
    facet_grid(Question ~ .)
```


    
![png](/assets/05-Bar-char-facet/output_23_0.png)
    


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


<style>
.list-inline {list-style: none; margin:0; padding: 0}
.list-inline>li {display: inline-block}
.list-inline>li:not(:last-child)::after {content: "\00b7"; padding: 0 .5ex}
</style>
<ol class=list-inline><li>'Canada - 61%'</li><li>'Mexico - 62%'</li><li>'Canada - 57%'</li><li>'Mexico - 72%'</li><li>'Canada - 50%'</li><li>'Mexico - 76%'</li><li>'Canada - 48%'</li><li>'Mexico - 61%'</li><li>'Canada - 76%'</li><li>'Mexico - 47%'</li><li>'Canada - 60%'</li><li>'Mexico - 59%'</li><li>'Canada - 52%'</li><li>'Mexico - 53%'</li><li>'Canada - 61%'</li><li>'Mexico - 43%'</li><li>'Canada - 88%'</li><li>'Mexico - 54%'</li><li>'Canada - 44%'</li><li>'Mexico - 77%'</li><li>'Canada - 37%'</li><li>'Mexico - 52%'</li><li>'Canada - 50%'</li><li>'Mexico - 70%'</li><li>'Canada - 59%'</li><li>'Mexico - 69%'</li><li>'Canada - 62%'</li><li>'Mexico - 74%'</li><li>'Canada - 47%'</li><li>'Mexico - 53%'</li><li>'Canada - 71%'</li><li>'Mexico - 49%'</li><li>'Canada - 66%'</li></ol>



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


<table class="dataframe">
<caption>A tibble: 6 × 5</caption>
<thead>
	<tr><th scope=col>COUNTRY</th><th scope=col>Question</th><th scope=col>neg_perc</th><th scope=col>right_labels</th><th scope=col>left_labels</th></tr>
	<tr><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;chr&gt;</th></tr>
</thead>
<tbody>
	<tr><td>Canada</td><td>ST24Q01</td><td>60.82666</td><td>39%</td><td>Canada - 61%</td></tr>
	<tr><td>Canada</td><td>ST24Q02</td><td>61.96628</td><td>38%</td><td>Canada - 62%</td></tr>
	<tr><td>Canada</td><td>ST24Q03</td><td>56.91068</td><td>43%</td><td>Canada - 57%</td></tr>
	<tr><td>Canada</td><td>ST24Q04</td><td>71.77194</td><td>28%</td><td>Canada - 72%</td></tr>
	<tr><td>Canada</td><td>ST24Q05</td><td>50.13961</td><td>50%</td><td>Canada - 50%</td></tr>
	<tr><td>Canada</td><td>ST24Q06</td><td>75.72334</td><td>24%</td><td>Canada - 76%</td></tr>
</tbody>
</table>




```r
p1 <-
pisa_617 %>%
ggplot(aes(x=Perc, y=COUNTRY)) + 
    #geom_col creates bar and customize bar color
    geom_col(mapping=aes(fill=Answer), color = "black", size = 0.2, width = 0.8, position = position_stack(reverse = TRUE)) +
    scale_fill_manual(values=color_pisa) +
    #break into facet, but use facet_wrap instead of facet_grid to modify position of strip text
    facet_wrap(Question ~ ., nrow = 11, strip.position = "top",
               labeller = as_labeller(question_desc)) +
    #custom label, on the left and the right
    geom_text(data=pisa_label, mapping=aes(x=-0.01, y=COUNTRY, label=left_labels), size=3, hjust=1, family = "Lato Light") +
    geom_text(data=pisa_label, mapping=aes(x=1.01, y=COUNTRY, label=right_labels), size=3, hjust=0, family = "Lato Light") +
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
    #Add custom axis by geom_segment
    geom_segment(data=data.frame(x = 0, xend = 1, y = 0, yend = 0, Question = "ST24Q11"),
               aes(x=x,y=y,yend=yend,xend=xend), inherit.aes=FALSE)+

    #To move the panel area to the right, we increase the xlim while limiting the display label
    coord_cartesian(xlim=c(-0.1,1), clip="off") +
    theme(axis.text.y = element_blank(),
          panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          #strip text aligned with the bar. 
          #Don't know the relationship btw l=30 and l=50
          strip.text.x = element_text(hjust = 0, size = 3 *14/5,
                                      margin = margin(l=70)),
          legend.position = "bottom",
          legend.title = element_blank(),
          plot.caption = element_text(face="italic"),
          plot.title.position = "plot",
          plot.title = element_text(size = 20, family="Lato Black"),
          #Add some margin to final svg output
          plot.margin = margin(t=10, l=10),
          #Show the x-axis line and ticks
          axis.ticks.x = element_line(color = "black"),
         )
                       
p1
```

    Warning message:
    "[1m[22mUsing `size` aesthetic for lines was deprecated in ggplot2 3.4.0.
    [36mℹ[39m Please use `linewidth` instead."
    


    
![png](/assets/05-Bar-char-facet/output_29_1.png)
    


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
ggsave("6.1.7 Bar char Grouping all responses.svg", last_plot(), device=svg, width = 2400, height = 2800, units="px")
```

![Bar Chart Facet](/assets/05-Bar-char-facet//6.1.7_Bar_char_Facet.svg)

TODO:
- [ ] Change geom_text to annotate for global font
- [ ] Increase the distance between legend keys.


```r

```
