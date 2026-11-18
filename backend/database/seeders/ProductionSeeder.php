<?php

namespace Database\Seeders;

use App\Models\ProductionLine;
use App\Models\ProductionStep;
use Illuminate\Database\Seeder;

class ProductionSeeder extends Seeder
{
    public function run(): void
    {
        $steps = [
            ['source', 'droplet',
                ['fa' => 'منبع آب', 'en' => 'Water Source', 'ar' => 'مصدر المياه'],
                ['fa' => 'آب از منبع طبیعی محافظت‌شده و دور از آلودگی‌های شهری و صنعتی، از طریق خطوط استیل بهداشتی به کارخانه منتقل می‌شود.',
                    'en' => 'Water flows from a protected natural source, far from urban and industrial pollution, through sanitary stainless-steel pipelines.',
                    'ar' => 'تنتقل المياه من مصدر طبيعي محمي بعيد عن التلوث عبر أنابيب صحية من الفولاذ المقاوم للصدأ.']],
            ['filtration', 'filter',
                ['fa' => 'تصفیه و فیلتراسیون', 'en' => 'Filtration', 'ar' => 'الترشيح'],
                ['fa' => 'فیلتراسیون چندمرحله‌ای شنی، کربنی و میکرونی، ذرات معلق را بدون تغییر ترکیب معدنی طبیعی آب حذف می‌کند.',
                    'en' => 'Multi-stage sand, carbon and micron filtration removes particles while preserving the natural mineral balance.',
                    'ar' => 'ترشيح متعدد المراحل يزيل الشوائب مع الحفاظ على التوازن المعدني الطبيعي.']],
            ['disinfection', 'sun',
                ['fa' => 'گندزدایی', 'en' => 'Disinfection', 'ar' => 'التعقيم'],
                ['fa' => 'گندزدایی با پرتو فرابنفش و ازن، بدون استفاده از کلر و مواد شیمیایی.',
                    'en' => 'UV and ozone disinfection — no chlorine, no chemicals.',
                    'ar' => 'تعقيم بالأشعة فوق البنفسجية والأوزون دون كلور أو مواد كيميائية.']],
            ['laboratory', 'flask',
                ['fa' => 'آزمایشگاه', 'en' => 'Laboratory', 'ar' => 'المختبر'],
                ['fa' => 'نمونه‌برداری مستمر و آزمایش‌های فیزیکوشیمیایی و میکروبی در آزمایشگاه کنترل کیفیت کارخانه.',
                    'en' => 'Continuous sampling with physicochemical and microbiological tests in our in-house QC lab.',
                    'ar' => 'أخذ عينات مستمر واختبارات فيزيائية وكيميائية وميكروبية في مختبرنا.']],
            ['filling', 'bottle',
                ['fa' => 'خط پرکنی', 'en' => 'Filling', 'ar' => 'التعبئة'],
                ['fa' => 'شست‌وشو، پرکنی و درب‌بندی در یک مونوبلوک تمام‌اتوماتیک و در اتاق تمیز، بدون تماس دست.',
                    'en' => 'Rinsing, filling and capping in a fully automatic monoblock inside a clean room — untouched by hand.',
                    'ar' => 'الغسل والتعبئة والإغلاق في وحدة آلية بالكامل داخل غرفة نظيفة دون لمس اليد.']],
            ['labeling', 'tag',
                ['fa' => 'لیبل‌زنی و کدگذاری', 'en' => 'Labeling & Coding', 'ar' => 'الملصقات والترميز'],
                ['fa' => 'لیبل‌زنی دقیق و چاپ تاریخ تولید، انقضا و شماره بچ برای ردیابی کامل هر بطری.',
                    'en' => 'Precise labeling plus production date, expiry and batch number for full traceability.',
                    'ar' => 'ملصقات دقيقة مع تاريخ الإنتاج والانتهاء ورقم الدفعة للتتبع الكامل.']],
            ['packaging', 'package',
                ['fa' => 'بسته‌بندی', 'en' => 'Packaging', 'ar' => 'التغليف'],
                ['fa' => 'شیرینک، پالت‌بندی و استرچ اتوماتیک برای حمل‌ونقل ایمن تا دست مشتری.',
                    'en' => 'Automatic shrink-wrapping, palletizing and stretch-wrapping for safe delivery.',
                    'ar' => 'تغليف حراري وتجميع على منصات آلياً لنقل آمن.']],
            ['quality', 'shield-check',
                ['fa' => 'کنترل کیفیت نهایی', 'en' => 'Final Quality Control', 'ar' => 'مراقبة الجودة النهائية'],
                ['fa' => 'هر بچ تولید پیش از خروج از کارخانه بازرسی و نمونه شاهد آن نگهداری می‌شود.',
                    'en' => 'Every batch is inspected before release and a retention sample is archived.',
                    'ar' => 'تُفحص كل دفعة قبل خروجها ويُحتفظ بعينة مرجعية منها.']],
        ];

        foreach ($steps as $i => [$key, $icon, $title, $description]) {
            ProductionStep::query()->updateOrCreate(['key' => $key], [
                'title' => $title,
                'description' => $description,
                'icon' => $icon,
                'sort_order' => $i + 1,
                'is_active' => true,
            ]);
        }

        // Production lines: capacities are left empty on purpose — enter the real
        // nameplate capacity of each line from the admin panel.
        $lines = [
            [
                'name' => ['fa' => 'خط تولید بطری‌های کوچک و متوسط', 'en' => 'Small & Medium Bottle Line', 'ar' => 'خط العبوات الصغيرة والمتوسطة'],
                'description' => ['fa' => 'خط تمام‌اتوماتیک شامل دستگاه بادکن، مونوبلوک شست‌وشو-پرکنی-درب‌بندی، لیبل‌زن و شیرینک.',
                    'en' => 'Fully automatic line: blow molder, rinse-fill-cap monoblock, labeler and shrink wrapper.',
                    'ar' => 'خط آلي بالكامل: آلة نفخ، وحدة غسل وتعبئة وإغلاق، آلة ملصقات وتغليف حراري.'],
                'technology' => ['fa' => 'بادکن خطی، پرکنی ثقلی، لیبل‌زن رپ‌اراند', 'en' => 'Linear blow molding, gravity filling, wrap-around labeling', 'ar' => 'نفخ خطي، تعبئة بالجاذبية، ملصقات ملتفة'],
                'bottle_sizes' => [330, 500, 1500],
            ],
            [
                'name' => ['fa' => 'خط تولید گالن', 'en' => 'Large Format Line', 'ar' => 'خط العبوات الكبيرة'],
                'description' => ['fa' => 'خط مخصوص بطری‌های بزرگ برای مصرف خانوار پرجمعیت و سازمان‌ها.',
                    'en' => 'Dedicated line for large formats serving households and organizations.',
                    'ar' => 'خط مخصص للعبوات الكبيرة للأسر والمؤسسات.'],
                'technology' => ['fa' => 'پرکنی حجمی، درب‌بند نیمه‌اتوماتیک', 'en' => 'Volumetric filling, semi-automatic capping', 'ar' => 'تعبئة حجمية، إغلاق نصف آلي'],
                'bottle_sizes' => [10000],
            ],
        ];

        foreach ($lines as $i => $line) {
            ProductionLine::query()->updateOrCreate(
                ['sort_order' => $i + 1],
                array_merge($line, ['is_active' => true]),
            );
        }
    }
}
