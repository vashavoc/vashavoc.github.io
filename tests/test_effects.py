from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class EffectsTests(unittest.TestCase):
    def test_light_mode_logo_has_permanent_glow(self):
        css = (ROOT / 'assets/css/streaming.css').read_text()
        rule = ':root[data-theme="light"] .brand-logo img {'
        self.assertIn(rule, css)
        body = css.split(rule, 1)[1].split('}', 1)[0]
        self.assertIn('drop-shadow(-3px 0 7px #b994ff80)', body)
        self.assertIn('drop-shadow(3px 0 7px #62d5ee60)', body)

    def test_logo_is_not_recolored_between_themes(self):
        css = (ROOT / 'assets/css/streaming.css').read_text()
        self.assertNotIn('brightness(0)', css)
        self.assertNotIn('--logo-filter', css)

    def test_effects_are_motion_opt_in(self):
        css = (ROOT / 'assets/css/streaming.css').read_text()
        self.assertIn('@media (prefers-reduced-motion: no-preference)', css)
        self.assertIn('.brand-logo:is(:hover, :focus-visible) img', css)
        self.assertIn('.button::before', css)
        self.assertIn('@keyframes section-reveal', css)
        self.assertIn('.section.is-revealed', css)
        self.assertNotIn('.section { opacity: 0', css)
