const edge = require('electron-edge-js')
const $ = require('jquery')
const ko = require('knockout');
const chart = require('chart.js');

var vm = function() {

  var s = this;
  s.cpuStats = ko.observableArray([]);

  s.cpuChart = new Chart($('#cpuGraph'), {
    type: 'line',
    data: {
      labels: [''],
      datasets: [{
          label: 'CPU Utilization',
          data: [],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
      }]
  },
    options: {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
    }
  });

  s.updateGraph = function(value) {
    s.cpuChart.data.labels.push('');
    s.cpuChart.data.datasets.forEach((dataset) => {
        dataset.data.push(value);
        if (dataset.data.length > 25) {
          s.cpuChart.data.labels.shift();
          dataset.data.shift();
        }
    });

    s.cpuChart.update();
  }

  s.update = function() {
    var getCpuUtilizationFunc = edge.func({
      assemblyFile: '../dll/bin/Debug/cpuMonitor.dll',
      typeName: 'cpuMonitor.Monitor',
      methodName: 'GetCpuUtilization'
    });
    
    getCpuUtilizationFunc({ requestTimestamp: new Date()}, function (error, result) {
      s.cpuStats(result.cpuStats);
      s.updateGraph(result.avgPercentage);
    });
  }

  s.update();
  setInterval(s.update, 1000);
}

$(() => {
  ko.applyBindings(new vm());
})
