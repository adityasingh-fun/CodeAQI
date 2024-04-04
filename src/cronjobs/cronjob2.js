const aqiModel = require('../models/aqi_inModel');
const historicModel = require('../models/historicModel.js');
const cronLogModel = require('../models/cronLogModel.js');
const mongoose = require('mongoose');
const axios = require("axios");
const cron = require('node-cron');
const moment = require('moment-timezone');

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

mongoose.connect('mongodb+srv://chaudharyaditya41:Z67gI1uJnrGCnHuY@cluster0.jgngtnq.mongodb.net/testingAPIsDb11?retryWrites=true&w=majority', {
    usenewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB2 is connected"))
    .catch(err => console.log(err))

cron.schedule('*/30 * * * *', async () => {
    try {
        const originalUrl = 'https://api.waqi.info/feed/@80/?token=7124b219cbdffcfa7e30e4e0745bc252b445fb2f';
        console.log("Coming into cronjob 2");
        // Start time of cron
        const startTimestamp = moment().format();
        const StartTime = moment.tz(startTimestamp, 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

        let bulkOps = [];
        let historicDocuments = [];
        const documents = await aqiModel.find();
        // console.log(documents);
        console.log("Documents present in the AQI collection", documents.length);
        for (let i = 300; i < 600; i++) {
            let Status = null;
            const latitude = documents[i]["latitude"];
            const longitude = documents[i]["longitude"];
            const _id = documents[i]["_id"];
            const Uid = documents[i]["Uid"];
            const LocationName = documents[i]["LocationName"];
            const StationName = documents[i]["StationName"];
            const CityName = documents[i]["CityName"];
            const StateName = documents[i]["StateName"];
            const Country = documents[i]["Country"];
            // parse the url
            const parsedUrl = new URL(originalUrl);

            // setting the latitude and longitude in the url
            const newUrl = `feed/@${Uid}/`;

            // update the path in parsed url
            parsedUrl.pathname = newUrl;

            // convert the original url back to string
            const finalUrl = parsedUrl.toString();
            // console.log(finalUrl);

            const storeData = await axios.get(finalUrl);
            const dataFromAPI = storeData.data;
            // console.log(dataFromAPI);

            let PM10 = null;
            let PM25 = null;
            let Temperartue = null;
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

            if (dataFromAPI.status == 'error') {
                PM10 = "NA";
                PM25 = "NA";
                Temperartue = "NA";
                Humidity = "NA";
                DominentPollutent = "NA";
                AQI = "NA";
                aqiIndia = "NA";
                aqiUS = "NA";
                aqiEurope = "NA";
                NO2 = "NA";
                SO2 = "NA";
                O3 = "NA";
                CO = "NA";
                time = "NA";
                Status = "Inactive";

                const completeObj = { Status, AQI, aqiIndia, aqiUS, aqiEurope, DominentPollutent, PM10, PM25, NO2, SO2, O3, CO, Temperartue, Humidity, time };
                const historicObj = { Status, Uid, LocationName, AQI, aqiIndia, aqiUS, aqiEurope, DominentPollutent, PM10, PM25, NO2, SO2, O3, Temperartue, Humidity, StationName, CityName, StateName, Country, time, latitude, longitude };
                historicDocuments.push(historicObj);
                let upsertDoc = {
                    'updateOne': {
                        'filter': { _id: _id },
                        'update': completeObj,
                        'upsert': true
                    }
                };
                // console.log(upsertDoc);
                bulkOps.push(upsertDoc);
                // console.log(updateDocument);
            }
            else {
                Status = "Active";
                // pm10
                if (dataFromAPI.data.iaqi.hasOwnProperty('pm10')) {
                    // console.log("pm10 key hai");
                    PM10 = dataFromAPI.data.iaqi.pm10.v;
                }
                else {
                    PM10 = "NA";
                }

                // pm25
                if (dataFromAPI.data.iaqi.hasOwnProperty('pm25')) {
                    // console.log("pm25 key hai");
                    PM25 = dataFromAPI.data.iaqi.pm25.v;
                }
                else {
                    PM25 = "NA";
                }

                // no2
                if (dataFromAPI.data.iaqi.hasOwnProperty('no2')) {
                    // console.log("pm25 key hai");
                    NO2 = dataFromAPI.data.iaqi.no2.v;
                }
                else {
                    NO2 = "NA";
                }

                // so2
                if (dataFromAPI.data.iaqi.hasOwnProperty('so2')) {
                    // console.log("pm25 key hai");
                    SO2 = dataFromAPI.data.iaqi.so2.v;
                }
                else {
                    SO2 = "NA";
                }

                // o3
                if (dataFromAPI.data.iaqi.hasOwnProperty('o3')) {
                    // console.log("pm25 key hai");
                    O3 = dataFromAPI.data.iaqi.o3.v;
                }
                else {
                    O3 = "NA";
                }

                // CO
                let CO = null;
                if (dataFromAPI.data.iaqi.hasOwnProperty('co')) {
                    CO = dataFromAPI.data.iaqi.co.v;
                }
                else {
                    CO = "NA";
                }

                // Temperature
                if (dataFromAPI.data.iaqi.hasOwnProperty('t')) {
                    // console.log("temperature key hai");
                    let number = dataFromAPI.data.iaqi.t.v;
                    Temperartue = Math.round(number);
                }
                else {
                    Temperartue = "NA";
                }
                // Humidity
                if (dataFromAPI.data.iaqi.hasOwnProperty('h')) {
                    // console.log("humidity key hai");
                    let number = dataFromAPI.data.iaqi.h.v;
                    Humidity = Math.round(number);
                }
                else {
                    Humidity = "NA";
                }

                // let time = dataFromAPI.data.time.iso;
                const isoDateTime = dataFromAPI.data.time.iso;
                time = moment.tz(isoDateTime, 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

                // Dominent pollutent
                if (dataFromAPI.data.hasOwnProperty('dominentpol')) {
                    DominentPollutent = dataFromAPI.data.dominentpol;
                }
                else {
                    DominentPollutent = "NA";
                }
                if (DominentPollutent == '') {
                    DominentPollutent = "NA";
                }

                if (dataFromAPI.data.hasOwnProperty('aqi')) {
                    AQI = dataFromAPI.data.aqi;
                }
                else {
                    AQI = "NA";
                }

                if (AQI == '-') {
                    if (PM10 != "NA" && PM25 != "NA") {
                        AQI = Math.max(PM10, PM25);
                    }
                    else if (PM10 == "NA" && PM25 != "NA") {
                        AQI = PM25;
                    }
                    else if (PM10 != "NA" && PM25 == "NA") {
                        AQI = PM10;
                    }
                    else {
                        AQI = "NA"
                    }
                }

                // converting individual AQI to concentration
                let pm10conc;
                if (PM10 != "NA") {
                    pm10conc = ConcPM10(PM10);
                }
                else {
                    pm10conc = 0;
                }

                let pm25conc;
                if (PM25 != "NA") {
                    pm25conc = ConcPM25(PM25);
                }
                else {
                    pm25conc = 0;
                }

                let so2conc;
                if (SO2 != "NA") {
                    so2conc = ConcSO2(SO2);
                }
                else {
                    so2conc = 0;
                }

                let no2conc;
                if (NO2 != "NA") {
                    no2conc = ConcNo2(NO2);
                }
                else {
                    no2conc = 0;
                }

                let o3conc;
                if (O3 != "NA") {
                    o3conc = ConcO3(O3);
                }
                else {
                    o3conc = 0;
                }

                let coconc;
                if (CO != "NA") {
                    coconc = ConcCO(CO);
                }
                else {
                    coconc = 0;
                }

                // converting concentrations of pm10 to individual AQIs of IN, US, and EU  
                let pm10in = pm10IN(pm10conc);
                let pm10us = pm10US(pm10conc);
                let pm10eu = pm10EU(pm10conc);
                // console.log("pm10in is", pm10in);
                // console.log("pm10us is", pm10us);
                // console.log("pm10eu is", pm10eu);

                // converting concentrations of pm25 to individual AQIs of IN, US, and EU  
                let pm25in = pm25IN(pm25conc);
                let pm25us = pm25US(pm25conc);
                let pm25eu = pm25EU(pm25conc);
                // console.log("pm25in is", pm25in);
                // console.log("pm25us is", pm25us);
                // console.log("pm25eu is", pm25eu);

                // converting concentrations of o3 to individual AQIs of IN, US, and EU  
                let o3in = o3IN(o3conc);
                let o3us = o3US(o3conc);
                let o3eu = o3EU(o3conc);
                // console.log("o3in is", o3in);
                // console.log("o3us is", o3us);
                // console.log("o3eu is", o3eu);

                // converting concentrations of no2 to individual AQIs of IN, US, and EU  
                let no2in = no2IN(no2conc);
                let no2us = no2US(no2conc);
                let no2eu = no2EU(no2conc);
                // console.log("no2in is", no2in);
                // console.log("no2us is", no2us);
                // console.log("no2eu is", no2eu);

                // converting concentrations of so2 to individual AQIs of IN, US, and EU  
                let so2in = so2IN(so2conc);
                let so2us = so2US(so2conc);
                let so2eu = so2EU(so2conc);
                // console.log("so2in is", so2in);
                // console.log("so2us is", so2us);
                // console.log("so2eu is", so2eu);

                // converting concentrations of CO to individual AQIs of IN, US, and EU  
                let coin = coIN(coconc);
                let cous = coUS(coconc);
                // console.log("coin is", coin);
                // console.log("cous is", cous);

                if (PM10 != "NA" || PM25 != "NA") {
                    aqiIndia = Math.max(pm10in, pm25in, so2in, no2in, o3in, coin);
                    aqiUS = Math.max(pm10us, pm25us, so2us, no2us, o3us, cous);
                    aqiEurope = Math.max(pm10eu, pm25eu, so2eu, no2eu, o3eu);
                }
                else {
                    aqiIndia = "NA";
                    aqiUS = "NA";
                    aqiEurope = "NA";
                }

                if (PM10 != "NA") {
                    PM10 = pm10conc;
                }
                if (PM25 != "NA") {
                    PM25 = pm25conc;
                }
                if (O3 != "NA") {
                    O3 = o3conc;
                }
                if (NO2 != "NA") {
                    NO2 = no2conc;
                }
                if (SO2 != "NA") {
                    SO2 = so2conc;
                }
                if (CO != "NA") {
                    CO = coconc;
                }

                const completeObj = { Status, AQI, aqiIndia, aqiUS, aqiEurope, DominentPollutent, PM10, PM25, NO2, SO2, O3, CO, Temperartue, Humidity, time };
                const historicObj = { Status, Uid, LocationName, AQI, aqiIndia, aqiUS, aqiEurope, DominentPollutent, PM10, PM25, NO2, SO2, O3, Temperartue, Humidity, StationName, CityName, StateName, Country, time, latitude, longitude };

                historicDocuments.push(historicObj);
                let upsertDoc = {
                    'updateOne': {
                        'filter': { _id: _id },
                        'update': completeObj,
                        'upsert': true
                    }
                };
                // console.log(upsertDoc);
                bulkOps.push(upsertDoc);
                // console.log(updateDocument);
            }
        }
        const result = await historicModel.insertMany(historicDocuments);
        // console.log(result);
        await aqiModel.bulkWrite(bulkOps)
            .then(bulkWriteOpResult => {
                console.log('BULK update OK');
                console.log(JSON.stringify(bulkWriteOpResult, null, 2));
            })
            .catch(err => {
                console.log('BULK update error');
                console.log(JSON.stringify(err, null, 2));
            });
        const endTimestamp = moment().format();
        const EndTime = moment.tz(endTimestamp, 'Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        const CronName = "cron 2";
        const cronObj = {
            CronName,
            StartTime,
            EndTime
        }
        await cronLogModel.create(cronObj);
        console.log("Finished Updating cron 2");
    }
    catch (error) {
        console.log(error.message);
    }
});