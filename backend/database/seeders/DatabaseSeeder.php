<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            SettingSeeder::class,
            CatalogSeeder::class,
            ProductionSeeder::class,
            CertificateSeeder::class,
            PageSeeder::class,
            ArticleSeeder::class,
        ]);
    }
}
