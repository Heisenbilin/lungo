<template>
  <div>
    <a-modal v-model:visible="visible" :title="modelTitle" :footer="null" width="50%">
      <a-form ref="formRef" :model="alarmForm" v-bind="formItemLayout" :rules="rules">
        <a-form-item label="告警名称" name="alarmName">
          <a-input v-model:value="alarmForm.alarmName" placeholder="输入告警名称" />
        </a-form-item>
        <a-form-item label="错误类型" name="errorIds">
          <a-checkbox-group v-model:value="settingObj.errorIds">
            <a-checkbox :value="item.id" v-for="item in errorTypeList" :key="item.id"
              :disabled="ignoreErrorIdList.includes(item.id)">
              {{ item.errorType + '【' + item.errorDesc + '】' }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-row>
          <a-col :span="10">
            <a-form-item label="监控周期" v-bind="defaultItemLayout" name="interval">
              <a-input-number v-model:value="alarmForm.interval" :min="10" :step="10" :max="60"
                :formatter="value => `${value}分钟`" :parser="value => value.replace('分钟', '')" />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="告警阀值" v-bind="defaultItemLayout" name="value">
              <a-input-number v-model:value="alarmForm.value" :min="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="alarm-desc">
          * {{ alarmForm.interval }}分钟内达到{{ alarmForm.value }}个将触发告警
        </div>
        <a-row>
          <a-col :span="10">
            <a-form-item label="升级周期" v-bind="defaultItemLayout" name="upgradeCondition">
              <a-input-number v-model:value="alarmForm.upgradeCondition" :min="10" :step="10" :max="60"
                :formatter="value => `${value}分钟`" :parser="value => value.replace('分钟', '')" />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="升级阀值" v-bind="defaultItemLayout" name="upgradeNum">
              <a-input-number v-model:value="alarmForm.upgradeNum" :min="1" />
            </a-form-item>
          </a-col>
        </a-row>
        <div class="alarm-desc">
          * {{ alarmForm.upgradeCondition }}分钟内达到{{ alarmForm.upgradeNum }}次将触发升级告警
        </div>
        <a-form-item label="选择告警人员">
          <GroupUsersCheckbox :base-url="baseURL" :uc-group-id="ucGroupId" field="workcode" :span="6" popover
            v-model="settingObj.alarmUsers" />
        </a-form-item>
        <a-alert message="告警群设置需要借助知音楼群中添加的机器人的WebHook与密钥来推送告警" type="warning" closable />
        <a-form-item label="告警群设置">
          <div v-for="(item, index) in settingObj.robot" :key="index">
            <a-row :gutter="16">
              <a-col :span="10"><a-input v-model:value="item.yachUrl" placeholder="WebHook" /></a-col>
              <a-col :span="10">
                <a-input v-model:value="item.yachToken" placeholder="密钥" /></a-col>
              <a-col :span="4">
                <a-button type="primary" shape="circle" @click="removeRobot(index)">
                  <template #icon>
                    <MinusOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </div>
          <a-button type="primary" shape="circle" @click="addRobot">
            <template #icon>
              <PlusOutlined />
            </template>
          </a-button>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 8 }">
          <a-button type="primary" @click="onUpdateSubmit" v-if="updateAlarmRuleId > 0">修改</a-button>
          <a-button type="primary" @click="onSubmit" v-else>创建</a-button>
          <a-button style="margin-left: 50px" @click="visible = false">取消</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, inject, watch } from 'vue';
import { GroupUsersCheckbox } from '@xes/uc';
import { requestErrorTypeList, requestAddAlarmRule, requestUpdateAlarmRule } from '@/apis/alarm';
// import { useGetHuatuoGroups } from '@/hooks/board/useGetHuatuoGroups';
import { useWeeklyReportUserSelect } from '@/hooks/board/useWeeklyReportUserSelect';
import { message } from 'ant-design-vue';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';

const emit = defineEmits(['close']);
// 任务表单 ref
const formRef = ref();
const modelTitle = ref('新增告警规则');
const updateAlarmRuleId = ref(0);
const projectId = inject<any>('projectId');
const ucGroupId = inject<any>('ucGroupId');
const workcode = 'xiongbilin'

const visible = ref(false);
// 忽略的类型复选框不能被取消
const ignoreErrorIdList = ref<any>([]);
const alarmForm = reactive({
  alarmName: '',
  projectTag: 'xiaosongshu',
  projectId: projectId.value,
  errorIds: '',
  interval: 10,
  value: 10,
  upgradeCondition: 10,
  upgradeNum: 10,
});
const settingObj = reactive({
  id: 0,
  userId: workcode,
  yachIds: [],
  errorIds: [],
  robot: [
    {
      yachUrl: '',
      yachToken: '',
    },
  ],
  alarmUsers: [],
});
const showModal = record => {
  visible.value = true;
  if (record) {
    modelTitle.value = '修改告警规则';
    console.log(record);
    const {
      id = 0,
      alarmName,
      projectId,
      projectTag,
      errorIds,
      interval,
      value,
      upgradeCondition,
      upgradeNum,
      AlarmSetting,
      ignoreErrorIds,
    } = record;
    updateAlarmRuleId.value = id;
    // 设置复选框不能被编辑的ID
    ignoreErrorIdList.value = ignoreErrorIds.split(',').map(Number);
    const { id: settingId, userId, yachIds, alarmUsers } = AlarmSetting;
    alarmForm.alarmName = alarmName;
    alarmForm.projectId = projectId;
    alarmForm.projectTag = projectTag;
    alarmForm.errorIds = errorIds;
    alarmForm.interval = interval;
    alarmForm.value = value;
    alarmForm.upgradeCondition = upgradeCondition;
    alarmForm.upgradeNum = upgradeNum;
    settingObj.id = settingId;
    settingObj.userId = userId;
    settingObj.alarmUsers = alarmUsers;
    settingObj.yachIds = yachIds === '' ? [] : yachIds.split(',').map(Number);
    settingObj.robot = record.AlarmSetting.robot;
    settingObj.errorIds = errorIds.split(',').map(Number);
    return;
  }
  ignoreErrorIdList.value = [];
  updateAlarmRuleId.value = 0;
  alarmForm.alarmName = '';
  alarmForm.projectId = projectId;
  alarmForm.projectTag = 'xiaosongshu';
  alarmForm.errorIds = '';
  alarmForm.interval = 10;
  alarmForm.value = 10;
  alarmForm.upgradeCondition = 10;
  alarmForm.upgradeNum = 10;
  settingObj.userId = workcode;
  settingObj.alarmUsers = [];
  settingObj.yachIds = [];
  settingObj.robot = [];
  settingObj.errorIds = [];
  modelTitle.value = '新增告警规则';
};
const closeModal = () => {
  visible.value = false;
  emit('close');
};
// 表单规则
const rules = {
  alarmName: [{ required: true, message: '请给你的告警设置一个名称', trigger: 'blur' }],
  errorIds: [{ required: true, message: '至少选择一个要监控的错误类型', trigger: 'blur' }],
  interval: [{ required: true, type: 'number', message: '告警周期必填', trigger: 'blur' }],
  value: [{ required: true, type: 'number', message: '告警阀值必填', trigger: 'blur' }],
  upgradeCondition: [
    { required: true, type: 'number', message: '升级周期必填', trigger: 'blur' },
  ],
  upgradeNum: [{ required: true, type: 'number', message: '升级阀值必填', trigger: 'blur' }],
};
// const { groups } = useGetHuatuoGroups();
const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 18,
  },
};
const defaultItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 12,
  },
};
// 错误类型列表
const errorTypeList = reactive<any>([]);
requestErrorTypeList().then(res => {
  if (res.stat) {
    errorTypeList.push(...res.data);
  }
});
watch(
  () => settingObj.errorIds,
  val => {
    alarmForm.errorIds = val.join(',');
  }
);
const onSubmit = async () => {
  await formRef.value.validate();
  const body: any = { ...alarmForm };
  body.settingObj = {
    userId: settingObj.userId,
    alarmUsers: settingObj.alarmUsers,
    // 这里的 groupIds 为项目的 groupId
    groupIds: ucGroupId.value,
    yachIds: settingObj.yachIds.join(','),
    robot: JSON.stringify(settingObj.robot),
  };
  const { stat = 0, msg = '' } = await requestAddAlarmRule(body);
  if (stat) {
    message.info('新增规则成功');
    closeModal();
    return;
  }
  message.error(msg);
};
const onUpdateSubmit = async () => {
  await formRef.value.validate();
  const body: any = { ...alarmForm, id: updateAlarmRuleId.value };
  body.settingObj = {
    id: settingObj.id,
    userId: settingObj.userId,
    // 这里的 groupIds 为项目的 groupId
    groupIds: ucGroupId.value,
    alarmUsers: settingObj.alarmUsers,
    yachIds: settingObj.yachIds.join(','),
    robot: JSON.stringify(settingObj.robot),
  };
  const { stat = 0, msg = '' } = await requestUpdateAlarmRule(body);
  if (stat) {
    message.info('修改规则成功');
    closeModal();
    return;
  }
  message.error(msg);
};
// 增加一组群
const addRobot = () => {
  settingObj.robot.push({
    yachUrl: '',
    yachToken: '',
  });
};
// 删除一组群
const removeRobot = index => {
  settingObj.robot.splice(index, 1);
};

/**
 * 告警用户选择逻辑
 */
const { baseURL } = useWeeklyReportUserSelect();
</script>

<style scoped>
.alarm-desc {
  color: red;
  font-size: 10px;
  line-height: 37px;
}

:deep(.ant-divider.ant-divider-horizontal) {
  margin: 3px 0 10px 0 !important;
}

:deep(.border) {
  padding: 5px 15px !important;
}
</style>
