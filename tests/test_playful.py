from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class Decorations(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.stickers = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'squad-sticker' in (attrs.get('class') or '').split():
            self.stickers.append(attrs)

class PlayfulTests(unittest.TestCase):
    def test_squad_sticker_is_removed_from_both_pages(self):
        for filename in ('index.html', 'preview.html'):
            with self.subTest(page=filename):
                stickers = Decorations((ROOT / filename).read_text()).stickers
                self.assertEqual(stickers, [])
        self.assertNotIn('.squad-sticker', (ROOT / 'assets/css/streaming.css').read_text())

if __name__ == '__main__':
    unittest.main()
