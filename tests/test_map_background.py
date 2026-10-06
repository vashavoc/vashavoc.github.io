from pathlib import Path
import unittest
ROOT = Path(__file__).resolve().parents[1]
class MapBackgroundTest(unittest.TestCase):
    def test_map_asset_and_subtle_background(self):
        self.assertTrue((ROOT / 'assets/images/dmz-hajin-map.webp').exists())
        css = (ROOT / 'assets/css/streaming.css').read_text()
        self.assertIn('dmz-hajin-map.webp', css)
        self.assertIn('pointer-events: none', css)
        self.assertIn('--map-opacity:', css)
if __name__ == '__main__':
    unittest.main()
