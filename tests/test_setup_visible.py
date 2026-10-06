from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class SetupVisibleTest(unittest.TestCase):
    def test_setup_has_no_disclosure(self):
        for name in ('index.html', 'preview.html'):
            with self.subTest(page=name):
                html = (ROOT / name).read_text()
                setup = html.split('id="setup"', 1)[1].split('</section>', 1)[0]
                self.assertNotIn('<details', setup)
                self.assertNotIn('<summary', setup)
                self.assertIn('<h3>Gaming PC</h3>', setup)
                self.assertIn('<h3>Stream PC</h3>', setup)

if __name__ == '__main__':
    unittest.main()
