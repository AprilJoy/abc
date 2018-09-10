/**
 * @file 单页面js文件
 *       通过ajax从其他接口读入数据
 *       或者读取静态数据
 * @author dongshaoyang(dongshaoyang@baidu.com)
 * @createtime 2018-09-10
 * @updatetime 2018-09-10
 */
import Chart from 'chart.js';

import $ from 'jquery';
import a from './demo';

// 从其他demo的文件中引入变量foo
let ctx = a.foo;

let message = 'The long line.';
$('#we').html(message);


let ctx5 = $('#myChart5');
let config = { // 创建一个实例
    type: 'bar', // 图表类型
    data: { // 图表数据
        labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        datasets: [
            {
                label: '生产量',
                data: [2000, 3000, 4000, 5000, 4000, 6000, 8000, 7000, 5000, 2000, 1000, 9000],
                backgroundColor: '#FF6384',
                borderColor: '#FF6384'
            }
        ]
    },
    options: { // 图表配置项
        title: {
            display: true,
            text: '2017年度xx工厂月生产量'
        },
        scales: { // 刻度
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
};
let myChart = new Chart(ctx5, config);


let dataPoints = [];
function addData(data) {
    for (let i = 0; i < data.length; i++) {
        dataPoints.push({
            x: new Date(data[i].date),
            y: data[i].units
        });
    }
    console.log(dataPoints);
    let tmp = [];
    for (let i = dataPoints.length - 1; i >= 0; i--) {
        tmp.push(dataPoints[i].y);
    }
    console.log(tmp);
    console.log(config.data.datasets[0].data);
    config.data.datasets[0].data = tmp;
    myChart.update();

}

$.getJSON('http://localhost:3000/api/data/gallery/javascript/daily-sales-data.json', addData);



