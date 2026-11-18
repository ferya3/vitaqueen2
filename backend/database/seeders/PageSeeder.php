<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        Page::query()->updateOrCreate(['slug' => 'about'], [
            'title' => ['fa' => 'درباره کارخانه', 'en' => 'About the Factory', 'ar' => 'عن المصنع'],
            'excerpt' => [
                'fa' => 'ما آب را همان‌طور که طبیعت آفریده، با فناوری روز و استانداردهای سخت‌گیرانه به سفره شما می‌رسانیم.',
                'en' => 'We deliver water exactly as nature made it — with modern technology and uncompromising standards.',
                'ar' => 'نوصل المياه كما خلقتها الطبيعة، بأحدث التقنيات وأعلى المعايير.',
            ],
            'body' => [
                'fa' => '<p>متن معرفی شرکت را از پنل مدیریت ویرایش کنید: تاریخچه، مالکیت، موقعیت منبع آب و مسیر رشد کارخانه.</p>',
                'en' => '<p>Edit the company introduction from the admin panel: history, ownership, source location and growth.</p>',
                'ar' => '<p>قم بتحرير نبذة الشركة من لوحة الإدارة: التاريخ والملكية وموقع المصدر ومسيرة النمو.</p>',
            ],
            'sections' => [
                ['type' => 'mission',
                    'title' => ['fa' => 'مأموریت', 'en' => 'Mission', 'ar' => 'المهمة'],
                    'body' => ['fa' => 'تأمین آب آشامیدنی سالم، طبیعی و قابل اعتماد برای هر خانواده و سازمان.',
                        'en' => 'To provide safe, natural and reliable drinking water to every family and organization.',
                        'ar' => 'توفير مياه شرب آمنة وطبيعية وموثوقة لكل أسرة ومؤسسة.']],
                ['type' => 'vision',
                    'title' => ['fa' => 'چشم‌انداز', 'en' => 'Vision', 'ar' => 'الرؤية'],
                    'body' => ['fa' => 'تبدیل‌شدن به برند مرجع آب معدنی در منطقه با حضور در بازارهای صادراتی.',
                        'en' => 'To become the region’s reference mineral water brand with a strong export presence.',
                        'ar' => 'أن نصبح العلامة المرجعية للمياه المعدنية في المنطقة مع حضور تصديري قوي.']],
                ['type' => 'values',
                    'title' => ['fa' => 'ارزش‌ها', 'en' => 'Values', 'ar' => 'القيم'],
                    'items' => [
                        ['fa' => 'خلوص و سلامت', 'en' => 'Purity & health', 'ar' => 'النقاء والصحة'],
                        ['fa' => 'شفافیت در کیفیت', 'en' => 'Transparent quality', 'ar' => 'الشفافية في الجودة'],
                        ['fa' => 'مسئولیت در برابر طبیعت', 'en' => 'Responsibility to nature', 'ar' => 'المسؤولية تجاه الطبيعة'],
                        ['fa' => 'همکاری بلندمدت با شرکا', 'en' => 'Long-term partnerships', 'ar' => 'شراكات طويلة الأمد'],
                    ]],
                ['type' => 'timeline',
                    'title' => ['fa' => 'تاریخچه', 'en' => 'History', 'ar' => 'التاريخ'],
                    // Fill with real milestones: [{year, title:{..}, body:{..}}]
                    'items' => []],
                ['type' => 'infrastructure',
                    'title' => ['fa' => 'زیرساخت‌ها', 'en' => 'Infrastructure', 'ar' => 'البنية التحتية'],
                    'items' => [
                        ['fa' => 'سالن تولید با استانداردهای بهداشتی صنایع غذایی', 'en' => 'Food-grade production hall', 'ar' => 'صالة إنتاج بمعايير غذائية'],
                        ['fa' => 'آزمایشگاه کنترل کیفیت فیزیکوشیمیایی و میکروبی', 'en' => 'Physicochemical & microbiological QC lab', 'ar' => 'مختبر جودة فيزيائي وكيميائي وميكروبي'],
                        ['fa' => 'انبار مسقف و ناوگان توزیع', 'en' => 'Covered warehouse & distribution fleet', 'ar' => 'مستودع مغطى وأسطول توزيع'],
                        ['fa' => 'سیستم تصفیه و گندزدایی بدون مواد شیمیایی', 'en' => 'Chemical-free treatment & disinfection', 'ar' => 'معالجة وتعقيم دون مواد كيميائية'],
                    ]],
            ],
            'is_published' => true,
        ]);

        $simple = [
            'export' => [
                ['fa' => 'صادرات', 'en' => 'Export', 'ar' => 'التصدير'],
                ['fa' => 'آماده همکاری با واردکنندگان و توزیع‌کنندگان بین‌المللی با امکان برچسب اختصاصی و مستندات صادراتی هستیم.',
                    'en' => 'We work with international importers and distributors, offering private labels and full export documentation.',
                    'ar' => 'نتعاون مع المستوردين والموزعين الدوليين مع إمكانية الملصقات الخاصة ووثائق التصدير الكاملة.'],
            ],
            'privacy' => [
                ['fa' => 'حریم خصوصی', 'en' => 'Privacy Policy', 'ar' => 'سياسة الخصوصية'],
                ['fa' => 'اطلاعات ارسالی شما فقط برای پیگیری درخواست همکاری استفاده می‌شود و در اختیار شخص ثالث قرار نمی‌گیرد.',
                    'en' => 'Information you submit is used only to follow up your request and is never shared with third parties.',
                    'ar' => 'تُستخدم المعلومات المرسلة فقط لمتابعة طلبك ولا تُشارك مع أي طرف ثالث.'],
            ],
        ];

        foreach ($simple as $slug => [$title, $excerpt]) {
            Page::query()->updateOrCreate(['slug' => $slug], [
                'title' => $title,
                'excerpt' => $excerpt,
                'body' => array_map(fn ($t) => "<p>{$t}</p>", $excerpt),
                'is_published' => true,
            ]);
        }
    }
}
