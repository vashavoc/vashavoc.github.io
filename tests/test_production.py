from pathlib import Path
import unittest
from test_preview import PageParser

ROOT = Path(__file__).resolve().parents[1]

class ProductionTests(unittest.TestCase):
    def test_homepage_promotes_the_approved_redesign(self):
        text = (ROOT / 'index.html').read_text()
        page = PageParser(text)
        self.assertIn('class="brand-logo"', text)
        self.assertIn('Play to win.', text)
        self.assertIn('assets/css/streaming.css', text)
        self.assertIn('assets/js/streaming.js', text)
        self.assertIn('G-HN4649BPPJ', text)
        self.assertNotIn('noindex', text)
        self.assertTrue(any(t == 'link' and a.get('rel') == 'canonical' and a.get('href') == 'https://vas.gg' for t, a in page.elements))
        self.assertTrue(any(t == 'meta' and a.get('property') == 'og:url' and a.get('content') == 'https://vas.gg' for t, a in page.elements))
        for t, a in page.elements:
            for key in ('src', 'href'):
                value = a.get(key, '')
                if value and not value.startswith(('https:', '#', '//')):
                    self.assertTrue((ROOT / value.split('?')[0]).exists(), value)

if __name__ == '__main__':
    unittest.main()
