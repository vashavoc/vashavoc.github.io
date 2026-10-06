from pathlib import Path
import unittest
ROOT = Path(__file__).resolve().parents[1]
class FaviconTest(unittest.TestCase):
    def test_branded_icons_exist_and_are_linked(self):
        for page in ('index.html', 'preview.html'):
            text = (ROOT / page).read_text()
            for icon in ('favicon.ico', 'assets/images/favicon-32.png', 'assets/images/apple-touch-icon.png'):
                self.assertTrue((ROOT / icon).exists(), icon)
                self.assertIn(icon, text)
if __name__ == '__main__':
    unittest.main()
