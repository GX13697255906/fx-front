<template>
  <div class="main_div">
    <div class="row_1">
      <div id="myChart"/>
      <div id="table_status">
      </div>
    </div>
    <div class="row_3"></div>
    <div class="row_2">
      <div id="myChart2">
        <MyChartTwo></MyChartTwo>
      </div>
      <div id="table_status2">
        <a-table id="data_rank" :style="{height:'100%'}" :dataSource='tableList' :columns='columns' row-key="id"
                 :pagination="true"
                 :scroll="{y:355}" @change="handleTableChange">
          <template slot="id" slot-scope="text">
            <a>{{ text }}</a>
          </template>
          <div
              slot="filterDropdown"
              slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
              style="padding: 8px">
            <a-input v-ant-ref="c => (searchInput = c)" :placeholder="`Search ${column.dataIndex}`"
                     :value="selectedKeys[0]"
                     style="width: 188px; margin-bottom: 8px; display: block;"
                     @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                     @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"/>
            <a-button type="primary" icon="search" size="small" style="width: 90px; margin-right: 8px"
                      @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)">
              Search
            </a-button>
            <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
              Reset
            </a-button>
          </div>
          <a-icon slot="filterIcon" slot-scope="filtered" type="search"
                  :style="{ color: filtered ? '#108ee9' : undefined }"/>
          <template slot="customRender" slot-scope="text, record, index, column">
      <span v-if="searchText && searchedColumn === column.dataIndex">
        <template
            v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))">
          <mark v-if="fragment.toLowerCase() === searchText.toLowerCase()" :key="i" class="highlight">
            {{ fragment }}
          </mark>
          <template v-else>
            {{ fragment }}
          </template>
        </template>
      </span>
            <template v-else>
              {{ text }}
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import {get} from '@/utils/http'
import MyChartTwo from "@/components/main_components/MyChartTwo";

let Mock = require('mockjs');
let Random = Mock.Random;
export default {
  name: "main",
  components: {
    MyChartTwo
  },
  data() {
    return {
      title: "main",
      bar_data: null,
      line_data: null,
      system_data: null,
      times: null,
      tableList: [],
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      columns: [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',
          scopedSlots: {customRender: 'id'},
          // 设置 column.ellipsis 可以让单元格内容根据宽度自动省略。
          ellipsis: true
        },
        {
          title: '电厂名称',
          dataIndex: 'subjectName',
          key: 'subjectName',
          scopedSlots: {
            //通过 filterDropdown 定义自定义的列筛选功能，并实现一个搜索列的示例。
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
              record.subjectName
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          }
        },
        {
          title: '所属行政区',
          dataIndex: 'area',
          key: 'area'
        },
        {
          title: '所属发电集团',
          dataIndex: 'powerGroup',
          key: 'powerGroup',
          scopedSlots: {
            //通过 filterDropdown 定义自定义的列筛选功能，并实现一个搜索列的示例。
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
              record.powerGroup
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          }
        },
        {
          title: '预期收益（万元）',
          dataIndex: 'currYield',
          key: 'currYield',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.currYield - b.currYield
        },
        {
          title: '实际上网电量（MWH）',
          dataIndex: 'actualPower',
          key: 'actualPower',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.actualPower - b.actualPower
        },
        {
          title: '执行偏差率',
          dataIndex: 'deviation',
          key: 'deviation',
          sorter: (a, b) => a.deviation - b.deviation
        }
      ],
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
      },


      //  vue-ele-table数据
      mockData: [],
      rightButtons: [
        {
          text: '编辑',
          click: (id, index, data) => {
            console.log(id, index, data)
            this.$message({
              type: 'success',
              message: '点击编辑了!'
            })
          }
        }
      ],
      topButtons: [
        {
          text: '新增',
          click: (data) => {
            console.log(data)
            this.$message({
              type: 'success',
              message: '点击新增!'
            })
          }
        },
        {
          text: '启用',
          attrs: {
            type: 'success'
          },
          click: (ids) => {
            console.log(ids)
            if (ids.length === 0) return
            this.$refs.table.reset()
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
            setTimeout(() => {
              this.mockData = this.mockData.map((item) => {
                if (ids.indexOf(item.id) > -1) {
                  item.status = 1
                }
                return item
              })
            }, 1000)
          }
        },
        {
          text: '禁用',
          attrs: {
            type: 'warning'
          },
          click: (ids) => {
            console.log(ids)
            if (ids.length === 0) return
            this.$refs.table.reset()
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
            setTimeout(() => {
              this.mockData = this.mockData.map((item) => {
                if (ids.indexOf(item.id) > -1) {
                  item.status = 0
                }
                return item
              })
            }, 1000)
          }
        }
      ],
      topTime: 'create_time',
      topSearch: [
        {text: '用户名', value: 'name'},
        {text: '省份', value: 'address'}
      ],
      columnsDesc: {
        id: {
          text: 'ID',
          sortable: true,
          width: 80
        },
        avatar: {
          text: '头像',
          type: 'image'
        },
        name: {
          text: '名字',
          type: 'input'
        },
        type: {
          text: '类型',
          options: ['VIP1', 'VIP2', 'VIP3', 'SVIP']
        },
        address: {
          text: '省份'
        },
        birthday: {
          toggleShow: true,
          text: '出生日期'
        },
        status: {
          text: '状态',
          type: 'status',
          toggleShow: true,
          width: 100,
          options: [
            {text: '正常', type: 'success', value: 1},
            {text: '禁用', type: 'danger', value: 0}
          ]
        },
        create_time: {
          text: '创建时间',
          type: 'datetime-text'
        }
      }


    }
  },
  mounted() {
    this.showLine();
    this.showDataRank();
    const data = this.getMockData();
    this.mockData = data;
  },
  methods: {
    showLine() {
      localStorage.setItem("areaCode", 'GuangDong');
      localStorage.setItem("marketId", '1307965417568268290');
      localStorage.setItem("scopeDate", '2020-05-13');
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

        if (this.line_data != null) {
          for (let i = 0; i < this.line_data.length; i++) {
            if (this.line_data[i] != null) {
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
    },
    showDataRank() {
      let url = 'http://172.16.6.161:8888/biz101/rank';
      localStorage.setItem("areaCode", 'GuangDong');
      localStorage.setItem("marketId", '1307965417568268290');
      localStorage.setItem("scopeDate", '2020-05-13');
      let params = {
        'areaCode': localStorage.getItem("areaCode"),
        'date': localStorage.getItem("scopeDate"),
        'dateType': 1,
        'current': 1,
        'size': 10
      };
      get(url, params).then((data) => {
        this.tableList = data.data.records;
        console.log(this.tableList)
      });
    },
    handleTableChange(val) {
      this.$emit('changeCurrent', val.current);
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },


    handleRequest(params) {
      console.log(params)
      return new Promise((resolve) => {
        setTimeout(() => {
          let list = this.mockData
          // 过滤
          if (params._filter) {
            const filters = params._filter.split('|')
            filters.forEach((item) => {
              item = item.split(':')
              const field = item[0]
              const values = item[1].split(',')
              list = list.filter((item) => {
                // eslint-disable-next-line eqeqeq
                return values.some((value) => value == item[field])
              })
            })
          }

          // 时间过滤
          if (params._filter_time) {
            const filterTimes = params._filter_time.split('|')
            filterTimes.forEach((item) => {
              item = item.split(':')
              const field = item[0]
              const [startTime, endTime] = item[1].split(',')
              list = list.filter((item) => {
                return item[field] > Number(startTime) && item[field] <= Number(endTime)
              })
            })
          }

          // 搜索过滤
          if (params._search_field && params._search_keyword) {
            const searchFields = params._search_field.split('|')
            list = list.filter((item) => {
              return searchFields.some(field => {
                return item[field].indexOf(params._search_keyword) > -1
              })
            })
          }

          // 排序
          if (params._order_field) {
            list.sort((a, b) => {
              return params._order_direction === 'asc' ? a[params._order_field] - b[params._order_field] : b[params._order_field] - a[params._order_field]
            })
          }

          // 截取
          resolve({
            total: list.length,
            list: list.slice((params.page - 1) * params.size, params.page * params.size)
          })
        }, 1000)
      })
    },
    handleDelete(primaryKey, index, row) {
      console.log(primaryKey, index, row)
      this.mockData = this.mockData.filter((item) => item.id !== primaryKey)
      return Promise.resolve()
    },
    handleDeletes(ids, data) {
      console.log(ids, data)
      this.mockData = this.mockData.filter((item) => ids.indexOf(item.id) === -1)
      return Promise.resolve()
    },
    handleUpdate(data) {
      console.log(data)
      this.mockData = this.mockData.map((item) => {
        if (item.id === data.id) {
          item = Object.assign({}, item, data)
        }
        return item
      })
      return Promise.resolve()
    },
    // 测试数据
    getMockData() {
      const data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'list|40': [{
          // 属性 id 是一个自增数，起始值为 1，每次增 1
          'id|+1': 1,
          'name': '@cname',
          'birthday': '@datetime',
          'address': '@province',
          'type|1': [
            'VIP1',
            'VIP2',
            'VIP3',
            'SVIP'
          ],
          'avatar': function () {
            return Random.image('250x250', Mock.mock('@hex'))
          },
          'create_time': function () {
            return (new Date().getTime() / 1000) - Random.integer(0, 864000)
          },
          'status|0-1': 1
        }]
      })
      return data.list
    }


  },
  watch: {}
}
</script>

<style scoped>
.main_div {
  display: flex;
  flex-direction: column;
}

.row_1 {
  display: block;
}

#myChart {
  float: left;
  width: 49.5%;
  height: 400px;
  background-color: #2d3a4b;
}

#table_status {
  float: right;
  width: 49.5%;
  height: 400px;
  background-color: #2d3a4b;
}

.row_3 {
  height: 5px;
}

.row_2 {
  height: 450px;
  display: block;
}

#myChart2 {
  float: left;
  width: 49.5%;
  height: 450px;
  /*background-color: #2d3a4b;*/
  background-color: #f0f2f5;
}

#table_status2 {
  float: right;
  height: 450px;
  width: 49.5%;
  background-color: #2d3a4b;
}

#data_rank {
  height: 100%;
}

</style>