const { response } = require("express");
//const response=require('express');
function openTab(tabId) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    // Deactivate all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }

    // Activate the clicked tab button
    const clickedButton = event.currentTarget;
    clickedButton.classList.add('active');
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('warning').style.display = 'none';
    document.getElementById('tab-container').style.display = 'none';
}

async function searchAPI() {
    const searchTerm = document.getElementById('searchInput').value;

    const response = await fetch('https://stock-market-backend1.wl.r.appspot.com/company/'+searchTerm);
    const warning = await response.json();

    if(Object.keys(warning).length === 0){
        console.log("The data is ", warning);
        document.getElementById('warning').style.display = 'block';
    }
    else{
        let response = await fetch('https://stock-market-backend1.wl.r.appspot.com/company/'+searchTerm);
        let company_data = await response.json();
        displayResults(company_data);
        document.getElementById('tab-container').style.display = 'block';
        const response2 = await fetch('http://127.0.0.1:5000/summary/'+searchTerm);
        if (!response2.ok) {
            console.error('Failed to fetch data:', response2.statusText);
            return;
        }
        let summary_data = await response2.json();
        console.log('Summary Data:', summary_data);
        displaySummary(company_data.ticker, summary_data);
        document.getElementById('tab-container').style.display = 'block';
        const response3 = await fetch('http://127.0.0.1:5000/recommendations/'+searchTerm);
        const reco_data = await response3.json();
        displayRecomedations(latestDate(reco_data));
        const response4 = await fetch('http://127.0.0.1:5000/chart/'+searchTerm)
        const charts = await response4.json();
        displayCharts(charts);
        const response5 = await fetch('http://127.0.0.1:5000/news/'+searchTerm);
        const news_data = await response5.json();
        displayNews(news_data);
    }


    // fetch('http://127.0.0.1:5000/chart/'+searchTerm)
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    //     displayCharts(data);
    // })

    // fetch('http://127.0.0.1:5000/news/'+searchTerm)
    // .then(responses => responses.json())
    // .then(data => {
    //     console.log(data);
    //     displayNews(data);
    // })

}

function latestDate(data){

    console.log(data);

    const latestdate = data.reduce((latest, data) => {
        return data.period > latest ? data.period : latest;
    },'');

    const latestData = data.find(data => data.period === latestdate);

    return latestData;
}
///{"country":"US","currency":"USD","estimateCurrency":"USD","exchange":"NASDAQ NMS - GLOBAL MARKET","finnhubIndustry":"Technology",
//"ipo":"1980-12-12","logo":"https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AAPL.png",
//"marketCapitalization":3358745.953943074,"name":"Apple Inc","phone":"14089961010","shareOutstanding":15204.14,"ticker":"AAPL",
//"weburl":"https://www.apple.com/"}
function displayResults(data) {
    const resultsDiv = document.getElementById('resultContainer');
    const resImg = document.getElementById('resultImage');

    if(data.logo){
        resImg.src = data.logo;
    }

    if(data.name){
        const name = document.getElementById('companyName')
        name.innerText = data.name;
    }

    if(data.ticker){
        const ticker = document.getElementById('stockTickerSymbol')
        ticker.innerText = data.ticker;
    }

    if(data.exchange){
        const exchange = document.getElementById('stockExchangeCode')
        exchange.innerText = data.exchange;
    }

    if(data.ipo){
        const ipo = document.getElementById('companyStartDate')
        ipo.innerText = data.ipo;
    }

    if(data.finnhubIndustry){
        const weburl = document.getElementById('category')
        weburl.innerText = data.finnhubIndustry;
    }

    return

}
//{"c":220.91,"d":0.09,"dp":0.0408,"h":221.27,"l":216.72,"o":220.9,"pc":220.82,"t":1725912002}
function displaySummary(ticker, data) {
    const summaryDiv = document.getElementById('summary');
    console.log(data);
    if(ticker){
        const cticker = document.getElementById('stockTickerSymbol2')
        cticker.innerText = ticker;
    }

    if(data.t){
        const tradingday = document.getElementById('tradingday');
        tradingday.innerText = data.t || 'N/A';
    }

    if(data.pc){
        const previousclose = document.getElementById('pcp');
        previousclose.innerText = data.pc || 'N/A';
    }

    if(data.o){
        const openingprice = document.getElementById('openingp');
        openingprice.innerText = data.o || 'N/A';
    }

    if(data.h){
        const high = document.getElementById('highp');
        high.innerText = data.h || 'N/A';
    }

    if(data.l){
        const low = document.getElementById('lowp');
        low.innerText = data.l || 'N/A';
    }

    if(data.d){
        const dailychange = document.getElementById('ch');
        dailychange.innerText = data.d;
        const changeImg = document.getElementById('changeImg');

        if(data.d > 0){
            changeImg.src = "images/GreenArrowUp.png";
        }
        else{
            changeImg.src = "images/RedArrowDown.png";
        }

        changeImg.style.width = "20px";
        changeImg.style.height = "20px";

    }

    if(data.dp){
        const dailypercentage = document.getElementById('ch1');
        dailypercentage.innerText = data.dp;
        const changeImg1 = document.getElementById('changeImg1');

        if(data.dp > 0){
            changeImg1.src = "images/GreenArrowUp.png";
        }
        else{
            changeImg1.src = "images/RedArrowDown.png";
        }

        changeImg1.style.width = "20px";
        changeImg1.style.height = "20px";

    }

    return
}


function displayRecomedations(data) {

    console.log(data);

    const rec1 = document.getElementById('rec1');
    const rec2 = document.getElementById('rec2');
    const rec3 = document.getElementById('rec3');
    const rec4 = document.getElementById('rec4');
    const rec5 = document.getElementById('rec5');

    rec1.innerText = data.strongSell;
    rec2.innerText = data.sell;
    rec3.innerText = data.hold;
    rec4.innerText = data.buy;
    rec5.innerText = data.strongBuy;

    return
}

function displayNews(data) {

    const news = document.getElementsByClassName('news_data');
    const newsImg = document.getElementsByClassName('news_image');
    const newsHeadline = document.getElementsByClassName('news_headline');
    const newsDate = document.getElementsByClassName('news_date');
    const newsUrl = document.getElementsByClassName('news_source');
    let newsData = [];

    let count = 0;

    for( let i=0; i<data.length; i++){
        let isEmpty = Object.values(data[i]).some(x => (x == null || x == "" || x == " "));

        if(!isEmpty){
            newsData.push(data[i]);
            count++;

            if(count == 5){
                break;
            }
        }

    }

    for( let i=0; i<newsData.length; i++){
        console.log("The news data image is at " + newsData[i].image);
        newsImg[i].innerHTML = "<img src=" + newsData[i].image + " alt='News Image' style='width: 100px; height: 100px;'>";
        newsHeadline[i].innerText = newsData[i].headline;
        newsDate[i].innerText = convertToDate(newsData[i].datetime);
        newsUrl[i].innerHTML = "<a href=" + newsData[i].url + " target='_blank' style='color: blue'>See Orginal Post</a>";
    }

    return
}


function convertToDate(date){

    const dateObject = new Date(date * 1000);      //https://chat.openai.com/c/5d5826bb-112b-4948-8eba-ad49ecde090f

    const formattedDate = dateObject.toLocaleDateString("en-US", {                //https://chat.openai.com/c/5d5826bb-112b-4948-8eba-ad49ecde090f
        day: "numeric",                                                           //https://chat.openai.com/c/5d5826bb-112b-4948-8eba-ad49ecde090f  
        month: "long",                                                            //https://chat.openai.com/c/5d5826bb-112b-4948-8eba-ad49ecde090f      
        year: "numeric"                                                           //https://chat.openai.com/c/5d5826bb-112b-4948-8eba-ad49ecde090f  
    });

    return formattedDate;       //https://chat.openai.com/c/5d5826bb-112b-4948-8eba-ad49ecde090f

}


function displayCharts(data){
    const stockPriceData = data.results.map(point => [point.t, point.c]);
    const volumeData = data.results.map(point => [point.t, point.v]);
      
    console.log("Data points for the first chart:");
    console.log(stockPriceData);
    console.log("Data points for the second chart:");
    console.log(volumeData);

    groupingUnits = [[
        'week',                         // unit name
        [1]                             // allowed multiples
    ], [
        'month',
        [1, 2, 3, 4, 6]
    ]];


    Highcharts.stockChart('container', {
        rangeSelector: {
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d'
            }, {
                type: 'day',
                count: 15,
                text: '15d'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m'
            }, {
                type: 'all',
                text: '6m'
            }],
        },
        title: {
            text: 'Stock Price ' + data.ticker + ' ' + getDate()
        },
        subtitle: {
            text: '<a href="https://polygon.io/" target="_blank" style="color: blue">Source: Polygon.io</a>'
        },

        yAxis: [{
            title: {
                text: 'Stock Price'
            },
            opposite: false,
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            opposite: true,
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '40%',
            offset: 0,
            lineWidth: 2
        }],

        plotOptions: {
            column: {
                color: 'black', // Set the column color to black
                borderColor: 'black' // Set the border color of the columns to black
            }
        },

        series: [{
            name: 'AAPL Stock Price',
            data: stockPriceData,
            type: 'area',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            }
        }, {
            type: 'column',
            name: 'Volume',
            data: volumeData,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        }]

    });

}


function getDate(){
    date = Date.now();
    const dateObject = new Date(date);
    const formattedDate = dateObject.toISOString().split('T')[0];
    return formattedDate;

}
