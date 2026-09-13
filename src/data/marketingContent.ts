export const featureGroups = [
  { title: 'Image-Based Wardrobe', copy: 'Capture or upload clothing photos. StyleSense identifies useful attributes such as category, color, style, and fabric so your wardrobe takes shape quickly.', points: ['Photo upload and capture', 'Automatic attribute recognition', 'Editable clothing details'] },
  { title: 'Manual Wardrobe', copy: 'Prefer to enter an item yourself? Add it manually or correct any detail that image recognition did not get quite right.', points: ['Manual item entry', 'Flexible categories', 'Easy corrections'] },
  { title: 'Outfit Generator', copy: 'Build coordinated combinations using only items that are available in your personal wardrobe.', points: ['Top, bottom, and footwear combinations', 'Occasion-aware ideas', 'Save and rate outfits'] },
  { title: 'Hybrid Recommendations', copy: 'StyleSense balances what matches your clothes with what it learns from your taste, feedback, and community activity.', points: ['Content-based matching', 'Collaborative learning', 'Feedback and trend signals'] },
  { title: 'Weather & Location', copy: 'Suggestions can respond to temperature, rain, humidity, and the context of where you are going.', points: ['Current weather context', 'Location-aware conditions', 'Situation-appropriate options'] },
  { title: 'Outfit Planner', copy: 'Move from a daily suggestion to a full week of considered choices without constant repetition.', points: ['Daily recommendations', 'Weekly planning', 'Context-aware scheduling'] },
  { title: 'Wear Frequency', copy: 'StyleSense tracks what gets worn and temporarily eases frequently used pieces out of suggestions.', points: ['Wear history', 'Reduced repetition', 'Rediscovery of overlooked items'] },
  { title: 'Size Adaptability', copy: 'Update measurements and fit feedback over time so clothing information stays relevant as your wardrobe and fit change.', points: ['Current size information', 'Fit feedback', 'Adaptive wardrobe relevance'] },
  { title: 'No New Clothes Mode', copy: 'Prioritize creative combinations from what you own before considering another purchase.', points: ['Existing wardrobe first', 'Creative reuse', 'Budget-conscious choices'] },
  { title: 'Community Discovery', copy: 'Browse outfit ideas, react, rate, and share feedback. These interactions can help personalize recommendations.', points: ['Outfit inspiration', 'Ratings and reactions', 'Collaborative signals'] },
];

export const testimonials = [
  { quote: 'I have plenty of clothes, but I still repeat the same outfits. StyleSense helps me see combinations I would have missed.', name: 'Mika R.', context: 'College student', category: 'Students' },
  { quote: 'Planning the night before makes my mornings calmer. I spend less time deciding and feel more put together.', name: 'Paolo D.', context: 'Young professional', category: 'Young Professionals' },
  { quote: 'I like that the first answer is not to shop. It starts with what is already in my closet and helps me use it better.', name: 'Ana L.', context: 'Budget-conscious shopper', category: 'Everyday Users' },
  { quote: 'Most of my favorite pieces are from ukay-ukay. Seeing new ways to combine them makes the wardrobe feel fresh again.', name: 'Bea S.', context: 'Second-hand clothing user', category: 'Everyday Users' },
  { quote: 'The weather detail is practical. I can still choose my own outfit, but the suggestions make sense for the day ahead.', name: 'Jamie C.', context: 'College student', category: 'Students' },
  { quote: 'Feedback makes the app feel personal over time. The outfits are gradually closer to what I would actually wear.', name: 'Nico V.', context: 'Young professional', category: 'Young Professionals' },
];

export const faqGroups = [
  { title: 'General', items: [
    ['What is StyleSense?', 'StyleSense is an image-based personal wardrobe and outfit recommendation system. It helps you organize clothes you own and find new ways to wear them.'],
    ['Who is StyleSense for?', 'It is designed for students, young professionals, budget-conscious users, second-hand clothing fans, and anyone who wants more value from their wardrobe.'],
    ['Is StyleSense an online clothing store?', 'No. StyleSense is not an e-commerce app. Its priority is helping you use clothing you already own.'],
  ] },
  { title: 'Wardrobe', items: [
    ['How do I add clothes?', 'Upload an existing image or capture a new photo inside the app, then review the clothing details.'],
    ['Can I manually add clothes?', 'Yes. You can add clothing manually and edit attributes whenever image recognition needs correction.'],
    ['How does image recognition work?', 'The system examines a clothing photo and suggests useful attributes such as type, color, style, and fabric. You stay in control of corrections.'],
  ] },
  { title: 'Recommendations', items: [
    ['How are outfits generated?', 'StyleSense compares compatible clothing attributes, your preferences, context, history, and feedback to rank useful outfit combinations.'],
    ['How does collaborative filtering work?', 'Interactions such as ratings, saves, and community outfit activity help the system learn patterns shared by people with similar taste.'],
    ['How does content-based filtering work?', 'It looks at the characteristics of your own clothes and evaluates which pieces work well together.'],
    ['How does StyleSense use my feedback?', 'Ratings, saves, skips, wear actions, and fit feedback influence which recommendations appear in the future.'],
    ['How does wear frequency affect recommendations?', 'Frequently worn items can be temporarily reduced in suggestions, helping you avoid repetition and rediscover other clothes.'],
    ['How does weather affect recommendations?', 'Temperature, rain, humidity, and other conditions can influence which available items are prioritized.'],
  ] },
  { title: 'Profile & Fit', items: [
    ['Can my size information change?', 'Yes. You can update sizes and measurements as needed.'],
    ['How does StyleSense handle changing body measurements?', 'New measurements and ongoing fit feedback keep outdated clothing information from dominating recommendations.'],
    ['How are clothing fit preferences considered?', 'You can indicate whether items fit well, feel tight, feel loose, or are no longer relevant to your current wardrobe.'],
  ] },
  { title: 'Privacy', items: [
    ['What user information is collected?', 'StyleSense uses the profile, wardrobe, preference, interaction, and contextual information needed to organize clothes and personalize outfits. Final production policies will describe the exact data collected.'],
    ['How is wardrobe data handled?', 'Wardrobe information is intended for your personalized experience. Community sharing is optional and separate from your private wardrobe.'],
  ] },
];
