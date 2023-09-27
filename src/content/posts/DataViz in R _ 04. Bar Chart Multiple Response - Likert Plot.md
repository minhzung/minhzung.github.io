---

author: Mindx
pubDate: 2023-05-01T19:30:00+07:00
title: "DataViz in R | 04. Bar Chart Multiple Responses - Likert Plot"
image: "@assets/04-Bar-chart-multi-likert/6.1.4_Bar_Chart_for_mulres_-_Likert.svg"

category: 'ggplot'
draft: false
tags:
- dataviz
- learning


description: "More advance bar chart, or diverging stacked bar chart, or some kind of likert plot."

---
## Target result

http://www.datavisualisation-r.com/pdf/barcharts_multiple_all_2.pdf

In the previous bar charts, each bar aligns to the left of x-axis. We will highlight the difference between **positive and negative responses** by dividing each bar into two halves from a central axis. This may obscure the comparison of the length between the bars. However, this is a chart that represents a total of 100% for each bar, and the lengths of the bars are equal, so we can omit it.


```r
#Load neccessary lib
library(ggplot2)
library(dplyr)
#Setting width and height
theme_set(theme_minimal())
options(repr.plot.width=10, repr.plot.height=6)
```


```r
#Load data
ZA4800_DE <- readRDS("./myData/EVS_2008/germany.Rda")
ZA4800_DE <- ZA4800_DE[,-1]
head(ZA4800_DE)
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A tibble: 6 × 7</caption>
<thead>
	<tr><th scope=col>v159</th><th scope=col>v160</th><th scope=col>v161</th><th scope=col>v162</th><th scope=col>v163</th><th scope=col>v164</th><th scope=col>v165</th></tr>
	<tr><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th><th scope=col>&lt;hvn_lbll&gt;</th></tr>
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
#Load library HAVEN for reading hvn_* type
library(haven)
#Data wrangling by library TIDYR
library(tidyr)
```


```r
evs <- ZA4800_DE %>%
    pivot_longer(cols=everything(), names_to = "Question", values_to = "Answer") %>%
    mutate(Anstype = factor(Answer, levels = c(-2, -1, 1, 2, 3, 4), 
                            labels = c("n.a./don't know", "n.a./don't know", "agree strongly", "agree", "disagree", "disagree strongly"))) %>%
    #the default .add=FALSE group_by() will override existing groups.
    group_by(Question, Anstype, .add=T) %>%
    #Add summarized column after grouping
    summarize(Count = n())
```

    [1m[22m`summarise()` has grouped output by 'Question'. You can override using the `.groups` argument.
    


```r
head(evs,10)
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A grouped_df: 10 × 3</caption>
<thead>
	<tr><th scope=col>Question</th><th scope=col>Anstype</th><th scope=col>Count</th></tr>
	<tr><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;int&gt;</th></tr>
</thead>
<tbody>
	<tr><td>v159</td><td>n.a./don't know  </td><td> 67</td></tr>
	<tr><td>v159</td><td>agree strongly   </td><td>803</td></tr>
	<tr><td>v159</td><td>agree            </td><td>782</td></tr>
	<tr><td>v159</td><td>disagree         </td><td>311</td></tr>
	<tr><td>v159</td><td>disagree strongly</td><td>112</td></tr>
	<tr><td>v160</td><td>n.a./don't know  </td><td>104</td></tr>
	<tr><td>v160</td><td>agree strongly   </td><td>332</td></tr>
	<tr><td>v160</td><td>agree            </td><td>647</td></tr>
	<tr><td>v160</td><td>disagree         </td><td>655</td></tr>
	<tr><td>v160</td><td>disagree strongly</td><td>337</td></tr>
</tbody>
</table> 
</div>




```r
#Load question description
#These descriptions have already been incorporated into label of "Question"
#However, it's short and not suitable for presentation purpose

Quesdesc = c("v159" = "A working mother can establish just as warm and\nsecure an environment as a non-working mother", 
             "v160" = "A pre-school child is likely to suffer if\nhis or her mother is working",
             "v161" = "A job is alright, but what most women\nreally want is a home and children",
             "v162" = "Being a housewife is just as fulfilling as\nworking",
             "v163" = "Having a job is the best way for a woman\nto be independent",
             "v164" = "Both the husband and wife should contribute\nto the family income",
             "v165" = "In general, fathers are as well suited to\nlook after their children as women")
```


```r
#Create custom color vector based on origin graph(using eye-dropper)
color_evs <- c("n.a./don't know" = "#bebebe", 
               "agree strongly" = "#00d0e2", 
               "agree" = "#6ddde1", 
               "disagree" = "#ff8aee", 
               "disagree strongly" = "#ff00d2")
```

Initially, I have no idea about the key word to search how to draw this. It seems like a "likert plot", however, the many links I found using another package (HH). 
The more appropriate term is <mark>"diverging stacked bar"</mark>
Try with this one: https://rfortherestofus.com/2021/10/diverging-bar-chart/

The trick here is turn the negative answers to negative percentage value

**Bonus:**
A very interesting article that I found, in which they compare the **diverging stacked bar** with others
https://blog.datawrapper.de/divergingbars/


```r
#We need to create a percentage column, in which the negative percentage represents negative answer
evs_614 <- evs %>%
           group_by(Question, .add=T) %>%
           mutate(percent_answers = Count / sum(Count)) %>%
           mutate(plot_perc = ifelse(Anstype %in% c("disagree", "disagree strongly"), percent_answers, -percent_answers))

head(evs_614)
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A grouped_df: 6 × 5</caption>
<thead>
	<tr><th scope=col>Question</th><th scope=col>Anstype</th><th scope=col>Count</th><th scope=col>percent_answers</th><th scope=col>plot_perc</th></tr>
	<tr><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td>v159</td><td>n.a./don't know  </td><td> 67</td><td>0.03228916</td><td>-0.03228916</td></tr>
	<tr><td>v159</td><td>agree strongly   </td><td>803</td><td>0.38698795</td><td>-0.38698795</td></tr>
	<tr><td>v159</td><td>agree            </td><td>782</td><td>0.37686747</td><td>-0.37686747</td></tr>
	<tr><td>v159</td><td>disagree         </td><td>311</td><td>0.14987952</td><td> 0.14987952</td></tr>
	<tr><td>v159</td><td>disagree strongly</td><td>112</td><td>0.05397590</td><td> 0.05397590</td></tr>
	<tr><td>v160</td><td>n.a./don't know  </td><td>104</td><td>0.05012048</td><td>-0.05012048</td></tr>
</tbody>
</table> 
</div>




```r
ggplot(evs_614, aes(x=plot_perc, y=Question)) +
    geom_col(mapping=aes(fill=Anstype))
```


    
![png](@assets/04-Bar-chart-multi-likert/output_10_0.png)
    



```r
#Looks good. Now we change the order of level using forcats fct_relevel

library(forcats)
levels(evs_614$Anstype)
```


<div class="dataframe">
    'n.a./don\'t know''agree strongly''agree''disagree''disagree strongly'
</div>

```r
evs_614 %>%
    mutate(Anstype = fct_relevel(Anstype, 'agree strongly', 'agree', 'n.a./don\'t know', 'disagree strongly','disagree')) %>%
    ggplot(aes(x=plot_perc, y=Question)) +
    geom_col(mapping=aes(fill=Anstype)) +
    #Change the order of legend accordingly
    scale_fill_manual(values=color_evs,
                      limits=c('agree strongly', 'agree', 'n.a./don\'t know', 'disagree strongly','disagree')) 
    
```


    
![png](@assets/04-Bar-chart-multi-likert/output_12_0.png)
    


Next, I want the `n.a` tag goes to the very left of the plot. 

The original idea in R-base is using multiple layers: one for the neutral group, one for the negative answers, one for the positive answers and the fourth for the gap between them.


```r
#add a geom_col layer and move to x=-1 using position_nudge
#The gap is too big, so I reordered it
#To avoid changing "negative answer" to "positive percent" and have unneccessary confusion
#I decided to reverse the x-axis

evs_614 %>%
    mutate(Anstype = fct_relevel(Anstype, 'agree strongly', 'agree', 'n.a./don\'t know', 'disagree strongly','disagree')) %>%
    ggplot(aes(x=plot_perc, y=Question)) +
    #subset to create geom_col for non-neutral group
    geom_col(data=subset(evs_614, Anstype != "n.a./don't know"), mapping=aes(fill=Anstype)) +
    #subset to create geom_col for neutral group
    geom_col(data=subset(evs_614, Anstype == "n.a./don't know"), mapping=aes(x=-plot_perc, fill=Anstype),
             position = position_nudge(-1)) +
    #Change the order of legend accordingly
    scale_fill_manual(values=color_evs,
                     limits=c('agree strongly', 'agree', 'n.a./don\'t know', 'disagree strongly','disagree')) +
    #Reverse x-axis and also label them
    scale_x_reverse(breaks = seq(-0.6, 0.8, 0.2), labels= function(x) round(abs(x)*100,0))
```


    
![png](@assets/04-Bar-chart-multi-likert/output_14_0.png)
    


In above graph, `subset` function does perfectly, except for the levels new subset need to be reordered again.

In addition, the order of question is also wrong direction. We try to reorder it based on the number of total negative answer (i.e `disagree` + `disagree strongly`).

Found the idea for solution in [SO](https://stackoverflow.com/questions/66416961/a-tidy-way-to-order-x-axis-in-stacked-bar-by-subset-of-fill)


```r
#Data wrangling and reorder all levels
#reorder: reorder based on levels of another column
#But before it, we need to identify which is the correct order of level using relevel

evs_614X <-    
    evs_614 %>%
    mutate(Anstype = fct_relevel(Anstype, 'agree strongly', 'agree', 'n.a./don\'t know', 'disagree strongly','disagree')) %>%
    group_by(Question) %>%
    #Be aware of "Count" in the below bracket is the name of column, not a function
    mutate(num_positive = sum(Count[Anstype %in% c('disagree strongly','disagree')])) %>%
    #ungroup to clear the grouping in reorder Question 
    ungroup() %>%
    mutate(Question = fct_reorder(Question, num_positive))

```


```r
head(evs_614X)
```


<div class="relative overflow-auto font-mono text-sm max-h-96 text-left text-base-content/70 dataframe">
 <table class="dataframe">
<caption>A tibble: 6 × 6</caption>
<thead>
	<tr><th scope=col>Question</th><th scope=col>Anstype</th><th scope=col>Count</th><th scope=col>percent_answers</th><th scope=col>plot_perc</th><th scope=col>num_positive</th></tr>
	<tr><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;fct&gt;</th><th scope=col>&lt;int&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;int&gt;</th></tr>
</thead>
<tbody>
	<tr><td>v159</td><td>n.a./don't know  </td><td> 67</td><td>0.03228916</td><td>-0.03228916</td><td>423</td></tr>
	<tr><td>v159</td><td>agree strongly   </td><td>803</td><td>0.38698795</td><td>-0.38698795</td><td>423</td></tr>
	<tr><td>v159</td><td>agree            </td><td>782</td><td>0.37686747</td><td>-0.37686747</td><td>423</td></tr>
	<tr><td>v159</td><td>disagree         </td><td>311</td><td>0.14987952</td><td> 0.14987952</td><td>423</td></tr>
	<tr><td>v159</td><td>disagree strongly</td><td>112</td><td>0.05397590</td><td> 0.05397590</td><td>423</td></tr>
	<tr><td>v160</td><td>n.a./don't know  </td><td>104</td><td>0.05012048</td><td>-0.05012048</td><td>992</td></tr>
</tbody>
</table> 
</div>




```r
#Create our plot

plot_614 <- evs_614X %>%
    ggplot(aes(x=plot_perc, y=Question)) +
    #subset to create geom_col for non-neutral group
    geom_col(data=subset(evs_614X, Anstype != "n.a./don't know"), mapping=aes(fill=Anstype)) +
    #subset to create geom_col for neutral group
    geom_col(data=subset(evs_614X, Anstype == "n.a./don't know"), mapping=aes(x=-plot_perc, fill=Anstype),
             position = position_nudge(-1)) +
    #Add zero point segment, to distingush positive and negative answer
    geom_segment(aes(x=0, y=0.25, xend=0, yend=+7.75), color="#6ca6cd", linewidth=0.75) +
    #Change the order of legend accordingly
    scale_fill_manual(values=color_evs,
                     limits=c('n.a./don\'t know', 'agree strongly', 'agree', 'disagree','disagree strongly')) +
    #Reverse x-axis and also label them
    scale_x_continuous(breaks = seq(-0.8, 0.6, 0.2), labels= function(x) round(abs(x)*100,0)) +
    #mapping label of y axis to description
    scale_y_discrete(labels=Quesdesc) +
    #add annotate
    annotate("text", x=-1, y=8, label = "N=2,075", hjust=0) +
    annotate("text", x=0.7, y=8, label="all values in percent", hjust=1, fontface="italic") +
    #avoid clipping through the annotate
    coord_cartesian(clip="off") +
    #edit the labels
    labs(x=NULL, y=NULL,
         title="It is often said that attitudes towards gender roles are changing",
         caption="Source: European Values Study 2008 Germany, ZA4800. www.gesis.org.") +
    #changing theme
    theme(panel.grid.major = element_blank(),
          panel.grid.minor = element_blank(),
          plot.caption = element_text(face="italic"),
          plot.title.position = "plot",
          plot.title = element_text(margin=margin(b=20)),
          legend.position = "bottom",
          legend.title = element_blank(),
          legend.spacing.x = unit(0.5, "cm"),)
                       
plot_614
```


    
![png](@assets/04-Bar-chart-multi-likert/output_18_0.png)
    



```r
#Changing the font
library(extrafont)
theme_set(theme_minimal(base_family = "Lato Light"))
plot_614 + 
    theme(plot.title = element_text(family="Lato Black"))
```

    
![png](@assets/04-Bar-chart-multi-likert/output_19_1.png)
    


## Final result in svg


```r
ggsave("6.1.4 Bar Chart for mulres - Advance.svg", last_plot(), device=svg, bg="white", width = 20, height = 12, units="cm")
```


![Barchart Likert](@assets/04-Bar-chart-multi-likert/6.1.4_Bar_Chart_for_mulres_-_Likert.svg)

