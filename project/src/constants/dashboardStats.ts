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

export const membershipStats = [
  { title: "TOTAL MEMBERS", value: "2087", Icon: Users, path:"/total-members" },
  { title: "YEARLY MEMBERS", value: "796", Icon: Clock, path:"/yearly" },
  { title: "HALF YEARLY MEMBERS", value: "372", Icon: UserCheck, path:"/half-yearly" },
  { title: "QUARTERLY MEMBERS", value: "487", Icon: User, path:"/quarterly" },
];

export const activityStats = [
  { title: "MONTHLY MEMBERS", value: "421", Icon: Users, path:"/monthly" },
  { title: "ACTIVE MEMBERS", value: "747", Icon: UserCheck, path:"/members/active" },
  { title: "IN-ACTIVE MEMBERS", value: "1340", Icon: User, path:"/members/inactive" },
  { title: "TODAY ATTENDANCE", value: "1", Icon: Clock, path:"/today/attendance" },
];

export const demographicStats = [
  { title: "MALE MEMBERS", value: "1781", Icon: UserCircle2, path:"/member/male" },
  { title: "TRANSGENDER MEMBERS", value: "0", Icon: UserCog2, path:"/member/transgender" },
  { title: "FEMALE MEMBERS", value: "245", Icon: UserCircle2, path:"/member/female" },
  { title: "AMOUNT COLLECTED", value: "****", Icon: DollarSign, path:"/transaction/all" },
];

export const financialStats = [
  { title: "AMOUNT SPENT", value: "****", Icon: DollarSign, path:"/expense" },
  { title: "TOTAL AMOUNT PENDING", value: "₹6,16,549", Icon: Users2, path:"/pending" },
  { title: "MEMBERSHIP EXPIRING FOLLOW UP", value: "0", Icon: Users, path:"/followup" },
  { title: "MEMBER WITH ADDON / PT", value: "0", Icon: Users, path:"/apt" },
];