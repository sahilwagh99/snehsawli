# Shree Shankar Maharaj Seva Mandal, Chinchwad: website

A static rebuild of https://ssmsmchinchwad.ngo/ with every page, photo and the emblem carried over, plus a testimonial carousel, an event calendar, a filterable photo gallery and a WhatsApp contact form.

No build step and no dependencies. Open `index.html` in a browser, or upload the whole folder to any static host.

## Pages

| File | Content |
| --- | --- |
| `index.html` | Hero slider, impact numbers, initiatives, Mamurdi project, testimonials, event calendar, gallery preview, awards, ways to help |
| `about.html` | Snehsavali, Raddi Daan, Murti Amchi Kimmat Tumchi, new home at Mamurdi, Trustees' appeal |
| `founders.html` | Dr. Avinash Vaidya and Dr. Mrs. Manali Vaidya |
| `events.html` | Full event calendar and yearly programmes |
| `gallery.html` | All photos with category filters and a full-screen viewer |
| `awards.html` | Awards timeline |
| `contact.html` | Phone, WhatsApp, map, message form, ways to support |

## Editing content

Events, testimonials and gallery photos all live in `assets/js/data.js`. Edit that file only; the pages pick up the changes.

- **Event**: add an object to `events` with `date` (`YYYY-MM-DD`), optional `time` and `endTime` (24-hour, IST), `category` (`blood`, `raddi`, `festival`, `care`, `recognition`), `title`, `place` and `desc`. Visitors can add any upcoming event to Google Calendar or download it as an `.ics` file.
- **Photo**: save `name-800.jpg` and `name-1920.jpg` in `assets/img/photos/`, then add an entry to `gallery`. Full-resolution originals are kept in `assets/img/original/`.
- **Colours and fonts**: everything is defined in `assets/css/tokens.css`.

## Before going live

- **Testimonials are placeholders.** The old site had none. Replace them with real quotes, used with the person's consent.
- **Upcoming events are a sample schedule.** Events marked `sample: true` in `data.js` need to be replaced with confirmed dates.
- **Donation details.** The old site published no bank or UPI details, so the Donate options point to phone and WhatsApp. Add account details and 80G information if the Mandal wants them online.
- **Social media.** The old site's Facebook, Twitter and Instagram icons linked nowhere, so they were left out. Add them to the footer once real profile links exist.
- **Design system.** The EmergeFlow Design System was not available when this was built. `tokens.css` holds every colour, font, radius and shadow, so its values can be swapped for the EmergeFlow tokens.
