// 按需导入组件
import naive, {
  darkTheme,
  NTag,
  NCard,
  NDivider,
  NSpace,
  NPopover,
  NButton,
  NAvatar,
  NStatistic,
  NSelect,
  NInput,
  NThing,
  NPopconfirm,
  NIcon,
  NIconWrapper,
  NCheckbox,
  NCheckboxGroup,
  NButtonGroup,
  NModal,
  NEmpty,
  NUpload,
  NUploadDragger,
  NTabs,
  NTabPane,
  NGrid,
  NGridItem,
  NEllipsis,
  NImage,
  NMessageProvider,
  useMessage,
  NPagination,
  NRadio,
  NRadioButton,
  NRadioGroup,
  NText,
  NConfigProvider,
  NDynamicTags,
  NColorPicker,
  NDescriptions,
  NDescriptionsItem,
  useNotification,
  NNotificationProvider,
  NSwitch,
  NMenu,
  // dateZhCN,
  zhCN,
  // darkTheme,
  NBreadcrumb,
  NBreadcrumbItem,
  NLayout,
  NLayoutSider,
  NLayoutFooter,
  NLayoutContent,
  NLayoutHeader,
  NForm,
  NFormItem,
  NDropdown,
  NInputNumber,
  NTreeSelect,
  NBadge,
  NListItem,
  NList,
  NAutoComplete,
  NCascader,
  NDatePicker,
  NTimePicker,
  NRate,
  NSlider,
  NTransfer,
  NMention,
  NFormItemGi,
  NTree,
  NH1,
  NH2,
  NH3,
  NH4,
  NH5,
  NH6,
  NInputGroupLabel,
  NInputGroup,
  NDrawer,
  NDrawerContent,
  NDynamicInput,
  NPopselect,
  NTime,
  NScrollbar,
  NElement,
  NSkeleton,
  NTooltip,
  NTab,
  NResult,
  NAffix, NGradientText
} from 'naive-ui'

import { initVbenComponent, setNotice, setMessage } from '@vben/vbencomponents'

export async function registerComponents(app) {
  initVbenComponent(app, {
    Drawer: NDrawer,
    DrawerContent: NDrawerContent,
    Tag: NTag,
    Card: NCard,
    Menu: NMenu,
    Divider: NDivider,
    Space: NSpace,
    Popover: NPopover,
    Button: NButton,
    ButtonGroup: NButtonGroup,
    Avatar: NAvatar,
    Statistic: NStatistic,
    Select: NSelect,
    Input: NInput,
    InputGroup: NInputGroup,
    InputGroupLabel: NInputGroupLabel,
    InputNumber: NInputNumber,
    Form: NForm,
    FormItem: NFormItem,
    Thing: NThing,
    Popconfirm: NPopconfirm,
    Icon: NIcon,
    IconWrapper: NIconWrapper,
    Checkbox: NCheckbox,
    CheckboxGroup: NCheckboxGroup,
    Breadcrumb: NBreadcrumb,
    BreadcrumbItem: NBreadcrumbItem,
    Modal: NModal,
    Empty: NEmpty,
    Upload: NUpload,
    UploadDragger: NUploadDragger,
    Tabs: NTabs,
    Tab: NTab,
    TabPane: NTabPane,
    Grid: NGrid,
    GridItem: NGridItem,
    Ellipsis: NEllipsis,
    Image: NImage,
    MessageProvider: NMessageProvider,
    Pagination: NPagination,
    Radio: NRadio,
    RadioButton: NRadioButton,
    RadioGroup: NRadioGroup,
    Text: NText,
    Config: NConfigProvider,
    DynamicTags: NDynamicTags,
    ColorPicker: NColorPicker,
    Descriptions: NDescriptions,
    DescriptionsItem: NDescriptionsItem,
    NotificationProvider: NNotificationProvider,
    Switch: NSwitch,
    Layout: NLayout,
    LayoutHeader: NLayoutHeader,
    LayoutFooter: NLayoutFooter,
    LayoutSider: NLayoutSider,
    LayoutContent: NLayoutContent,
    Dropdown: NDropdown,
    TreeSelect: NTreeSelect,
    Badge: NBadge,
    ListItem: NListItem,
    List: NList,
    AutoComplete: NAutoComplete,
    Cascader: NCascader,
    DatePicker: NDatePicker,
    TimePicker: NTimePicker,
    Rate: NRate,
    Slider: NSlider,
    Transfer: NTransfer,
    Mention: NMention,
    FormItemGi: NFormItemGi,
    Tree: NTree,
    H1: NH1,
    H2: NH2,
    H3: NH3,
    H4: NH4,
    H5: NH5,
    H6: NH6,
    DynamicInput: NDynamicInput,
    PopSelect: NPopselect,
    Time: NTime,
    Scrollbar: NScrollbar,
    DarkTheme: darkTheme,
    Element: NElement,
    Skeleton: NSkeleton,
    Tooltip: NTooltip,
    Result: NResult,
    Affix: NAffix,
    GradientText: NGradientText
  })
  setMessage(useMessage)
  setNotice(useNotification)
  // @ts-ignore
  // app.use(naive)
}
