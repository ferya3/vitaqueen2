<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

/**
 * Starter catalog. Water analysis fields (pH, TDS, minerals) are intentionally
 * empty: they must come from the factory's official lab report, never invented.
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $natural = Category::query()->updateOrCreate(['slug' => 'natural-mineral-water'], [
            'name' => ['fa' => 'آب معدنی طبیعی', 'en' => 'Natural Mineral Water', 'ar' => 'مياه معدنية طبيعية'],
            'description' => [
                'fa' => 'بطری‌های کوچک، متوسط و بزرگ برای مصرف روزانه، خانواده و سازمان‌ها.',
                'en' => 'Small, medium and large bottles for everyday, family and corporate use.',
                'ar' => 'عبوات صغيرة ومتوسطة وكبيرة للاستخدام اليومي والعائلي وللمؤسسات.',
            ],
            'sort_order' => 1,
        ]);

        $special = Category::query()->updateOrCreate(['slug' => 'special-products'], [
            'name' => ['fa' => 'محصولات ویژه', 'en' => 'Special Products', 'ar' => 'منتجات خاصة'],
            'description' => [
                'fa' => 'محصولات با بسته‌بندی شیشه‌ای و سفارشی برای هتل‌ها، رستوران‌ها و رویدادها.',
                'en' => 'Glass and custom-label products for hotels, restaurants and events.',
                'ar' => 'منتجات بعبوات زجاجية وملصقات مخصصة للفنادق والمطاعم والفعاليات.',
            ],
            'sort_order' => 2,
        ]);

        $products = [
            [
                'slug' => 'mineral-water-330ml', 'category' => $natural, 'volume_ml' => 330, 'units_per_pack' => 24,
                'packs_per_pallet' => 84, 'accent' => '#13A8CE', 'featured' => true, 'order' => 1,
                'name' => ['fa' => 'آب معدنی ۳۳۰ میلی‌لیتری', 'en' => 'Mineral Water 330 ml', 'ar' => 'مياه معدنية ٣٣٠ مل'],
                'short' => ['fa' => 'بطری کوچک و سبک؛ مناسب پذیرایی، جلسات و همراه.', 'en' => 'Compact and light — ideal for meetings, hospitality and on the go.', 'ar' => 'عبوة صغيرة وخفيفة، مثالية للاجتماعات والضيافة والتنقل.'],
            ],
            [
                'slug' => 'mineral-water-500ml', 'category' => $natural, 'volume_ml' => 500, 'units_per_pack' => 12,
                'packs_per_pallet' => 120, 'accent' => '#13A8CE', 'featured' => true, 'order' => 2,
                'name' => ['fa' => 'آب معدنی نیم‌لیتری', 'en' => 'Mineral Water 500 ml', 'ar' => 'مياه معدنية ٥٠٠ مل'],
                'short' => ['fa' => 'پرفروش‌ترین سایز برای مصرف روزانه و فروشگاه‌ها.', 'en' => 'Our best-selling everyday size for retail.', 'ar' => 'الحجم الأكثر مبيعاً للاستخدام اليومي.'],
            ],
            [
                'slug' => 'mineral-water-1500ml', 'category' => $natural, 'volume_ml' => 1500, 'units_per_pack' => 6,
                'packs_per_pallet' => 80, 'accent' => '#0E7FA6', 'featured' => true, 'order' => 3,
                'name' => ['fa' => 'آب معدنی ۱.۵ لیتری', 'en' => 'Mineral Water 1.5 L', 'ar' => 'مياه معدنية ١٫٥ لتر'],
                'short' => ['fa' => 'سایز خانواده؛ مناسب سفره و مصرف خانگی.', 'en' => 'Family size for the dining table and home.', 'ar' => 'حجم العائلة للمنزل ومائدة الطعام.'],
            ],
            [
                'slug' => 'mineral-water-10l', 'category' => $natural, 'volume_ml' => 10000, 'units_per_pack' => 1,
                'packs_per_pallet' => 60, 'accent' => '#073B59', 'featured' => true, 'order' => 4,
                'name' => ['fa' => 'آب معدنی ۱۰ لیتری', 'en' => 'Mineral Water 10 L', 'ar' => 'مياه معدنية ١٠ لتر'],
                'short' => ['fa' => 'گالن دسته‌دار برای دفاتر، کارگاه‌ها و مصرف حجیم.', 'en' => 'Handled jug for offices, workshops and bulk use.', 'ar' => 'عبوة بمقبض للمكاتب والورش والاستهلاك الكبير.'],
            ],
            [
                'slug' => 'premium-glass-750ml', 'category' => $special, 'volume_ml' => 750, 'units_per_pack' => 12,
                'packs_per_pallet' => 50, 'accent' => '#8DD9E9', 'featured' => false, 'order' => 5, 'material' => 'Glass',
                'name' => ['fa' => 'آب معدنی پریمیوم بطری شیشه‌ای ۷۵۰', 'en' => 'Premium Glass Bottle 750 ml', 'ar' => 'زجاجة فاخرة ٧٥٠ مل'],
                'short' => ['fa' => 'بطری شیشه‌ای برای هتل‌ها و رستوران‌های لوکس.', 'en' => 'Glass bottle for hotels and fine dining.', 'ar' => 'زجاجة للفنادق والمطاعم الراقية.'],
            ],
        ];

        foreach ($products as $p) {
            $liters = $p['volume_ml'] >= 1000 ? rtrim(rtrim(number_format($p['volume_ml'] / 1000, 1), '0'), '.').' L' : $p['volume_ml'].' ml';

            Product::query()->updateOrCreate(['slug' => $p['slug']], [
                'category_id' => $p['category']->id,
                'sku' => 'VQ-'.str_pad((string) $p['volume_ml'], 5, '0', STR_PAD_LEFT).(($p['material'] ?? 'PET') === 'Glass' ? '-G' : ''),
                'name' => $p['name'],
                'short_description' => $p['short'],
                'description' => [
                    'fa' => "<p>{$p['short']['fa']}</p><p>این محصول از منبع طبیعی کارخانه برداشت شده و پس از فیلتراسیون چندمرحله‌ای و کنترل کیفیت آزمایشگاهی، در محیطی کاملاً بهداشتی و بدون دخالت دست بطری‌گیری می‌شود.</p>",
                    'en' => "<p>{$p['short']['en']}</p><p>Drawn from our natural source, multi-stage filtered, laboratory tested and bottled in a fully hygienic, hands-free environment.</p>",
                    'ar' => "<p>{$p['short']['ar']}</p><p>تُستخرج من مصدرنا الطبيعي وتُرشّح على عدة مراحل وتُختبر في المختبر ثم تُعبأ في بيئة صحية بالكامل دون تدخل يدوي.</p>",
                ],
                'volume_ml' => $p['volume_ml'],
                'bottle_material' => $p['material'] ?? 'PET',
                'units_per_pack' => $p['units_per_pack'],
                'packs_per_pallet' => $p['packs_per_pallet'],
                'shelf_life_months' => ($p['material'] ?? 'PET') === 'Glass' ? 24 : 12,
                // Left empty on purpose: enter values from the official lab analysis.
                'ph' => null,
                'tds' => null,
                'mineral_composition' => null,
                'specs' => [
                    ['label' => ['fa' => 'حجم', 'en' => 'Volume', 'ar' => 'الحجم'], 'value' => ['fa' => $liters, 'en' => $liters, 'ar' => $liters]],
                    ['label' => ['fa' => 'جنس بطری', 'en' => 'Bottle material', 'ar' => 'مادة العبوة'], 'value' => ($p['material'] ?? 'PET') === 'Glass'
                        ? ['fa' => 'شیشه', 'en' => 'Glass', 'ar' => 'زجاج']
                        : ['fa' => 'PET گرید غذایی', 'en' => 'Food-grade PET', 'ar' => 'PET غذائي']],
                    ['label' => ['fa' => 'درب', 'en' => 'Cap', 'ar' => 'الغطاء'], 'value' => ['fa' => 'پلمب‌دار با حلقه ضمانت', 'en' => 'Tamper-evident ring', 'ar' => 'مع حلقة ضمان']],
                    ['label' => ['fa' => 'نوع بسته‌بندی', 'en' => 'Packaging', 'ar' => 'التغليف'], 'value' => $p['units_per_pack'] > 1
                        ? ['fa' => 'شیرینک', 'en' => 'Shrink-wrapped pack', 'ar' => 'تغليف حراري']
                        : ['fa' => 'تکی', 'en' => 'Single unit', 'ar' => 'عبوة فردية']],
                ],
                'accent_color' => $p['accent'],
                'is_featured' => $p['featured'],
                'is_active' => true,
                'sort_order' => $p['order'],
            ]);
        }
    }
}
