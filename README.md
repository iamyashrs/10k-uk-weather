# 10K UK Weather Analyzer

> Analyze, Visualize UK and Other regions weather data, while playing a short game and learn some facts as well.

Available online:
[https://10k-uk-weather.azurewebsites.net/](https://10k-uk-weather.azurewebsites.net/)

My entry for the [10k Apart](https://a-k-apart.com/) 2016 contest. Runs on NodeJs and requires only HTML on the client for full functionality. CSS & JS provides the other enhancements.

## Size (8,015 Bytes)

Pages clocks in at just over 8kB with enhancements. If the browser is JavaScript enabled, additional requests will be made for JavaScript enhancements and loading of a Visuzalization which is written in vanilla JavaScript. Asynchronously request for the JS and other assets. Most of the requests are GZIP'ed, Minified and Cached for the end user. To make the page load blazing fast. Most of the dynamic results are calculated on the backend, to reduce the page size and requests count.

## Progressive Enhancement (Vanilla JS & CSS with Dynamic Pages)

Javascript and CSS provides furthur enhancements to the application, with web application working without several enhancements as well.

<img width="1440" src="http://i.imgur.com/JAga3kr.png" />

## Performance (1.09 Seconds (Approx))

All assets with the exception of HTML and CSS are loaded asynchronously. Most of the requests are GZIP'ed, Minified and Cached for the end user. 

## Browser Support (Lynx, IE, Chrome, Safari.. etc)

Support for all modern browsers and even including support for text based browsers such as Lynx browser. The web application is fully responsive and would feel great at any device with bare minimum screen size.

<center><img width="820" src="http://i.imgur.com/cMLeQJB.png" />

<img width="200" src="http://i.imgur.com/2v67DXE.png" /></center>

## Accessibility (a11y)

Most of the accessibility tips have been considered and implemented in the web application. Even support for contrast, with vibrant colors for different sections of the application. ARIA landmarks are used for navigation, and other visualizations for better display of data to users. Text graph will be visible to text based browsers as well. Js and CSS do provide furthur enhancements.

## Credit (MET)

Data from public sector information licensed under the [Open Government Licence v1.0](http://www.nationalarchives.gov.uk/doc/open-government-licence/), [view data source](http://www.metoffice.gov.uk/climate/uk/datasets/#). 

## License (MIT)