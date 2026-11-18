<?php

namespace Database\Seeders;

use App\Models\Certificate;
use Illuminate\Database\Seeder;

/**
 * Certificate placeholders. Upload the real scanned certificate / lab report PDFs
 * from Admin → Quality & Certificates, fill in numbers and dates, or deactivate
 * the ones the factory does not hold.
 */
class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['certificate', 1, ['fa' => 'پروانه ساخت سازمان غذا و دارو', 'en' => 'Food & Drug Administration Manufacturing License', 'ar' => 'ترخيص التصنيع من هيئة الغذاء والدواء'],
                ['fa' => 'سازمان غذا و دارو', 'en' => 'Iran FDA', 'ar' => 'هيئة الغذاء والدواء']],
            ['standard', 2, ['fa' => 'نشان استاندارد ملی ایران', 'en' => 'Iranian National Standard Mark', 'ar' => 'علامة المواصفة الوطنية الإيرانية'],
                ['fa' => 'سازمان ملی استاندارد ایران', 'en' => 'INSO', 'ar' => 'المنظمة الوطنية للمواصفات']],
            ['certificate', 3, ['fa' => 'سیستم مدیریت ایمنی مواد غذایی ISO 22000', 'en' => 'ISO 22000 Food Safety Management', 'ar' => 'نظام إدارة سلامة الغذاء ISO 22000'],
                ['fa' => 'نهاد گواهی‌دهنده', 'en' => 'Certification body', 'ar' => 'جهة الاعتماد']],
            ['certificate', 4, ['fa' => 'سیستم تحلیل خطر و نقاط کنترل بحرانی HACCP', 'en' => 'HACCP', 'ar' => 'نظام تحليل المخاطر HACCP'],
                ['fa' => 'نهاد گواهی‌دهنده', 'en' => 'Certification body', 'ar' => 'جهة الاعتماد']],
            ['lab_report', 5, ['fa' => 'گزارش آنالیز فیزیکوشیمیایی آب', 'en' => 'Physicochemical Water Analysis Report', 'ar' => 'تقرير التحليل الفيزيائي والكيميائي'],
                ['fa' => 'آزمایشگاه همکار مورد تأیید', 'en' => 'Accredited partner laboratory', 'ar' => 'مختبر معتمد']],
            ['lab_report', 6, ['fa' => 'گزارش آزمون میکروبی', 'en' => 'Microbiological Test Report', 'ar' => 'تقرير الاختبار الميكروبي'],
                ['fa' => 'آزمایشگاه کنترل کیفیت کارخانه', 'en' => 'In-house QC laboratory', 'ar' => 'مختبر مراقبة الجودة']],
        ];

        foreach ($items as [$type, $order, $title, $issuer]) {
            Certificate::query()->updateOrCreate(['sort_order' => $order], [
                'type' => $type,
                'title' => $title,
                'issuer' => $issuer,
                'description' => [
                    'fa' => 'تصویر و فایل رسمی این مدرک را از پنل مدیریت بارگذاری کنید.',
                    'en' => 'Upload the official scan of this document from the admin panel.',
                    'ar' => 'ارفع النسخة الرسمية من هذه الوثيقة من لوحة الإدارة.',
                ],
                'is_active' => true,
            ]);
        }
    }
}
