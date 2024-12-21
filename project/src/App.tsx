import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import MemberDetails from './components/dashboard/MemberDetails'
import YearlyQuaterlyDetails from './components/dashboard/YearlyQuaterlyDetails'
import ActiveMembers from './components/dashboard/ActiveInactive'
import MemberAttendance from './components/dashboard/TodayAttendance'
import ProfilePage from './components/Header1/ProfilePage';
import AddMember from './components/Header1/AddMember';


const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
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
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/addmember" element={<AddMember />} />


            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
