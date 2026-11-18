<?php

namespace Tests\Unit;

use App\Support\HtmlSanitizer;
use PHPUnit\Framework\TestCase;

class HtmlSanitizerTest extends TestCase
{
    public function test_it_removes_scripts_handlers_and_dangerous_urls(): void
    {
        $dirty = '<p onclick="alert(1)">سلام <strong>دنیا</strong></p><script>alert(1)</script>'
            .'<a href="javascript:alert(1)">x</a><a href="https://example.com" target="_blank">ok</a>'
            .'<img src="x" onerror="alert(1)"><iframe src="//evil"></iframe><div style="color:red">kept</div>';

        $clean = HtmlSanitizer::clean($dirty);

        $this->assertStringNotContainsString('script', $clean);
        $this->assertStringNotContainsString('onclick', $clean);
        $this->assertStringNotContainsString('onerror', $clean);
        $this->assertStringNotContainsString('javascript:', $clean);
        $this->assertStringNotContainsString('iframe', $clean);
        $this->assertStringNotContainsString('style=', $clean);
        $this->assertStringContainsString('<strong>دنیا</strong>', $clean);
        $this->assertStringContainsString('rel="noopener noreferrer"', $clean);
        $this->assertStringContainsString('kept', $clean);
    }
}
