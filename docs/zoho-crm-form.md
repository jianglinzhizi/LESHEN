# LESHEN 瀹樼綉琛ㄥ崟 Zoho CRM 瀵规帴璇存槑

褰撳墠瀹樼綉琛ㄥ崟宸茬粡鎸?Zoho CRM Leads 缁撴瀯鏀归€狅細

- 鍓嶇鎻愪氦鍒?`/api/zoho-lead`
- 鍚庣鎺ュ彛浣跨敤 Zoho OAuth refresh token 鎹㈠彇 access token
- 鍚庣鎺ュ彛鎶婄嚎绱㈠啓鍏?Zoho CRM `Leads`
- Zoho 瀵嗛挜鍙繚瀛樺湪鏈嶅姟绔幆澧冨彉閲忥紝涓嶄細鏆撮湶鍒版祻瑙堝櫒

## 1. 瀹樼綉琛ㄥ崟瀛楁

瀹樼綉琛ㄥ崟瀛楁锛?
- 鑱旂郴浜?- 鑱旂郴鐢佃瘽
- 寰俊
- 鎵€鍦ㄥ煄甯?- 棰勭畻鍖洪棿
- 闇€姹傝鏄?
## 2. Zoho Leads 瀛楁鏄犲皠

鍙戦€佸埌 Zoho CRM 鐨?`Leads` 瀛楁锛?
| 瀹樼綉瀛楁 | Zoho 瀛楁 API Name | 璇存槑 |
| --- | --- | --- |
| 鑱旂郴浜?| `Last_Name` | Zoho Leads 绯荤粺蹇呭～瀛楁 |
| 鑱旂郴鐢佃瘽 | `Phone` | 鏍囧噯鐢佃瘽瀛楁 |
| 鎵€鍦ㄥ煄甯?| `City` | 鏍囧噯鍩庡競瀛楁 |
| 鍥哄畾鏉ユ簮 | `Lead_Source` | 鍥哄畾涓?`Website` |
| 鍥哄畾鍏徃 | `Company` | 鍥哄畾涓?`涓汉瀹㈡埛` |
| 寰俊銆侀绠楀尯闂淬€侀渶姹傝鏄?| `Description` | 鍚堝苟淇濆瓨锛岄伩鍏嶅繀椤诲厛鍒涘缓 Zoho 鑷畾涔夊瓧娈?|

濡傛灉鍚庣画鍦?Zoho 閲屽垱寤轰簡鑷畾涔夊瓧娈碉紝渚嬪 `Wechat__c`銆乣Budget_Range__c`锛屽彲浠ュ湪 `server/zoho-crm.mjs` 閲屾妸 `rawFields.wechat` 鍜?`rawFields.budget` 鍗曠嫭鏄犲皠杩囧幓銆?
## 3. 鐜鍙橀噺

澶嶅埗 `.env.example` 涓?`.env.local`锛屽～鍐?Zoho OAuth 淇℃伅锛?
```env
VITE_ZOHO_LEAD_ENDPOINT=/api/zoho-lead
ZOHO_ACCOUNTS_DOMAIN=https://accounts.zoho.com.cn
ZOHO_API_DOMAIN=https://www.zohoapis.com.cn
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
```

浣犵殑 Zoho 鍚庡彴鍦板潃鏄細

```text
https://crm.zoho.com.cn/crm/org46779451/tab/Home/begin
```

鎵€浠ヤ腑鍥藉尯璐﹀彿榛樿浣跨敤锛?
```text
ZOHO_ACCOUNTS_DOMAIN=https://accounts.zoho.com.cn
ZOHO_API_DOMAIN=https://www.zohoapis.com.cn
```

## 4. 褰撳墠鎻愪氦 JSON

鍓嶇鎻愪氦缁?`/api/zoho-lead` 鐨勭粨鏋勶細

```json
{
  "source": "leshen-official-site",
  "submittedAt": "2026-07-11T00:00:00.000Z",
  "module": "Leads",
  "zohoLead": {
    "Last_Name": "寮犲厛鐢?,
    "Phone": "13800000000",
    "City": "涓婃捣",
    "Lead_Source": "Website",
    "Company": "涓汉瀹㈡埛",
    "Description": "寰俊锛歭eshen-demo\n棰勭畻鍖洪棿锛?0000-20000\n鎵€鍦ㄥ煄甯傦細涓婃捣\n\n闇€姹傝鏄庯細\n甯屾湜鏀瑰杽鍙戦檯绾?
  },
  "rawFields": {
    "contactName": "寮犲厛鐢?,
    "phone": "13800000000",
    "wechat": "leshen-demo",
    "city": "涓婃捣",
    "budget": "10000-20000",
    "requirement": "甯屾湜鏀瑰杽鍙戦檯绾?
  }
}
```

## 5. 鏈湴棰勮琛屼负

濡傛灉娌℃湁閰嶇疆 `ZOHO_CLIENT_ID`銆乣ZOHO_CLIENT_SECRET`銆乣ZOHO_REFRESH_TOKEN`锛岃〃鍗曚笉浼氫涪鏁版嵁锛?
- 浼氬厛淇濆瓨鍒版祻瑙堝櫒 `localStorage`
- key 鏄?`leshen_contact_inquiries`
- 椤甸潰浼氭彁绀哄綋鍓嶆槸鏈湴棰勮璁板綍

閰嶇疆濂?Zoho OAuth 鍚庯紝鎻愪氦浼氳繘鍏?Zoho CRM Leads銆?
