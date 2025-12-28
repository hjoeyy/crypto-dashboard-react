# 🚀 Crypto Dashboard Project - Step-by-Step Roadmap
## Your Complete Guide to Building a CoinGecko Dashboard

---

## 🎯 **Project Overview**

You're building a **crypto dashboard** that displays cryptocurrency data in a table format, similar to CoinGecko's main page. This project will help you practice React concepts you learned while building your e-commerce app.

**Key Difference from Your E-Commerce Project:**
- Instead of products, you're displaying cryptocurrencies
- Instead of a shopping cart, you're filtering/sorting coins
- Similar patterns: hooks, services, context, React Query

---

## 📋 **Phase-by-Phase Breakdown**

This project is broken into **8 phases**. Complete each phase before moving to the next. Don't skip ahead!

---

## **PHASE 1: Project Setup & Foundation** ⚙️
*Estimated Time: 30-45 minutes*

### **What You're Doing:**
Setting up your project structure, installing dependencies, and creating the basic file structure.

### **Step-by-Step:**

#### **Step 1.1: Create New Project**
```bash
# Navigate to your workspace
cd /Users/bloxx/Desktop/reactcoursehayk

# Create new Vite + React + TypeScript project
npm create vite@latest crypto-dashboard -- --template react-ts

# Navigate into project
cd crypto-dashboard

# Install dependencies
npm install
```

#### **Step 1.2: Install Required Packages**
```bash
# Core dependencies
npm install @tanstack/react-query axios react-router

# UI & Styling
npm install tailwindcss @tailwindcss/vite
npm install recharts  # For charts

# TypeScript types (if needed)
npm install -D @types/react @types/react-dom
```

#### **Step 1.3: Set Up Tailwind CSS**
1. Update `vite.config.ts` to include Tailwind:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

2. Create `src/index.css` and add Tailwind directives:
```css
@import "tailwindcss";
```

#### **Step 1.4: Create Folder Structure**
Create these folders in `src/`:
```
src/
├── components/     (UI components)
├── pages/          (Page components)
├── hooks/          (Custom hooks)
├── services/       (API calls)
├── context/        (Context providers)
├── types/          (TypeScript types)
└── utils/          (Helper functions)
```

**✅ Phase 1 Complete When:**
- Project runs without errors (`npm run dev`)
- All folders are created
- Tailwind CSS is working (test with a colored div)

---

## **PHASE 2: API Setup & Types** 🔌
*Estimated Time: 45-60 minutes*

### **What You're Doing:**
Setting up the API connection to CoinGecko and defining TypeScript types for the data.

### **Step-by-Step:**

#### **Step 2.1: Explore CoinGecko API**
1. Visit: https://www.coingecko.com/en/api/documentation
2. Find the endpoint for getting coins list
3. Test it in your browser or Postman:
   ```
   https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false
   ```

#### **Step 2.2: Create TypeScript Types**
Create `src/types/coin.ts`:
```typescript
// Define the shape of a coin object from the API
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

// Define filter types
export interface CoinFilters {
  priceRange?: {
    min: number;
    max: number;
  };
  marketCapRange?: {
    min: number;
    max: number;
  };
  volumeRange?: {
    min: number;
    max: number;
  };
  showGainers?: boolean;
  showLosers?: boolean;
}

// Define sort options
export type SortField = 'market_cap_rank' | 'name' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume';
export type SortOrder = 'asc' | 'desc';
```

**💡 Tip:** Look at the actual API response to make sure your types match!

#### **Step 2.3: Create HTTP Client**
Create `src/services/httpClient.ts`:
```typescript
import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### **Step 2.4: Create Base Service**
Create `src/services/HttpService.ts`:
```typescript
import { httpClient } from './httpClient';

export class HttpService {
  protected client;

  constructor(client = httpClient) {
    this.client = client;
  }

  async get<T>(url: string, config = {}): Promise<T> {
    try {
      const { data } = await this.client.get<T>(url, config);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}
```

#### **Step 2.5: Create Coin Service**
Create `src/services/CoinService.ts`:
```typescript
import { HttpService } from './HttpService';
import { httpClient } from './httpClient';
import { Coin } from '../types/coin';

export class CoinService extends HttpService {
  constructor() {
    super(httpClient);
  }

  async getCoins(): Promise<Coin[]> {
    return this.get<Coin[]>(
      '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    );
  }
}

export const coinService = new CoinService();
```

**✅ Phase 2 Complete When:**
- Types are defined for Coin data
- HTTP client is set up
- Service can fetch coins (test in browser console or create a simple test)

---

## **PHASE 3: React Query Setup & First Data Fetch** 📡
*Estimated Time: 30-45 minutes*

### **What You're Doing:**
Setting up React Query and creating your first custom hook to fetch coin data.

### **Step-by-Step:**

#### **Step 3.1: Set Up React Query in App**
Update `src/App.tsx`:
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 60 seconds
      refetchInterval: 60000, // Auto-refetch every 60 seconds
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Your app content will go here */}
        <div className="p-4">
          <h1>Crypto Dashboard</h1>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
```

#### **Step 3.2: Create useCoins Hook**
Create `src/hooks/useCoins.ts`:
```typescript
import { useQuery } from '@tanstack/react-query';
import { coinService } from '../services/CoinService';
import { Coin } from '../types/coin';

export const useCoins = () => {
  return useQuery<Coin[]>({
    queryKey: ['coins'],
    queryFn: () => coinService.getCoins(),
    staleTime: 60000, // Data is fresh for 60 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
  });
};
```

#### **Step 3.3: Test the Hook**
Create a simple test component `src/pages/Home.tsx`:
```typescript
import { useCoins } from '../hooks/useCoins';

export default function Home() {
  const { data, isLoading, error } = useCoins();

  if (isLoading) return <div>Loading coins...</div>;
  if (error) return <div>Error loading coins</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <h2>Coins Loaded: {data.length}</h2>
      <pre>{JSON.stringify(data[0], null, 2)}</pre>
    </div>
  );
}
```

Update `App.tsx` to use this component and test it!

**✅ Phase 3 Complete When:**
- React Query is set up
- `useCoins` hook fetches data successfully
- You can see coin data in the browser

---

## **PHASE 4: Build the Table Component** 📊
*Estimated Time: 1-2 hours*

### **What You're Doing:**
Creating the main table that displays all the coins with their data.

### **Step-by-Step:**

#### **Step 4.1: Create Table Component Structure**
Create `src/components/CoinTable.tsx`:
```typescript
import { Coin } from '../types/coin';

interface CoinTableProps {
  coins: Coin[];
  loading?: boolean;
}

export default function CoinTable({ coins, loading }: CoinTableProps) {
  if (loading) {
    return <div>Loading table...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              24h
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              7d
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              24h Volume
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Market Cap
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {coins.map((coin) => (
            <tr key={coin.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {coin.market_cap_rank}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={coin.image}
                    alt={coin.name}
                  />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {coin.name}
                    </div>
                    <div className="text-sm text-gray-500 uppercase">
                      {coin.symbol}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${coin.current_price.toLocaleString()}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                coin.price_change_percentage_24h >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </td>
              {/* Add more columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### **Step 4.2: Add All Required Columns**
Add columns for:
- 7d change (you'll need to calculate or fetch this)
- 24h Volume
- Market Cap
- Last 7 Days chart (using Recharts)

#### **Step 4.3: Style the Table**
Make it look good with Tailwind CSS classes. Reference the CoinGecko design.

#### **Step 4.4: Create CoinRow Component (Optional)**
Break out each row into its own component for better organization:
```typescript
// src/components/CoinRow.tsx
import { Coin } from '../types/coin';

interface CoinRowProps {
  coin: Coin;
}

export default function CoinRow({ coin }: CoinRowProps) {
  // Row content here
}
```

**✅ Phase 4 Complete When:**
- Table displays all coins
- All columns show correct data
- Table is styled and looks good
- Data updates every 60 seconds automatically

---

## **PHASE 5: Implement Filtering** 🔍
*Estimated Time: 1-2 hours*

### **What You're Doing:**
Adding filters so users can filter coins by price, market cap, volume, and gainers/losers.

### **Step-by-Step:**

#### **Step 5.1: Create Filters Component**
Create `src/components/Filters.tsx`:
```typescript
import { CoinFilters } from '../types/coin';

interface FiltersProps {
  filters: CoinFilters;
  onFilterChange: (filters: CoinFilters) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  // Build your filter UI here
  // Price range inputs
  // Market cap range inputs
  // Volume range inputs
  // Gainers/Losers toggle buttons
}
```

#### **Step 5.2: Add Filter State to Main Page**
In your main page component (e.g., `Home.tsx`):
```typescript
import { useState } from 'react';
import { CoinFilters } from '../types/coin';

export default function Home() {
  const [filters, setFilters] = useState<CoinFilters>({});
  const { data, isLoading } = useCoins();

  // Filter logic will go here
}
```

#### **Step 5.3: Implement Filter Logic**
Create a utility function `src/utils/filterCoins.ts`:
```typescript
import { Coin, CoinFilters } from '../types/coin';

export function filterCoins(coins: Coin[], filters: CoinFilters): Coin[] {
  return coins.filter((coin) => {
    // Price range filter
    if (filters.priceRange) {
      if (
        coin.current_price < filters.priceRange.min ||
        coin.current_price > filters.priceRange.max
      ) {
        return false;
      }
    }

    // Market cap filter
    if (filters.marketCapRange) {
      if (
        coin.market_cap < filters.marketCapRange.min ||
        coin.market_cap > filters.marketCapRange.max
      ) {
        return false;
      }
    }

    // Volume filter
    if (filters.volumeRange) {
      if (
        coin.total_volume < filters.volumeRange.min ||
        coin.total_volume > filters.volumeRange.max
      ) {
        return false;
      }
    }

    // Gainers filter
    if (filters.showGainers && coin.price_change_percentage_24h <= 0) {
      return false;
    }

    // Losers filter
    if (filters.showLosers && coin.price_change_percentage_24h >= 0) {
      return false;
    }

    return true;
  });
}
```

#### **Step 5.4: Use useMemo for Performance**
In your main component:
```typescript
import { useMemo } from 'react';
import { filterCoins } from '../utils/filterCoins';

const filteredCoins = useMemo(() => {
  if (!data) return [];
  return filterCoins(data, filters);
}, [data, filters]);
```

**✅ Phase 5 Complete When:**
- All filters work correctly
- Filtered results update when filters change
- Performance is good (using useMemo)

---

## **PHASE 6: Implement Sorting** 🔄
*Estimated Time: 1 hour*

### **What You're Doing:**
Adding sort functionality so users can sort by different columns.

### **Step-by-Step:**

#### **Step 6.1: Add Sort State**
In your main component:
```typescript
import { SortField, SortOrder } from '../types/coin';

const [sortField, setSortField] = useState<SortField>('market_cap_rank');
const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
```

#### **Step 6.2: Create Sort Utility**
Create `src/utils/sortCoins.ts`:
```typescript
import { Coin, SortField, SortOrder } from '../types/coin';

export function sortCoins(
  coins: Coin[],
  field: SortField,
  order: SortOrder
): Coin[] {
  return [...coins].sort((a, b) => {
    let aValue: number | string = a[field];
    let bValue: number | string = b[field];

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle number comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
}
```

#### **Step 6.3: Make Table Headers Clickable**
Update `CoinTable.tsx` to handle clicks:
```typescript
interface CoinTableProps {
  coins: Coin[];
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortOrder: SortOrder;
}

// In the header:
<th
  onClick={() => onSort('current_price')}
  className="cursor-pointer hover:bg-gray-100"
>
  Price
</th>
```

#### **Step 6.4: Combine Filtering and Sorting**
In your main component:
```typescript
const processedCoins = useMemo(() => {
  if (!data) return [];
  const filtered = filterCoins(data, filters);
  return sortCoins(filtered, sortField, sortOrder);
}, [data, filters, sortField, sortOrder]);
```

**✅ Phase 6 Complete When:**
- Clicking column headers sorts the table
- Sort order toggles (asc/desc) on click
- Sorting works with filtering

---

## **PHASE 7: Context API (Theme & Favorites)** 🎨
*Estimated Time: 1-2 hours*

### **What You're Doing:**
Adding dark mode and favorites functionality using Context API.

### **Step-by-Step:**

#### **Step 7.1: Create Theme Context**
Create `src/context/ThemeContext.tsx`:
```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

#### **Step 7.2: Create Favorites Context**
Create `src/context/FavoritesContext.tsx`:
```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[]; // Array of coin IDs
  addFavorite: (coinId: string) => void;
  removeFavorite: (coinId: string) => void;
  isFavorite: (coinId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (coinId: string) => {
    setFavorites((prev) => [...prev, coinId]);
  };

  const removeFavorite = (coinId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== coinId));
  };

  const isFavorite = (coinId: string) => {
    return favorites.includes(coinId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
```

#### **Step 7.3: Wrap App with Providers**
Update `App.tsx`:
```typescript
<QueryClientProvider client={queryClient}>
  <ThemeProvider>
    <FavoritesProvider>
      <BrowserRouter>
        {/* Your app */}
      </BrowserRouter>
    </FavoritesProvider>
  </ThemeProvider>
</QueryClientProvider>
```

#### **Step 7.4: Add Theme Toggle Button**
Create a component or add to header:
```typescript
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

#### **Step 7.5: Add Favorite Button to Table**
In `CoinRow.tsx`:
```typescript
import { useFavorites } from '../context/FavoritesContext';

const { isFavorite, addFavorite, removeFavorite } = useFavorites();

<button onClick={() => 
  isFavorite(coin.id) 
    ? removeFavorite(coin.id) 
    : addFavorite(coin.id)
}>
  {isFavorite(coin.id) ? '⭐' : '☆'}
</button>
```

**✅ Phase 7 Complete When:**
- Dark mode toggle works and persists
- Favorites can be added/removed
- Favorites persist in localStorage
- UI updates when theme/favorites change

---

## **PHASE 8: Polish & Bonus Features** ✨
*Estimated Time: 1-2 hours*

### **What You're Doing:**
Adding final touches, charts, and any remaining features.

### **Step-by-Step:**

#### **Step 8.1: Add 7-Day Sparkline Charts**
Using Recharts, add mini line charts to the table:
```typescript
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// In CoinRow, add a sparkline column
<ResponsiveContainer width={100} height={30}>
  <LineChart data={sparklineData}>
    <Line
      type="monotone"
      dataKey="price"
      stroke={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'}
      strokeWidth={2}
      dot={false}
    />
  </LineChart>
</ResponsiveContainer>
```

**Note:** You'll need to fetch sparkline data from the API. Update your service to include `sparkline=true` in the query.

#### **Step 8.2: Add Loading Skeletons**
Create skeleton components for better UX while loading:
```typescript
export function CoinTableSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Skeleton rows */}
    </div>
  );
}
```

#### **Step 8.3: Add Error Handling**
Improve error states:
```typescript
if (error) {
  return (
    <div className="text-center py-8">
      <p className="text-red-600">Error loading coins</p>
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );
}
```

#### **Step 8.4: Add Search Functionality**
Add a search input to filter by coin name/symbol:
```typescript
const [search, setSearch] = useState('');

const filteredCoins = useMemo(() => {
  if (!data) return [];
  let result = data;
  
  if (search) {
    result = result.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  return filterCoins(result, filters);
}, [data, search, filters]);
```

#### **Step 8.5: Performance Optimization**
- Add `React.memo` to `CoinRow` component
- Use `useCallback` for event handlers
- Ensure `useMemo` is used for expensive calculations

**✅ Phase 8 Complete When:**
- All features work smoothly
- UI looks polished
- Performance is good
- No console errors

---

## 🎯 **Daily Work Plan**

### **Day 1: Setup & Foundation**
- ✅ Complete Phase 1 (Setup)
- ✅ Complete Phase 2 (API & Types)
- ✅ Complete Phase 3 (React Query)

**Goal:** See coin data in the browser

### **Day 2: Core Features**
- ✅ Complete Phase 4 (Table)
- ✅ Complete Phase 5 (Filters)

**Goal:** Table displays coins with working filters

### **Day 3: Sorting & Context**
- ✅ Complete Phase 6 (Sorting)
- ✅ Complete Phase 7 (Context API)

**Goal:** Full table functionality with theme and favorites

### **Day 4: Polish**
- ✅ Complete Phase 8 (Polish & Bonus)
- ✅ Test everything
- ✅ Fix any bugs

**Goal:** Complete, polished project

---

## 🆘 **When You Get Stuck**

### **Common Issues & Solutions:**

1. **"I don't know how to start a phase"**
   - Read the step-by-step instructions
   - Look at your e-commerce project for similar patterns
   - Start with the simplest version, then add complexity

2. **"My API call isn't working"**
   - Check the Network tab in browser DevTools
   - Verify the API URL is correct
   - Check if CoinGecko has rate limits
   - Look at the error message in console

3. **"My filters aren't working"**
   - Console.log your filter state
   - Console.log the filtered results
   - Check if your filter logic is correct
   - Make sure you're using useMemo

4. **"TypeScript errors"**
   - Read the error message carefully
   - Check your type definitions match the API response
   - Use `any` temporarily to unblock, then fix types later

5. **"I don't understand a concept"**
   - Refer back to PROJECT_BREAKDOWN.md
   - Search for the concept online
   - Try building a minimal example first

---

## 📝 **Checklist Before Moving to Next Phase**

Before starting a new phase, make sure:
- [ ] Current phase is working
- [ ] No console errors
- [ ] Code is committed to git
- [ ] You understand what you built
- [ ] You can explain it to someone else

---

## 🎓 **Learning Goals Checklist**

By the end of this project, you should understand:

- [ ] How to set up a React + TypeScript project
- [ ] How to structure a React project (folders, files)
- [ ] How to fetch data with React Query
- [ ] How to create custom hooks
- [ ] How to use Context API for global state
- [ ] How to filter and sort data
- [ ] How to use useMemo and useCallback
- [ ] How to persist data in localStorage
- [ ] How to work with TypeScript types
- [ ] How to build reusable components

---

## 🚀 **Next Steps After Completion**

1. **Add Testing** (if required)
   - Set up Vitest
   - Write tests for components
   - Write tests for hooks
   - Write tests for utilities

2. **Deploy**
   - Deploy to Vercel or Netlify
   - Share your project

3. **Add More Features**
   - Coin detail page
   - Historical price charts
   - Portfolio tracking

---

## 💡 **Remember**

- **Start small:** Get one thing working, then add more
- **Don't skip phases:** Each builds on the previous
- **Test as you go:** Don't wait until the end
- **Ask for help:** When stuck for >30 minutes, ask
- **Take breaks:** Coding for hours isn't productive
- **Celebrate wins:** Each phase complete is progress!

---

**You've got this! Take it one phase at a time. 🎉**

