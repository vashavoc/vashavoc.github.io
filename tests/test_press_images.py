from pathlib import Path
import unittest
from test_preview import PageParser

ROOT = Path(__file__).resolve().parents[1]

class PressImageTests(unittest.TestCase):
    def test_both_press_images_are_local_accessible_and_consistent(self):
        for filename in ('index.html', 'preview.html'):
            with self.subTest(page=filename):
                page = PageParser((ROOT / filename).read_text())
                for image_name in ('MW4_MP_003_BRANDED.webp', 'MW4_CAM_010_BRANDED.webp'):
                    images = [a for tag, a in page.elements if tag == 'img' and a.get('src') == 'assets/images/' + image_name]
                    self.assertEqual(len(images), 1, image_name)
                    image = images[0]
                    self.assertTrue(image.get('alt'))
                    self.assertEqual((image.get('width'), image.get('height')), ('1920', '1080'))
                    asset = ROOT / image['src']
                    self.assertTrue(asset.is_file())
                    self.assertLess(asset.stat().st_size, 700_000)
                photos = [a.get('src') for tag, a in page.elements if tag == 'img']
                self.assertIn('assets/images/image02.jpg', photos, 'Keep VAS’s personal photo')

    def test_hero_blend_restores_original_portrait_on_both_pages(self):
        for filename in ('index.html', 'preview.html'):
            with self.subTest(page=filename):
                page = PageParser((ROOT / filename).read_text())
                portraits = [a for tag, a in page.elements if tag == 'img' and 'stream-portrait' in a.get('class', '').split()]
                self.assertEqual(len(portraits), 1, 'Original hero portrait must be layered with the MW4 poster')
                portrait = portraits[0]
                self.assertEqual(portrait.get('src'), 'assets/images/image05.jpg')
                self.assertTrue(portrait.get('alt'))
                self.assertEqual((portrait.get('width'), portrait.get('height')), ('1200', '675'))
                self.assertTrue(any(tag == 'div' and a.get('class') == 'stream-art' for tag, a in page.elements))

if __name__ == '__main__':
    unittest.main()
