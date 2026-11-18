<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'slug' => 'how-to-read-mineral-water-label', 'type' => 'article', 'days' => 3,
                'title' => ['fa' => 'چگونه برچسب آب معدنی را بخوانیم؟', 'en' => 'How to read a mineral water label', 'ar' => 'كيف تقرأ ملصق المياه المعدنية؟'],
                'excerpt' => ['fa' => 'TDS، pH و ترکیب املاح روی برچسب چه معنایی دارند و چطور آب مناسب خود را انتخاب کنیم؟',
                    'en' => 'What TDS, pH and mineral composition on the label mean — and how to choose the right water.',
                    'ar' => 'ماذا تعني قيم TDS والرقم الهيدروجيني والأملاح على الملصق وكيف تختار المياه المناسبة؟'],
                'body' => [
                    'fa' => '<h2>TDS چیست؟</h2><p>مجموع مواد جامد محلول (TDS) نشان‌دهنده مقدار کل املاح حل‌شده در آب است و بر حسب میلی‌گرم در لیتر بیان می‌شود.</p><h2>pH</h2><p>pH میزان اسیدی یا قلیایی بودن آب را نشان می‌دهد. آب آشامیدنی معمولاً در محدوده نزدیک به خنثی قرار دارد.</p><h2>ترکیب املاح</h2><p>کلسیم، منیزیم، سدیم و بی‌کربنات از مهم‌ترین املاح آب معدنی هستند که طعم و ویژگی آب را تعیین می‌کنند.</p>',
                    'en' => '<h2>What is TDS?</h2><p>Total dissolved solids (TDS) is the total amount of minerals dissolved in water, expressed in mg/L.</p><h2>pH</h2><p>pH shows how acidic or alkaline water is. Drinking water is usually close to neutral.</p><h2>Minerals</h2><p>Calcium, magnesium, sodium and bicarbonate are the key minerals that shape taste and character.</p>',
                    'ar' => '<h2>ما هو TDS؟</h2><p>إجمالي المواد الصلبة الذائبة هو مجموع الأملاح الذائبة في الماء ويقاس بالملليغرام لكل لتر.</p><h2>الرقم الهيدروجيني</h2><p>يبين مدى حموضة أو قلوية الماء، وعادةً ما تكون مياه الشرب قريبة من المتعادل.</p><h2>الأملاح</h2><p>الكالسيوم والمغنيسيوم والصوديوم والبيكربونات هي أهم الأملاح التي تحدد الطعم.</p>',
                ],
            ],
            [
                'slug' => 'hydration-at-work', 'type' => 'article', 'days' => 10,
                'title' => ['fa' => 'آب و بهره‌وری در محیط کار', 'en' => 'Hydration and productivity at work', 'ar' => 'الماء والإنتاجية في العمل'],
                'excerpt' => ['fa' => 'چرا سازمان‌ها باید دسترسی آسان به آب آشامیدنی سالم را برای کارکنان فراهم کنند؟',
                    'en' => 'Why organizations should give employees easy access to safe drinking water.',
                    'ar' => 'لماذا يجب على المؤسسات توفير مياه شرب آمنة لموظفيها؟'],
                'body' => [
                    'fa' => '<p>کم‌آبی خفیف می‌تواند بر تمرکز و انرژی اثر بگذارد. تأمین آب بسته‌بندی‌شده مطمئن برای دفاتر و کارگاه‌ها، بخشی از سلامت سازمانی است.</p>',
                    'en' => '<p>Even mild dehydration can affect focus and energy. Reliable bottled water for offices and workshops is part of workplace wellbeing.</p>',
                    'ar' => '<p>حتى الجفاف الخفيف يؤثر على التركيز والطاقة. توفير مياه معبأة موثوقة للمكاتب جزء من صحة بيئة العمل.</p>',
                ],
            ],
            [
                'slug' => 'website-launch', 'type' => 'news', 'days' => 1,
                'title' => ['fa' => 'راه‌اندازی وب‌سایت جدید کارخانه', 'en' => 'Our new website is live', 'ar' => 'إطلاق الموقع الإلكتروني الجديد'],
                'excerpt' => ['fa' => 'وب‌سایت جدید با امکان ثبت آنلاین درخواست نمایندگی و دسترسی به گواهینامه‌ها راه‌اندازی شد.',
                    'en' => 'The new website launches with online agency requests and downloadable certificates.',
                    'ar' => 'انطلق الموقع الجديد مع إمكانية تقديم طلبات الوكالة عبر الإنترنت وتحميل الشهادات.'],
                'body' => [
                    'fa' => '<p>از این پس نمایندگان، پخش‌کنندگان و مشتریان سازمانی می‌توانند درخواست همکاری خود را به‌صورت آنلاین ثبت کرده و وضعیت کیفیت محصولات را مشاهده کنند.</p>',
                    'en' => '<p>Agents, distributors and corporate clients can now submit partnership requests online and review our quality documentation.</p>',
                    'ar' => '<p>يمكن الآن للوكلاء والموزعين والعملاء من المؤسسات تقديم طلبات الشراكة عبر الإنترنت ومراجعة وثائق الجودة.</p>',
                ],
            ],
        ];

        foreach ($articles as $a) {
            Article::query()->updateOrCreate(['slug' => $a['slug']], [
                'type' => $a['type'],
                'title' => $a['title'],
                'excerpt' => $a['excerpt'],
                'body' => $a['body'],
                'is_published' => true,
                'published_at' => now()->subDays($a['days']),
            ]);
        }
    }
}
