//set visibility according to the input
document.getElementById("input_holdout").style.visibility = "hidden";
document.getElementById("input_cpa").style.visibility = "hidden";

input_selected = "investment";

function click_investment() {
  document.getElementById("input_investment").style.visibility = "visible";
  document.getElementById("input_holdout").style.visibility = "hidden";
  document.getElementById("input_cpa").style.visibility = "hidden";
  input_selected = "investment";
};

function click_cpa() {
  document.getElementById("input_investment").style.visibility = "hidden";
  document.getElementById("input_holdout").style.visibility = "hidden";
  document.getElementById("input_cpa").style.visibility = "visible";
  input_selected = "cpa";
};

function click_holdout() {
  document.getElementById("input_investment").style.visibility = "hidden";
  document.getElementById("input_holdout").style.visibility = "visible";
  document.getElementById("input_cpa").style.visibility = "hidden";
  input_selected = "holdout";
};

// power calc function
function power_calc(conversion_rate_control, cpa, investment, total_group_size, holdout) {
  conversion_rate_test = conversion_rate_control+(investment/cpa)/(total_group_size*(1-holdout))
  if (conversion_rate_test > 1){
    conversion_rate_test = 1
  }
  df_Welch = (((conversion_rate_test*(1-conversion_rate_test))/(total_group_size*(1-holdout)))
              +((conversion_rate_control*(1-conversion_rate_control))/(total_group_size*holdout)))^2 /
              ( (((conversion_rate_test*(1-conversion_rate_test))/(total_group_size*(1-holdout)))^2)/((total_group_size*(1-holdout))-1)
              + (((conversion_rate_control*(1-conversion_rate_control))/(total_group_size*holdout))^2)/((total_group_size*holdout)-1))

  ncp = Math.abs(conversion_rate_test - conversion_rate_control)/Math.sqrt(((conversion_rate_test*(1-conversion_rate_test))/
       (total_group_size*(1-holdout)))+((conversion_rate_control*(1-conversion_rate_control))/(total_group_size*(holdout))))

  return(1-jStat.noncentralt.cdf(jStat.studentt.inv(0.95,df_Welch),df_Welch,ncp))
};

//function when investment is selected
function calculate_investment() {
  conversion_rate_control = input_basecr.value/100;
  total_group_size = input_group_size.value;
  investment = input_investment.value;

  for (i1 in vcpa) {
    for (i2 in vholdout) {
      power = power_calc(conversion_rate_control, vcpa[i1], investment, total_group_size, vholdout[i2]);
      vpower1.push(power);
    }
    vpower[i1] = vpower1;
    vpower1 = new Array();
  };

  var data = [{
    x: vholdout,
    y: vcpa,
    z: vpower,
    type: 'contour',
    colorscale: colorscaleValue,
    showscale: true
  }];

  var layout = {
    title: '',
    annotations: [],
    xaxis: {
      ticks: '',
      side: 'top'
    },
    xaxis: {
      title: 'Holdout %',
      titlefont: {
        size: 12,
        color: '#7f7f7f'
      }
    },
    yaxis: {
      title: 'Cost per Incremental Buyer $',
      titlefont: {
        size: 12,
        color: '#7f7f7f'
      }
    }
  };

  Plotly.newPlot('myDiv', data, layout);
};

function calculate_holdout() {
  conversion_rate_control = input_basecr.value/100;
  total_group_size = input_group_size.value;
  holdout = input_holdout.value/100;

  for (i1 in vcpa) {
    for (i2 in vinvestment) {
      power = power_calc(conversion_rate_control, vcpa[i1], vinvestment[i2], total_group_size, holdout);
      vpower1.push(power);
    }
    vpower[i1] = vpower1;
    vpower1 = new Array();
  };

  var data = [{
    x: vinvestment,
    y: vcpa,
    z: vpower,
    type: 'contour',
    colorscale: colorscaleValue,
    showscale: true
  }];

  var layout = {
    title: '',
    annotations: [],
    xaxis: {
      ticks: '',
      side: 'top'
    },
    xaxis: {
      title: 'Total Investment $',
      titlefont: {
        size: 12,
        color: '#7f7f7f'
      }
    },
    yaxis: {
      title: 'Cost per Incremental Buyer $',
      titlefont: {
        size: 12,
        color: '#7f7f7f'
      }
    }
  };

  Plotly.newPlot('myDiv', data, layout);
};

function calculate_cpa() {
  conversion_rate_control = input_basecr.value/100;
  total_group_size = input_group_size.value;
  cpa = input_cpa.value;

  for (i1 in vholdout) {
    for (i2 in vinvestment) {
      power = power_calc(conversion_rate_control, cpa, vinvestment[i2], total_group_size, vholdout[i1]);
      vpower1.push(power);
    }
    vpower[i1] = vpower1;
    vpower1 = new Array();
  };

  var data = [{
    x: vinvestment,
    y: vholdout,
    z: vpower,
    type: 'contour',
    colorscale: colorscaleValue,
    showscale: true
  }];

  var layout = {
    title: '',
    annotations: [],
    xaxis: {
      ticks: '',
      side: 'top'
    },
    xaxis: {
      title: 'Total Investment $',
      titlefont: {
        size: 12,
        color: '#7f7f7f'
      }
    },
    yaxis: {
      title: 'Holdout %',
      titlefont: {
        size: 12,
        color: '#7f7f7f'
      }
    }
  };

  Plotly.newPlot('myDiv', data, layout);
};

//calculate button function
function calculate() {
  var vpower = new Array();
  var vpower1 = new Array();
  var data = new Array();

  if (input_selected == "investment") {
    calculate_investment();
  } else if (input_selected == "holdout") {
    calculate_holdout();
  } else {
    calculate_cpa();
  }
};

//defaults and plotly
var vholdout = [0.01,0.02,0.03,0.04,0.05,0.06,0.07,0.08,0.09,0.1,0.11,0.12,0.13,0.14,0.15,0.16,0.17,0.18,0.19,0.2,0.21,0.22,0.23,0.24,0.25,0.26,0.27,0.28,0.29,0.3,0.31,0.32,0.33,0.34,0.35,0.36,0.37,0.38,0.39,0.4,0.41,0.42,0.43,0.44,0.45,0.46,0.47,0.48,0.49,0.5];
var vinvestment = [10000,20000,30000,40000,50000,60000,70000,80000,90000,100000,110000,120000,130000,140000,150000,160000,170000,180000,190000,200000,210000,220000,230000,240000,250000,260000,270000,280000,290000,300000,310000,320000,330000,340000,350000,360000,370000,380000,390000,400000,410000,420000,430000,440000,450000,460000,470000,480000,490000,500000]
var vcpa = [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250];

var vpower = new Array();
var vpower1 = new Array();

conversion_rate_control = 0.01;
cpa = 200;
total_group_size = 10000000;

var i1;
var i2;

for (i1 in vinvestment) {
  for (i2 in vholdout) {
    power = power_calc(conversion_rate_control, cpa, vinvestment[i1], total_group_size, vholdout[i2]);
    vpower1.push(power);
  }
  vpower[i1] = vpower1;
  vpower1 = new Array();
};

var colorscaleValue = [
  [0, '#d53e4f'],
  [0.6, '#fee08b'],
  [0.8, '#abdda4'],
  [1,'#003d00']
];

var data = [{
  x: vholdout,
  y: vinvestment,
  z: vpower,
  type: 'contour',
  colorscale: colorscaleValue,
  showscale: true
}];

var layout = {
  title: '',
  annotations: [],
  xaxis: {
    ticks: '',
    side: 'top'
  },
  xaxis: {
    title: 'Holdout %',
    titlefont: {
      size: 12,
      color: '#7f7f7f'
    }
  },
  yaxis: {
    title: 'Total Investment $',
    titlefont: {
      size: 12,
      color: '#7f7f7f'
    }
  }
};

Plotly.newPlot('myDiv', data, layout);
