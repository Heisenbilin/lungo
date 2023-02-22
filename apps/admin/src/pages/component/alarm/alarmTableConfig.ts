export const alarmRuleColumns = [
  {
    title: '告警名称',
    dataIndex: 'alarmName',
    key: 'alarmName',
  },
  {
    title: '监控类型',
    dataIndex: 'AlarmSetting',
    key: 'AlarmErrorType',
    // slots: { customRender: 'AlarmErrorType' },
  },
  {
    title: '已忽略类型',
    dataIndex: 'AlarmSetting',
    key: 'ignoreErrorType',
    // slots: { customRender: 'ignoreErrorType' },
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
    // slots: { customRender: 'settingRobots' },
  },
  {
    title: '告警状态',
    dataIndex: 'isActive',
    key: 'isActive',
    // slots: { customRender: 'isActive' },
  },
  {
    title: '操作',
    key: 'handle',
    // slots: { customRender: 'handle' },
  },
]
export const alarmLogColumns = [
  {
    title: '告警规则名称',
    dataIndex: 'alarmRuleId',
    key: 'alarmRule',
    // slots: { customRender: 'alarmRule' },
  },
  {
    title: '告警设置',
    dataIndex: 'alarmRuleId',
    key: 'alarmRule1',
    // slots: { customRender: 'alarmRule1' },
  },
  {
    title: '升级设置',
    dataIndex: 'alarmRuleId',
    key: 'alarmRule2',
    // slots: { customRender: 'alarmRule2' },
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
    // slots: { customRender: 'isUpgrade' },
  },
  {
    title: '触发时间',
    dataIndex: 'createTime',
    key: 'createTime',
    // slots: { customRender: 'createTime' },
  },
  /*{
      title: '操作',
      key: 'handle',
      slots: { customRender: 'handle' },
    },*/
]
export const alarmActionLogColumns = [
  {
    title: '告警规则名称',
    dataIndex: 'alarmRuleId',
    key: 'alarmRule',
    // slots: { customRender: 'alarmRule' },
  },
  {
    title: '来源',
    dataIndex: 'source',
    key: 'source',
    // slots: { customRender: 'source' },
  },
  {
    title: '动作',
    dataIndex: 'action',
    key: 'action',
    // slots: { customRender: 'action' },
  },
  {
    title: '人员',
    dataIndex: 'user',
    key: 'user',
    // slots: { customRender: 'user' },
  },
  {
    title: '触发时间',
    dataIndex: 'createTime',
    key: 'createTime',
    // slots: { customRender: 'createTime' },
  },
  /*{
      title: '操作',
      key: 'handle',
      // slots: { customRender: 'handle' },
    },*/
]
