export interface GalleryImage {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
}

// No real store photography has been supplied yet — every tile uses the
// branded placeholder until actual shop photos are added here.
const PLACEHOLDER = '/product-placeholder.svg'

// Image 1 is always the Store Front hero — first in array, dominant in all layouts.
export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    title: 'Our Store',
    description: 'JJ Signature in Tirunelveli',
    image: PLACEHOLDER,
    tags: ['store', 'front', 'boutique'],
  },
  {
    id: 2,
    title: 'Tailoring Section',
    description: 'Custom stitching for blouses, suits, and gowns',
    image: PLACEHOLDER,
    tags: ['tailoring', 'stitching'],
  },
  {
    id: 3,
    title: 'Bridal & Festive Wear',
    description: 'Lehengas and Aari work blouses for weddings and festivals',
    image: PLACEHOLDER,
    tags: ['bridal', 'festive'],
  },
  {
    id: 4,
    title: 'Saree Collection',
    description: 'Readymade sarees and pre-pleating services',
    image: PLACEHOLDER,
    tags: ['sarees', 'collection'],
  },
  {
    id: 5,
    title: 'Fabric Selection',
    description: 'Cotton, silk cotton, and silk fabrics by the metre',
    image: PLACEHOLDER,
    tags: ['fabric', 'material'],
  },
  {
    id: 6,
    title: 'Nighty Collection',
    description: 'Comfortable readymade nighties in a range of styles',
    image: PLACEHOLDER,
    tags: ['nighty', 'readymade'],
  },
  {
    id: 7,
    title: 'Kids Wear',
    description: 'Pavadai sattai and gowns tailored for children',
    image: PLACEHOLDER,
    tags: ['kids', 'wear'],
  },
  {
    id: 8,
    title: 'Punjabi Suits',
    description: 'With and without lining, stitched to your measurements',
    image: PLACEHOLDER,
    tags: ['suits', 'tailoring'],
  },
  {
    id: 9,
    title: 'Anarkali & Gowns',
    description: 'Elegant Anarkali sets and gowns for every occasion',
    image: PLACEHOLDER,
    tags: ['anarkali', 'gowns'],
  },
  {
    id: 10,
    title: 'Store Interior',
    description: 'A welcoming space where craftsmanship meets quality',
    image: PLACEHOLDER,
    tags: ['store', 'interior'],
  },
  {
    id: 11,
    title: "Men's Wear",
    description: 'Kurtas, Jippas, and tailored pants',
    image: PLACEHOLDER,
    tags: ['mens wear', 'tailoring'],
  },
  {
    id: 12,
    title: 'Finishing Details',
    description: 'Every stitch checked for quality and precision',
    image: PLACEHOLDER,
    tags: ['quality', 'finishing'],
  },
  {
    id: 13,
    title: 'Baju Kurong & Baju Malayu',
    description: 'Traditional wear stitched with care',
    image: PLACEHOLDER,
    tags: ['baju', 'traditional'],
  },
  {
    id: 14,
    title: 'Customer Consultation',
    description: 'Our team helping customers find the perfect fit',
    image: PLACEHOLDER,
    tags: ['staff', 'consultation'],
  },
  {
    id: 15,
    title: 'Aari Work',
    description: 'Intricate Aari embroidery on blouses and lehengas',
    image: PLACEHOLDER,
    tags: ['aari work', 'embroidery'],
  },
  {
    id: 16,
    title: 'Premium Selection',
    description: 'Carefully curated pieces for discerning customers',
    image: PLACEHOLDER,
    tags: ['premium', 'selection'],
  },
  {
    id: 17,
    title: 'Our Craftsmanship',
    description: 'Trusted tailoring and boutique services at JJ Signature',
    image: PLACEHOLDER,
    tags: ['craftsmanship', 'trust'],
  },
]
