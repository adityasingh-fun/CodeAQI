const aqiModel = require('../models/aqi_inModel');
const historicModel = require('../models/historicModel.js');
const cronLogModel = require('../models/cronLogModel.js');
const moment = require('moment-timezone');
const axios = require("axios");
const fs = require('fs');
const csv = require('csv-parser');

function InvLinear(AQIhigh, AQIlow, Conchigh, Conclow, a) {
    let invLinear;
    let Conc = ((a - AQIlow) / (AQIhigh - AQIlow)) * (Conchigh - Conclow) + Conclow;
    invLinear = Math.round(Conc);
    return invLinear;
}

// function to calculate the concentration of pm25
function ConcPM25(a) {
    let ConcCalc;
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 35, 0, a);
    }
    else if (a >= 51 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 75, 36, a);
    }
    else if (a >= 101 && a <= 200) {
        ConcCalc = InvLinear(200, 101, 115, 76, a);
    }
    else if (a >= 201 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 150, 116, a);
    }
    else if (a >= 301 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 250, 151, a);
    }
    else if (a >= 401 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 500, 251, a);
    }
    else if (a >= 501 && a < Infinity) {
        ConcCalc = "Values above 500 are considered Hazardous";
    }
    else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

// function to calculate the concentration of pm10
function ConcPM10(a) {
    let ConcCalc;
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 50, 0, a);
    }
    else if (a >= 51 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 150, 51, a);
    }
    else if (a >= 101 && a <= 200) {
        ConcCalc = InvLinear(200, 101, 350, 151, a);
    }
    else if (a >= 201 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 420, 351, a);
    }
    else if (a >= 301 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 500, 421, a);
    }
    else if (a >= 401 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 600, 501, a);
    }
    else if (a >= 501 && a < Infinity) {
        ConcCalc = "Values above 500 are considered Hazardous";
    }
    else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

// function to calculate the concentration of sulfur dioxide(SO2)
function ConcSO2(a) {
    let ConcCalc;
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 50, 0, a);
    }
    else if (a >= 51 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 150, 51, a);
    }
    else if (a >= 101 && a <= 200) {
        ConcCalc = InvLinear(200, 101, 800, 151, a);
    }
    else if (a >= 201 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 1600, 801, a);
    }
    else if (a >= 301 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 2100, 1601, a);
    }
    else if (a >= 401 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 2620, 2101, a);
    }
    else if (a >= 501 && a < Infinity) {
        ConcCalc = "values above 500 are considered Hazardous";
    }
    else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

// function to calculate the concentration of nitrogen dioxide(NO2)
function ConcNo2(a) {
    let ConcCalc;
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 40, 0, a);
    }
    else if (a >= 51 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 80, 41, a);
    }
    else if (a >= 101 && a <= 200) {
        ConcCalc = InvLinear(200, 101, 280, 81, a);
    }
    else if (a >= 201 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 565, 280, a);
    }
    else if (a >= 301 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 750, 565, a);
    }
    else if (a >= 401 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 940, 751, a);
    }
    else if (a >= 501 && a < Infinity) {
        ConcCalc = "Values above 500 are considered Hazardous";
    }
    else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

// function to calculate the concentration of Carbon monoxide(CO)
function ConcCO(a) {
    let ConcCalc;
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 2000, 0, a);
    }
    else if (a >= 51 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 4000, 2000, a);
    }
    else if (a >= 101 && a <= 200) {
        ConcCalc = InvLinear(200, 101, 24000, 4000, a);
    }
    else if (a >= 201 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 36000, 24000, a);
    }
    else if (a >= 301 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 48000, 36000, a);
    }
    else if (a >= 401 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 60000, 48000, a);
    }
    else if (a >= 501 && a <= Infinity) {
        ConcCalc = "Values above 500 are considered Hazardous";
    }
    else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

// function to calculate the concentration of ozone(O3)
function ConcO3(a) {
    let ConcCalc;
    if (a >= 0 && a <= 50) {
        ConcCalc = InvLinear(50, 0, 100, 0, a);
    }
    else if (a >= 51 && a <= 100) {
        ConcCalc = InvLinear(100, 51, 160, 100, a);
    }
    else if (a >= 101 && a <= 200) {
        ConcCalc = InvLinear(200, 101, 265, 161, a);
    }
    else if (a >= 201 && a <= 300) {
        ConcCalc = InvLinear(300, 201, 800, 262, a);
    }
    else if (a >= 301 && a <= 400) {
        ConcCalc = InvLinear(400, 301, 1000, 800, a);
    }
    else if (a >= 401 && a <= 500) {
        ConcCalc = InvLinear(500, 401, 1200, 1000, a);
    }
    else if (a >= 501 && a < Infinity) {
        ConcCalc = "Values above 500 are considered Hazardous";
    }
    else {
        ConcCalc = "Out of Range";
    }
    return ConcCalc;
}

function Linear(AQIhigh, AQIlow, conchigh, Conclow, Concentration) {
    let linear;

    const Conc = parseFloat(Concentration);
    let a = ((Conc - Conclow) / (conchigh - Conclow)) * (AQIhigh - AQIlow) + AQIlow;
    linear = Math.round(a);
    return linear;
}

function pm10IN(Concentration) {
    let val = parseFloat(Concentration);
    let pm10val;
    if (val >= 0 && val <= 50) {
        pm10val = Linear(50, 0, 50, 0, val);
    }
    else if (val >= 51 && val <= 100) {
        pm10val = Linear(100, 51, 100, 51, val);
    }
    else if (val >= 101 && val <= 250) {
        pm10val = Linear(200, 101, 250, 101, val);
    }
    else if (val >= 251 && val <= 350) {
        pm10val = Linear(300, 201, 350, 251, val);
    }
    else if (val >= 351 && val <= 430) {
        pm10val = Linear(400, 301, 430, 351, val);
    }
    else if (val >= 431 && val <= 750) {
        pm10val = Linear(500, 401, 750, 431, val);
    }
    else if (val >= 751 && val < Infinity) {
        pm10val = "Values above 500 are considered Hazardous";
    }
    else {
        pm10val = "Out of Range";
    }
    return pm10val;
}

function pm25IN(Concentration) {
    let val = parseFloat(Concentration);
    let pm25val;
    if (val >= 0 && val <= 30) {
        pm25val = Linear(50, 0, 30, 0, val);
    }
    else if (val >= 31 && val <= 60) {
        pm25val = Linear(100, 51, 60, 31, val);
    }
    else if (val >= 61 && val <= 90) {
        pm25val = Linear(200, 101, 90, 61, val);
    }
    else if (val >= 91 && val <= 120) {
        pm25val = Linear(300, 201, 120, 91, val);
    }
    else if (val >= 121 && val <= 250) {
        pm25val = Linear(400, 301, 250, 121, val);
    }
    else if (val >= 251 && val <= 500) {
        pm25val = Linear(500, 401, 500, 251, val);
    }
    else if (val >= 501 && val < Infinity) {
        pm25val = "Values above 500 are considered Hazardous";
    }
    else {
        pm25val = "Out of Range";
    }
    return pm25val;
}

function no2IN(Concentration) {
    let val = parseFloat(Concentration);
    let no2val;
    if (val >= 0 && val <= 40) {
        no2val = Linear(50, 0, 40, 0, val);
    }
    else if (val >= 41 && val <= 80) {
        no2val = Linear(100, 51, 80, 41, val);
    }
    else if (val >= 81 && val <= 180) {
        no2val = Linear(200, 101, 180, 81, val);
    }
    else if (val >= 181 && val <= 280) {
        no2val = Linear(300, 201, 280, 181, val);
    }
    else if (val >= 281 && val <= 400) {
        no2val = Linear(400, 301, 400, 281, val);
    }
    else if (val >= 401 && val <= 800) {
        no2val = Linear(500, 400, 800, 401, val);
    }
    else if (val >= 801 && val < Infinity) {
        no2val = "Values above 500 are considered Hazardous";
    }
    else {
        no2val = "Out of Range";
    }
    return no2val;
}

function o3IN(Concentration) {
    let val = parseFloat(Concentration);
    let o3val;
    if (val >= 0 && val <= 50) {
        o3val = Linear(50, 0, 50, 0, val);
    }
    else if (val >= 51 && val <= 100) {
        o3val = Linear(100, 51, 100, 51, val);
    }
    else if (val >= 101 && val <= 168) {
        o3val = Linear(200, 101, 168, 101, val);
    }
    else if (val >= 169 && val <= 208) {
        o3val = Linear(300, 201, 208, 169, val);
    }
    else if (val >= 209 && val <= 748) {
        o3val = Linear(400, 301, 748, 209, val);
    }
    else if (val >= 749 && val <= 1000) {
        o3val = Linear(500, 401, 1000, 749, val);
    }
    else if (val >= 1001 && val < Infinity) {
        o3val = "Values above 500 are considered Hazardous";
    }
    else {
        o3val = "Out of Range";
    }
    return o3val;
}

function so2IN(Concentration) {
    let val = parseFloat(Concentration);
    let so2val;
    if (val >= 0 && val <= 40) {
        so2val = Linear(50, 0, 40, 0, val);
    }
    else if (val >= 41 && val <= 80) {
        so2val = Linear(100, 51, 80, 41, val);
    }
    else if (val >= 81 && val <= 380) {
        so2val = Linear(200, 101, 380, 81, val);
    }
    else if (val >= 381 && val <= 800) {
        so2val = Linear(300, 201, 800, 381, val);
    }
    else if (val >= 801 && val <= 1600) {
        so2val = Linear(400, 301, 1600, 801, val);
    }
    else if (val >= 1601 && val <= 2500) {
        so2val = Linear(500, 401, 2500, 1601, val);
    }
    else if (val >= 2501 && val < Infinity) {
        so2val = "Values above 500 are considered Hazardous";
    }
    else {
        so2val = "Out of Range";
    }
    return so2val;
}

function coIN(Concentration) {
    let val = parseFloat(Concentration);
    let coval;
    if (val >= 0 && val <= 1000) {
        coval = Linear(50, 0, 1000, 0, val);
    }
    else if (val >= 1001 && val <= 2000) {
        coval = Linear(100, 51, 2000, 1000, val);
    }
    else if (val >= 2001 && val <= 10000) {
        coval = Linear(200, 101, 10000, 2000, val);
    }
    else if (val >= 10001 && val <= 17000) {
        coval = Linear(300, 201, 17000, 10001, val);
    }
    else if (val >= 17001 && val <= 34000) {
        coval = Linear(400, 301, 34000, 17001, val);
    }
    else if (val >= 34001 && val <= 50000) {
        coval = Linear(500, 401, 50000, 34001, val);
    }
    else if (val >= 50001 && val < Infinity) {
        coval = "Values above 500 are considered Hazardous";
    }
    else {
        coval = "Out of Range";
    }
    return coval;
}

// functions for AQI-US calculations based on concentartion of dominent pollutent

function pm25US(Concentration) {
    let val = parseFloat(Concentration);
    let pm25val;
    if (val >= 0 && val <= 12) {
        pm25val = Linear(50, 0, 12, 0, val);
    }
    else if (val >= 12.1 && val <= 35) {
        pm25val = Linear(100, 51, 35, 12.1, val);
    }
    else if (val >= 35.1 && val <= 55) {
        pm25val = Linear(150, 101, 55, 35.1, val);
    }
    else if (val >= 55.1 && val <= 150) {
        pm25val = Linear(200, 151, 150, 55.1, val);
    }
    else if (val >= 151 && val <= 250) {
        pm25val = Linear(300, 200, 250, 151, val);
    }
    else if (val >= 251 && val <= 500) {
        pm25val = Linear(500, 300, 500, 251, val);
    }
    else if (val > 500 && val < Infinity) {
        pm25val = "Values above 500 are considered Hazardous";
    }
    else {
        pm25val = "Out of Range";
    }
    return pm25val;
}

function pm10US(Concentration) {
    let val = parseFloat(Concentration);
    let pm10val;
    if (val >= 0 && val <= 54) {
        pm10val = Linear(50, 0, 54, 0, val);
    }
    else if (val >= 55 && val <= 154) {
        pm10val = Linear(100, 51, 154, 55, val);
    }
    else if (val >= 155 && val <= 254) {
        pm10val = Linear(150, 101, 254, 155, val);
    }
    else if (val >= 255 && val <= 354) {
        pm10val = Linear(200, 151, 354, 255, val);
    }
    else if (val >= 355 && val <= 424) {
        pm10val = Linear(300, 201, 424, 355, val);
    }
    else if (val >= 425 && val <= 604) {
        pm10val = Linear(500, 300, 604, 425, val);
    }
    else if (val >= 605 && val < Infinity) {
        pm10val = "Values above 500 are considered Hazardous";
    }
    else {
        pm10val = "Out of Range";
    }
    return pm10val;
}

function coUS(Concentration) {
    let val = parseFloat(Concentration);
    let coval;
    if (val >= 0 && val <= 5210) {
        coval = Linear(50, 0, 5210, 0, val);
    }
    else if (val >= 5211 && val <= 11131) {
        coval = Linear(100, 51, 11131, 5211, val);
    }
    else if (val >= 11132 && val <= 14684) {
        coval = Linear(150, 101, 14684, 11132, val);
    }
    else if (val >= 14685 && val <= 18237) {
        coval = Linear(200, 151, 18237, 14685, val);
    }
    else if (val >= 18238 && val <= 35999) {
        coval = Linear(300, 201, 35999, 18238, val);
    }
    else if (val >= 36000 && val <= 59683) {
        coval = Linear(500, 300, 59683, 36000, val);
    }
    else if (val > 59683 && val < Infinity) {
        coval = "Values above 500 are considered Hazardous";
    }
    else {
        coval = "Out of Range";
    }
    return coval;
}

function so2US(Concentration) {
    let val = parseFloat(Concentration);
    let so2val;
    if (val >= 0 && val <= 95) {
        so2val = Linear(50, 0, 95, 0, val);
    }
    else if (val >= 96 && val <= 203) {
        so2val = Linear(100, 51, 203, 96, val);
    }
    else if (val >= 204 && val <= 501) {
        so2val = Linear(150, 101, 501, 204, val);
    }
    else if (val >= 502 && val <= 823) {
        so2val = Linear(200, 151, 823, 502, val);
    }
    else if (val >= 824 && val <= 1635) {
        so2val = Linear(300, 201, 1635, 824, val);
    }
    else if (val >= 1636 && val <= 2718) {
        so2val = Linear(500, 300, 2718, 1636, val);
    }
    else if (val >= 2719 && val < Infinity) {
        so2val = "Values above 500 are considered Hazardous";
    }
    else {
        so2val = "Out of Range";
    }
    return so2val;
}

function o3US(Concentration) {
    let val = parseFloat(Concentration);
    let o3val;
    if (val >= 0 && val <= 110) {
        o3val = Linear(50, 0, 110, 0, val);
    }
    else if (val >= 111 && val <= 142) {
        o3val = Linear(100, 51, 142, 111, val);
    }
    else if (val >= 143 && val <= 173) {
        o3val = Linear(150, 100, 173, 143, val);
    }
    else if (val >= 174 && val <= 213) {
        o3val = Linear(200, 151, 213, 174, val);
    }
    else if (val >= 214 && val <= 406) {
        o3val = Linear(300, 201, 406, 214, val);
    }
    else if (val >= 407 && val <= 605) {
        o3val = Linear(500, 300, 605, 407, val);
    }
    else if (val > 605 && val < Infinity) {
        o3val = "Values above 500 are considered Hazardous";
    }
    else {
        o3val = "Out of Range";
    }
    return o3val;
}

function no2US(Concentration) {
    let val = parseFloat(Concentration);
    let no2val;
    if (val >= 0 && val <= 85) {
        no2val = Linear(50, 0, 85, 0, val);
    }
    else if (val >= 86 && val <= 161) {
        no2val = Linear(100, 51, 161, 86, val);
    }
    else if (val >= 162 && val <= 579) {
        no2val = Linear(150, 101, 579, 162, val);
    }
    else if (val >= 580 && val <= 1043) {
        no2val = Linear(200, 151, 1043, 580, val);
    }
    else if (val >= 1044 && val <= 2007) {
        no2val = Linear(300, 201, 2007, 1044, val);
    }
    else if (val >= 2008 && val <= 3293) {
        no2val = Linear(500, 300, 3293, 2008, val);
    }
    else if (val >= 3294 && val < Infinity) {
        no2val = "Values above 500 are considered Hazardous";
    }
    else {
        no2val = "Out of Range";
    }
    return no2val;
}

function pm25EU(Concentration) {
    let val = parseFloat(Concentration);
    let pm25val;
    if (val >= 0 && val <= 10) {
        pm25val = Linear(50, 0, 10, 0, val);
    }
    else if (val > 10 && val <= 20) {
        pm25val = Linear(100, 51, 20, 11, val);
    }
    else if (val > 20 && val <= 25) {
        pm25val = Linear(200, 101, 25, 21, val);
    }
    else if (val > 25 && val <= 50) {
        pm25val = Linear(300, 201, 50, 26, val);
    }
    else if (val > 50 && val <= 75) {
        pm25val = Linear(400, 301, 75, 51, val);
    }
    else if (val > 75 && val <= 800) {
        pm25val = Linear(500, 401, 800, 76, val);
    }
    else if (val > 800 && val < Infinity) {
        pm25val = "Values above 500 are considered Hazardous";
    }
    else {
        pm25val = "Out of Range";
    }
    return pm25val;
}

function pm10EU(Concentration) {
    let val = parseFloat(Concentration);
    let pm10val;
    if (val >= 0 && val <= 20) {
        pm10val = Linear(50, 0, 20, 0, val);
    }
    else if (val > 20 && val <= 40) {
        pm10val = Linear(100, 51, 40, 21, val);
    }
    else if (val > 40 && val <= 50) {
        pm10val = Linear(200, 101, 50, 41, val);
    }
    else if (val > 50 && val <= 100) {
        pm10val = Linear(300, 201, 100, 51, val);
    }
    else if (val > 100 && val <= 150) {
        pm10val = Linear(400, 301, 150, 101, val);
    }
    else if (val > 150 && val <= 1200) {
        pm10val = Linear(500, 401, 1200, 151, val);
    }
    else if (val > 1200 && val < Infinity) {
        pm10val = "Values above 500 are considered Hazardous";
    }
    else {
        pm10val = "Out of Range";
    }
    return pm10val;
}

function so2EU(Concentration) {
    let val = parseFloat(Concentration);
    let so2val;
    if (val >= 0 && val <= 100) {
        so2val = Linear(50, 0, 100, 0, val);
    }
    else if (val > 100 && val <= 200) {
        so2val = Linear(100, 51, 200, 101, val);
    }
    else if (val > 200 && val <= 350) {
        so2val = Linear(200, 101, 350, 201, val);
    }
    else if (val > 350 && val <= 500) {
        so2val = Linear(300, 201, 500, 351, val);
    }
    else if (val > 500 && val <= 750) {
        so2val = Linear(400, 301, 750, 501, val);
    }
    else if (val > 750 && val <= 1250) {
        so2val = Linear(500, 401, 1250, 751, val);
    }
    else if (val > 1250 && val < Infinity) {
        so2val = "Values above 500 are considered Hazardous";
    }
    else {
        so2val = "Out of Range";
    }
    return so2val;
}

function no2EU(Concentration) {
    let val = parseFloat(Concentration);
    let no2val;
    if (val >= 0 && val <= 40) {
        no2val = Linear(50, 0, 40, 0, val);
    }
    else if (val > 40 && val <= 90) {
        no2val = Linear(100, 51, 90, 41, val);
    }
    else if (val > 90 && val <= 120) {
        no2val = Linear(200, 101, 120, 91, val);
    }
    else if (val > 120 && val <= 230) {
        no2val = Linear(300, 201, 230, 121, val);
    }
    else if (val > 230 && val <= 340) {
        no2val = Linear(400, 301, 340, 231, val);
    }
    else if (val > 340 && val <= 1000) {
        no2val = Linear(500, 401, 1000, 341, val);
    }
    else if (val > 1000 && val < Infinity) {
        no2val = "values above 500 are considered Hazardous";
    }
    else {
        no2val = "Out of Range";
    }
    return no2val;
}

function o3EU(Concentration) {
    let val = parseFloat(Concentration);
    let o3val;
    if (val >= 0 && val <= 50) {
        o3val = Linear(50, 0, 50, 0, val);
    }
    else if (val > 51 && val <= 100) {
        o3val = Linear(100, 51, 100, 51, val);
    }
    else if (val > 100 && val <= 130) {
        o3val = Linear(200, 101, 130, 101, val);
    }
    else if (val > 130 && val <= 240) {
        o3val = Linear(300, 201, 240, 131, val);
    }
    else if (val > 240 && val <= 380) {
        o3val = Linear(400, 301, 380, 241, val);
    }
    else if (val > 380 && val <= 800) {
        o3val = Linear(500, 401, 800, 381, val);
    }
    else if (val > 800 && val < Infinity) {
        o3val = "Values above 500 are considered Hazardous";
    }
    else {
        o3val = "Out of Range";
    }
    return o3val;
}

const testingLinearWorking = async function (req, res) {
    try {
        // const pm10 = pm10IN(600);
        // const pm25 = pm25IN(501);
        // const no2 = no2IN(201);
        // const o3 = o3IN(800);
        // const so2 = so2IN(901);
        // const co = coIN(35002);
        // const so2E = so2EU(78);
        // const no2E = no2EU(150);
        // const o3E = o3EU(390);
        // const pm25conc = ConcPM25(250);
        // const pm10conc = ConcPM10(150);
        // const so2conc = concSO2(250);
        // const no2conc = ConcNo2(450);
        // const coConc = ConcCO(450);
        // const o3Conc = ConcO3(430);

        // checking if pm10 and pm25 is present
        // if (pm10 || pm25) {
        //     console.log("pm10 or pm25. Any one is present");
        // }
        // console.log("Value of pm25", pm25);
        // console.log("Value of so2", so2);
        // console.log("Value of co", coConc);
        // console.log("Value of O3",o3Conc);
        // console.log("value of pm10", pm10);
        // console.log("Value of pm25",pm25);
        // console.log("Value of so2",so2);
        // console.log("Value of no2", no2);
        // console.log("Value of CO", co);
        // console.log("Value of o3", o3);
        const pm25U = pm25US(400);
        const pm10U = pm10US(450);
        const so2U = so2US(480);
        const no2U = no2US(1000);
        const pm25E = pm25EU(60);
        const pm10E = pm10EU(49);
        console.log("Value of pm25 Us", pm25U);
        console.log("Value of pm10 US", pm10U);
        console.log("Value of so2 US", so2U);
        console.log("Value of no2 US", no2U);
        console.log("Value of pm25 Europe", pm25E);
        console.log("Value of pm10 Europe", pm10E);
        // console.log("Value of pm25EU", pm25E);
        // console.log("Value of pm10EU", pm10E);
        // console.log("Value of so2EU", so2E);
        // console.log("Value of no2EU", no2E);
        // console.log("Value of o3EU", o3E);
        // console.log("Value of pm25conc", pm25conc);
        // console.log("Value of pm10conc", pm10conc);
        // console.log("Value of so2conc", so2conc);
        // console.log("Value of no2conc", no2conc);
        res.status(200).send({ status: true, message: "API running successfully" });
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}



// controller to get data based on city name
const gettingCities = async function (req, res) {
    try {
        console.log("Hitting the API");
        const city = req.body.city;
        console.log("City passed in post request is", city);
        let citiesData = [];
        if (city == "Delhi") {
            citiesData = await aqiModel.find({ StateName: city });
        }
        else {
            citiesData = await aqiModel.find({ CityName: city });
        }
        console.log("Length of document citiesData is", citiesData.length)
        // console.log("City data is",citiesData);
        return res.status(200).send({ status: true, message: "API running successfully", Data: citiesData });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// controller function to get nearest five locations based on latitude and longitude
const getNearestLocations = async function (req, res) {
    try {
        const latitude = parseFloat(req.body.latitude);
        const longitude = parseFloat(req.body.longitude);
        console.log("Latitude is", latitude, "and Longitude is", longitude);
        // const nearestLocations = await aqiModel.find({
        //     $near:{
        //         $geometry:{
        //             type:"Point",
        //             coordinates:[longitude,latitude]
        //         }
        //     }
        // }).limit(5);
        // console.log(nearestLocations);
        const result = await aqiModel.find();
        // console.log(result);
        result.sort((a, b) => {
            const distA = Math.sqrt(Math.pow(latitude - a.latitude, 2) + Math.pow(longitude - a.longitude, 2));
            const distB = Math.sqrt(Math.pow(latitude - b.latitude, 2) + Math.pow(longitude - b.longitude, 2));
            return distA - distB;
        });
        const documents = result.slice(0, 5);
        console.log(documents);
        return res.status(200).send({ status: true, message: "API running successfully", Data: documents });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// controller function to get one week historic Data

// tester for checking cronLogs working
const cronLogs = async function (req, res) {
    try {
        console.log("Cron logs");
        const startTimestamp = moment().format();
        console.log("Start Timestamp", startTimestamp);
        const StartTime = moment.tz(startTimestamp, 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        console.log("Start time is", StartTime);
        for (let i = 0; i < 10000; i++) {
            console.log("Hello Aditya");
        }
        const endTimestamp = moment().format();
        console.log("End Timestamp", endTimestamp);
        const EndTime = moment.tz(endTimestamp, 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        console.log("End time is", EndTime);

        const CronName = "cron1";
        const obj = {
            CronName,
            StartTime,
            EndTime
        }
        const result = await cronLogModel.create(obj);
        console.log(result);
        console.log("Object is", obj);
        return res.status(200).send({ status: true, message: "API running successfully", data: result });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// integrating formula for AQI-IN
const aqiIn = async function (req, res) {
    try {
        // getting URL from third party API
        const originalUrl = 'https://api.waqi.info/feed/@80/?token=7124b219cbdffcfa7e30e4e0745bc252b445fb2f';
        // parse the url
        const Uid = 5484;
        const parsedUrl = new URL(originalUrl);
        const newUrl = `feed/@${Uid}/`;
        // update the path in parsed url
        parsedUrl.pathname = newUrl;
        const finalUrl = parsedUrl.toString();
        console.log(finalUrl);

        const storeData = await axios.get(finalUrl);
        console.log(storeData.data);

        const dataFromAPI = storeData.data;
        console.log("Data from API is", dataFromAPI);
        let DominentPollutent = null;
        if (dataFromAPI.data.hasOwnProperty('dominentpol')) {
            DominentPollutent = dataFromAPI.data.dominentpol;
        }
        else {
            DominentPollutent = "NA";
        }
        if (DominentPollutent == '') {
            DominentPollutent = "NA"
        }
        console.log("Dominent polltent is", DominentPollutent);
        console.log("Dominent polltent value is", dataFromAPI.data.iaqi.pm25.v);
        let DominentPollutentValue = dataFromAPI.data.iaqi[DominentPollutent].v;
        console.log("Dominent pollutent value using variable dompol", DominentPollutentValue);

        let pm10 = null;
        if (dataFromAPI.data.iaqi.hasOwnProperty("pm10")) {
            pm10 = dataFromAPI.data.iaqi.pm10.v;

        }
        else {
            pm10 = "NA";
        }

        let pm25 = null;
        if (dataFromAPI.data.iaqi.hasOwnProperty('pm25')) {
            pm25 = dataFromAPI.data.iaqi.pm25.v;
        }
        else {
            pm25 = "NA";
        }

        let no2 = null;
        if (dataFromAPI.data.iaqi.hasOwnProperty('no2')) {
            no2 = dataFromAPI.data.iaqi.no2.v;
        }
        else {
            no2 = "NA";
        }

        let so2 = null;
        if (dataFromAPI.data.iaqi.hasOwnProperty('so2')) {
            so2 = dataFromAPI.data.iaqi.so2.v;
        }
        else {
            so2 = "NA";
        }

        let o3 = null;
        if (dataFromAPI.data.iaqi.hasOwnProperty('o3')) {
            o3 = dataFromAPI.data.iaqi.o3.v;
        }
        else {
            o3 = "NA";
        }

        let co = null;
        if (dataFromAPI.data.iaqi.hasOwnProperty('co')) {
            co = dataFromAPI.data.iaqi.co.v;
        }
        else {
            co = "NA";
        }

        // converting individual AQI to concentration
        let pm10conc;
        if (pm10 != "NA") {
            pm10conc = ConcPM10(pm10);
        }
        else {
            pm10conc = 0;
        }

        let pm25conc;
        if (pm25 != "NA") {
            pm25conc = ConcPM25(pm25);
        }
        else {
            pm25conc = 0;
        }

        let so2conc;
        if (so2 != "NA") {
            so2conc = ConcSO2(so2);
        }
        else {
            so2conc = 0;
        }

        let no2conc;
        if (no2 != "NA") {
            no2conc = ConcNo2(no2);
        }
        else {
            no2conc = 0;
        }

        let o3conc;
        if (o3 != "NA") {
            o3conc = ConcO3(o3);
        }
        else {
            o3conc = 0;
        }

        let coconc;
        if (co != "NA") {
            coconc = ConcCO(co);
        }
        else {
            coconc = 0;
        }


        let concentartionObj = { pm10conc, pm25conc, no2conc, so2conc, o3conc, coconc };
        console.log("Concentartions of pollutants", concentartionObj)
        let pollutantsObj = { pm10, pm25, no2, so2, o3, co };
        console.log("Pollutants object is", pollutantsObj);

        // converting concentrations of pm10 to individual AQIs of IN, US, and EU  
        let pm10in = pm10IN(pm10conc);
        let pm10us = pm10US(pm10conc);
        let pm10eu = pm10EU(pm10conc);
        console.log("pm10in is", pm10in);
        console.log("pm10us is", pm10us);
        console.log("pm10eu is", pm10eu);

        // converting concentrations of pm25 to individual AQIs of IN, US, and EU  
        let pm25in = pm25IN(pm25conc);
        let pm25us = pm25US(pm25conc);
        let pm25eu = pm25EU(pm25conc);
        console.log("pm25in is", pm25in);
        console.log("pm25us is", pm25us);
        console.log("pm25eu is", pm25eu);

        // converting concentrations of o3 to individual AQIs of IN, US, and EU  
        let o3in = o3IN(o3conc);
        let o3us = o3US(o3conc);
        let o3eu = o3EU(o3conc);
        console.log("o3in is", o3in);
        console.log("o3us is", o3us);
        console.log("o3eu is", o3eu);

        // converting concentrations of no2 to individual AQIs of IN, US, and EU  
        let no2in = no2IN(no2conc);
        let no2us = no2US(no2conc);
        let no2eu = no2EU(no2conc);
        console.log("no2in is", no2in);
        console.log("no2us is", no2us);
        console.log("no2eu is", no2eu);

        // converting concentrations of so2 to individual AQIs of IN, US, and EU  
        let so2in = so2IN(so2conc);
        let so2us = so2US(so2conc);
        let so2eu = so2EU(so2conc);
        console.log("so2in is", so2in);
        console.log("so2us is", so2us);
        console.log("so2eu is", so2eu);

        // converting concentrations of CO to individual AQIs of IN, US, and EU  
        let coin = coIN(coconc);
        let cous = coUS(coconc);
        console.log("coin is", coin);
        console.log("cous is", cous);

        let AQI_IN;
        let AQI_US;
        let AQI_EU;
        if(pm10 != "NA" || pm25 != "NA"){
            AQI_IN = Math.max(pm10in,pm25in,so2in,no2in,o3in,coin);
            AQI_US = Math.max(pm10us,pm25us,so2us,no2us,o3us,cous);
            AQI_EU = Math.max(pm10eu,pm25eu,so2eu,no2eu,o3eu);
        }
        else{
            AQI_IN = "NA";
            AQI_US = "NA";
            AQI_EU = "NA";
        }
        console.log("AQI-IN is", AQI_IN);
        console.log("AQI-US is", AQI_US);
        console.log("AQI-EU is",AQI_EU);

        return res.status(200).send({ status: false, message: "API running successfully", data: dataFromAPI });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// router to check if we are getting any empty values in dominent pollutents or values other than 8 pollutents
const checkingDominentPollutant = async function (req, res) {
    try {
        // let PM10 = "PM10";
        const getDocumentspm10 = await aqiModel.find({ DominentPollutent: 'pm10' });
        const sizeOfpm10AsDominentPollutant = getDocumentspm10.length;
        // console.log(getDocumentspm10);
        console.log("Size of pm10 documents", sizeOfpm10AsDominentPollutant);

        const getDocumentspm25 = await aqiModel.find({ DominentPollutent: 'pm25' });
        const sizeOfpm25AsDominentPollutant = getDocumentspm25.length;
        // console.log(getDocumentspm25);
        console.log("Size of pm25 documents", sizeOfpm25AsDominentPollutant);

        const getDocumentso3 = await aqiModel.find({ DominentPollutent: 'o3' });
        const sizeOfo3AsDominentPollutant = getDocumentso3.length;
        // console.log(getDocumentso3);
        console.log("Size of o3 documents", sizeOfo3AsDominentPollutant);

        const getDocumentsco = await aqiModel.find({ DominentPollutent: 'co' });
        const sizeOfcoAsDominentPollutant = getDocumentsco.length;
        // console.log(getDocumentsco);
        console.log("Size of co documents", sizeOfcoAsDominentPollutant);

        const getDocumentsno2 = await aqiModel.find({ DominentPollutent: 'no2' });
        const sizeOfno2AsDominentPollutant = getDocumentsno2.length;
        console.log("Size of no2 documents", sizeOfno2AsDominentPollutant);

        const getDocumentsso2 = await aqiModel.find({ DominentPollutent: 'so2' });
        const sizeOfso2AsDominentPollutant = getDocumentsso2.length;
        console.log("Size of so2 documents", sizeOfso2AsDominentPollutant);

        const getDocumentsnh3 = await aqiModel.find({ DominentPollutent: 'nh3' });
        const sizeOfnh3AsDominentPollutant = getDocumentsnh3.length;
        console.log("Size of nh3 documents", sizeOfnh3AsDominentPollutant);

        const getDocumentspb = await aqiModel.find({ DominentPollutent: 'pb' });
        const sizeOfpbAsDominentPollutant = getDocumentspb.length;
        console.log("Size of pb documents", sizeOfpbAsDominentPollutant);

        const getDocumentsNA = await aqiModel.find({ DominentPollutent: 'NA' });
        const sizeOfNAAsDominentPollutant = getDocumentsNA.length;
        console.log("Size of NA documents", sizeOfNAAsDominentPollutant);

        // finding documents having AQI greater than 300
        const greaterAQIdocuments = await aqiModel.find({ O3: { $gt: 100 } });
        const sizeOfGreaterAQIdocuments = greaterAQIdocuments.length;
        console.log(greaterAQIdocuments);


        const getDocumentsOthers = await aqiModel.find({ DominentPollutent: { $nin: ['NA', 'pb', 'nh3', 'so2', 'no2', 'co', 'o3', 'pm10', 'pm25'] } });
        // console.log(getDocumentsOthers);
        // const pm10Andpm25Ando3 = sizeOfpm25AsDominentPollutant + sizeOfpm10AsDominentPollutant + sizeOfo3AsDominentPollutant;
        // const pm10Andpm25Ando3Andco = sizeOfpm25AsDominentPollutant + sizeOfpm10AsDominentPollutant + sizeOfo3AsDominentPollutant + sizeOfcoAsDominentPollutant;
        // console.log(pm10Andpm25);
        // console.log(pm10Andpm25Ando3);
        // console.log(pm10Andpm25Ando3Andco);
        return res.status(200).send({ status: true, message: "API running successfully", data: greaterAQIdocuments });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}

const allAQIsInDatabase = async function(req,res){
    try{
        const originalUrl = 'https://api.waqi.info/feed/@80/?token=7124b219cbdffcfa7e30e4e0745bc252b445fb2f';
        const csvFilePath = 'C:\\Users\\lenovo\\Downloads\\testi30.csv';
        console.log("File path of csv is", csvFilePath);

        let instream;
        instream = fs.createReadStream(csvFilePath);
        const readable = instream.pipe(csv());

        for await (const record of readable){
            let Status = null;
            const Uid = record.Uid;
            const latitude = record.latitude;
            const longitude = record.longitude;
            const LocationName = record.LocationName;
            const CityName = record.CityName;
            const Country = record.Country;
            const StateName = record.StateName;
            const StationName = record.StationName;

            const parsedUrl = new URL(originalUrl);
            const newUrl = `feed/@${Uid}/`;
            parsedUrl.pathname = newUrl;
            const finalUrl = parsedUrl.toString();
            console.log(finalUrl);

            const storeData = await axios.get(finalUrl);
            console.log(storeData.data);
            const dataFromAPI = storeData.data;
            console.log(dataFromAPI);

            let PM10 = null;
            let PM25 = null;
            let Temperature = null;
            let Humidity = null;
            let DominentPollutent = null;
            let AQI = null;
            let NO2 = null;
            let SO2 = null;
            let O3 = null;
            let CO = null;
            let time = null;
            let aqiIndia = null;
            let aqiUS = null;
            let aqiEurope = null;
            if (dataFromAPI.status == 'error'){
                PM10 = "NA";
                PM25 = "NA";
                Temperature = "NA";
                Humidity = "NA";
                DominentPollutent = "NA";
                AQI = "NA";
                NO2 = "NA";
                SO2 = "NA";
                O3 = "NA";
                CO = "NA";
                time = "NA";
                aqiIndia = "NA";
                aqiUS = "NA";
                aqiEurope = "NA";
                Status = "Inactive";
            }
            
            const completeObj = {Uid,LocationName,AQI,aqiIndia,aqiUS,aqiEurope,DominentPollutent,PM10,PM25,
            NO2,SO2,O3,CO,Temperature,Humidity,StationName,CityName,StateName,Country,latitude,longitude,time,Status};
            console.log("The object on creation is",completeObj);
            const createData = await aqiModel.create(completeObj);
            console.log("The object is as follows:", createData);
        }
        console.log("Reading csv successfully");
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message});
    }
}

module.exports = { gettingCities, getNearestLocations, cronLogs, aqiIn, testingLinearWorking, checkingDominentPollutant, allAQIsInDatabase };