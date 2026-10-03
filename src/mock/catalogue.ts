export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: string;
  colour: string;
  colourHex: string;
  availableColours: { name: string; hex: string; slug: string }[];
  sizes: string[];
  pricePence: number;
  stock: number;
  description: string;
  details: string[];
  materials: string;
  fit: string;
  deliveryAndReturns: string;
  images: string[];
}

export const CATALOGUE: Product[] = [
  {
    id: 'prod_1',
    sku: 'LR-OS-001',
    slug: 'wool-overshirt-slate',
    name: 'Wool Overshirt',
    category: 'Outerwear',
    colour: 'Slate',
    colourHex: '#52595D',
    availableColours: [
      { name: 'Slate', hex: '#52595D', slug: 'wool-overshirt-slate' },
      { name: 'Sand', hex: '#C2B69D', slug: 'wool-overshirt-sand' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    pricePence: 14800,
    stock: 14,
    description: 'Heavy Portuguese wool, boxy through the shoulder, lined at the yoke. Cut for relaxed layering with horn buttons.',
    details: [
      'Heavyweight 420gsm melton wool woven in Covilhã, Portugal',
      'Curved hem with reinforced split side gussets',
      'Natural corozo nut buttons dyed to match',
      'Dry clean only or delicate cold hand wash',
    ],
    materials: '100% Portuguese Wool (420gsm). Yoke lining: 100% Cupro.',
    fit: 'Relaxed, boxy fit through chest and body. Fits true to size for layering over knitwear.',
    deliveryAndReturns: 'Complimentary UK standard delivery (3-5 working days). 30-day returns on unworn pieces.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_2',
    sku: 'LR-OS-002',
    slug: 'wool-overshirt-sand',
    name: 'Wool Overshirt',
    category: 'Outerwear',
    colour: 'Sand',
    colourHex: '#C2B69D',
    availableColours: [
      { name: 'Slate', hex: '#52595D', slug: 'wool-overshirt-slate' },
      { name: 'Sand', hex: '#C2B69D', slug: 'wool-overshirt-sand' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    pricePence: 14800,
    stock: 3, // Low stock demo
    description: 'Warm sandy melton wool, tailored collar and twin chest patch pockets. A tactile staple for mid-season wear.',
    details: [
      'Warm sand hue inspired by unbleached linen textures',
      'Double needle topstitching throughout',
      'Concealed placket with matte horn hardware',
      'Woven in small batches in northern Portugal',
    ],
    materials: '100% Virgin Wool (420gsm). Cupro trim.',
    fit: 'Cut generously for wearing over fine knits. Model is 6ft 1in wearing size Medium.',
    deliveryAndReturns: 'Complimentary UK standard delivery. Dispatched within 24 hours from Bristol, UK.',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_3',
    sku: 'LR-TR-010',
    slug: 'pleated-trouser-ink',
    name: 'Pleated Trouser',
    category: 'Trousers',
    colour: 'Ink',
    colourHex: '#1E2328',
    availableColours: [
      { name: 'Ink', hex: '#1E2328', slug: 'pleated-trouser-ink' },
      { name: 'Stone', hex: '#BEB8AC', slug: 'pleated-trouser-stone' },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    pricePence: 12800,
    stock: 22,
    description: 'Deep single forward pleat with a gently tapered leg. Woven from high-twist wool twill with natural crease recovery.',
    details: [
      'High-twist 310gsm wool twill with natural drape',
      'Extended tab waistband with concealed hook and bar',
      'Internal curtain waistband for all-day comfort',
    ],
    materials: '98% Wool, 2% Elastane for subtle comfort stretch.',
    fit: 'Mid-to-high rise with room through thigh, tapering to a clean hem opening.',
    deliveryAndReturns: 'Standard 3-5 days delivery. Free returns within 30 days.',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_4',
    sku: 'LR-TR-011',
    slug: 'pleated-trouser-stone',
    name: 'Pleated Trouser',
    category: 'Trousers',
    colour: 'Stone',
    colourHex: '#BEB8AC',
    availableColours: [
      { name: 'Ink', hex: '#1E2328', slug: 'pleated-trouser-ink' },
      { name: 'Stone', hex: '#BEB8AC', slug: 'pleated-trouser-stone' },
    ],
    sizes: ['28', '30', '32', '34', '36'],
    pricePence: 12800,
    stock: 17,
    description: 'Crisp stone wool twill with single front pleats. Elegant structure paired with a relaxed ease.',
    details: [
      'Stone grey hue with subtle heather depth',
      'Deep slanted side pockets and double jetted back pockets',
    ],
    materials: '100% Worsted Wool (290gsm).',
    fit: 'High rise. Sits cleanly on natural waist.',
    deliveryAndReturns: 'Complimentary standard delivery.',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_5',
    sku: 'LR-KN-020',
    slug: 'merino-crewneck-oat',
    name: 'Merino Crewneck',
    category: 'Knitwear',
    colour: 'Oat',
    colourHex: '#D8CEBE',
    availableColours: [
      { name: 'Oat', hex: '#D8CEBE', slug: 'merino-crewneck-oat' },
      { name: 'Forest', hex: '#2A3C30', slug: 'merino-crewneck-forest' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    pricePence: 9600,
    stock: 31,
    description: 'Seamless 7-gauge extrafine merino wool. Knitted in Hawick, Scotland with tubular neckband and rib cuffs.',
    details: [
      '100% Extrafine Australian merino yarn spun in Yorkshire',
      'Fully fashioned raglan shoulder construction',
    ],
    materials: '100% Extrafine Merino Wool.',
    fit: 'Classic regular fit. Knitted with slight ease through chest.',
    deliveryAndReturns: 'Ships next business day from UK warehouse.',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_6',
    sku: 'LR-KN-021',
    slug: 'merino-crewneck-forest',
    name: 'Merino Crewneck',
    category: 'Knitwear',
    colour: 'Forest',
    colourHex: '#2A3C30',
    availableColours: [
      { name: 'Oat', hex: '#D8CEBE', slug: 'merino-crewneck-oat' },
      { name: 'Forest', hex: '#2A3C30', slug: 'merino-crewneck-forest' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    pricePence: 9600,
    stock: 1, // Oversell demo
    description: 'Rich bottle-green merino knit with subtle depth. Spun from super-soft fibres that insulate without weight.',
    details: [
      'Deep forest hue dyed with low-impact botanical dyes',
      'Ribbed collar, cuffs and hem with elastane recovery thread',
      'Only 1 unit remaining in current workshop batch',
    ],
    materials: '100% Extrafine Merino Wool (19.5 micron).',
    fit: 'Standard unisex fit. Take true size.',
    deliveryAndReturns: 'Limited archive run. Dispatched immediately.',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_7',
    sku: 'LR-CT-030',
    slug: 'double-faced-coat-charcoal',
    name: 'Double-faced Coat',
    category: 'Outerwear',
    colour: 'Charcoal',
    colourHex: '#383A3C',
    availableColours: [
      { name: 'Charcoal', hex: '#383A3C', slug: 'double-faced-coat-charcoal' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    pricePence: 42000,
    stock: 6,
    description: 'Unstructured double-faced wool coat with hand-split and hand-stitched seams. Flowing silhouette with storm flap closure.',
    details: [
      'Double-faced 680gsm virgin wool and cashmere blend',
      'Hand-stitched perimeter seams taking 14 hours per coat',
      'Deep raglan sleeves and welt pockets',
    ],
    materials: '90% Virgin Wool, 10% Cashmere.',
    fit: 'Oversized, cocooning silhouette designed to fall below the knee.',
    deliveryAndReturns: 'Dispatched in protective canvas garment bag.',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_8',
    sku: 'LR-SH-040',
    slug: 'poplin-shirt-white',
    name: 'Poplin Shirt',
    category: 'Shirts',
    colour: 'White',
    colourHex: '#FDFDFD',
    availableColours: [
      { name: 'White', hex: '#FDFDFD', slug: 'poplin-shirt-white' },
      { name: 'Blue stripe', hex: '#8BA5B8', slug: 'poplin-shirt-blue-stripe' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    pricePence: 8800,
    stock: 40,
    description: 'Crisp 120-two-ply Egyptian cotton poplin with a relaxed spread collar. Mother-of-pearl buttons and single-needle stitching.',
    details: [
      'Giza 87 long-staple cotton woven in Albini mills, Italy',
      'Clean point collar with removable brass collar stays',
    ],
    materials: '100% Long-Staple Egyptian Cotton (120/2 Poplin).',
    fit: 'Tailored everyday fit. Slightly lengthened body.',
    deliveryAndReturns: 'Ships in 1-2 business days.',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_9',
    sku: 'LR-SH-041',
    slug: 'poplin-shirt-blue-stripe',
    name: 'Poplin Shirt',
    category: 'Shirts',
    colour: 'Blue stripe',
    colourHex: '#8BA5B8',
    availableColours: [
      { name: 'White', hex: '#FDFDFD', slug: 'poplin-shirt-white' },
      { name: 'Blue stripe', hex: '#8BA5B8', slug: 'poplin-shirt-blue-stripe' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    pricePence: 8800,
    stock: 25,
    description: 'Bespoke micro butcher stripe on dense poplin. Versatile under jackets or open over a fine white tee.',
    details: [
      'Woven fine micro-stripe with optic white ground',
      'Genuine Australian mother-of-pearl buttons',
    ],
    materials: '100% Egyptian Cotton.',
    fit: 'Relaxed classic fit.',
    deliveryAndReturns: 'UK standard 3-5 days delivery.',
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_10',
    sku: 'LR-SK-050',
    slug: 'bias-midi-skirt-clay',
    name: 'Bias Midi Skirt',
    category: 'Skirts',
    colour: 'Clay',
    colourHex: '#B5654A',
    availableColours: [
      { name: 'Clay', hex: '#B5654A', slug: 'bias-midi-skirt-clay' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    pricePence: 11200,
    stock: 12,
    description: 'Cut on the true bias from heavy sandwashed silk-viscose. Skims the hips and flares gently towards a fluid midi hem.',
    details: [
      'Heavy 220gsm sandwashed satin with matte luster',
      'Enclosed elasticated waistband that sits flat on hip',
    ],
    materials: '60% Cupro, 40% Viscose (Sandwashed).',
    fit: 'True bias cut contours naturally to the body.',
    deliveryAndReturns: 'Complimentary UK standard delivery.',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_11',
    sku: 'LR-DR-060',
    slug: 'linen-wrap-dress-ecru',
    name: 'Linen Wrap Dress',
    category: 'Dresses',
    colour: 'Ecru',
    colourHex: '#ECE4D6',
    availableColours: [
      { name: 'Ecru', hex: '#ECE4D6', slug: 'linen-wrap-dress-ecru' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    pricePence: 16400,
    stock: 9,
    description: 'Tailored wrap dress cut from Normandy flax linen. Features asymmetric kimono sleeve shaping and internal anchor ties.',
    details: [
      '100% Delave French Flax Linen (230gsm)',
      'Self-tie belt threading through side seam aperture',
    ],
    materials: '100% French Flax Linen.',
    fit: 'Adjustable wrap fit. Sits on natural waist, falls mid-calf.',
    deliveryAndReturns: 'Dispatched within 24 hours.',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'prod_12',
    sku: 'LR-AC-070',
    slug: 'brushed-wool-scarf-moss',
    name: 'Brushed Wool Scarf',
    category: 'Accessories',
    colour: 'Moss',
    colourHex: '#4E5B42',
    availableColours: [
      { name: 'Moss', hex: '#4E5B42', slug: 'brushed-wool-scarf-moss' },
    ],
    sizes: ['One size'],
    pricePence: 6800,
    stock: 18,
    description: 'Generously proportioned scarf woven from pure lambswool and brushed with natural teasels for a lofty, cloud-soft pile.',
    details: [
      'Dimensions: 210cm × 45cm with 8cm twisted fringe',
      'Woven in the Scottish Borders',
    ],
    materials: '100% Brushed Pure Lambswool.',
    fit: 'One size. 210cm length allows double-loop wrap.',
    deliveryAndReturns: 'Complimentary standard delivery in branded gift box.',
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
    ],
  },
];
