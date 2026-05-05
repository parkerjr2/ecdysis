export type NavLink = { label: string; href: string };

export type Service = {
  label: string;
  iconKey: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export type Testimonial = {
  author: string;
  quote: string;
  rating: number;
  avatar?: string;
};

export type ContactInfo = {
  phone: string;
  email: string;
  address: { line1: string; line2: string };
  hours: { tueSat: string; sunMon: string };
  social: { facebook?: string; instagram?: string };
};
