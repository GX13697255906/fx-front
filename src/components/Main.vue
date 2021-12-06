<template>
  <div>

    <div>
      <div id="myChart"/>
    </div>

<!--    <div>-->
<!--      <ul>-->
<!--        <li v-for="(point, index) in bar_data" v-bind:key="point">{{ index }}-{{ point }}</li>-->
<!--      </ul>-->
<!--    </div>-->


  </div>
</template>

<script>
import {get} from '@/utils/http'

export default {
  name: "main",
  data() {
    return {
      title: "main",
      bar_data: null,
      line_data: null,
      system_data: null,
      times: null,
      echarts_option: {
        title: {
          text: '超短期负荷预测准确率',
          textStyle: {
            color: 'aliceblue'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        //图例 legend 默认显示line或bar名称（name）
        legend: {
          textStyle: {
            color: 'aliceblue'
          }
        },
        xAxis: {
          name: '时间',
          data: []
        },
        yAxis: [{
          type: "value",
          name: '单位：MW',
          axisLabel: {
            formatter: '{value}',
            // textStyle: {
            //   color: '#fff'
            // }
          },
          axisLine: {show: true},
          axisTick: {show: true}

          // data: [0, 20000, 40000, 60000, 80000, 100000]
        },
          {
            type: "value",
            name: "准确率%",
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: '{value}%',
            },
            axisLine: {show: true},
            axisTick: {show: true}
          }],
        series: [{}, {}, {}]
      }
    }
  },
  mounted() {
    this.showLine();
  },
  methods: {
    showLine() {
      localStorage.setItem("areaCode", 'GuangDong');
      localStorage.setItem("marketId", '1307965417568268290');
      localStorage.setItem("Authorization", "bearer8973a9fb-6366-43b0-ba01-3288222f64be");
      localStorage.setItem("scopeDate", '2020-05-13');
      console.log("------------show Line-------------")
      let url = 'http://172.16.6.161:8888/biz104/ram/forecast/system';

      let params = {
        "areaCode": "GuangDong",
        "date": localStorage.getItem("scopeDate")
      };

      get(url, params).then((data) => {
        this.bar_data = data.data.actual;
        this.line_data = data.data.deviation;
        this.system_data = data.data.forecast;
        this.times = data.data.time;
        this.echarts_option.xAxis.data = this.times;

        this.echarts_option.series[0].name = "实际负荷";
        this.echarts_option.series[0].data = this.bar_data;
        this.echarts_option.series[0].type = 'line';

        if(this.line_data != null){
          for(let i = 0;i<this.line_data.length;i++){
              console.log(this.line_data[0])
            if(this.line_data[i] != null && this.line_data[0] != 0){
              this.line_data[i] = this.line_data[i] * 100;
            }
          }
        }

        this.echarts_option.series[1].name = "负荷预测准确率";
        this.echarts_option.series[1].data = this.line_data;
        this.echarts_option.series[1].type = 'line';

        this.echarts_option.series[2].name = "超短期预测负荷";
        this.echarts_option.series[2].data = this.system_data;
        this.echarts_option.series[2].type = 'line';
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption(this.echarts_option, true);
      });
    }
  },
  watch: {}
}
</script>

<style scoped>
#myChart {
  width: 50%;
  height: 300px;
  background-color: #2d3a4b;
}
</style>