import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import StaffDetails from './pages/Staff';
import Members from './pages/Members';
import MemberDetails from './components/dashboard/MemberDetails';
import YearlyQuaterlyDetails from './components/dashboard/YearlyQuaterlyDetails';
import ActiveMembers from './components/dashboard/ActiveInactive';
import MemberAttendance from './components/dashboard/TodayAttendance';
import MemberPage from './components/dashboard/gender';
import TransactionComponent from './components/dashboard/TransactionComponent';
import Expense from './components/dashboard/Expense';
import FeePending from './components/dashboard/FeePending';
import MembershipFollowUp from './components/dashboard/MembershipFollowUp';
import MemberAPTDetails from './components/dashboard/MemberAPTDetails';
import ActivePT from './components/dashboard/ActivePT';
import ProfilePage from './components/Header1/ProfilePage';
import AddMember from './components/Header1/AddMember';
import AddTranscation from './components/Header1/AddTransaction';
import AddStaff from './components/Header1/AddStaff';
import AddLead from './components/Header1/AddLead';
import AbsentDetails from './components/dashboard/AbsentDetails';
import MembershipRenewal from './components/dashboard/Renewal';
import PTFeePending from './components/dashboard/PTFeeDetails';
import RenewalForm from './components/Header1/RenewalForm';
import Renewal from './components/Header1/Renewal';
import TaxCalculator from './components/Header1/TaxCalculator';
import SupplementBill from './components/Header1/SupplementBill';
import BillData from './components/Header1/AddBill';
import ExpenseData from './components/Header1/AddExpense';
import DietDetailsPage from './components/Header1/DietDetails';



const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#F1F7F8]">
      
        <Sidebar />
        
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/total-members" element={<MemberDetails />} />
              <Route path="/:members" element={<YearlyQuaterlyDetails />} />
              <Route path="/members/:status" element={<ActiveMembers />} />
              <Route path="/today/attendance" element={<MemberAttendance />} />
              <Route path="/member/:gender" element={<MemberPage />} />
              <Route path="/period/:gender/:period" element={<MemberPage />} />
              <Route path="/transaction/:period" element={<TransactionComponent />} />
              <Route path="/expense" element={<Expense />} />
              <Route path="/pending" element={<FeePending />} />
              <Route path="/followup" element={<MembershipFollowUp />} />
              <Route path="/apt" element={<MemberAPTDetails />} />
              <Route path="/apt/:status" element={<ActivePT />} />
              <Route path="/absent" element={<AbsentDetails />} />
              <Route path="/renewal" element={<MembershipRenewal />} />
              <Route path="/pt/pending" element={<PTFeePending />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/addmember" element={<AddMember />} />
              <Route path="/transaction" element={<AddTranscation />} />
              <Route path="/addstaff" element={<AddStaff />} />
              <Route path="/addlead" element={<AddLead />} />
              <Route path="/renewal" element={<Renewal />} />
              <Route path="/renewalform" element={<RenewalForm />} />
              <Route path="/taxcalculator" element={<TaxCalculator />} />
              <Route path="/supplementbill" element={<SupplementBill />} />
              <Route path="/addbill" element={<BillData />} />
              <Route path="/addexpense" element={<ExpenseData />} />
              <Route path="/dietdetails" element={<DietDetailsPage />} />
              <Route path="/members" element={<Members />} />
              <Route path="/staff" element={<StaffDetails />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;