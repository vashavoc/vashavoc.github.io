from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class HardwareTests(unittest.TestCase):
    def test_updated_equipment_is_consistent_on_both_pages(self):
        for name in ('index.html', 'preview.html'):
            with self.subTest(page=name):
                text = (ROOT / name).read_text()
                self.assertIn('<dt>Controller</dt><dd>Scuf Omega PS5 Controller</dd>', text)
                self.assertIn('<dt>Audio Interface</dt><dd>GoXLR</dd>', text)
                self.assertIn('<dt>Other gear</dt><dd>Elgato Stream Deck+</dd>', text)
                self.assertNotIn('Beacn', text)
                self.assertNotIn('Flydigi Apex 5', text)
                self.assertNotIn('DualSense Edge', text)

if __name__ == '__main__':
    unittest.main()
