// Tattoo catalog with exact estimated durations in hours

export const TATTOO_CATALOG = [
  // 1-Hour Tattoos
  { id: 'small-tattoo', name: 'Small Tattoo', durationHours: 1, category: 'Small & Fine' },
  { id: 'minimalist-tattoo', name: 'Minimalist Tattoo', durationHours: 1, category: 'Small & Fine' },
  { id: 'fine-line-tattoo', name: 'Fine Line Tattoo', durationHours: 1, category: 'Small & Fine' },
  { id: 'lettering-name', name: 'Lettering / Name', durationHours: 1, category: 'Lettering' },
  { id: 'small-symbol', name: 'Small Symbol', durationHours: 1, category: 'Small & Fine' },

  // 2-Hour Tattoos
  { id: 'traditional-tattoo', name: 'Traditional Tattoo', durationHours: 2, category: 'Artistic Styles' },
  { id: 'blackwork-tattoo', name: 'Blackwork Tattoo', durationHours: 2, category: 'Artistic Styles' },
  { id: 'dotwork-tattoo', name: 'Dotwork Tattoo', durationHours: 2, category: 'Geometric & Pattern' },
  { id: 'geometric-tattoo', name: 'Geometric Tattoo', durationHours: 2, category: 'Geometric & Pattern' },
  { id: 'mandala-tattoo', name: 'Mandala Tattoo', durationHours: 2, category: 'Geometric & Pattern' },
  { id: 'ornamental-tattoo', name: 'Ornamental Tattoo', durationHours: 2, category: 'Decorative' },
  { id: 'watercolor-tattoo', name: 'Watercolor Tattoo', durationHours: 2, category: 'Color & Illustrative' },
  { id: 'anime-tattoo', name: 'Anime Tattoo', durationHours: 2, category: 'Illustrative' },

  // 3-Hour Tattoos
  { id: 'neo-traditional-tattoo', name: 'Neo-Traditional Tattoo', durationHours: 3, category: 'Artistic Styles' },
  { id: 'realism-tattoo', name: 'Realism Tattoo', durationHours: 3, category: 'Realism' },
  { id: 'portrait-tattoo', name: 'Portrait Tattoo', durationHours: 3, category: 'Realism' },
  { id: 'black-grey-tattoo', name: 'Black & Grey Tattoo', durationHours: 3, category: 'Artistic Styles' },
  { id: 'japanese-tattoo', name: 'Japanese Tattoo', durationHours: 3, category: 'Cultural Styles' },
  { id: 'custom-tattoo', name: 'Custom Tattoo', durationHours: 3, category: 'Custom Work' },
  { id: 'cover-up-tattoo', name: 'Cover-Up Tattoo', durationHours: 3, category: 'Specialized' }
];

export const getTattooByName = (name) => {
  if (!name) return null;
  return TATTOO_CATALOG.find(t => t.name.toLowerCase() === name.trim().toLowerCase()) || null;
};
