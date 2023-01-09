<template>
  <a-drawer
    v-model:visible="drawerVisible"
    :bodyStyle="{ padding: '0px' }"
    width="1000px"
    @close="handleCancel"
    :zIndex="999"
  >
    <template #title>
      <div class="flex items-center">
        <div class="w-1/4" v-if="editProjectId">编辑应用 【项目ID：{{ editProjectId }}】</div>
        <div class="w-1/4" v-else>创建应用</div>
        <div class="flex justify-between w-3/5">
          <a-button
            type="link"
            target="_blank"
            href="https://app.xesv5.com/doc/pages/fedata/monitor.html"
          >
            操作文档
          </a-button>
          <a-popconfirm
            title="关闭项目后，将保存此表单信息并中止日志解析。确定要关闭吗？"
            ok-text="是"
            cancel-text="否"
            @confirm="handleOk(true)"
          >
            <a-button class="shut-down-button" v-if="editProjectId"> 关闭应用 </a-button>
          </a-popconfirm>
        </div>
      </div>
    </template>
    <div v-if="formLoading" class="flex justify-center items-center h-52">
      <a-spin size="large" />
    </div>
    <a-form
      :style="{ marginBottom: '60px' }"
      v-else
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-collapse v-model:activeKey="activeKey" expandIconPosition="right">
        <template #expandIcon="{ panelKey, isActive }">
          <a-switch
            :checked-children="panelKey !== '4' ? '开' : '是'"
            :un-checked-children="panelKey !== '4' ? '关' : '否'"
            :checked="isActive"
            v-if="panelKey !== '1'"
          />
        </template>
        <a-collapse-panel key="1" header="基础信息">
          <a-row>
            <a-col :span="12">
              <a-form-item label="项目名称" :name="['basic_info', 'project_name']">
                <a-input v-model:value="formState.basic_info.project_name" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="应用类型" :name="['basic_info', 'saas']">
                <a-select
                  v-model:value="formState.basic_info.saas"
                  placeholder="素质/学科（saas项目）"
                >
                  <a-select-option :value="'yes'">学科</a-select-option>
                  <a-select-option :value="'no'">素质</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :name="['basic_info', 'appid']">
                <template #label>
                  appid
                  <a-tooltip title="点击进入申请页面">
                    <a href="https://cloud.tal.com/logcenter#/log-access" target="_blank">
                      <InfoCircleOutlined />
                    </a>
                  </a-tooltip>
                </template>
                <a-input
                  v-model:value="formState.basic_info.appid"
                  placeholder="请输入日志中心申请到的appid"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="eventid" :name="['basic_info', 'eventid']">
                <a-input
                  v-model:value="formState.basic_info.eventid"
                  placeholder="必须与应用内的eventId配置完全一致"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item
                :name="['basic_info', 'uc_group_id']"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 21 }"
              >
                <template #label>
                  关联用户组
                  <a @click="openUCGroup">
                    <FormOutlined />
                  </a>
                </template>
                <a-select
                  v-model:value="formState.basic_info.uc_group_id"
                  allowClear
                  showSearch
                  placeholder="请选择用户组"
                  :filterOption="filterOption"
                  @change="handleChangeUcGroup"
                >
                  <a-select-option
                    v-for="item of groups"
                    :value="item.group_id"
                    :key="item.group_id"
                  >
                    {{ item.group_name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item
                :name="['basic_info', 'gateway']"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 21 }"
              >
                <template #label>
                  所属网关
                  <a-tooltip :overlayStyle="{ maxWidth: '400px' }" title="用于网关日志监控">
                    <InfoCircleOutlined />
                  </a-tooltip>
                </template>
                <a-select
                  v-model:value="formState.basic_info.gateway"
                  allowClear
                  showSearch
                  placeholder="请选择所属网关"
                  :filterOption="filterOption"
                >
                  <a-select-option v-for="(item, key) in GATEWAYS" :value="item" :key="key">
                    {{ key }}({{ item }})
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col span="18">
              <a-form-item
                :name="['basic_info', 'domain']"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }"
              >
                <template #label>
                  网关域名
                  <a-tooltip
                    :overlayStyle="{ maxWidth: '400px' }"
                    title="应用在网关申请到的upstream名称。用于网关日志的筛选，收敛域名需要输入收敛前的域名。点击可跳转跳转网关upstream管理页面查询。当前仅支持单个域名配置"
                  >
                    <a href="https://cloud.tal.com/gateway-fe#/config/upstreamList" target="_blank">
                      <InfoCircleOutlined />
                    </a>
                  </a-tooltip>
                </template>
                <a-input
                  v-model:value="formState.basic_info.domain"
                  placeholder="请输入项目页面在网关的域名(upstream名称)，用于筛选网关日志"
                />
              </a-form-item>
            </a-col>
            <a-col span="6">
              <a-button type="primary" :loading="hasGatewayLoading" @click="checkGateway">
                检测是否有网关数据
              </a-button>
              {{ hasGatewayData }}
            </a-col>
            <a-col :span="12">
              <a-form-item label="Git地址" :name="['basic_info', 'git']">
                <a-input v-model:value="formState.basic_info.git" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="所属项目" :name="['basic_info', 'belong_project']">
                <a-input
                  v-model:value="formState.basic_info.belong_project"
                  placeholder="例如：鲲系统"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                <template #label>
                  URL筛选关键字
                  <a-tooltip :overlayStyle="{ maxWidth: '550px' }">
                    <template #title>
                      填写此项可以筛选URL，过滤掉非必要URL产出的日志。<br />
                      填写规则：请输入日志解析需要筛选的URL关键字，多个关键字用英文逗号(,)隔开。<br />
                      筛选规则：依据此处填写的关键字作为筛选项，查询日志。
                      <div class="text-red-500">无需筛选请不要填写此项!</div>
                    </template>
                    <a href="https://cloud.tal.com/logcenter#/application" target="_blank">
                      <InfoCircleOutlined />
                    </a>
                  </a-tooltip>
                </template>
                <a-input
                  v-model:value="formState.basic_info.href"
                  placeholder="请输入日志解析需要筛选的URL关键字，多个关键字用英文逗号(,)隔开。无需筛选请不要填写此项！"
                />
              </a-form-item>
              <a-form-item label="项目描述" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                <a-textarea
                  v-model:value="formState.basic_info.project_desc"
                  placeholder="最多250个字"
                />
              </a-form-item>
              <a-form-item :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                <template #label>
                  接收周报用户
                  <a-tooltip
                    :overlayStyle="{ maxWidth: '550px' }"
                    title="选中的用户在每周一上午，从知音楼企业助手上收到项目本周的质量周报"
                  >
                    <InfoCircleOutlined />
                  </a-tooltip>
                </template>
                <a-alert v-if="showAlert" type="warning" show-icon>
                  <template #message>
                    <div class="flex items-center justify-between">
                      <span class="mr-2"> 关联用户组发生变化，请重新选择接收质量周报用户 </span>
                      <CloseOutlined
                        :style="{ fontSize: '12px' }"
                        class="cursor-pointer"
                        @click="() => (showAlert = false)"
                      />
                    </div>
                  </template>
                </a-alert>
                <GroupUsersCheckbox
                  :base-url="baseURL"
                  popover
                  :uc-group-id="formState.basic_info.uc_group_id"
                  v-model="formState.basic_info.weekly_report_receivers"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-panel>
        <a-collapse-panel key="2">
          <template #header>
            <a-row>
              <a-col :span="18"> Sourcemap解析 </a-col>
              <a-col :span="6">
                <a-tooltip
                  :overlayStyle="{ maxWidth: '460px' }"
                  title="通过Sourcemap还原生产环境中的压缩代码，可以准确定位到异常的代码位置，帮助您快速修复Bug。点击可跳转接入文档"
                >
                  <a
                    href="https://app.xesv5.com/doc/pages/fedata/sourcemap/sourcemap.html"
                    target="_blank"
                  >
                    推荐打开（需要依照文档配置）
                  </a>
                </a-tooltip>
              </a-col>
            </a-row>
          </template>
          <a-row>
            <a-col :span="8">
              <a-form-item :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                <template #label>
                  使用私有云存储
                  <a-tooltip
                    :overlayStyle="{ maxWidth: '340px' }"
                    title="默认存储在本平台申请的存储桶内，如需使用私有存储，需要在存储云申请私有桶，点击图标可进入申请页面"
                  >
                    <a href="https://cloud.xesv5.com/storage/" target="_blank">
                      <InfoCircleOutlined />
                    </a>
                  </a-tooltip>
                </template>
                <a-radio-group v-model:value="formState.sourcemap_info.default_storage">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="16" v-if="formState.sourcemap_info.default_storage === 1">
              <a-form-item label="accessKeyId" :name="['sourcemap_info', 'access_key_id']">
                <a-input v-model:value="formState.sourcemap_info.access_key_id" />
              </a-form-item>
              <a-form-item label="accessKeySecret" :name="['sourcemap_info', 'access_key_secret']">
                <a-input v-model:value="formState.sourcemap_info.access_key_secret" />
              </a-form-item>
              <a-form-item label="bucket" :name="['sourcemap_info', 'bucket']">
                <a-input v-model:value="formState.sourcemap_info.bucket" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="上传插件是否打印日志"
                :label-col="{ span: 8 }"
                :wrapper-col="{ span: 16 }"
              >
                <a-radio-group v-model:value="formState.sourcemap_info.enable_log">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-item :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                <template #label>
                  自定义map文件位置
                  <a-tooltip
                    :overlayStyle="{ maxWidth: '360px' }"
                    title="默认将dist/js目录中的map文件进行上传，若您的map文件并非存储在该目录下，请自定义map文件所在位置"
                  >
                    <InfoCircleOutlined />
                  </a-tooltip>
                </template>
                <a-radio-group v-model:value="formState.sourcemap_info.default_upload">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="16" v-if="formState.sourcemap_info.default_upload === 1">
              <a-form-item>
                <template #label>
                  编译后map文件位置
                  <a-tooltip
                    :overlayStyle="{ maxWidth: '360px' }"
                    title="默认在dist/js文件夹下寻找map文件，可自定义，多个文件夹请用英文逗号 (,) 区分"
                  >
                    <InfoCircleOutlined />
                  </a-tooltip>
                </template>
                <a-input
                  placeholder="请输入map文件所在文件夹相对位置，多个文件夹请用英文逗号 (,) 区分"
                  v-model:value="formState.sourcemap_info.upload_from"
                />
              </a-form-item>
              <a-form-item label="map文件上传位置">
                <a-input
                  placeholder="上传到存储桶中的对应文件夹位置（可不填）"
                  v-model:value="formState.sourcemap_info.upload_to"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-item
                label="知音楼消息提醒"
                :label-col="{ span: 12 }"
                :wrapper-col="{ span: 12 }"
              >
                <a-radio-group v-model:value="formState.sourcemap_info.notice_status">
                  <a-radio :value="1" disabled>是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="16" v-if="formState.sourcemap_info.notice_status === 1">
              <a-form-item label="提醒工号">
                <yachInputFilter v-model:noticeValues="formState.sourcemap_info.notice_values" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="自定义UA解析">
          <div style="padding: 0px 10px 10px 10px">
            <div>
              ·
              UA（UserAgent）解析模块用于对项目的UA格式进行声明，以统计用户所使用的APP名称、APP版本号等信息。
            </div>
            <div>· 推荐UA信息中的UA名与UA版本号以“/”或“:”隔开形式存放，否则可能无法被解析。</div>
            <div>
              ·
              通过此页面提交关键字,可以将项目内一般UA字段解析出更多的内部APP名称与版本号，如“XesAPP”，利用这些信息可提供更多的用户分析数据。
            </div>
            <div align="center">
              <img :src="UANoteIMG" alt="UA模块提示图片" style="width: 80%" />
            </div>
          </div>
          <template v-for="(item, index) in formState.ua_info" :key="index">
            <a-card :title="'UA信息' + (index + 1)" style="width: 100%">
              <template #extra>
                <a-button
                  v-if="index > 0"
                  danger
                  type="primary"
                  class="w-20 h-5 flex justify-center items-center !text-xl !p-0"
                  @click="addOrDelUA(index)"
                >
                  -
                </a-button>
                <a-button
                  v-else
                  class="w-20 h-5 flex justify-center items-center !text-xl !p-0"
                  type="primary"
                  @click="addOrDelUA(index)"
                >
                  +
                </a-button>
              </template>
              <a-row align="middle">
                <a-col :span="10">
                  <a-form-item
                    :name="['ua_info', index, 'ua_name']"
                    label="UA字段"
                    :rules="rules.ua_info.ua_name"
                  >
                    <a-input v-model:value="item.ua_name" @input="hideParse(index)" />
                  </a-form-item>
                  <a-form-item
                    :name="['ua_info', index, 'ua_flag']"
                    label="关键字"
                    :rules="rules.ua_info.ua_flag"
                  >
                    <a-input v-model:value="item.ua_flag" @input="hideParse(index)" />
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-button @click="parseUA(index)" type="primary" class="mb-6 ml-6">
                    -解析-
                  </a-button>
                </a-col>
                <a-col :span="10">
                  <template v-if="item.parse_status === 1">
                    <a-form-item label="APP名称">
                      <span>{{ item.app_name }}</span>
                    </a-form-item>
                    <a-form-item label="APP版本号">
                      <span>{{ item.app_version }}</span>
                    </a-form-item>
                  </template>
                </a-col>
              </a-row>
            </a-card>
            <br v-if="index !== formState.ua_info.length - 1" />
          </template>
        </a-collapse-panel>
        <a-collapse-panel key="4">
          <template #header>
            <a-row>
              <a-col :span="17">
                登录认证参数
                <a-tooltip
                  :overlayStyle="{ maxWidth: '340px' }"
                  title="为了准确生成每周的质量周报，需要登录的项目请在此处设置登录验证参数"
                >
                  <InfoCircleOutlined />
                </a-tooltip>
              </a-col>
              <a-col :span="7">用于质量周报，跳过页面的登录认证</a-col>
            </a-row>
          </template>
          <div v-if="formState.auth_info.need_login === 1">
            <a-row>
              <a-col :span="24">
                <a-form-item
                  labelAlign="left"
                  label="项目url"
                  :name="['auth_info', 'project_url']"
                  :rules="rules.authRules.project_url"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 19 }"
                >
                  <a-input
                    placeholder="请输入项目url，需包含完整的域名和协议如：https://fedata.xesv5.com"
                    v-model:value="formState.auth_info.project_url"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item
                  labelAlign="left"
                  label="登录参数有效期"
                  :name="['auth_info', 'effective_time']"
                  :rules="rules.authRules.effective_time"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 12 }"
                >
                  <a-radio-group
                    v-model:value="formState.auth_info.effective_time"
                    name="radioGroup"
                  >
                    <a-radio :value="3">大于等于48小时</a-radio>
                    <a-radio :value="2">大于等于24小时</a-radio>
                    <a-radio :value="1">小于24小时</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col>
                <a-form-item
                  labelAlign="left"
                  :label="noticeSlot"
                  :name="['auth_info', 'need_notify']"
                  :rules="rules.authRules.need_notify"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 12 }"
                >
                  <a-radio-group v-model:value="formState.auth_info.need_notify" name="radioGroup">
                    <a-radio :value="1">是</a-radio>
                    <a-radio :value="2">否</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row v-if="formState.auth_info.need_notify === 1">
              <a-col :span="24">
                <a-form-item
                  label="知音楼提醒用户"
                  labelAlign="left"
                  :label-col="{ span: 5 }"
                  :wrapper-col="{ span: 19 }"
                  :name="['auth_info', 'notice_users']"
                  :rules="rules.authRules.notice_users"
                >
                  <a-alert v-if="showAlert" type="warning" show-icon>
                    <template #message>
                      <div class="flex items-center justify-between">
                        <span class="mr-2"> 关联用户组发生变化，请重新选择知音楼提醒用户 </span>
                        <CloseOutlined
                          :style="{ fontSize: '12px' }"
                          class="cursor-pointer"
                          @click="() => (showAlert = false)"
                        />
                      </div>
                    </template>
                  </a-alert>
                  <GroupUsersCheckbox
                    :base-url="baseURL"
                    popover
                    :uc-group-id="formState.basic_info.uc_group_id"
                    v-model="formState.auth_info.notice_users"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row type="flex">
              <a-col :span="5">
                <div>
                  <span>认证参数</span>
                  <a-tooltip
                    :overlayStyle="{ maxWidth: '340px' }"
                    title="该登录参数可用于放火平台lighthouse"
                  >
                    <InfoCircleOutlined />
                  </a-tooltip>
                </div>
              </a-col>
              <a-col :span="2">
                <div class="text-center">字段</div>
              </a-col>
              <a-col :span="8">
                <div class="text-center">键</div>
              </a-col>
              <a-col :span="4">
                <div class="text-center">值</div>
              </a-col>
            </a-row>
            <div
              v-for="(item, i) in formState.auth_info.authForm.fields"
              :key="item.index"
              class="auth-form-item"
            >
              <a-row align="top">
                <a-col :span="3" />
                <a-col :span="1" class="mt-2">
                  <i
                    v-if="i === 0"
                    @click="addAuthField(formState.auth_info.authForm)"
                    class="mt-2 cursor-pointer"
                  >
                    <PlusCircleTwoTone />
                  </i>
                </a-col>
                <a-col :span="5">
                  <a-form-item
                    :name="['auth_info', 'authForm', 'fields', i, 'field']"
                    :rules="rules.authRules.field"
                  >
                    <a-select v-model:value="item.field" placeholder="请选择">
                      <a-select-option v-for="j in selectFields" :key="j.value" :value="j.value">
                        {{ j.value }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="5">
                  <a-form-item
                    :name="['auth_info', 'authForm', 'fields', i, 'key']"
                    :rules="rules.authRules.key"
                  >
                    <a-input
                      placeholder="请输入KEY"
                      v-model:value="item.key"
                      @change="() => clearFieldsSpace(formState.auth_info.authForm, i, 'key')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item
                    :name="['auth_info', 'authForm', 'fields', i, 'value']"
                    :rules="rules.authRules.value"
                  >
                    <a-textarea
                      v-model:value="item.value"
                      placeholder="请输入VALUE"
                      auto-size
                      clearable
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="1" class="mt-2">
                  <i
                    v-if="i !== 0"
                    class="cursor-pointer"
                    @click="removeAuthField(formState.auth_info.authForm, item.index)"
                  >
                    <CloseCircleTwoTone />
                  </i>
                </a-col>
              </a-row>
            </div>
          </div>
          <a-row type="flex" justify="space-between" align="middle">
            <a-col :span="8">
              最近一次检测时间: {{ formState.auth_info.authForm.last_check_time_txt }}
            </a-col>
            <a-col :span="5">
              最近一次检测状态: {{ formState.auth_info.authForm.last_check_statusTxt }}
            </a-col>
            <a-col :span="5">
              <a-button
                type="primary"
                :loading="formState.auth_info.checkLoading"
                @click="
                  checkAuth(
                    formRef,
                    formState.auth_info,
                    formState.auth_info.project_url,
                    formState,
                  )
                "
              >
                检测参数
              </a-button>
            </a-col>
          </a-row>
        </a-collapse-panel>
      </a-collapse>
    </a-form>
    <div
      class="absolute right-0 bottom-0 w-full border-t-gray-300 border-t-1 px-2 py-3 bg-white text-right z-1"
    >
      <a-button class="mr-10 float-left" type="primary" @click="showSDKConfig">
        生成SDK推荐配置
      </a-button>
      <a-button class="mr-2" @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleOk" :loading="loading">提交</a-button>
    </div>
  </a-drawer>
  <a-modal v-model:visible="modalVisible" title="SDK推荐配置" width="800px">
    <template #footer>
      <a-button v-if="recommendMode === 'normal'" @click="changeMode('vue')">
        查看Vue引入方式
      </a-button>
      <a-button v-else @click="changeMode('normal')"> 切换简要配置 </a-button>
      <a-button type="primary" @click="downloadSDKConfig">保存成文件</a-button>
    </template>
    <a-typography-paragraph copyable class="json-parse">
      <CodeArea :codeStr="recommendSDKConfig" styleClass="!h-72" :lineNumbers="false" />
    </a-typography-paragraph>
  </a-modal>
</template>

<script setup lang="ts">
//添加应用 弹窗组件
import { computed, nextTick, onMounted, reactive, ref, toRaw, watch, h } from 'vue'
import { GroupUsersCheckbox } from '@xes/uc'
import { DEFAULT_FORM, VALIDATE_RULES, GATEWAYS } from './config'
import { getProject, modifyProject, addProject } from '@/apis/list'
import { checkValidGateway } from '@/apis/board/gateway'
import { message } from 'ant-design-vue'
import {
  InfoCircleOutlined,
  FormOutlined,
  CloseOutlined,
  PlusCircleTwoTone,
  CloseCircleTwoTone,
} from '@ant-design/icons-vue'
import { handleUaParse, handleProjectParams, initEditFormData } from '../utils'
import UANoteIMG from '@/assets/images/huatuo/ua_note.jpg'
import yachInputFilter from '../yachInputFilter.vue'

import { useWeeklyReportUserSelect } from '@/hooks/board/useWeeklyReportUserSelect'
import { useAuth } from '@/hooks/board/useAuth'
import { cloneDeep, buildUUID, delUrlParams } from '@vben/utils'
import { useListStore } from '@/store/modules/list'
import { storeToRefs } from 'pinia'
// import { isEqual } from 'lodash-es';
import LabelComponent from './labelComponent.vue'
import { saveAs } from 'file-saver'
import { getRecommendSDKConfig, getVueRecommendSDKConfig } from './sdkConfig'
import { CodeArea } from '@vben/components'

const props = defineProps({
  visible: {
    type: Boolean,
    default: () => false,
  },
  editProjectId: {
    type: String,
  },
})

const emit = defineEmits(['update:visible', 'flash'])

// const store = useStore();
const listStore = useListStore()
//窗口可视
const drawerVisible = ref(props.visible)
const modalVisible = ref(false)
watch(
  () => props.visible,
  val => {
    drawerVisible.value = val
    modalVisible.value = false
    recommendMode.value = 'normal'
  },
)
//表单相关
const formRef = ref()
//表单信息
const formState = reactive(cloneDeep(DEFAULT_FORM))
//验证规则
const rules = { ...VALIDATE_RULES }
//可选用户组
const { ucGroups: groups } = storeToRefs(listStore)

const noticeSlot = h(LabelComponent)

watch(groups, newGroups => {
  const group_id = formState.basic_info.uc_group_id
  if (group_id && !newGroups.map(item => item.group_id).includes(group_id)) {
    formState.basic_info.uc_group_id = null
  }
})

// SDK推荐配置
const recommendMode = ref('normal')
const recommendSDKConfig = computed(() => {
  const params = [
    formState.basic_info.appid,
    formState.basic_info.eventid,
    formState.basic_info.saas === 'yes',
  ]
  switch (recommendMode.value) {
    case 'normal':
      return getRecommendSDKConfig(...params)
    case 'vue':
      return getVueRecommendSDKConfig(...params)
    default:
      return ''
  }
})

//折叠面板
const activeKey = ref(['1'])
//确认按钮loading
const loading = ref(false)
//表单loading
const formLoading = ref(true)

onMounted(() => {
  listStore.requestUCGroups()
  if (props.editProjectId) {
    initProjectData()
  } else {
    formLoading.value = false
  }
  // getPlatformList();
})

watch(activeKey, (val, preVal) => {
  //表单还在加载，取消处理
  if (formLoading.value === true) {
    return
  }
  // 登录认证
  if (preVal.includes('4') !== val.includes('4')) {
    //关闭全清空，开启设默认值
    const need_login = val.includes('4') ? 1 : 2 //2不需要，1需要
    formState.auth_info = {
      need_login,
      effective_time: null,
      need_notify: null,
      notice_users: [],
      project_url: '',
      checkLoading: false,
      authForm: {
        fields: [
          {
            index: buildUUID(),
            field: '',
            key: '',
            value: '',
          },
        ],
      },
      auth_msg: [],
    }
  }
  //sourcemap解析折叠菜单变化
  if (preVal.includes('2') !== val.includes('2')) {
    //关闭全清空，开启设默认值
    const sourcemap_analysis = val.includes('2') ? 1 : 0 //0不解析，1解析
    formState.sourcemap_info = {
      sourcemap_analysis: sourcemap_analysis,
      default_storage: 0,
      enable_log: 0,
      default_upload: 0,
      notice_status: 0,
      notice_values: [],
    }
  }
  //UA解析折叠菜单变化
  if (preVal.includes('3') !== val.includes('3')) {
    //关闭置空，开启设默认值
    formState.ua_info =
      val.indexOf('3') === -1
        ? []
        : [
            {
              ua_name: '',
              ua_flag: '',
              parse_status: 0,
              app_name: '',
              app_version: '',
            },
          ]
  }
})

//表单为编辑项目时，根据项目id请求数据，初始化表单
async function initProjectData() {
  const result = await getProject(props.editProjectId)
  if (result.stat === 1) {
    //清洗数据
    const editFormData = initEditFormData(result.data)
    //判断要打开的折叠面板
    if (editFormData.sourcemap_info.sourcemap_analysis === 1) {
      activeKey.value.push('2')
    }
    if (editFormData.ua_info[0].ua_flag) {
      activeKey.value.push('3')
    }
    if (editFormData.auth_info.need_login === 1) {
      activeKey.value.push('4')
    }
    //绑定数据到表单上
    formState.basic_info = editFormData.basic_info
    formState.sourcemap_info = editFormData.sourcemap_info
    formState.ua_info = editFormData.ua_info
    formState.auth_info = editFormData.auth_info
    formState.auth_info_original_auth_msg = editFormData.auth_info_original_auth_msg
    //使用nextTick防止activeKey被监听
    nextTick(() => {
      formLoading.value = false
    })
  } else {
    message.error('请求异常')
    emit('update:visible', false)
  }
}

//验证并提交表单
function handleOk(isShutDown = false) {
  loading.value = true
  formRef.value
    .validate() //验证表单
    .then(() => addOrModifyProject(isShutDown)) //提交表单
    .catch(error => {
      loading.value = false
      console.log('error', error)
    })
}

//向后台提交表单数据
async function addOrModifyProject(isShutDown) {
  // ua表单验证
  const uaInfo = formState.ua_info
  for (let i = uaInfo.length - 1; i > -1; i--) {
    if ((uaInfo[i].ua_name || uaInfo[i].ua_flag) && uaInfo[i].parse_status !== 1) {
      message.error(`请先解析第${i + 1}条ua信息或${i === 0 ? '清空' : '删除'}`)
      loading.value = false
      return
    } else if (!uaInfo[i].ua_name && !uaInfo[i].ua_flag) {
      if (!(i === 0 && uaInfo.length === 1)) {
        formState.ua_info.splice(i, 1)
      }
    }
  }
  //处理数据
  const params = handleProjectParams(toRaw(formState), isShutDown)
  // if (params.loginParams.need_login === 1) {
  //   let a = JSON.parse(formState.auth_info_original_auth_msg || '{}')
  //   let b = params.loginParams.auth_msg
  //   const flag = isEqual(a, b)
  //   if (!flag) {
  //     loading.value = false;
  //     message.error('认证参数发生变化请点击检测')
  //     return
  //   }
  // }

  const result = props.editProjectId
    ? await modifyProject(props.editProjectId, params)
    : await addProject(params)
  if (result.stat === 1) {
    message.success('提交成功！')
    //提交表单后，更新项目列表
    emit('flash')
    delUrlParams(['openUpdateDialog, project_id'])
    emit('update:visible', false)
  }
  loading.value = false
}

function handleCancel() {
  delUrlParams(['openUpdateDialog', 'project_id'])
  emit('update:visible', false)
}

//通过改变store状态打开用户组管理弹窗
function openUCGroup() {
  listStore.ucGroupVisible = true
}

//选择用户组/网关时，用户自己输入时的筛选条件
function filterOption(inputValue, options) {
  return options.children[0].children.includes(inputValue)
}

//增加或删除ua
function addOrDelUA(index) {
  if (index > 0) {
    formState.ua_info.splice(index, 1)
  } else {
    formState.ua_info.push({
      ua_name: '',
      ua_flag: '',
      parse_status: 0,
      parse_result: '',
    })
  }
}

//隐藏解析结果
function hideParse(index) {
  const ua_info = formState.ua_info[index]
  ua_info.parse_status = 0
  ua_info.app_name = ua_info.app_version = ''
}

//解析ua
//TODO:一条ua中关键字出现多次，匹配哪个？
async function parseUA(index) {
  const nameList = [
    ['ua_info', index, 'ua_name'],
    ['ua_info', index, 'ua_flag'],
  ]
  try {
    await formRef.value.validateFields(nameList)
    const { app_name, app_version } = handleUaParse(
      formState.ua_info[index].ua_name,
      formState.ua_info[index].ua_flag,
    )
    if (!app_name) {
      message.error('无法解析')
      return
    }
    formState.ua_info[index].app_name = app_name
    formState.ua_info[index].app_version = app_version
    formState.ua_info[index].parse_status = 1
  } catch (e) {
    console.log(e)
  }
}

/**
 * 可接收质量周报用户逻辑
 */
const { baseURL } = useWeeklyReportUserSelect()

/**
 * alert 显示隐藏逻辑
 */
const showAlert = ref(false)
const handleChangeUcGroup = () => {
  showAlert.value = true
}

const { addAuthField, removeAuthField, selectFields, clearFieldsSpace, checkAuth } = useAuth()

// 打开SDK推荐配置弹窗
const showSDKConfig = () => {
  formRef.value
    .validate() //验证表单
    .then(() => {
      modalVisible.value = true
    })
    .catch(error => {
      console.log('error', error)
    })
}

// 下载SDK推荐配置文件
const downloadSDKConfig = () => {
  const blob = new Blob([recommendSDKConfig.value], { type: 'text/javascript' })
  saveAs(blob, 'sdkConfig.js')
}

const changeMode = mode => {
  recommendMode.value = mode
}

const hasGatewayData = ref('')
const hasGatewayLoading = ref(false)

//检测是否有网关数据
const checkGateway = async () => {
  const { gateway, domain } = formState.basic_info
  if (!(gateway && domain)) {
    message.error('请先添加网关和域名')
    return false
  }
  hasGatewayLoading.value = true
  const data = await checkValidGateway({ gateway, domain })
  if (data.stat === 1) {
    hasGatewayData.value = data.data ? '有数据' : '无数据'
    hasGatewayLoading.value = false
    return
  }
  hasGatewayData.value = '请求错误'
  hasGatewayLoading.value = false
}
</script>

<style lang="scss" scoped>
:deep(span.anticon:not(.app-iconify)) {
  vertical-align: middle;
}

.shut-down-button {
  color: #fff;
  background: #ff7875;
  border-color: #ff7875;
  text-shadow: 0 -1px 0 rgb(0 0 0 / 12%);
  box-shadow: 0 2px #0000000b;
}

.shut-down-button:hover {
  color: #fff;
  background: #ffa39e;
  border-color: #ffa39e;
}

:deep(.ant-divider.ant-divider-horizontal) {
  margin: 3px 0 10px 0 !important;
}

:deep(.border) {
  padding: 5px 15px !important;
}

.json-parse {
  position: relative;

  :deep(.ant-typography-copy) {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
