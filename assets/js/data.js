/*
  Site content that changes often: events, testimonials and gallery photos.
  Edit this file to update the calendar, the testimonial carousel and the
  gallery. No other file needs to change.

  Dates are "YYYY-MM-DD", times are 24-hour "HH:MM" (India Standard Time).
*/
window.SSMSM = {
  phone: '+91 95792 25298',
  tel: '+919579225298',
  whatsapp: '919579225298',

  /* Event categories: label, colour token and icon shown in the calendar */
  categories: {
    blood:       { label: 'Blood donation', color: 'var(--cat-blood)',       icon: 'droplet' },
    raddi:       { label: 'Raddi Daan',     color: 'var(--cat-raddi)',       icon: 'newspaper' },
    festival:    { label: 'Festivals',      color: 'var(--cat-festival)',    icon: 'diya' },
    care:        { label: 'Care & health',  color: 'var(--cat-care)',        icon: 'heart' },
    recognition: { label: 'Recognition',    color: 'var(--cat-recognition)', icon: 'award' }
  },

  /*
    Events.
    Entries marked `sample: true` are a placeholder schedule written for this
    build. Replace them with the Mandal's confirmed dates before going live.
    Entries without that flag come from the current website (awards) or from
    the dates printed on the gallery photos.
  */
  events: [
    { id: 'snehsavali-visit-2026-03', date: '2026-03-24', category: 'care',
      title: 'Volunteers’ day at Snehsavali',
      place: 'Snehsavali – Aapla Ghar, Charholi',
      desc: 'Volunteers spent the day with the residents of Snehsavali – Aapla Ghar.' },
    { id: 'rotary-award-2026', date: '2026-07-22', category: 'recognition',
      title: 'Rotary Vocational Service Award',
      place: 'Rotary Club of Nigdi, Pune',
      desc: 'The Rotary Club of Nigdi honoured our founders with the Vocational Service Award, a second time after 2023.' },
    { id: 'murti-2026', date: '2026-09-04', category: 'festival',
      title: 'Murti Amchi Kimmat Tumchi 2026: idol display',
      place: 'Chinchwad, Pune',
      desc: 'Eco-friendly Shadu Mati Ganesh idols on display. Devotees chose an idol and contributed an amount of their choice.' },
    { id: 'blood-2026-09-06', date: '2026-09-06', category: 'blood',
      title: 'Voluntary blood donation camp',
      place: 'Chinchwad, Pune',
      desc: 'Blood donation camp held during the Murti Amchi Kimmat Tumchi festival.' },

    { id: 'blood-2026-10-04', date: '2026-10-04', time: '09:00', endTime: '14:00', category: 'blood', sample: true,
      title: 'Voluntary blood donation camp',
      place: 'Chafekar Chowk, Chinchwad',
      desc: 'Walk in between 9 AM and 2 PM. Please eat a light meal before you donate.' },
    { id: 'raddi-2026-10-11', date: '2026-10-11', time: '08:00', endTime: '12:00', category: 'raddi', sample: true,
      title: 'Raddi & Bhangar Daan collection drive',
      place: 'Chinchwad Gaon',
      desc: 'Door-to-door collection of old newspapers and scrap for Snehsavali.' },
    { id: 'raddi-2026-10-25', date: '2026-10-25', time: '08:00', endTime: '12:00', category: 'raddi', sample: true,
      title: 'Raddi & Bhangar Daan collection drive',
      place: 'Pimpri and Chinchwad',
      desc: 'Keep your old newspapers, books and scrap ready. Message us on WhatsApp to add your address to the pickup route.' },
    { id: 'blood-2026-11-01', date: '2026-11-01', time: '09:00', endTime: '14:00', category: 'blood', sample: true,
      title: 'Voluntary blood donation camp',
      place: 'Chafekar Chowk, Chinchwad',
      desc: 'Every unit of blood can help save a life. Donors receive a certificate and refreshments.' },
    { id: 'diwali-2026', date: '2026-11-08', time: '17:00', endTime: '20:00', category: 'festival', sample: true,
      title: 'Diwali with Snehsavali residents',
      place: 'Snehsavali – Aapla Ghar, Charholi',
      desc: 'Celebrate Diwali with our residents: diyas, rangoli and faral. Families and volunteers are welcome.' },
    { id: 'health-2026-11-15', date: '2026-11-15', time: '10:00', endTime: '13:00', category: 'care', sample: true,
      title: 'Health check-up for senior citizens',
      place: 'Snehsavali – Aapla Ghar, Charholi',
      desc: 'Free general health and eye check-up for residents and senior citizens from nearby villages.' },
    { id: 'raddi-2026-11-22', date: '2026-11-22', time: '08:00', endTime: '12:00', category: 'raddi', sample: true,
      title: 'Raddi & Bhangar Daan collection drive',
      place: 'Akurdi and Nigdi',
      desc: 'Monthly collection drive. Your old newspapers help cover the running costs of the home.' },
    { id: 'blood-2026-12-06', date: '2026-12-06', time: '09:00', endTime: '14:00', category: 'blood', sample: true,
      title: 'Voluntary blood donation camp',
      place: 'Pimpri, Pune',
      desc: 'Open to all healthy adults aged 18 to 65.' },
    { id: 'volunteer-2026-12-13', date: '2026-12-13', time: '17:00', endTime: '18:30', category: 'care', sample: true,
      title: 'New volunteer orientation',
      place: 'Vaidya Pathology Laboratory, Chinchwad',
      desc: 'Meet the team and learn how you can help at Snehsavali, blood camps and Raddi Daan drives.' },
    { id: 'raddi-2026-12-27', date: '2026-12-27', time: '08:00', endTime: '12:00', category: 'raddi', sample: true,
      title: 'Raddi & Bhangar Daan collection drive',
      place: 'Chinchwad Gaon',
      desc: 'Last collection drive of the year.' },
    { id: 'sankranti-2027', date: '2027-01-14', time: '16:00', endTime: '19:00', category: 'festival', sample: true,
      title: 'Makar Sankranti with our residents',
      place: 'Snehsavali – Aapla Ghar, Charholi',
      desc: 'Til-gul, kite flying and an evening together with the residents.' },
    { id: 'raddi-2027-01-24', date: '2027-01-24', time: '08:00', endTime: '12:00', category: 'raddi', sample: true,
      title: 'Raddi & Bhangar Daan collection drive',
      place: 'Pimpri and Chinchwad',
      desc: 'Monthly collection drive.' },
    { id: 'blood-2027-01-26', date: '2027-01-26', time: '09:00', endTime: '14:00', category: 'blood', sample: true,
      title: 'Republic Day blood donation camp',
      place: 'Chafekar Chowk, Chinchwad',
      desc: 'Mark Republic Day with the gift of blood.' }
  ],

  /*
    Testimonials.
    PLACEHOLDERS: the current website has no testimonials, so these were
    written for this build. Replace each one with a real quote, used with the
    person's consent, before the site goes live.
  */
  testimonials: [
    { quote: 'When my mother moved to Snehsavali I worried she would feel alone. Today she calls it her home. The care, the food and the respect she receives are more than we hoped for.',
      name: 'Family of a resident', role: 'Snehsavali – Aapla Ghar', icon: 'home' },
    { quote: 'I have donated blood at the Mandal’s camps for years. They are always well run, and you can feel how much the doctors care about every donor.',
      name: 'Regular blood donor', role: 'Chinchwad', icon: 'droplet' },
    { quote: 'We now keep every newspaper for the Raddi Daan pickup. It costs us nothing and it helps keep a whole home running. Our children have learned what seva means.',
      name: 'Raddi Daan supporter', role: 'Pimpri', icon: 'newspaper' },
    { quote: 'Bringing home a Shadu Mati Ganesh from Murti Amchi Kimmat Tumchi is now our family tradition. We celebrate the eco-friendly way and know our contribution helps the elders.',
      name: 'Devotee and donor', role: 'Murti Amchi Kimmat Tumchi', icon: 'leaf' },
    { quote: 'Volunteering during the Ganesh festival showed me what quiet, selfless work looks like. Dr. and Mrs. Vaidya work side by side with every volunteer.',
      name: 'Festival volunteer', role: 'Murti Amchi Kimmat Tumchi', icon: 'users' },
    { quote: 'Our team chose the Mandal for its transparency and its direct impact on senior citizens. Every visit to Snehsavali reminds us why.',
      name: 'CSR partner', role: 'Pune', icon: 'heart' }
  ],

  /* Gallery photo categories (filters on the gallery page) */
  galleryCategories: {
    all: 'All photos',
    care: 'Snehsavali',
    murti: 'Murti Amchi Kimmat Tumchi',
    blood: 'Blood donation'
  },

  /*
    Gallery photos. Each file exists in assets/img/photos as
    <file>-800.jpg and <file>-1920.jpg. w and h are the 1920 version's size.
  */
  gallery: [
    { file: 'snehsavali-family', w: 1920, h: 1080, date: '2026-03-24', category: 'care',
      caption: 'Residents and volunteers at Snehsavali – Aapla Ghar',
      alt: 'Elderly residents seated and standing together with volunteers in saffron jackets inside the Snehsavali home' },
    { file: 'blood-donation-camp', w: 1920, h: 1080, date: '2026-09-06', category: 'blood',
      caption: 'Voluntary blood donation camp',
      alt: 'Two donors giving blood in reclining chairs, surrounded by volunteers and a medical technician' },
    { file: 'idol-display', w: 1920, h: 1080, date: '2026-09-04', category: 'murti',
      caption: 'Rows of eco-friendly Ganesh idols on display',
      alt: 'Long tables lined with hundreds of clay Ganesh idols on a colourful carpet' },
    { file: 'murti-volunteers', w: 1920, h: 1080, date: '2025-08-16', category: 'murti',
      caption: 'The volunteer team at Murti Amchi Kimmat Tumchi',
      alt: 'Volunteers in saffron jackets standing in the decorated idol hall beside a garlanded statue' },
    { file: 'eco-ganesh-idol', w: 1080, h: 1920, date: '2025-08-28', category: 'murti',
      caption: 'A Shadu Mati Ganesh idol, painted with natural colours',
      alt: 'A white clay Ganesh idol with a yellow crown, set on a red cloth with a bell and conch' },
    { file: 'ration-donation', w: 1920, h: 1080, date: '2025-03-06', category: 'care',
      caption: 'Food grains and groceries donated for the residents',
      alt: 'Residents standing behind sacks of rice, grains, oil and groceries donated to the home' },
    { file: 'murti-stage', w: 1920, h: 864, date: '2023-09-13', category: 'murti',
      caption: 'The Daan Mandir and stage at Murti Amchi Kimmat Tumchi',
      alt: 'A decorated stage with the Murti Amchi Kimmat Tumchi banner, donation booths and framed portraits with marigold garlands' },
    { file: 'idol-rows', w: 1080, h: 1920, date: '2026-09-04', category: 'murti',
      caption: 'Shadu Mati idols waiting for their families',
      alt: 'Tables of clay Ganesh idols stretching to the back of a large decorated tent' },
    { file: 'murti-volunteers-2', w: 1920, h: 1080, date: '2025-08-16', category: 'murti',
      caption: 'Volunteers and devotees in the idol hall',
      alt: 'A group of volunteers smiling in front of the idol display and a large garlanded statue' },
    { file: 'exhibition-hall', w: 960, h: 1280, date: '2024-08-23', category: 'murti',
      caption: 'Setting up the exhibition hall before the festival',
      alt: 'A long decorated tent with a chandelier and empty tables being prepared for the idol display' }
  ]
};
