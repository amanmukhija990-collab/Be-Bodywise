export type Category = 'hair' | 'skin' | 'body';

export type Status = 
  | 'too_early' 
  | 'lag_phase' 
  | 'on_track' 
  | 'review_usage' 
  | 'professional_help';

export interface ProductTimeline {
  adjustmentDays: number;
  firstChangeDay: number;
  fullResultDay: number;
}

export interface ProductUsage {
  when: 'AM' | 'PM' | 'Shower' | 'Any';
  frequency: 'Daily' | '2+ a week' | 'Weekly';
  instructions: string;
}

export interface CatalogueProduct {
  id: string;
  slug: string;
  name: string;
  category: Category;
  sizeMl?: number;
  price: number; // ₹ (Selling Price)
  mrp?: number; // ₹ (Original MRP)
  rating?: number; // e.g. 4.8
  reviewCount?: number; // e.g. 1840
  tagline: string;
  image: string;
  actives: string[];
  purposes: string[];
  concerns: string[];
  skinTypes?: string[];
  reactivity: 1 | 2 | 3; // 1 gentle … 3 strong
  timeline: ProductTimeline;
  usage: ProductUsage;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CheckInRecord {
  date: string; // ISO date YYYY-MM-DD
  score: 0 | 1 | 2 | 3 | 4; // 0 Worse, 1 No change, 2 Slight, 3 Noticeable, 4 Significant
  irritation: boolean;
  note?: string;
}

export interface ManualProduct {
  name: string;
  category: Category;
  actives: string[];
  purposes: string[];
}

export interface ShelfItem {
  id: string;
  productId?: string;
  manual?: ManualProduct;
  startDate: string; // ISO date YYYY-MM-DD
  when: string;
  frequency: string;
  instructions?: string;
  logs: string[]; // array of ISO date strings YYYY-MM-DD
  checkIns: CheckInRecord[];
}

export interface MatchAnswers {
  focus: Category[];
  primaryCategory?: 'hair' | 'skin' | 'body' | 'pcos' | 'nutrition';
  primaryGoal?: string;
  skinType?: string;
  concerns: string[];
  severity?: string;
  symptoms?: string[];
  lifestyle?: {
    ageGroup?: string;
    waterIntake?: string;
    sleepHours?: string;
    stressLevel?: string;
    dietType?: string;
  };
  customerName?: string;
  customerType?: string;
  reactivity: string;
  commitment: 'minimal' | 'balanced' | 'complete';
}

export interface UserState {
  profile: {
    firstName: string;
    email: string;
  };
  xp: number;
  streak: number;
  bestStreak: number;
  shelf: ShelfItem[];
  matchAnswers?: MatchAnswers;
  matchResults?: string[]; // catalogue product IDs
  missions: Record<string, string[]>; // date string -> mission IDs
  oneTimeAwards: string[]; // e.g. 'match_done'
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'xp' | 'info';
}
