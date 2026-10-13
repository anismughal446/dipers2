const categoryCopy = {
  fashion: 'Easy to pair with everyday outfits, this pick brings a little extra comfort and color to your child’s day. Browse the details and choose the option that suits your family.',
  gear: 'A practical everyday essential for busy family routines, selected to make outings and daily care feel simpler. Review the product details and find the right fit for your needs.',
  feeding: 'A helpful addition to mealtime routines, made for the little moments shared around the table. Explore the product details and see if it belongs in your family’s essentials.',
  bath: 'A gentle-care staple for your baby’s daily routine, bringing a thoughtful touch to bath and skincare time. Check the product details before adding it to your basket.',
  safety: 'A considered choice for everyday family spaces and routines. Read the product information and choose the item that works for your home.',
  toys: 'A cheerful pick for playtime, discovery, and little everyday adventures. Explore the product details and find a new favorite for your child.',
  diapering: 'A dependable diapering essential for the changing moments that fill every day. Review the product details and keep your nursery routine well stocked.',
  nursery: 'A lovely addition to your little one’s room, chosen to make everyday nursery routines feel more welcoming. Take a closer look at the product details.',
  moms: 'A thoughtful everyday pick for parents and caregivers. Explore the details and find something useful for your family’s day-to-day routine.',
  school: 'Ready for busy school days, this pick helps make getting out the door feel a little easier. Check the product information to see if it suits your child.'
};

export function productDescription(product) {
  const category = String(product.category || '').toLowerCase();
  const copy = categoryCopy[category] || 'A thoughtful pick for little ones and the people who care for them. Explore the product details and find out whether it suits your family’s everyday needs.';
  return `${product.name} is a ${product.category || 'Sproutello'} favorite from ${product.brand || product.vendor || 'our collection'}. ${copy}`;
}

export function productImageUrl(image) {
  if (typeof image !== 'string' || !image.startsWith('/bp/')) return image;
  return `https://babyplanet.pk/${image.slice(4)}`;
}
