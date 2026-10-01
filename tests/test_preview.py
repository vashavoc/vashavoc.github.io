"""Static smoke checks for the unpublished streaming redesign.
Run: python3 -m unittest discover -s tests -v
"""
from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class PageParser(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.elements = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

class PreviewTests(unittest.TestCase):
    def test_streaming_preview_has_accessible_navigation_and_real_links(self):
        self.assertTrue((ROOT / 'preview.html').exists(), 'Streaming preview is missing')
        text = (ROOT / 'preview.html').read_text()
        page = PageParser(text)
        ids = [a['id'] for _, a in page.elements if 'id' in a]
        self.assertEqual(len(ids), len(set(ids)), 'Duplicate IDs')
        links = [a['href'] for t, a in page.elements if t == 'a']
        self.assertIn('https://twitch.tv/VAS_', links)
        for section in ('watch', 'community', 'about', 'setup'):
            self.assertIn(section, ids)
            self.assertIn('#' + section, links)
        self.assertEqual(sum(t == 'h1' for t, _ in page.elements), 1)
        self.assertTrue(any(t == 'a' and a.get('href') == '#main' for t, a in page.elements))
        self.assertTrue(any(t == 'details' for t, _ in page.elements))
        self.assertNotIn('id="highlights"', text)
        self.assertNotIn('2021-2023', text)
        for t, a in page.elements:
            if t == 'img':
                self.assertIn('alt', a)
            if t == 'iframe':
                self.assertTrue(a.get('title'))
            if t == 'a' and a['href'].startswith('#'):
                self.assertIn(a['href'][1:], ids)
            for key in ('src', 'href'):
                value = a.get(key, '')
                if value and not value.startswith(('https:', '#', '//')):
                    self.assertTrue((ROOT / value.split('?')[0]).exists(), value)

if __name__ == '__main__':
    unittest.main()
