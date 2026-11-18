<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

/**
 * Site-wide settings. Every value is editable from Admin → Settings.
 *
 * IMPORTANT: no invented numbers. Stats flagged "is_placeholder" are hidden on
 * the website until an editor enters the factory's real figure (and the admin
 * dashboard shows a warning). Stats flagged "auto" are counted from the database.
 */
class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // ------------------------------------------------------------ brand
            ['site.name', 'brand', ['fa' => 'ویتا کوئین', 'en' => 'VitaQueen', 'ar' => 'فيتا كوين']],
            ['site.legal_name', 'brand', ['fa' => 'شرکت تولیدی آب معدنی ویتا کوئین', 'en' => 'VitaQueen Mineral Water Co.', 'ar' => 'شركة فيتا كوين للمياه المعدنية']],
            ['site.tagline', 'brand', ['fa' => 'طبیعت در خالص‌ترین شکل خود', 'en' => 'Nature in its purest form', 'ar' => 'الطبيعة في أنقى صورها']],
            ['site.description', 'brand', [
                'fa' => 'تولیدکننده آب معدنی طبیعی با خطوط تمام‌اتوماتیک، آزمایشگاه کنترل کیفیت و شبکه توزیع سراسری.',
                'en' => 'Natural mineral water producer with fully automated lines, an in-house QC laboratory and nationwide distribution.',
                'ar' => 'منتج للمياه المعدنية الطبيعية بخطوط آلية بالكامل ومختبر لمراقبة الجودة وشبكة توزيع واسعة.',
            ]],

            // ------------------------------------------------------------- hero
            ['hero.title', 'home', ['fa' => 'طبیعت در خالص‌ترین شکل خود', 'en' => 'Nature in its purest form', 'ar' => 'الطبيعة في أنقى صورها']],
            ['hero.subtitle', 'home', [
                'fa' => 'آب معدنی طبیعی، برگرفته از دل طبیعت و تولیدشده با فناوری روز برای زندگی سالم‌تر.',
                'en' => 'Natural mineral water drawn from the heart of nature and bottled with modern technology for a healthier life.',
                'ar' => 'مياه معدنية طبيعية من قلب الطبيعة، معبأة بأحدث التقنيات من أجل حياة أكثر صحة.',
            ]],
            ['hero.video_url', 'home', null],
            ['hero.poster_url', 'home', null],

            // ------------------------------------------------------------ stats
            ['stats', 'home', [
                ['key' => 'daily_capacity', 'value' => 0, 'suffix' => ['fa' => 'بطری', 'en' => 'bottles', 'ar' => 'زجاجة'],
                    'label' => ['fa' => 'ظرفیت تولید روزانه', 'en' => 'Daily production capacity', 'ar' => 'الطاقة الإنتاجية اليومية'], 'is_placeholder' => true],
                // "auto" stats are counted live from the database (always real).
                ['key' => 'production_lines', 'value' => 0, 'suffix' => null, 'auto' => true,
                    'label' => ['fa' => 'خط تولید فعال', 'en' => 'Production lines', 'ar' => 'خطوط الإنتاج'], 'is_placeholder' => false],
                ['key' => 'products', 'value' => 0, 'suffix' => null, 'auto' => true,
                    'label' => ['fa' => 'محصول', 'en' => 'Products', 'ar' => 'منتجات'], 'is_placeholder' => false],
                ['key' => 'founded_year', 'value' => 0, 'suffix' => null,
                    'label' => ['fa' => 'سال تأسیس', 'en' => 'Founded', 'ar' => 'سنة التأسيس'], 'is_placeholder' => true],
            ]],

            // ---------------------------------------------------------- contact
            ['contact.phone', 'contact', '+98 21 0000 0000'],
            ['contact.sales_phone', 'contact', '+98 912 000 0000'],
            ['contact.email', 'contact', 'info@example.com'],
            ['contact.sales_email', 'contact', 'sales@example.com'],
            ['contact.address', 'contact', [
                'fa' => 'نشانی کارخانه را از پنل مدیریت وارد کنید',
                'en' => 'Enter the factory address from the admin panel',
                'ar' => 'أدخل عنوان المصنع من لوحة الإدارة',
            ]],
            ['contact.working_hours', 'contact', [
                'fa' => 'شنبه تا چهارشنبه ۸ تا ۱۶ — پنجشنبه ۸ تا ۱۲',
                'en' => 'Sat–Wed 8:00–16:00 · Thu 8:00–12:00',
                'ar' => 'السبت–الأربعاء ٨:٠٠–١٦:٠٠ · الخميس ٨:٠٠–١٢:٠٠',
            ]],
            ['contact.map', 'contact', ['lat' => 35.6892, 'lng' => 51.389, 'zoom' => 13]],

            // ----------------------------------------------------------- social
            ['social', 'social', [
                'instagram' => null, 'linkedin' => null, 'telegram' => null, 'whatsapp' => null, 'aparat' => null,
            ]],

            // -------------------------------------------------------------- seo
            ['seo.title_suffix', 'seo', ['fa' => 'ویتا کوئین', 'en' => 'VitaQueen', 'ar' => 'فيتا كوين']],
            ['seo.keywords', 'seo', ['fa' => 'آب معدنی, تولید آب معدنی, نمایندگی آب معدنی, پخش عمده آب', 'en' => 'mineral water, bottled water manufacturer, water distributor, export', 'ar' => 'مياه معدنية, مصنع مياه, توزيع مياه, تصدير']],

            // ---------------------------------------------------------- private
            ['leads.notify_email', 'leads', null, false],
        ];

        foreach ($settings as $row) {
            [$key, $group, $value] = $row;
            Setting::query()->updateOrCreate(['key' => $key], [
                'group' => $group,
                'value' => $value,
                'is_public' => $row[3] ?? true,
            ]);
        }
    }
}
