Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif', Chart.defaults.global.defaultFontColor = "#292b2c";
var budget = 45000;
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx,
    {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "今日支出",
                lineTension: .3,
                backgroundColor: "rgba(210,17,16,0.3)",
                borderColor: "rgba(220,17,16,1)",
                pointRadius: 5,
                pointBackgroundColor: "rgba(220,17,16,0.3)",
                pointBorderColor: "rgba(255,255,255,0.8)",
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(225,17,16,1)",
                pointHitRadius: 20,
                pointBorderWidth: 2,
                data: []
            },
                {
                    label: "本月預算",
                    lineTension: .3,
                    backgroundColor: "rgba(255,17,16,0.0)",
                    borderColor: "rgba(225,17,16,1)",
                    pointBackgroundColor: "rgba(220,17,16,1)",
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    data: []
                },
                {
                    label: "本月累計支出",
                    lineTension: .3,
                    backgroundColor: "rgba(12,1,160,0.3)",
                    borderColor: "rgba(12,170,160,1)",
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(12,170,160,0.5)",
                    pointBorderColor: "rgba(255,255,255,0.8)",
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(12,170,160,0.5)",
                    pointHitRadius: 20,
                    pointBorderWidth: 2,
                    data: []
                }]
        },
        options: {
            scales: {
                xAxes: [{time: {unit: "date"}, gridLines: {display: !1}, ticks: {maxTicksLimit: 7}}],
                yAxes: [{ticks: {min: 0, max: 5e4, maxTicksLimit: 5}, gridLines: {color: "rgba(0, 0, 0, .125)"}}]
            },
        }
    });

var lineChartUpdate = function (obj_label_data) {

    myLineChart.data.labels = [];
    myLineChart.data.datasets[0].data = [];
    var month_acc = 0;
    console.log(obj_label_data.price);
    for (var i = obj_label_data.date.length - 1; i >= 0; --i) {

        var yyyymmdd = obj_label_data.date[i].split('-');
        console.log(parseInt(yyyymmdd[1]));
        var mS = ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        var date = mS[parseInt(yyyymmdd[1])]+' '+yyyymmdd[2];

        month_acc += parseInt(obj_label_data.price[i]);
        var previous = myLineChart.data.labels.length - 1;
        if(myLineChart.data.labels[previous] === date){
            myLineChart.data.datasets[0].data[previous] += parseInt(obj_label_data.price[i]);
            myLineChart.data.datasets[2].data[previous] = (month_acc);
        }else{
            myLineChart.data.labels.push(date); //obj_label_data.date[i]);
            myLineChart.data.datasets[0].data.push(parseInt(obj_label_data.price[i]));
            myLineChart.data.datasets[1].data.push(budget);
            myLineChart.data.datasets[2].data.push(month_acc);
        }
    }
    console.log( myLineChart.data.datasets[0].data);
    myLineChart.update()
};
$(document).ready(function () {
    var username = document.cookie.match(/name=.*;?/);
    username = username[0].split('=')[1];
    $("#userName").html('<i class="fa fa-user" aria-hidden="true"></i>&nbsp'+username);
    var request = $.ajax({
        url: "/getRecent",
        method: "GET",
        dataType: "json",
        success: function (response) {
            var obj = {
                date: response.date,
                price: response.price,
                outcome_acc: response.outcome_acc
            }
            lineChartUpdate(obj);
            $('#TodayNTD').text(response.price[0] +'NTD');
            $('#ThisMonthNTD').text(response.outcome_acc + 'NTD');
            $('#TotalBalance').text(response.balance + 'NTD');
            $('#MonthBudget').text('45000NTD');
            $("#ThisMonth").html(' <div class="card-header" id="ThisMonth"> <i class="fa fa-area-chart"></i>'
                +  obj.date[0].split('-')[0] + ' 本月支出'+' </div> ' )
        }
    });
});
