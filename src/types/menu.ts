export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

export const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Drinks', 'Desserts'];

// Mock Data
export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description: 'Angus beef patty with cheddar, lettuce, tomato, and house sauce.',
    price: 12.99,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: '2',
    name: 'Double Bacon Blast',
    description: 'Two patties, crispy bacon, onion rings, and BBQ sauce.',
    price: 16.50,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Fresh basil, mozzarella, and san marzano tomato sauce.',
    price: 14.00,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: '4',
    name: 'Pepperoni Feast',
    description: 'Loaded with double pepperoni and extra cheese.',
    price: 16.00,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
  {
    id: '5',
    name: 'Strawberry Milkshake',
    description: 'Real strawberries, vanilla ice cream, and whipped cream.',
    price: 6.50,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    available: true,
  },
];
