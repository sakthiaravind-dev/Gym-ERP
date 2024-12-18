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
  { title: "TOTAL MEMBERS", value: "2087", Icon: Users },
  { title: "YEARLY MEMBERS", value: "796", Icon: Clock },
  { title: "HALF YEARLY MEMBERS", value: "372", Icon: UserCheck },
  { title: "QUARTERLY MEMBERS", value: "487", Icon: User },
];

export const activityStats = [
  { title: "MONTHLY MEMBERS", value: "421", Icon: Users },
  { title: "ACTIVE MEMBERS", value: "747", Icon: UserCheck },
  { title: "IN-ACTIVE MEMBERS", value: "1340", Icon: User },
  { title: "TODAY ATTENDANCE", value: "1", Icon: Clock },
];

export const demographicStats = [
  { title: "MALE MEMBERS", value: "1781", Icon: UserCircle2 },
  { title: "TRANSGENDER MEMBERS", value: "0", Icon: UserCog2 },
  { title: "FEMALE MEMBERS", value: "245", Icon: UserCircle2 },
  { title: "AMOUNT COLLECTED", value: "****", Icon: DollarSign },
];

export const financialStats = [
  { title: "AMOUNT SPENT", value: "****", Icon: DollarSign },
  { title: "TOTAL AMOUNT PENDING", value: "₹6,16,549", Icon: Users2 },
  { title: "MEMBERSHIP EXPIRING FOLLOW UP", value: "0", Icon: Users },
  { title: "MEMBER WITH ADDON / PT", value: "0", Icon: Users },
];