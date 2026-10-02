from pathlib import Path
import re
import unittest

CSS = Path(__file__).resolve().parents[1] / 'assets/css/streaming.css'

class TypographyTests(unittest.TestCase):
    def test_reading_text_is_larger_without_shrinking_on_mobile(self):
        css = CSS.read_text()
        for selector, minimum in [('body', 16), ('.hero-description', 16),
                                  ('.button', 14), ('.text-link', 14),
                                  ('.stream-intro p', 14), ('dl', 13),
                                  ('.stream-footer', 12), ('.section-index', 12)]:
            blocks = re.findall(r'(?m)^\s*' + re.escape(selector) + r'\s*\{([^}]*)\}', css)
            sizes = [int(size) for block in blocks for size in re.findall(r'font-size:\s*(\d+)px', block)]
            with self.subTest(selector=selector):
                self.assertTrue(sizes)
                self.assertTrue(all(size >= minimum for size in sizes), sizes)

    def test_header_and_heading_sizes_stay_unchanged(self):
        css = CSS.read_text()
        self.assertIn('h1 { font-size: clamp(62px, 6.9vw, 94px);', css)
        self.assertIn('h2 { font-size: clamp(34px, 4vw, 52px);', css)
        self.assertRegex(css, r'\.site-header nav a \{[^}]*font-size: 12px;')
        self.assertRegex(css, r'\.header-cta \{[^}]*font-size: 12px;')
