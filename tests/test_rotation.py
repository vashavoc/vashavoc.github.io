from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class RotationTests(unittest.TestCase):
    def test_dmz_is_in_rotation_on_both_pages(self):
        for name in ('index.html', 'preview.html'):
            with self.subTest(page=name):
                text = (ROOT / name).read_text()
                rotation = text.split('class="rotation shell"', 1)[1].split('</div>', 1)[0]
                for game in ('CALL OF DUTY', 'WARZONE', 'DMZ'):
                    self.assertIn(f'<span>{game}</span>', rotation)

if __name__ == '__main__':
    unittest.main()
