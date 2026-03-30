<div align="center">

<img src="public/favicon.png" alt="Sekka Logo" width="80" height="80" />

# سِكّة — لوحة التحكم

**Sekka Admin Panel**

شريك شغلك في الديليفري

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)](/)

<br />

<p align="center">
  <strong>لوحة تحكم احترافية لإدارة منصة سِكّة للتوصيل — مصر</strong>
  <br />
  <sub>مبنية بـ Angular 21 مع دعم كامل للعربية (RTL) وتصميم متجاوب</sub>
</p>

[عرض مباشر](#-التشغيل) · [التوثيق](#-البنية-المعمارية) · [الـ API](https://github.com/AhmedSalem104/Sekka.APIs/blob/main/docs/ADMIN_PANEL_API.md)

</div>

---

## المحتويات

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [لقطات الشاشة](#-لقطات-الشاشة)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [البنية المعمارية](#-البنية-المعمارية)
- [الصفحات والوحدات](#-الصفحات-والوحدات)
- [الـ API Endpoints](#-الـ-api-endpoints)
- [نظام التصميم](#-نظام-التصميم-design-system)
- [التشغيل](#-التشغيل)
- [البناء والنشر](#-البناء-والنشر)
- [هيكل المشروع](#-هيكل-المشروع)

---

## 📋 نظرة عامة

| | |
|---|---|
| **المشروع** | لوحة تحكم إدارية لتطبيق سِكّة للتوصيل |
| **السوق** | مصر — سائقين التوصيل |
| **اللغة** | عربي (عامية مصرية) — RTL |
| **الـ API** | 210 endpoint عبر 25 controller |
| **الصفحات** | 27 صفحة كاملة مع CRUD |
| **الحالة** | Production Ready |

---

## ✨ المميزات

### الأساسيات
- **Angular 21** — أحدث إصدار مع Standalone Components و Signals
- **RTL كامل** — دعم كامل للاتجاه من اليمين لليسار
- **تصميم متجاوب** — يشتغل على Desktop و Tablet و Mobile
- **Dark / Light Mode** — وضع مظلم وفاتح مع حفظ التفضيل
- **JWT Authentication** — تسجيل دخول آمن مع HTTP Interceptor
- **Lazy Loading** — تحميل الصفحات عند الحاجة فقط

### لوحة التحكم (Dashboard)
- **KPI Cards** — طلبات اليوم، الإيرادات، السائقين الأونلاين، معدل الإتمام
- **Real-time Stats** — إحصائيات مباشرة محدثة لحظياً
- **Revenue Chart** — رسم بياني للإيرادات اليومية
- **Order Status Chart** — توزيع حالات الطلبات

### إدارة العمليات
- **إدارة الطلبات** — إنشاء، تعيين سائق، تغيير حالة، تصدير
- **إدارة السائقين** — تفعيل/تعطيل، عرض الأداء، مراقبة المواقع
- **إدارة الفترات الزمنية** — إنشاء وتعديل فترات التوصيل

### إدارة المستخدمين
- **العملاء** — عرض التفاصيل، تفعيل/تعطيل، سجل الطلبات
- **الشركاء** — توثيق/رفض، تعديل العمولة، عرض الطلبات
- **القائمة السوداء** — إضافة/إزالة حظر المستخدمين

### الإدارة المالية
- **الاشتراكات** — تمديد، إلغاء، إهداء، إحصائيات
- **التسويات** — اعتماد/رفض، تنفيذ الدفع
- **المحافظ** — تعديل الرصيد، تجميد/فك التجميد
- **الفواتير** — إنشاء، تسجيل دفع، تحميل PDF، إرسال بالإيميل
- **الاستردادات** — موافقة/رفض، تنفيذ
- **المدفوعات** — عرض، إعادة محاولة، إلغاء
- **النزاعات** — حل، تصعيد، رد

### التقارير والتحليلات
- **الإحصائيات المتقدمة** — إيرادات، طلبات، أداء سائقين، Charts
- **التقارير الذكية** — 7 تقارير AI-driven:
  - رؤى الأعمال
  - توقعات الطلب
  - مخاطر فقدان العملاء
  - تحسين الإيرادات
  - تحليل العرض والطلب
  - اكتشاف الشذوذات
  - تحليل الأفواج (Cohort Analysis)

### إدارة المنصة
- **الإعدادات** — 5 أقسام: إعدادات، خصائص، إصدارات، صيانة، عمولات
- **المركبات** — تسجيل، فحص، إحصائيات الأسطول
- **المناطق** — إضافة/حذف مناطق التغطية
- **الأدوار** — إنشاء/حذف أدوار الوصول
- **الإشعارات** — إرسال فردي وجماعي
- **الطوارئ SOS** — استلام/حل بلاغات الطوارئ

### التسويق
- **الشرائح** — إنشاء شرائح ديناميكية/ثابتة
- **الحملات** — إنشاء، تفعيل/إيقاف، تتبع الاستخدام
- **دوائر التوفير** — إدارة دوائر التوفير الجماعية

---

## 🛠 التقنيات المستخدمة

<table>
<tr>
<td align="center" width="100">

**Angular 21**
<br /><sub>Framework</sub>
</td>
<td align="center" width="100">

**TypeScript 5.9**
<br /><sub>Language</sub>
</td>
<td align="center" width="100">

**SCSS**
<br /><sub>Styling</sub>
</td>
<td align="center" width="100">

**Chart.js 4**
<br /><sub>Charts</sub>
</td>
<td align="center" width="100">

**ng2-charts**
<br /><sub>Angular Charts</sub>
</td>
<td align="center" width="100">

**RxJS 7**
<br /><sub>Reactivity</sub>
</td>
</tr>
</table>

### الأنماط المعمارية
| النمط | التفاصيل |
|---|---|
| **Standalone Components** | كل component مستقل بذاته بدون NgModules |
| **Signals** | إدارة الحالة بـ Angular Signals (بدون RxJS state management) |
| **Functional Guards** | `CanActivateFn` بدلاً من class-based guards |
| **Functional Interceptors** | `HttpInterceptorFn` للـ authentication |
| **Lazy Loading** | كل صفحة `loadComponent` مع dynamic import |
| **Proxy Config** | للتطوير المحلي لتجاوز CORS |

---

## 🏗 البنية المعمارية

```
src/app/
├── core/                          # البنية التحتية
│   ├── guards/
│   │   └── auth.guard.ts          # حماية المسارات (JWT check)
│   └── interceptors/
│       └── auth.interceptor.ts    # إضافة Bearer token تلقائياً
│
├── layout/                        # هيكل الصفحة
│   ├── admin-layout/              # الهيكل الرئيسي (sidebar + header + content)
│   ├── header/                    # الشريط العلوي (بحث، إشعارات، ثيم، بروفايل)
│   └── sidebar/                   # القائمة الجانبية (قابلة للطي، 7 أقسام)
│
├── pages/                         # 27 صفحة
│   ├── dashboard/                 # لوحة التحكم الرئيسية
│   ├── login/                     # تسجيل الدخول
│   ├── drivers/                   # إدارة السائقين
│   ├── orders/                    # إدارة الطلبات
│   ├── customers/                 # إدارة العملاء
│   ├── partners/                  # إدارة الشركاء
│   ├── subscriptions/             # إدارة الاشتراكات
│   ├── settlements/               # التسويات المالية
│   ├── payments/                  # المدفوعات
│   ├── wallets/                   # المحافظ الإلكترونية
│   ├── disputes/                  # النزاعات
│   ├── invoices/                  # الفواتير
│   ├── refunds/                   # الاستردادات
│   ├── notifications/             # الإشعارات
│   ├── sos/                       # الطوارئ
│   ├── vehicles/                  # المركبات
│   ├── config/                    # إعدادات المنصة
│   ├── regions/                   # المناطق
│   ├── roles/                     # الأدوار
│   ├── blacklist/                 # القائمة السوداء
│   ├── audit-logs/                # سجل المراجعة
│   ├── segments/                  # شرائح المستخدمين
│   ├── campaigns/                 # الحملات التسويقية
│   ├── insights/                  # التقارير الذكية
│   ├── savings-circles/           # دوائر التوفير
│   ├── time-slots/                # الفترات الزمنية
│   └── statistics/                # الإحصائيات المتقدمة
│
└── environments/                  # إعدادات البيئة
    ├── environment.ts             # Development
    └── environment.prod.ts        # Production
```

---

## 📄 الصفحات والوحدات

### العمليات (Operations)

| الصفحة | المسار | الـ APIs | العمليات |
|---|---|---|---|
| لوحة التحكم | `/dashboard` | 4 endpoints | KPIs, Charts, Real-time |
| الطلبات | `/orders` | 10 endpoints | List, Detail, Create, Assign, Override, Auto-assign, Export |
| السائقين | `/drivers` | 6 endpoints | List, Detail, Performance, Activate/Deactivate, Locations |
| الفترات الزمنية | `/time-slots` | 6 endpoints | List, Create, Toggle, Delete |

### المستخدمين (Users)

| الصفحة | المسار | الـ APIs | العمليات |
|---|---|---|---|
| العملاء | `/customers` | 5 endpoints | List, Detail, Activate/Deactivate, Order History |
| الشركاء | `/partners` | 8 endpoints | List, Detail, Verify/Reject, Commission, Activate |
| القائمة السوداء | `/blacklist` | 4 endpoints | List, Add, Remove, Update |

### المالية (Finance)

| الصفحة | المسار | الـ APIs | العمليات |
|---|---|---|---|
| الاشتراكات | `/subscriptions` | 12 endpoints | List, Detail, Stats, Extend, Cancel, Gift, Plans |
| التسويات | `/settlements` | 5 endpoints | List, Detail, Approve/Reject, Process |
| المدفوعات | `/payments` | 5 endpoints | List, Detail, Retry, Void, Export |
| المحافظ | `/wallets` | 10 endpoints | List, Detail, Stats, Adjust, Freeze/Unfreeze, Bulk |
| الفواتير | `/invoices` | 7 endpoints | List, Detail, Create, Mark Paid, Cancel, PDF, Email |
| الاستردادات | `/refunds` | 6 endpoints | List, Detail, Stats, Approve/Reject, Process |
| النزاعات | `/disputes` | 7 endpoints | List, Detail, Stats, Assign, Respond, Resolve, Escalate |

### التحليلات (Analytics)

| الصفحة | المسار | الـ APIs | العمليات |
|---|---|---|---|
| الإحصائيات | `/statistics` | 20 endpoints | Revenue, Orders, Drivers, Customers, KPI, Heatmap, Growth |
| التقارير الذكية | `/insights` | 7 endpoints | Insights, Forecast, Churn, Revenue, Supply-Demand, Anomalies, Cohort |
| سجل المراجعة | `/audit-logs` | 6 endpoints | List, Detail, Entity, User, Actions, Export |

### المنصة (Platform)

| الصفحة | المسار | الـ APIs | العمليات |
|---|---|---|---|
| الإعدادات | `/config` | 21 endpoints | Settings, Feature Flags, Versions, Maintenance, Commissions |
| المناطق | `/regions` | 4 endpoints | List, Create, Update, Delete |
| المركبات | `/vehicles` | 11 endpoints | List, Detail, Stats, Create, Activate, Inspect, Transfer |
| الأدوار | `/roles` | 7 endpoints | List, Create, Update, Delete, Assign, Revoke |
| الإشعارات | `/notifications` | 3 endpoints | History, Send Single, Send Bulk |
| الطوارئ SOS | `/sos` | 10 endpoints | List, Detail, Stats, Acknowledge, Assign, Actions, Resolve, Escalate |

### التسويق (Marketing)

| الصفحة | المسار | الـ APIs | العمليات |
|---|---|---|---|
| الشرائح | `/segments` | 10 endpoints | List, Detail, Create, Update, Delete, Toggle, Users, Refresh |
| الحملات | `/campaigns` | 10 endpoints | List, Detail, Create, Activate, Pause, Delete, Usage, Stats, Validate |
| دوائر التوفير | `/savings-circles` | 11 endpoints | List, Detail, Stats, Create, Suspend, Resume, Close, Force Payout |

---

## 🔌 الـ API Endpoints

<table>
<tr><td><strong>Base URL</strong></td><td><code>https://sekka.runasp.net/api/v1/admin</code></td></tr>
<tr><td><strong>Auth</strong></td><td>JWT Bearer Token (Admin role)</td></tr>
<tr><td><strong>Total Endpoints</strong></td><td>210</td></tr>
<tr><td><strong>Controllers</strong></td><td>25</td></tr>
<tr><td><strong>Documentation</strong></td><td><a href="https://github.com/AhmedSalem104/Sekka.APIs/blob/main/docs/ADMIN_PANEL_API.md">ADMIN_PANEL_API.md</a></td></tr>
</table>

### الاستجابة القياسية

```json
{
  "isSuccess": true,
  "data": { },
  "message": "رسالة النجاح",
  "errors": null
}
```

### الاستجابة المرقّمة (Paginated)

```json
{
  "isSuccess": true,
  "data": {
    "items": [ ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalCount": 150,
    "totalPages": 15,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

---

## 🎨 نظام التصميم (Design System)

### الألوان

| اللون | الكود | الاستخدام |
|---|---|---|
| 🟠 **Primary** | `#FC5D01` | الأزرار، الروابط، العناصر التفاعلية |
| 🟠 **Primary Light** | `#FFF0E6` | خلفيات ثانوية، hover |
| 🟠 **Primary Dark** | `#D94E00` | pressed states |
| 🟢 **Success** | `#38A169` | نجاح، تم التسليم |
| 🔴 **Error** | `#E53E3E` | خطأ، فشل |
| 🟡 **Warning** | `#ECC94B` | تحذير، انتظار |
| 🔵 **Info** | `#3182CE` | معلومة، طلب جديد |

### ألوان حالات الطلب

| الحالة | اللون | الكود |
|---|---|---|
| مستني (جديد) | 🔵 أزرق | `#3182CE` |
| في السكة | 🟠 برتقالي | `#FC5D01` |
| وصلت | 🟡 أصفر | `#ECC94B` |
| اتسلّم | 🟢 أخضر | `#38A169` |
| معرفتش أسلّم | 🔴 أحمر | `#E53E3E` |
| ملغي | ⚪ رمادي | `#718096` |
| مرتجع | 🟣 بنفسجي | `#805AD5` |

### الخط

| الخاصية | القيمة |
|---|---|
| **Font Family** | [Tajawal](https://fonts.google.com/specimen/Tajawal) |
| **Bold** (700) | العناوين، الأزرار |
| **SemiBold** (600) | عناوين الأقسام |
| **Medium** (500) | النصوص العادية |
| **Light** (300) | التفاصيل الثانوية |

### الأبعاد

| العنصر | القيمة |
|---|---|
| Border Radius (أزرار) | `12px` |
| Border Radius (كروت) | `16px` |
| Border Radius (pills) | `100px` |
| Sidebar Width | `260px` |
| Sidebar Collapsed | `72px` |
| Header Height | `64px` |

---

## 🚀 التشغيل

### المتطلبات

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [Angular CLI](https://angular.dev/tools/cli) v21+

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/AhmedSalem104/Sekka.Admin-Panel.Angular.git

# الدخول للمجلد
cd Sekka.Admin-Panel.Angular

# تثبيت الحزم
npm install
```

### التشغيل (Development)

```bash
# تشغيل السيرفر مع الـ proxy
ng serve --proxy-config proxy.conf.json

# أو على بورت محدد
ng serve --port 4201 --proxy-config proxy.conf.json
```

> السيرفر هيشتغل على `http://localhost:4200/`
> الـ Proxy هيوجه الطلبات لـ `https://sekka.runasp.net`

### تسجيل الدخول

ادخل **رقم الموبايل** وكلمة المرور الخاصة بحساب Admin.

---

## 📦 البناء والنشر

### Production Build

```bash
ng build --configuration production
```

> الملفات هتطلع في `dist/sekka-admin/`

### Deploy

```bash
# نسخ ملفات الـ dist لأي static hosting
# مثال: Firebase Hosting
firebase deploy

# مثال: Nginx
cp -r dist/sekka-admin/browser/* /var/www/sekka-admin/
```

### Nginx Config (مثال)

```nginx
server {
    listen 80;
    server_name admin.sekka.com;
    root /var/www/sekka-admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass https://sekka.runasp.net;
        proxy_set_header Host sekka.runasp.net;
    }
}
```

---

## 📁 هيكل المشروع

```
Sekka.Admin-Panel.Angular/
├── 📄 angular.json                # إعدادات Angular CLI
├── 📄 package.json                # الحزم والنسخ
├── 📄 proxy.conf.json             # Proxy للتطوير المحلي
├── 📄 tsconfig.json               # إعدادات TypeScript
│
├── 📁 public/
│   ├── 🖼️ favicon.png             # أيقونة التاب (لوجو سِكّة)
│   └── 🖼️ favicon.ico             # Fallback icon
│
├── 📁 docs/
│   └── 📄 Sekka_Brand_Identity.md # هوية العلامة التجارية
│
└── 📁 src/
    ├── 📄 index.html              # HTML الرئيسي (RTL + Tajawal)
    ├── 📄 main.ts                 # نقطة الدخول
    ├── 📄 styles.scss             # الأنماط العامة + Design System
    │
    ├── 📁 environments/
    │   ├── 📄 environment.ts      # إعدادات التطوير
    │   └── 📄 environment.prod.ts # إعدادات الإنتاج
    │
    └── 📁 app/
        ├── 📄 app.ts              # Root Component
        ├── 📄 app.routes.ts       # جميع المسارات (27 route)
        ├── 📄 app.config.ts       # إعدادات التطبيق + Interceptors
        │
        ├── 📁 core/               # Guards & Interceptors
        ├── 📁 layout/             # Sidebar + Header + Shell
        └── 📁 pages/              # 27 صفحة (3 ملفات لكل صفحة)
            ├── 📁 dashboard/      # .ts + .html + .scss
            ├── 📁 login/
            ├── 📁 drivers/
            ├── 📁 orders/
            └── ... (23 more)
```

---

## 📊 إحصائيات المشروع

| | |
|---|---|
| **إجمالي الملفات** | 120 |
| **ملفات TypeScript** | 38 |
| **ملفات HTML** | 30 |
| **ملفات SCSS** | 30 |
| **إجمالي الأسطر** | ~18,500 |
| **حجم الـ Bundle (Initial)** | ~80 KB (gzipped) |
| **حجم الـ Bundle (Total)** | ~400 KB (gzipped) |
| **Lazy Chunks** | 28 |

---

## 🔐 الأمان

- JWT Bearer Token مع Auto-refresh
- HTTP Interceptor يضيف الـ Token تلقائياً لكل الطلبات
- Route Guard يمنع الوصول بدون تسجيل دخول
- 401 Unauthorized يعمل redirect تلقائي للـ Login
- الـ Token محفوظ في `localStorage`

---

## 🌐 التوافق

| المتصفح | الحالة |
|---|---|
| Chrome 90+ | ✅ مدعوم |
| Firefox 88+ | ✅ مدعوم |
| Safari 14+ | ✅ مدعوم |
| Edge 90+ | ✅ مدعوم |

| الجهاز | الحالة |
|---|---|
| Desktop (1200px+) | ✅ كامل |
| Tablet (768px-1199px) | ✅ متجاوب |
| Mobile (320px-767px) | ✅ متجاوب |

---

<div align="center">

**سِكّة** — شريك شغلك في الديليفري

مبني بـ ❤️ في مصر

</div>
