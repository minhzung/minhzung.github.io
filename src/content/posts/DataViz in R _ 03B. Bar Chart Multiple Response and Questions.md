---

author: Mindx
pubDate: 2023-04-29T10:30:00+07:00
title: "DataViz in R | 03B. Bar Chart Multiple Responses and Questions"
image: "@assets/03-Bar-chart-multi-2/output_19_0.png"

category: 'ggplot'
draft: false
tags:
- dataviz
- learning

description: "Playing with EVS data in previous post"

---

```r
library(ggplot2)
library(viridis)
library(dplyr)
theme_set(theme_minimal())
```
    
    

```r
#load the data that I have extracted
evs <- readRDS("./myData/EVS_2008/germany.Rda")
head(evs)
```


<div class="relative overflow-auto max-h-96 sm:rounded-lg">
 <table class="dataframe">
<caption>A tibble: 6 × 8</caption>
<thead>
	<tr><th scope=col>v106</th><th scope=col>v159</th><th scope=col>v160</th><th scope=col>v161</th><th scope=col>v162</th><th scope=col>v163</th><th scope=col>v164</th><th scope=col>v165</th></tr>
	<tr><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th></tr>
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
#Using library haven and labelled to read or extract the label(s)
library(haven)
library(labelled)
head(evs$v159)
```


    <labelled<double>[6]>: working mother warm relationship with children (Q48A)
    [1] 4 3 1 1 3 2
    
    Labels:
     value              label
        -5      other missing
        -4 question not asked
        -3     not applicable
        -2          no answer
        -1         don't know
         1     agree strongly
         2              agree
         3           disagree
         4  disagree strongly



```r
#Using val_labels, we see that the values for 7 cols are the same: from -5 to 4
val_labels(evs)
```


<div class="dataframe">
$v106
 other missing -5 question not asked -4 not applicable -3 no answer -2 don't know -1 roman catholic 1 protestant 2 free church/ non-conformist/ evangelical 3 jew 4 muslim 5 hindu 6 buddhist 7 orthodox 8 other 9

$v159
 other missing -5 question not asked -4 not applicable -3 no answer -2 don't know -1 agree strongly 1 agree 2 disagree 3 disagree strongly 4

$v160
 other missing -5 question not asked -4 not applicable -3 no answer -2 don't know -1 agree strongly 1 agree 2 disagree 3 disagree strongly 4

$v161
 other missing -5 question not asked -4 not applicable -3 no answer -2 don't know -1 agree strongly 1 agree 2 disagree 3 disagree strongly 4

$v162
 other missing -5 question not asked -4 not applicable -3 no answer -2 don't know -1 agree strongly 1 agree 2 disagree 3 disagree strongly 4

$v163
 other missing -5 question not asked -4 not applicable -3 no answer -2 don't know -1 agree strongly 1 agree 2 disagree 3 disagree strongly 4

$v164
 other missing -5 question not asked -4 not applicable -3 no answer -2 don't know -1 agree strongly 1 agree 2 disagree 3 disagree strongly 4

$v165
 other missing -5 question not asked -4 not applicable -3 no answer -2 don't know -1 agree strongly 1 agree 2 disagree 3 disagree strongly 4
</div>



## Data wrangling

The negative values (from -5 to -1) are deﬁned as missing values and are therefore not taken into account during statistical calculations. However, the answers of `dk (don’t know)` and `na (no answer)` gave us some insights because the question was indeed asked and the respondent has already provided an answer to it.

As a result, we will remove the negative values from -5 to -3 (`other missing`, `not asked`, and `not applicable`) and convert both `no answer` and `don't know` to a category of value.


```r
#For this example we will drop the first column "v106" on the respondent's religious

evs <- evs[,-1]
head(evs)
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A tibble: 6 × 7</caption>
<thead>
	<tr><th scope=col>v159</th><th scope=col>v160</th><th scope=col>v161</th><th scope=col>v162</th><th scope=col>v163</th><th scope=col>v164</th><th scope=col>v165</th></tr>
	<tr><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td>4</td><td>1</td><td>4</td><td>3</td><td>3</td><td>4</td><td>3</td></tr>
	<tr><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>4</td><td>4</td></tr>
	<tr><td>1</td><td>3</td><td>3</td><td>3</td><td>1</td><td>1</td><td>1</td></tr>
	<tr><td>1</td><td>4</td><td>2</td><td>3</td><td>1</td><td>1</td><td>2</td></tr>
	<tr><td>3</td><td>1</td><td>1</td><td>2</td><td>3</td><td>2</td><td>3</td></tr>
	<tr><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
</tbody>
</table> 
</div>




```r
#Firstly we need to convert the data from "wider" to "longer" format
#i.e few columns, more rows - by pivot_longer in tidyr lib
#However, please keep in mind that the pivot_longer can not summary each value
#As can be seen from the dim(), the pivot dataframe has exactly 2075 x 7 = 14,525 rows

library(tidyr)
pivot_evs_longer <- pivot_longer(evs, cols=everything(), names_to = "Question", values_to = "Answer")
head(pivot_evs_longer)
dim(evs)
dim(pivot_evs_longer)
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A tibble: 6 × 2</caption>
<thead>
	<tr><th scope=col>Question</th><th scope=col>Answer</th></tr>
	<tr><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td>v159</td><td>4</td></tr>
	<tr><td>v160</td><td>1</td></tr>
	<tr><td>v161</td><td>4</td></tr>
	<tr><td>v162</td><td>3</td></tr>
	<tr><td>v163</td><td>3</td></tr>
	<tr><td>v164</td><td>4</td></tr>
</tbody>
</table> 
</div>




<style>
.list-inline {list-style: none; margin:0; padding: 0}
.list-inline>li {display: inline-block}
.list-inline>li:not(:last-child)::after {content: "\00b7"; padding: 0 .5ex}
</style>
<ol class=list-inline><li>2075</li><li>7</li></ol>




<style>
.list-inline {list-style: none; margin:0; padding: 0}
.list-inline>li {display: inline-block}
.list-inline>li:not(:last-child)::after {content: "\00b7"; padding: 0 .5ex}
</style>
<ol class=list-inline><li>14525</li><li>2</li></ol>




```r
#Then we use pivot_wider with values_fn to summary the data
#Remember to add values_fill for NA case
#https://stackoverflow.com/questions/28873057/sum-across-multiple-columns-with-dplyr

pivot_evs <- pivot_wider(pivot_evs_longer, names_from = "Answer", values_from = "Answer", values_fn = length, values_fill = 0)
pivot_evs
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A tibble: 7 × 7</caption>
<thead>
	<tr><th scope=col>Question</th><th scope=col>4</th><th scope=col>1</th><th scope=col>3</th><th scope=col>2</th><th scope=col>-1</th><th scope=col>-2</th></tr>
	<tr><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th></tr>
</thead>
<tbody>
	<tr><td>v159</td><td>112</td><td>803</td><td>311</td><td>782</td><td> 67</td><td>0</td></tr>
	<tr><td>v160</td><td>337</td><td>332</td><td>655</td><td>647</td><td>101</td><td>3</td></tr>
	<tr><td>v161</td><td>477</td><td>163</td><td>769</td><td>523</td><td>138</td><td>5</td></tr>
	<tr><td>v162</td><td>490</td><td>174</td><td>708</td><td>553</td><td>147</td><td>3</td></tr>
	<tr><td>v163</td><td> 43</td><td>851</td><td>205</td><td>909</td><td> 64</td><td>3</td></tr>
	<tr><td>v164</td><td> 52</td><td>772</td><td>205</td><td>985</td><td> 55</td><td>6</td></tr>
	<tr><td>v165</td><td> 70</td><td>568</td><td>447</td><td>887</td><td> 96</td><td>7</td></tr>
</tbody>
</table> 
</div>




```r
#Create percentage columns
#This solution I asked ChatGPT from OpenAI and the result is good

pivot_evs %>%  
mutate(Total = rowSums(select(., -Question)),
         across(-c(Question, Total), ~./Total*100, .names = "{.col}_%"))
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A tibble: 7 × 14</caption>
<thead>
	<tr><th scope=col>Question</th><th scope=col>4</th><th scope=col>1</th><th scope=col>3</th><th scope=col>2</th><th scope=col>-1</th><th scope=col>-2</th><th scope=col>Total</th><th scope=col>4_%</th><th scope=col>1_%</th><th scope=col>3_%</th><th scope=col>2_%</th><th scope=col>-1_%</th><th scope=col>-2_%</th></tr>
	<tr><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td>v159</td><td>112</td><td>803</td><td>311</td><td>782</td><td> 67</td><td>0</td><td>2075</td><td> 5.397590</td><td>38.698795</td><td>14.987952</td><td>37.68675</td><td>3.228916</td><td>0.0000000</td></tr>
	<tr><td>v160</td><td>337</td><td>332</td><td>655</td><td>647</td><td>101</td><td>3</td><td>2075</td><td>16.240964</td><td>16.000000</td><td>31.566265</td><td>31.18072</td><td>4.867470</td><td>0.1445783</td></tr>
	<tr><td>v161</td><td>477</td><td>163</td><td>769</td><td>523</td><td>138</td><td>5</td><td>2075</td><td>22.987952</td><td> 7.855422</td><td>37.060241</td><td>25.20482</td><td>6.650602</td><td>0.2409639</td></tr>
	<tr><td>v162</td><td>490</td><td>174</td><td>708</td><td>553</td><td>147</td><td>3</td><td>2075</td><td>23.614458</td><td> 8.385542</td><td>34.120482</td><td>26.65060</td><td>7.084337</td><td>0.1445783</td></tr>
	<tr><td>v163</td><td> 43</td><td>851</td><td>205</td><td>909</td><td> 64</td><td>3</td><td>2075</td><td> 2.072289</td><td>41.012048</td><td> 9.879518</td><td>43.80723</td><td>3.084337</td><td>0.1445783</td></tr>
	<tr><td>v164</td><td> 52</td><td>772</td><td>205</td><td>985</td><td> 55</td><td>6</td><td>2075</td><td> 2.506024</td><td>37.204819</td><td> 9.879518</td><td>47.46988</td><td>2.650602</td><td>0.2891566</td></tr>
	<tr><td>v165</td><td> 70</td><td>568</td><td>447</td><td>887</td><td> 96</td><td>7</td><td>2075</td><td> 3.373494</td><td>27.373494</td><td>21.542169</td><td>42.74699</td><td>4.626506</td><td>0.3373494</td></tr>
</tbody>
</table> 
</div>




```r
var_label(evs)
```


<div class="dataframe">
	
$v159
    'working mother warm relationship with children (Q48A)'

$v160
    'pre-school child suffers with working mother (Q48B)'

$v161
    'women really want home and children (Q48C)'

$v162
    'being housewife as fulfilling as paid job (Q48D)'

$v163
    'job best way for independence women (Q48E)'

$v164
    'husband+wife contribute to household income (Q48F)'

$v165
    'fathers as well suited to look after children as mothers (Q48G)' 
</div>




```r
#However, we need to change the name of column also
#Adding the question desc
#To call a column with name as numeric character, use with ``
#use last_col()

Quesdesc = c("v159" = "A working mother can establish just as warm and\nsecure an environment as a non-working mother", 
             "v160" = "A pre-school child is likely to suffer if\nhis or her mother is working",
             "v161" = "A job is alright, but what most women\nreally want is a home and children",
             "v162" = "Being a housewife is just as fulfilling as\nworking",
             "v163" = "Having a job is the best way for a woman\nto be independent",
             "v164" = "Both the husband and wife should contribute\nto the family income",
             "v165" = "In general, fathers are as well suited to\nlook after their children as women")

pivot_evs <- pivot_evs %>%
    mutate(Quesdesc = Quesdesc,
           Total = rowSums(select(., -Question)),
           "Agree strongly" = round(`1`/Total*100,2),
           "Agree" = round(`2`/Total*100,2),
           "Disagree" = round(`3`/Total*100,2),
           "Disagree strongly" = round(`4`/Total*100,2),
           ) %>%
    #We have to separate 2 mutate call due to the Total 
    mutate("n.a./don't know" = 100 - rowSums(select(.,`Agree strongly`:`Disagree strongly`)))
```


```r
pivot_evs
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A tibble: 7 × 14</caption>
<thead>
	<tr><th scope=col>Question</th><th scope=col>4</th><th scope=col>1</th><th scope=col>3</th><th scope=col>2</th><th scope=col>-1</th><th scope=col>-2</th><th scope=col>Quesdesc</th><th scope=col>Total</th><th scope=col>Agree strongly</th><th scope=col>Agree</th><th scope=col>Disagree</th><th scope=col>Disagree strongly</th><th scope=col>n.a./don't know</th></tr>
	<tr><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td>v159</td><td>112</td><td>803</td><td>311</td><td>782</td><td> 67</td><td>0</td><td>A working mother can establish just as warm and
secure an environment as a non-working mother</td><td>2075</td><td>38.70</td><td>37.69</td><td>14.99</td><td> 5.40</td><td>3.22</td></tr>
	<tr><td>v160</td><td>337</td><td>332</td><td>655</td><td>647</td><td>101</td><td>3</td><td>A pre-school child is likely to suffer if
his or her mother is working                       </td><td>2075</td><td>16.00</td><td>31.18</td><td>31.57</td><td>16.24</td><td>5.01</td></tr>
	<tr><td>v161</td><td>477</td><td>163</td><td>769</td><td>523</td><td>138</td><td>5</td><td>A job is alright, but what most women
really want is a home and children                     </td><td>2075</td><td> 7.86</td><td>25.20</td><td>37.06</td><td>22.99</td><td>6.89</td></tr>
	<tr><td>v162</td><td>490</td><td>174</td><td>708</td><td>553</td><td>147</td><td>3</td><td>Being a housewife is just as fulfilling as
working                                           </td><td>2075</td><td> 8.39</td><td>26.65</td><td>34.12</td><td>23.61</td><td>7.23</td></tr>
	<tr><td>v163</td><td> 43</td><td>851</td><td>205</td><td>909</td><td> 64</td><td>3</td><td>Having a job is the best way for a woman
to be independent                                   </td><td>2075</td><td>41.01</td><td>43.81</td><td> 9.88</td><td> 2.07</td><td>3.23</td></tr>
	<tr><td>v164</td><td> 52</td><td>772</td><td>205</td><td>985</td><td> 55</td><td>6</td><td>Both the husband and wife should contribute
to the family income                             </td><td>2075</td><td>37.20</td><td>47.47</td><td> 9.88</td><td> 2.51</td><td>2.94</td></tr>
	<tr><td>v165</td><td> 70</td><td>568</td><td>447</td><td>887</td><td> 96</td><td>7</td><td>In general, fathers are as well suited to
look after their children as women                 </td><td>2075</td><td>27.37</td><td>42.75</td><td>21.54</td><td> 3.37</td><td>4.97</td></tr>
</tbody>
</table> 
</div>



## Target result

http://www.datavisualisation-r.com/pdf/barcharts_multiple_all.pdf

This is a stacked bar for multiple variables in the dataframe. So basically the dataset should be in the "longer" form.
Let's start


```r
library(forcats)
```


```r
#Instead of using pivot_longer for 2-times-pivoted df pivot_evs
#We will create it from start, for our need.
#Explanation for friendly warning message "`summarise()` has grouped output by"
#https://stackoverflow.com/questions/62140483/how-to-interpret-dplyr-message-summarise-regrouping-output-by-x-override

evs_613 <- evs %>%
    pivot_longer(cols=everything(), names_to = "Question", values_to = "Answer") %>%
    mutate(Anstype = factor(Answer, levels = c(-2, -1, 1, 2, 3, 4), 
                            labels = c("n.a./don't know", "n.a./don't know", "agree strongly", "agree", "disagree", "disagree strongly"))) %>%
    #reorder the Anstype to reverse order
    #mutate(Question = fct_reorder(Question, .desc=T))
    #the default .add=FALSE group_by() will override existing groups.
    group_by(Question, Answer, Anstype, .add=T) %>%
    #Add summarized column after grouping
    summarize(Count = n())
```

    [1m[22m`summarise()` has grouped output by 'Question', 'Answer'. You can override using the `.groups` argument.
    


```r
head(evs_613)
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A grouped_df: 6 × 4</caption>
<thead>
	<tr><th scope=col>Question</th><th scope=col>Answer</th><th scope=col>Anstype</th><th scope=col>Count</th></tr>
	<tr><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;dbl+lbl&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;int&gt;</th></tr>
</thead>
<tbody>
	<tr><td>v159</td><td>-1</td><td>n.a./don't know  </td><td> 67</td></tr>
	<tr><td>v159</td><td> 1</td><td>agree strongly   </td><td>803</td></tr>
	<tr><td>v159</td><td> 2</td><td>agree            </td><td>782</td></tr>
	<tr><td>v159</td><td> 3</td><td>disagree         </td><td>311</td></tr>
	<tr><td>v159</td><td> 4</td><td>disagree strongly</td><td>112</td></tr>
	<tr><td>v160</td><td>-2</td><td>n.a./don't know  </td><td>  3</td></tr>
</tbody>
</table> 
</div>




```r
#Setting width and height
options(repr.plot.width=10, repr.plot.height=6)
```


```r
#Remember to add discrete = TRUE in viridis
ggplot(evs_613, aes(x=Count, y=Question)) +
    geom_bar(mapping=aes(fill=Anstype), position = "fill", stat = "identity") +
    scale_fill_viridis(discrete=T, option = "plasma")
```


    
![png](@assets/03-Bar-chart-multi-2/output_17_0.png)
    



```r
#Create custom color vector based on origin (using eye-dropper)
color_613 <- c("n.a./don't know" = "#bebebe", 
               "agree strongly" = "#00d0e2", 
               "agree" = "#6ddde1", 
               "disagree" = "#ff8aee", 
               "disagree strongly" = "#ff00d2")
```


```r
#Result - seem easy?

ggplot(evs_613, aes(x=Count, y=Question)) +
    #reverse position
    geom_col(mapping=aes(fill=Anstype), position = position_fill(reverse = T)) +
    #add annotate
    annotate("text", x=0, y=7.75, label = "N=2,075", hjust=0) +
    annotate("text", x=1, y=7.75, label="all values in percent", hjust=1, fontface="italic") +
    #manual fill color
    scale_fill_manual(values=color_613) +
    #mapping label of y axis to description
    scale_y_discrete(labels=Quesdesc, limits=rev) +
    #edit the break label in x-axis and turn scale 1 to 100 percent
    scale_x_continuous(breaks = seq(0, 1, 0.2), labels= function(x) x*100) +
    #edit the labels
    labs(x=NULL, y=NULL,
         title="It is often said that attitudes towards gender roles are changing",
         caption="Source: European Values Study 2008 Germany, ZA4800. www.gesis.org.") +
    #changing theme
    theme(panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          plot.caption = element_text(face="italic"),
          plot.title.position = "plot",
          legend.position = "top",
          legend.title = element_blank(),) +
    guides(fill = guide_legend(title.position = "right", 
                               label.position = "left", 
                               label.hjust = 0
                              )) +
    coord_cartesian(clip="off")
```


    
![png](@assets/03-Bar-chart-multi-2/output_19_0.png)
    

