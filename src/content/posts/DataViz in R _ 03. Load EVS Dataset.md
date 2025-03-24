---
author: Mindx
pubDate: 2023-04-29T10:00:00+07:00
title: "DataViz in R | 03. Load EVS Dataset"
image: "@assets/03-Load-EVS-Dataset.jpg"

category: 'ggplot'
draft: false
tags:
- dataviz
- wrangling
description: "Data wrangling with EVS dataset from gesis"

---

## Data source

In previous posts, I complained that the dataset `ZA4753 - European Values Study 2008: Germany` could not be directly downloaded.

Therefore I made some research and go from this [site](https://europeanvaluesstudy.eu/methodology-data-documentation/previous-surveys-1981-2008/survey-2008/) *(appreared at top when I search "EVS 2008 dataset")* to the below site

https://search.gesis.org/research_data/ZA4800

**Fortunately**, this dataset is now downloadable, simply by registering an account. 
```
Downloads:
ZA4800_v5-0-0.dta.zip Stata (Dataset) 10.03 MB
ZA4800_v5-0-0.sav.zip SPSS (Dataset) 12.91 MB

Availability: A - Data and documents are released for academic research and teaching.
```

Select the SPSS dataset and we can continue to dive in.


```r
#Using haven library to read the .sav file

library(haven)
```


```r
read_sav("./myData/EVS_2008/ZA4800_v5-0-0.sav")
```


    Error: Failed to parse C:/Users/minhd/OneDrive/Learning/Dataviz-R/myData/EVS_2008/ZA4800_v5-0-0.sav: Unable to convert string to the requested encoding (invalid byte sequence).
    Traceback:
    

    1. read_sav("./myData/EVS_2008/ZA4800_v5-0-0.sav")

    2. df_parse_sav_file(spec, encoding, user_na, cols_skip, n_max, 
     .     skip, name_repair = .name_repair)


## Error when try to handling SPSS data with unicode character

I found several posts on Internet telling about the error when using `encoding="utf-8"` (default) in read_sav.
```
Error: Failed to parse "./myData/EVS_2008/ZA4800_v5-0-0.sav"
Unable to convert string to the requested encoding (invalid byte sequence)
```
It may come from the nature of how SPSS handling the data file. A quick fix is changing `encoding` to `latin1`. However, the problem still arises when the negative values become `NA`. 

Therefore, I changed to `dta` format and use `read_dta` instead.


```r
za4800 <- read_dta("./myData/EVS_2008/ZA4800_v5-0-0.dta")
```


```r
dim(za4800)

#We need to extract data for Germany and for certain questions only
#Read the source for description of each variable (there are 132 variables)
```


<style>
.list-inline {list-style: none; margin:0; padding: 0}
.list-inline>li {display: inline-block}
.list-inline>li:not(:last-child)::after {content: "\00b7"; padding: 0 .5ex}
</style>
<ol class=list-inline><li>66280</li><li>477</li></ol>




```r
unique(za4800$country)
```


    <labelled<double>[46]>: country code
     [1]   8  40  51  56  70 100 112 191 196 197 203 208 233 246 250 268 276 300 348
    [20] 352 372 380 428 440 442 470 498 499 528 578 616 620 642 643 688 703 705 724
    [39] 752 756 792 804 807 826 909 915
    
    Labels:
     value              label
         8            Albania
        31         Azerbaijan
        40            Austria
        51            Armenia
        56            Belgium
        70 Bosnia Herzegovina
       100           Bulgaria
       112            Belarus
       191            Croatia
       196             Cyprus
       197    Northern Cyprus
       203     Czech Republic
       208            Denmark
       233            Estonia
       246            Finland
       250             France
       268            Georgia
       276            Germany
       300             Greece
       ...
       915             Kosovo



```r
#We found the country code of Germany was '276'

evs_ger <- dplyr::filter(za4800, country==276)
dim(evs_ger)
```


<style>
.list-inline {list-style: none; margin:0; padding: 0}
.list-inline>li {display: inline-block}
.list-inline>li:not(:last-child)::after {content: "\00b7"; padding: 0 .5ex}
</style>
<ol class=list-inline><li>2075</li><li>477</li></ol>




```r
#It seems matching to the number of observation in the book. Great!
#Now we select only 8 questions for learning purpose

evs_ger <- dplyr::select(evs_ger, v106,v159,v160,v161,v162,v163,v164,v165)
head(evs_ger)
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A tibble: 6 × 8</caption>
<thead>
	<tr><th scope=col>v106</th><th scope=col>v159</th><th scope=col>v160</th><th scope=col>v161</th><th scope=col>v162</th><th scope=col>v163</th><th scope=col>v164</th><th scope=col>v165</th></tr>
	<tr><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td> 2</td><td>4</td><td>1</td><td>4</td><td>3</td><td>3</td><td>4</td><td>3</td></tr>
	<tr><td> 2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>4</td><td>4</td></tr>
	<tr><td>-3</td><td>1</td><td>3</td><td>3</td><td>3</td><td>1</td><td>1</td><td>1</td></tr>
	<tr><td>-3</td><td>1</td><td>4</td><td>2</td><td>3</td><td>1</td><td>1</td><td>2</td></tr>
	<tr><td>-3</td><td>3</td><td>1</td><td>1</td><td>2</td><td>3</td><td>2</td><td>3</td></tr>
	<tr><td> 2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
</tbody>
</table> 
</div>




```r
#write the RDS file for learning purpose
saveRDS(evs_ger, file="./myData/EVS_2008/germany.Rda")
```


```r
#Test load my data
my_df <- readRDS("./myData/EVS_2008/germany.Rda")
head(my_df)
dim(my_df)
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A tibble: 6 × 8</caption>
<thead>
	<tr><th scope=col>v106</th><th scope=col>v159</th><th scope=col>v160</th><th scope=col>v161</th><th scope=col>v162</th><th scope=col>v163</th><th scope=col>v164</th><th scope=col>v165</th></tr>
	<tr><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td> 2</td><td>4</td><td>1</td><td>4</td><td>3</td><td>3</td><td>4</td><td>3</td></tr>
	<tr><td> 2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>4</td><td>4</td></tr>
	<tr><td>-3</td><td>1</td><td>3</td><td>3</td><td>3</td><td>1</td><td>1</td><td>1</td></tr>
	<tr><td>-3</td><td>1</td><td>4</td><td>2</td><td>3</td><td>1</td><td>1</td><td>2</td></tr>
	<tr><td>-3</td><td>3</td><td>1</td><td>1</td><td>2</td><td>3</td><td>2</td><td>3</td></tr>
	<tr><td> 2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
</tbody>
</table> 
</div>




<style>
.list-inline {list-style: none; margin:0; padding: 0}
.list-inline>li {display: inline-block}
.list-inline>li:not(:last-child)::after {content: "\00b7"; padding: 0 .5ex}
</style>
<ol class=list-inline><li>2075</li><li>8</li></ol>




```r
#

attributes(my_df[[5]])$labels
```


<style>
.dl-inline {width: auto; margin:0; padding: 0}
.dl-inline>dt, .dl-inline>dd {float: none; width: auto; display: inline-block}
.dl-inline>dt::after {content: ":\0020"; padding-right: .5ex}
.dl-inline>dt:not(:first-of-type) {padding-left: .5ex}
</style><dl class=dl-inline><dt>other missing</dt><dd>-5</dd><dt>question not asked</dt><dd>-4</dd><dt>not applicable</dt><dd>-3</dd><dt>no answer</dt><dd>-2</dd><dt>don't know</dt><dd>-1</dd><dt>agree strongly</dt><dd>1</dd><dt>agree</dt><dd>2</dd><dt>disagree</dt><dd>3</dd><dt>disagree strongly</dt><dd>4</dd></dl>

