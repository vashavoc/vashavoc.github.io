from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class SetupPhotoTest(unittest.TestCase):
    def test_photo_preserves_native_aspect_ratio(self):
        css = (ROOT / 'assets/css/streaming.css').read_text()
        self.assertIn('.setup-photo { position: relative; min-height: 0; align-self: start; }', css)
        self.assertIn('.setup-photo img { display: block; width: 100%; height: auto; }', css)
        self.assertNotIn('.setup-photo { height: 240px; }', css)

if __name__ == '__main__':
    unittest.main()
