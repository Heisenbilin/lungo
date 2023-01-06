<template>
  <div>
    <a-modal v-model:visible="visible" title="告警设置" :footer="null" width="80%">
      <a-button type="primary" @click="currentInstance.ctx.$refs.alarmForm.showModal()"> 新增规则</a-button>
      <div></div>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="告警规则">
          <a-table :dataSource="alarmRuleList" :columns="alarmRuleColumns" rowKey="id" :pagination="false">
            <template #AlarmErrorType="{ record }">
              <div v-for="item in record.AlarmSetting.AlarmErrorType" :key="item.id">
                {{ item.errorType }}
              </div>
            </template>
            <template #ignoreErrorType="{ record }">
              <div v-for="item in formatIgnoreError(
                record.AlarmSetting.AlarmErrorType,
                record.ignoreErrorIds
              )" :key="item">
                {{ item }}
              </div>
            </template>
            <template #settingRobots="{ record }">
              <div>{{ record.AlarmSetting.robot.length }}个告警群</div>
            </template>
            <template #isActive="{ record }">
              <a-switch checked-children="开" un-checked-children="关" v-model:checked="record.isActive"
                @change="val => updateRuleStatus(val, record)" />
            </template>
            <template #handle="{ record }">
              <a-button type="link" @click="openUpdateForm(record)">修改</a-button>
              <a-button type="link" v-for="item in formatCanIgnoreErrorList(
                record.ignoreErrorIds,
                record.AlarmSetting.AlarmErrorType
              )" :key="item.id" @click="ignoreErrorType(record.id, record.ignoreErrorIds, item.id)">忽略{{
  item.errorType
}}</a-button>
              <a-button type="link" v-for="item in formatCanRemoveIgnoreErrorList(
                record.ignoreErrorIds,
                record.AlarmSetting.AlarmErrorType
              )" :key="item.id" @click="removeIgnoreErrorType(record.id, record.ignoreErrorIds, item.id)">取消忽略{{
  item.errorType
}}</a-button>
              <a-popconfirm title="确认删除该规则？" ok-text="Yes" cancel-text="No" @confirm="removeAlarmRule(record.id)">
                <a-button type="link">删除</a-button>
              </a-popconfirm>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="告警记录">
          <a-table :dataSource="alarmLogList" :columns="alarmLogColumns" rowKey="id" :pagination="alarmLogPagination">
            <template #alarmRule="{ record }">
              {{ record.AlarmRule.alarmName }}
            </template>
            <template #alarmRule1="{ record }">
              {{ record.AlarmRule.interval }}分钟内达到{{ record.AlarmRule.value }}
            </template>
            <template #alarmRule2="{ record }">
              {{ record.AlarmRule.upgradeCondition }}分钟内触发{{ record.AlarmRule.upgradeNum }}
            </template>
            <template #isUpgrade="{ record }">
              {{ record.isUpgrade ? '升级' : '普通' }}
            </template>
            <template #createTime="{ record }">
              {{ formatUtcTime(record.createTime) }}
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="3" tab="行为记录">
          <a-table :dataSource="alarmActionLogList" :columns="alarmActionLogColumns" rowKey="id"
            :pagination="alarmActionLogPagination">
            <template #alarmRule="{ record }">
              {{ record.AlarmRule.alarmName }}
            </template>
            <template #source="{ record }">
              <a-tag color="green">{{ formatSource(record.source) }}</a-tag>
            </template>
            <template #action="{ record }">
              <a-tag color="orange">{{ formatAction(record.action) }}</a-tag>
            </template>
            <template #user="{ record }">
              <a-button type="link" @click="openYach(formatUser(record.user).account)">{{
                formatUser(record.user).name
              }}</a-button>
            </template>
            <template #createTime="{ record }">
              {{ formatLocalTime(record.createTime) }}
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
      <alarm-form ref="alarmForm" @close="onClose" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, ref, toRefs, watch, getCurrentInstance, onMounted } from 'vue';
import {
  requestAlarmRuleList,
  requestAlarmLogList,
  requestAlarmActionLogList,
  requestUpdateRuleStatus,
  requestRemoveAlarmRule,
  requestIgnoreAlarmType,
} from '@/apis/alarm';
import AlarmForm from './alarmForm.vue';
import { message } from 'ant-design-vue';
import moment from 'moment';
import { ToolsLib } from '@xes/fe-utils';
import { requestYachId } from '@/apis/tool';
const props = defineProps({
  projectId: {
    type: Number,
  },
  ucGroupId: {
    type: String,
    default: '',
  },
})
const { projectId, ucGroupId } = toRefs(props);
provide('projectId', projectId);
provide('ucGroupId', ucGroupId);
const visible = ref(false);
const alarmForm = ref();
const activeKey = ref('1');
const alarmRuleList = ref([]);
const alarmLogList = ref([]);
const alarmActionLogList = ref([]);


let currentInstance: any = ''
onMounted(() => {
  currentInstance = getCurrentInstance()
})

const alarmRuleColumns = reactive([
  {
    title: '告警名称',
    dataIndex: 'alarmName',
    key: 'alarmName',
  },
  {
    title: '监控类型',
    dataIndex: 'AlarmSetting',
    key: 'AlarmErrorType',
    slots: { customRender: 'AlarmErrorType' },
  },
  {
    title: '已忽略类型',
    dataIndex: 'AlarmSetting',
    key: 'ignoreErrorType',
    slots: { customRender: 'ignoreErrorType' },
  },
  {
    title: '告警周期【分钟】',
    dataIndex: 'interval',
    key: 'interval',
  },
  {
    title: '告警阀值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '升级周期【分钟】',
    dataIndex: 'upgradeCondition',
    key: 'upgradeCondition',
  },
  {
    title: '升级阀值',
    dataIndex: 'upgradeNum',
    key: 'upgradeNum',
  },
  {
    title: '告警提醒群',
    dataIndex: 'settingId',
    key: 'settingRobots',
    slots: { customRender: 'settingRobots' },
  },
  {
    title: '告警状态',
    dataIndex: 'isActive',
    key: 'isActive',
    slots: { customRender: 'isActive' },
  },
  {
    title: '操作',
    key: 'handle',
    slots: { customRender: 'handle' },
  },
]);
const alarmLogColumns = reactive([
  {
    title: '告警规则名称',
    dataIndex: 'alarmRuleId',
    key: 'alarmRule',
    slots: { customRender: 'alarmRule' },
  },
  {
    title: '告警设置',
    dataIndex: 'alarmRuleId',
    key: 'alarmRule1',
    slots: { customRender: 'alarmRule1' },
  },
  {
    title: '升级设置',
    dataIndex: 'alarmRuleId',
    key: 'alarmRule2',
    slots: { customRender: 'alarmRule2' },
  },
  {
    title: '错误数量',
    dataIndex: 'errorNum',
    key: 'errorNum',
  },
  {
    title: '是否升级告警',
    dataIndex: 'isUpgrade',
    key: 'isUpgrade',
    slots: { customRender: 'isUpgrade' },
  },
  {
    title: '触发时间',
    dataIndex: 'createTime',
    key: 'createTime',
    slots: { customRender: 'createTime' },
  },
  /*{
      title: '操作',
      key: 'handle',
      slots: { customRender: 'handle' },
    },*/
]);
const alarmActionLogColumns = reactive([
  {
    title: '告警规则名称',
    dataIndex: 'alarmRuleId',
    key: 'alarmRule',
    slots: { customRender: 'alarmRule' },
  },
  {
    title: '来源',
    dataIndex: 'source',
    key: 'source',
    slots: { customRender: 'source' },
  },
  {
    title: '动作',
    dataIndex: 'action',
    key: 'action',
    slots: { customRender: 'action' },
  },
  {
    title: '人员',
    dataIndex: 'user',
    key: 'user',
    slots: { customRender: 'user' },
  },
  {
    title: '触发时间',
    dataIndex: 'createTime',
    key: 'createTime',
    slots: { customRender: 'createTime' },
  },
  /*{
      title: '操作',
      key: 'handle',
      slots: { customRender: 'handle' },
    },*/
]);
// 分页配置
const alarmLogPagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
  onChange: async current => {
    alarmLogForm.offset = (current - 1) * alarmLogForm.limit;
    alarmLogPagination.current = current;
    await getAlarmLogList();
  },
});
// 分页配置
const alarmActionLogPagination = reactive({
  current: 1,
  pageSize: 5,
  total: 0,
  onChange: current => {
    console.log(current);
    alarmActionLogForm.offset = (current - 1) * alarmActionLogForm.limit;
    alarmActionLogPagination.current = current;
    getAlarmActionLogList();
  },
});
watch(activeKey, val => {
  if (val === '1') {
    getAlarmRuleList();
  }
  if (val === '2') {
    getAlarmLogList();
  }
  if (val === '3') {
    getAlarmActionLogList();
  }
});
const showModal = () => {
  visible.value = true;
  getAlarmRuleList();
};
const closeModal = () => {
  visible.value = false;
};
// const projectId = inject('projectId');
const getAlarmRuleList = async () => {
  if (!projectId) return
  const {
    stat = 0,
    msg = '',
    data,
  } = await requestAlarmRuleList({
    projectId: projectId.value,
    projectTag: 'xiaosongshu',
  });
  if (stat) {
    alarmRuleList.value = data;
    return;
  }
  message.error(msg);
};
const alarmLogForm = reactive({
  offset: 0,
  limit: 5,
});
const alarmActionLogForm = reactive({
  offset: 0,
  limit: 5,
});
const getAlarmLogList = async () => {
  if (!projectId) return
  const {
    stat = 0,
    msg = '',
    data,
  } = await requestAlarmLogList({
    projectId: projectId.value,
    projectTag: 'xiaosongshu',
    offset: alarmLogForm.offset,
    limit: alarmLogForm.limit,
  });
  if (stat) {
    const { rows, count } = data;
    alarmLogPagination.total = count;
    alarmLogList.value = rows;
    return;
  }
  message.error(msg);
};
const getAlarmActionLogList = async () => {
  if (!projectId) return
  const {
    stat = 0,
    msg = '',
    data,
  } = await requestAlarmActionLogList({
    projectId: projectId.value,
    projectTag: 'xiaosongshu',
    offset: alarmActionLogForm.offset,
    limit: alarmActionLogForm.limit,
  });
  if (stat) {
    const { rows, count } = data;
    alarmActionLogPagination.total = count;
    alarmActionLogList.value = rows;
    return;
  }
  message.error(msg);
};
// 打开修改表单
const openUpdateForm = record => {
  alarmForm.value.showModal(record);
};
// 关闭事件的回调
const onClose = () => {
  getAlarmRuleList();
};
// 修改告警规则的状态
const updateRuleStatus = async (isActive, record) => {
  const { stat = 0 } = await requestUpdateRuleStatus({ isActive, id: record.id });
  if (stat) {
    message.info('更新成功');
    return;
  }
  message.error('更新失败');
  record.isActive = !isActive;
};
/**
 * UTC时间转为本地时间
 * @param date UTC日期字符串
 * @return {string}
 */
const formatUtcTime = date => {
  return moment(date).utcOffset(-8).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 本地时间格式化
 * @param date UTC日期字符串
 * @return {string}
 */
const formatLocalTime = date => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

/**
 * 转换行为
 * @param action 动作
 * @returns {string}
 */
const formatAction = action => {
  const actionMap = new Map([
    ['delete', '删除规则'],
    ['add', '新增规则'],
    ['update', '更新配置'],
    ['ignore', '忽略错误'],
    ['detail', '详情'],
    ['stop', '暂停预警'],
    ['start', '启用预警'],
  ]);
  return actionMap.get(action);
};

/**
 * 转换来源
 * @param source 来源
 * @returns {string}
 */
const formatSource = source => {
  const sourceMap = new Map([
    ['zhiyinlou', '知音楼'],
    ['Web', '网站'],
  ]);
  return sourceMap.get(source);
};

/**
 * 转换用户信息
 * @param user 用户信息字符串
 * @returns {Object}
 */
const formatUser = user => {
  return ToolsLib.jsonParse(user, {});
};
/**
 * 提取出忽略的错误类型。
 * @param {array} errorList 已监控的错误类型
 * @param {string} ignoreIds 忽略错误类型字符串
 * return {array} 错误类型数组
 */
const formatIgnoreError = (errorList, ignoreIds) => {
  const ignoreIdList = ignoreIds.split(',').map(Number);
  const errorMap = new Map();
  errorList.forEach(({ id, errorType }) => {
    errorMap.set(id, errorType);
  });
  const ignoreErrorList: any[] = [];
  ignoreIdList.forEach(val => {
    const errorType = errorMap.get(val);
    if (errorType) {
      ignoreErrorList.push(errorType);
    }
  });
  return ignoreErrorList;
};
/**
 * 忽略错误显示格式化
 * @param {string} ignoreErrorIds 忽略错误字符串
 * @param {array} errorTypeList 错误类型列表
 * @return {Promise<void>}
 */
const formatCanIgnoreErrorList = (ignoreErrorIds, errorTypeList) => {
  const ignoreErrorIdList = ignoreErrorIds.split(',').map(Number);
  return errorTypeList.filter(item => !ignoreErrorIdList.includes(item.id));
};
/**
 * 可取消忽略的错误类型
 * @param {string} ignoreErrorIds 忽略错误字符串
 * @param {array} errorTypeList 错误类型列表
 * @return {Promise<void>}
 */
const formatCanRemoveIgnoreErrorList = (ignoreErrorIds, errorTypeList) => {
  const ignoreErrorIdList = ignoreErrorIds.split(',').map(Number);
  return errorTypeList.filter(item => ignoreErrorIdList.includes(item.id));
};
/**
 * 删除规则
 * @param {number} id 规则ID
 * @return {Promise<void>}
 */
const removeAlarmRule = async id => {
  const { stat = 0 } = await requestRemoveAlarmRule({ id });
  if (stat) {
    message.info('删除成功');
    await getAlarmRuleList();
    return;
  }
  message.error('删除失败');
};

/**
 * 忽略某种类型的错误
 * @param {number} id 规则ID
 * @param {string} ignoreErrorIds 已忽略的ID字符串
 * @param {number} ignoreId 将要忽略的类型ID
 * @return {Promise<void>}
 */
const ignoreErrorType = async (id, ignoreErrorIds, ignoreId) => {
  const conIgnoreIds = [ignoreErrorIds, ignoreId].join(',');
  const { stat = 0 } = await requestIgnoreAlarmType({ id, ignoreErrorIds: conIgnoreIds });
  if (stat) {
    message.info('忽略成功');
    await getAlarmRuleList();
    return;
  }
  message.error('忽略失败');
};
/**
 * 取消忽略某种类型的错误
 * @param {number} id 规则ID
 * @param {string} ignoreErrorIds 已忽略的ID字符串
 * @param {number} ignoreId 要取消忽略的类型ID
 * @return {Promise<void>}
 */
const removeIgnoreErrorType = async (id, ignoreErrorIds, ignoreId) => {
  // 将忽略的ID从忽略字符串中提取出来
  // [1,2,3], 3 ==> [1,2]
  const removeIgnoreIds = ignoreErrorIds
    .split(',')
    .map(Number)
    .filter(item => item !== ignoreId)
    .join(',');
  const { stat = 0 } = await requestIgnoreAlarmType({ id, ignoreErrorIds: removeIgnoreIds });
  if (stat) {
    message.info('取消忽略成功');
    await getAlarmRuleList();
    return;
  }
  message.error('取消忽略失败');
};

/**
 * 打开知音楼
 * @param account 用户名
 * @returns {Promise<void>}
 */
const openYach = async account => {
  const result = await requestYachId({ account });
  const { stat = 0, data = [] } = result;
  if (stat !== 1 || data.length === 0) {
    message.warning('没有查询到人员相关知音楼信息');
    return;
  }
  const { yachid } = data[0];
  window.location.href = `yach://yach.zhiyinlou.com/session/sessionp2p?sessionid=${yachid}`;
};

</script>
