//playing with inputboxes
//var test_input_value = document.getElementById("input_cpa").value;

//function to adjust value from inputbox
function adjustcpa(value) {
  cpa = value
  for (i1 in vinvestment) {
    for (i2 in vholdout) {
      power = power_calc(conversion_rate_control, cpa, vinvestment[i1], total_group_size, vholdout[i2]);
      vpower1.push(power);
    }
    vpower[i1] = vpower1;
    vpower1 = new Array();
  };

  var data = [{
    x: vholdout1,
    y: vinvestment1,
    z: vpower,
    type: 'contour',
    //type: 'heatmap',
    colorscale: colorscaleValue,
    //colorscale: 'Jet',
    showscale: true
  }];

  Plotly.newPlot('myDiv', data, layout);
}

function adjustbasecr(value) {
  conversion_rate_control = value/100
  for (i1 in vinvestment) {
    for (i2 in vholdout) {
      power = power_calc(conversion_rate_control, cpa, vinvestment[i1], total_group_size, vholdout[i2]);
      vpower1.push(power);
    }
    vpower[i1] = vpower1;
    vpower1 = new Array();
  };

  var data = [{
    x: vholdout1,
    y: vinvestment1,
    z: vpower,
    type: 'contour',
    //type: 'heatmap',
    colorscale: colorscaleValue,
    //colorscale: 'Jet',
    showscale: true
  }];

  Plotly.newPlot('myDiv', data, layout);
}

//




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

var vholdout = [0.01,0.02,0.03,0.04,0.05,0.06,0.07,0.08,0.09,0.1,0.11,0.12,0.13,0.14,0.15,0.16,0.17,0.18,0.19,0.2,0.21,0.22,0.23,0.24,0.25,0.26,0.27,0.28,0.29,0.3,0.31,0.32,0.33,0.34,0.35,0.36,0.37,0.38,0.39,0.4,0.41,0.42,0.43,0.44,0.45,0.46,0.47,0.48,0.49,0.5];
//var vinvestment = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 75000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 1000000, 2000000];
var vinvestment = [10000,20000,30000,40000,50000,60000,70000,80000,90000,100000,110000,120000,130000,140000,150000,160000,170000,180000,190000,200000,210000,220000,230000,240000,250000,260000,270000,280000,290000,300000,310000,320000,330000,340000,350000,360000,370000,380000,390000,400000,410000,420000,430000,440000,450000,460000,470000,480000,490000,500000]
var vpower = new Array();
var vpower1 = new Array();

var vholdout1 = new Array()
var vinvestment1 = new Array()

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

var h1;
for (h1 in vholdout) {
  vholdout1.push(vholdout[h1].toString());
}

var in1;
for (in1 in vinvestment) {
  vinvestment1.push(vinvestment[in1].toString());
}


var colorscaleValue = [
  [0, '#d53e4f'],
  [0.6, '#fee08b'],
  [0.8, '#abdda4'],
  [1,'#003d00']
];

var data = [{
  x: vholdout1,
  y: vinvestment1,
  z: vpower,
  type: 'contour',
  //type: 'heatmap',
  colorscale: colorscaleValue,
  //colorscale: 'Jet',
  showscale: true
}];

var layout = {
  title: '',
  annotations: [],
  xaxis: {
    ticks: '',
    side: 'top'
  },
  yaxis: {
    ticks: '',
    ticksuffix: ' ',
    width: 700,
    height: 900,
    autosize: true
  }
};

for ( var i = 0; i < vinvestment1.length; i++ ) {
  for ( var j = 0; j < vholdout1.length; j++ ) {
    var currentValue = vpower[i][j];
    if (currentValue != 0.0) {
      var textColor = 'white';
    }else{
      var textColor = 'black';
    }
    var result = {
      xref: 'x1',
      yref: 'y1',
      x: vholdout1[j],
      y: vinvestment1[i],
      text: Math.round(vpower[i][j]*100)/100,
      font: {
        family: 'Arial',
        size: 8,
        color: 'rgb(50, 171, 96)'
      },
      showarrow: false,
      font: {
        color: textColor
      }
    };
    //layout.annotations.push(result);
  }
}

Plotly.newPlot('myDiv', data, layout);
