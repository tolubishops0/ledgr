

export type UserStatus = "active" | "suspended";
export type TransactionType = "income" | "expense";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  is_admin: boolean;
  status: UserStatus;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category_id: string;
  category?: Category;
  description: string | null;
  date: string;
  created_at: string;
};

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  category?: Category;
  amount: number;
  month: string;
  created_at: string;
};

export type OnboardingData = {
  monthly_income: number;
  budgets: { category_id: string; amount: number }[];
};


export type Tab = "profile" | "security" | "appearance";
export type AdminTab = "profile" | "appearance";


export type Filters = {
  search: string;
  type: "all" | TransactionType;
  category: string;
  fromDate: string;
  toDate: string;
};


