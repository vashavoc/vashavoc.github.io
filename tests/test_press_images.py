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
                self.assertEqual(photos.count('assets/images/vas-setup.webp'), 1, 'Keep setup photo only in the About section')

    def test_hero_rotates_through_four_remaining_portraits_on_both_pages(self):
        expected = ['vas-shirt.webp', 'vas-purple-room.webp', 'vas-outdoors.webp', 'vas-red-hoodie.webp']
        for filename in ('index.html', 'preview.html'):
            with self.subTest(page=filename):
                text = (ROOT / filename).read_text()
                page = PageParser(text)
                portraits = [a for tag, a in page.elements if tag == 'img' and 'stream-portrait' in a.get('class', '').split()]
                self.assertEqual([a.get('src') for a in portraits], ['assets/images/' + name for name in expected])
                self.assertIn('is-current', portraits[0].get('class', '').split())
                self.assertIn('Photo 1 / 4', text)
                for index, portrait in enumerate(portraits):
                    self.assertTrue(portrait.get('alt'))
                    self.assertEqual(portrait.get('aria-hidden'), 'false' if index == 0 else 'true')
                    self.assertIn('width', portrait)
                    self.assertIn('height', portrait)
                    self.assertLess((ROOT / portrait['src']).stat().st_size, 200_000)
                ids = {a.get('id'): a for tag, a in page.elements}
                for control in ('portrait-previous', 'portrait-next', 'portrait-toggle'):
                    self.assertEqual(ids[control].get('type'), 'button')
                self.assertIn('hidden', ids['portrait-controls'], 'No dead controls without JavaScript')
                self.assertIn('assets/js/portraits.js', text)
                self.assertNotIn('photoslibrary', text)
                self.assertTrue(any(tag == 'div' and a.get('class') == 'stream-art' for tag, a in page.elements))

if __name__ == '__main__':
    unittest.main()
