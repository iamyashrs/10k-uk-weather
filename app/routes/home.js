var express = require('express');
var fs = require('fs');
var request = require('request');
var chart = require('ascii-chart');
    
var router = express.Router();

var facts = [];
facts.push("<p>July 2006 stands as the <a href='http://www.metoffice.gov.uk/climate/uk/interesting/july2006'>warmest month</a> since records began in 1659 causing damage to road surfaces and buckling of rail lines.</p><p>It's been estimated that excess deaths due to the heat was <a href='https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/201039/Heatwave-Main_Plan-2013.pdf'>680 people</a>.</p>");
facts.push("<p>Although not recorded as one of the top 5 warmest months, August 2003 averaged 16.5&deg;C and had the <a href='http://www.bbc.co.uk/weather/features/23642901'>hottest day ever recorded</a>.</p><p>Excess deaths in August 2003 were estimated at <a href='https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/201039/Heatwave-Main_Plan-2013.pdf'>over 2000</a>.</p>");
facts.push("<p>July 1983 was the second warmest month on record resulting in a <a href='http://news.bbc.co.uk/1/hi/uk/3140675.stm'>rush on barbecue gear, salads, beer and soft drinks</a> and speed restrictions on railways.</p>");
facts.push("<p>The July 1976 heat wave led to the <a href='http://en.wikipedia.org/wiki/1976_United_Kingdom_heat_wave'>hottest summer average temperature since records began</a> causing a severe drought in the UK.</p><p>50,000 trees were destroyed by fire Hurn Forest, Dorset while £500 million worth of crops failed.</p>");
facts.push("<p>The winter of 1962/63, also known as the Big Freeze of 1963, was one of the <a href='http://en.wikipedia.org/wiki/Winter_of_1962%E2%80%9363_in_the_United_Kingdom'>coldest winters on record</a> in the UK.</p><p>The long bitterly cold spell caused <a href='http://www.metoffice.gov.uk/education/teens/case-studies/severe-winters'>lakes and rivers to freeze</a>, even the sea froze in places.</p>");
facts.push("<p>The UK suffered a <a href='http://en.wikipedia.org/wiki/Winter_of_1946%E2%80%9347_in_the_United_Kingdom'>harsh winter in 1946/47</a> bringing large snow drifts causing roads and railways to be blocked. Coal supplies struggled to get through to power stations resulting in energy rations.</p><p>As warmer weather reached the UK the melt water caused <a href='http://www.metoffice.gov.uk/education/teens/case-studies/severe-winters'>floods</a>, damaging hundreds of homes.</p><p>Ironically the summer of 1947 had one of the warmest <a href='http://www.ukweatherworld.co.uk/forum/index.php?/topic/55504-the-heatwave-of-late-may-early-june-1947/'>Augusts on record</a>.</p>");
facts.push("<p>The 10th hottest year on record, the UK endured a heatwave lasting two and a half months. Fatalities <a href='http://en.wikipedia.org/wiki/1911_United_Kingdom_heat_wave'>became common</a> whilst food spoiled very quickly and sewage spilled out.</p><p>The ensuing drought affected agriculture resulting in higher food prices.</p>");

var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

router.get('/', function (req, res, next) {

    var region, mode, page_title, dimention;
    
    if (["UK", "England", "Wales", "Scotland"].indexOf(req.query.region) > -1  
      && ["Max Temp", "Min Temp", "Mean Temp", "Rainfall", "Sunshine"].indexOf(req.query.mode) > -1) {
        
        region = req.query.region;
        mode = req.query.mode;
        page_title = region + ' Weather - ' + mode;
    
    } else {
        region = "UK";
        mode = "Mean Temp";
        page_title = "10K UK Weather Analyzer | Climate Visualizer";
    }

    if (["Max Temp", "Min Temp", "Mean Temp"].indexOf(mode) > -1){
        dimention = "<sup>o</sup>C";
    } else if (mode == "Rainfall") {
        dimention = "Milimeters";
    } else if (mode == "Sunshine") {
        dimention = "Hours";
    }
     
    var guess = parseFloat(req.query.guess);
    var request_url = "https://uk-weather-analyzer.appspot.com/api/readings/?region=" + region + "&mode=" + mode;

    request(request_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            
            api_object = JSON.parse(body);
            
            res.locals.data = api_object.results;
            
            res.locals.page_title = page_title;

            res.locals.region = region;
            res.locals.mode = mode;

            var index, j, latest_value;
            var data_ann = [];
            var data_yr = [];
            var latest_year_values = [];
            for (index = 0; index < api_object.results.length; ++index) {
                data_yr.push(api_object.results[index].Year);
                data_ann.push(api_object.results[index].ANN);
                if (index == (api_object.results.length - 1)){
                    latest_year_values.push(api_object.results[index].JAN, api_object.results[index].FEB,
                               api_object.results[index].MAR, api_object.results[index].APR, api_object.results[index].MAY,
                               api_object.results[index].JUN, api_object.results[index].JUL, api_object.results[index].AUG,
                               api_object.results[index].SEP, api_object.results[index].OCT, api_object.results[index].NOV,
                               api_object.results[index].DEC);
                }
            }
            var chart_txt = chart(data_ann, {
                              width: 33,
                              height: 20,
                              padding: 0,
                              pointChar: '#',
                              negativePointChar: '.',
                              axisChar: '.'
                            });
            var latest_year_values_without_null = without(latest_year_values, null);
            res.locals.chart = chart_txt;
            res.locals.data_ann = data_ann;
            res.locals.years = data_yr;
            res.locals.fact = facts[Math.floor(Math.random() * facts.length)];
            res.locals.latest_year = data_yr[data_yr.length - 1];
            res.locals.latest_month = MONTHS[latest_year_values_without_null.length-1];
            res.locals.latest_value = latest_year_values_without_null[latest_year_values_without_null.length - 1];
            res.locals.valueHash = res.locals.latest_value + res.locals.latest_year;
            if (guess){
                res.locals.guess = guess;
            }
            res.locals.dimention = dimention;
        }

        next();
        
    });
    
    // next();
    
}, function (req, res) {
    
    //set cache control headers
    res.set("Cache-Control","max-age=86400");
    res.set("Vary", "Accept-Encoding");

    res.render("home" , { 
      title: res.locals.page_title,
      website: req.website
    });
    
});

module.exports = router;

function without(array, what){
    return array.filter(function(el){
        return el !== what;
    });
}
