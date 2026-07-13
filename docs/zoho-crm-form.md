# LESHEN 官网表单 Zoho CRM 对接说明

当前官网表单已经按 Zoho CRM Leads 结构改造：

- 前端提交到 `/api/zoho-lead`
- 后端接口使用 Zoho OAuth refresh token 换取 access token
- 后端接口把线索写入 Zoho CRM `Leads`
- Zoho 密钥只保存在服务端环境变量，不会暴露到浏览器

## 1. 官网表单字段

官网表单字段：

- 联系人
- 联系电话
- 微信
- 所在城市
- 预算区间
- 需求说明

## 2. Zoho Leads 字段映射

发送到 Zoho CRM 的 `Leads` 字段：

| 官网字段 | Zoho 字段 API Name | 说明 |
| --- | --- | --- |
| 联系人 | `Last_Name` | Zoho Leads 系统必填字段 |
| 联系电话 | `Phone` | 标准电话字段 |
| 所在城市 | `City` | 标准城市字段 |
| 固定来源 | `Lead_Source` | 固定为 `Website` |
| 固定公司 | `Company` | 固定为 `个人客户` |
| 微信、预算区间、需求说明 | `Description` | 合并保存，避免必须先创建 Zoho 自定义字段 |

如果后续在 Zoho 里创建了自定义字段，例如 `Wechat__c`、`Budget_Range__c`，可以在 `server/zoho-crm.mjs` 里把 `rawFields.wechat` 和 `rawFields.budget` 单独映射过去。

## 3. 环境变量

复制 `.env.example` 为 `.env.local`，填写 Zoho OAuth 信息：

```env
VITE_ZOHO_LEAD_ENDPOINT=/api/zoho-lead
ZOHO_ACCOUNTS_DOMAIN=https://accounts.zoho.com.cn
ZOHO_API_DOMAIN=https://www.zohoapis.com.cn
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
```

你的 Zoho 后台地址是：

```text
https://crm.zoho.com.cn/crm/org46779451/tab/Home/begin
```

所以中国区账号默认使用：

```text
ZOHO_ACCOUNTS_DOMAIN=https://accounts.zoho.com.cn
ZOHO_API_DOMAIN=https://www.zohoapis.com.cn
```

## 4. 当前提交 JSON

前端提交给 `/api/zoho-lead` 的结构：

```json
{
  "source": "leshen-official-site",
  "submittedAt": "2026-07-11T00:00:00.000Z",
  "module": "Leads",
  "zohoLead": {
    "Last_Name": "张先生",
    "Phone": "13800000000",
    "City": "上海",
    "Lead_Source": "Website",
    "Company": "个人客户",
    "Description": "微信：leshen-demo\n预算区间：10000-20000\n所在城市：上海\n\n需求说明：\n希望改善发际线"
  },
  "rawFields": {
    "contactName": "张先生",
    "phone": "13800000000",
    "wechat": "leshen-demo",
    "city": "上海",
    "budget": "10000-20000",
    "requirement": "希望改善发际线"
  }
}
```

## 5. 本地预览行为

如果没有配置 `ZOHO_CLIENT_ID`、`ZOHO_CLIENT_SECRET`、`ZOHO_REFRESH_TOKEN`，表单不会丢数据：

- 会先保存到浏览器 `localStorage`
- key 是 `leshen_contact_inquiries`
- 页面会提示当前是本地预览记录

配置好 Zoho OAuth 后，提交会进入 Zoho CRM Leads。
