from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class HardwareGroupsTest(unittest.TestCase):
    def test_gaming_and_stream_pc_groups(self):
        for filename in ('index.html', 'preview.html'):
            with self.subTest(page=filename):
                html = (ROOT / filename).read_text()
                self.assertIn('<h3>Gaming PC</h3>', html)
                self.assertIn('<h3>Stream PC</h3>', html)
                stream = html.split('<h3>Stream PC</h3>', 1)[1].split('</dl>', 1)[0]
                self.assertIn('<dt>Computer</dt><dd>Mac Mini M4</dd>', stream)
                self.assertIn('<dt>Capture card</dt><dd>Elgato 4K X</dd>', stream)
                self.assertIn('AMD Ryzen 7 5800X3D', html)

if __name__ == '__main__':
    unittest.main()
