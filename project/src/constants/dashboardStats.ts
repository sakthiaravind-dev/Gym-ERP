import { 
  Users, 
  Clock, 
  UserCheck, 
  User, 
  UserCircle2, 
  UserCog2,
  DollarSign, 
  Users2 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const fetchData = async (table: string, column: string, filter?: string) => {
  let query = supabase.from(table).select(column);
  if (filter) {
    query = query.eq(column, filter);
  }
  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching ${column} from ${table}:`, error);
    return "NILL";
  }
  return data.length > 0 ? data.length : "NILL";
};

const fetchSum = async (table: string, column: string, castType?: string): Promise<string> => {
  const { data, error } = await supabase.from(table).select(column);
  if (error) {
    console.error(`Error fetching ${column} from ${table}:`, error);
    return "NILL";
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sum = data.reduce((acc, row: { [key: string]: any }) => {
    const value = castType ? parseFloat(row[column]) : parseFloat(row[column]);
    return acc + (isNaN(value) ? 0 : value);
  }, 0);
  return sum.toFixed(2);
};

const fetchTotalAmountCollected = async () => {
  const expensesSum = await fetchSum("expenses", "amount");
  const supplementsSum = await fetchSum("supplements_billing", "amount", "numeric");
  return (parseFloat(expensesSum) + parseFloat(supplementsSum)).toFixed(2);
};

export const membershipStats = [
  { title: "TOTAL MEMBERS", value: await fetchData("members", "member_id"), Icon: Users, path:"/members" },
  { title: "YEARLY MEMBERS", value: await fetchData("members", "member_type", "yearly"), Icon: Clock, path:"/members" },
  { title: "HALF YEARLY MEMBERS", value: await fetchData("members", "member_type", "half_yearly"), Icon: UserCheck, path:"/members" },
  { title: "QUARTERLY MEMBERS", value: await fetchData("members", "member_type", "quarterly"), Icon: User, path:"/members" },
];

export const activityStats = [
  { title: "MONTHLY MEMBERS", value: await fetchData("members", "member_type", "monthly"), Icon: Users, path:"/members" },
  { title: "ACTIVE MEMBERS", value: await fetchData("members", "status", "active"), Icon: UserCheck, path:"/members" },
  { title: "IN-ACTIVE MEMBERS", value: await fetchData("members", "status", "inactive"), Icon: User, path:"/members" },
  { title: "TODAY ATTENDANCE", value: await fetchData("attendance", "date", new Date().toISOString().split('T')[0]), Icon: Clock, path:"/today/attendance" },
];

export const demographicStats = [
  { title: "MALE MEMBERS", value: await fetchData("members", "gender", "male"), Icon: UserCircle2, path:"/member/male" },
  { title: "TRANSGENDER MEMBERS", value: await fetchData("members", "gender", "transgender"), Icon: UserCog2, path:"/member/transgender" },
  { title: "FEMALE MEMBERS", value: await fetchData("members", "gender", "female"), Icon: UserCircle2, path:"/member/female" },
  { title: "AMOUNT COLLECTED", value: await fetchTotalAmountCollected(), Icon: DollarSign, path:"/transaction/all" },
];

export const financialStats = [
  { title: "AMOUNT SPENT", value: await fetchSum("expenses", "amount"), Icon: DollarSign, path:"/expense" },
  { title: "TOTAL AMOUNT PENDING", value: await fetchSum("pending", "total_amount_pending"), Icon: Users2, path:"/pending" },
  { title: "MEMBERSHIP EXPIRING FOLLOW UP", value: await fetchData("followup", "membership_expiring"), Icon: Users, path:"/followup" },
  { title: "MEMBER WITH ADDON / PT", value: await fetchData("members", "addon_pt_count"), Icon: Users, path:"/apt" },
];

export const pendingStats = [
  { title: "CONTINUOUS ABSENT", value: await fetchData("attendance", "continuous_absent"), Icon: Users, path:"/absent" },
  { title: "TODAYS RENEWAL", value: await fetchData("renewals", "start_date", new Date().toISOString().split('T')[0]), Icon: Users, path:"/membership-renewal" },
  { title: "PT PENDING DETAILS", value: await fetchData("pt_pending", "details_count"), Icon: Users, path:"/pt/pending" },
];