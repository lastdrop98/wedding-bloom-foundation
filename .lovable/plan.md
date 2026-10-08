# Emerald signature invitation refinement

## Scope
Refine only the existing Limintso/Emerald signature template using the repository’s dedicated signature layout and Premium Emerald styling as the reference. Preserve the protected admin, database schema, commercial flow, and other invitation templates.

## Implementation
- Make the published invitation and its preview render the same signature implementation, with clearly labelled fictional preview data and no preview writes.
- Match the reference’s typography, paper/champagne palette, portrait cover and video treatment, stacked cards, spacing, buttons, and bottom navigation.
- Keep navigation inside each preview’s scroll area; support the same menu, gallery, RSVP controls, and animations in both presentations.
- Preserve real RSVP submission and personal guest links, guestbook, gifts and QR codes, gallery/video, music, and map links.
- Correct existing syntax/type blockers that prevent the preview from running, without redesigning unrelated pages.

## Verification
Check the automatic build/type results and test desktop/mobile preview navigation, gallery, forms, and cover rendering. Verify a real published invitation where available; explicitly report any live-data checks that cannot be completed.

## Technical details
Use `LimintsoSignatureHome` as the shared renderer and `SignaturePreview` as a data-only adapter. Keep preview submissions local and scope reference styling to the signature template. No schema changes or new dependencies.