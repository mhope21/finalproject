import React, { useEffect, useState } from 'react';
import DashboardCard from './DashboardCard'; 
import { API_URL } from '../constants';

const DashCardSet = () => {
  const [userCount, setUserCount] = useState(0);
  const [kitRequestCount, setKitRequestCount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const dashUrl = `${API_URL}/admin_dashboard`

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(dashUrl,  {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`, 
              'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
          const data = await response.json();
          setUserCount(data.users_count);
          setKitRequestCount(data.kit_requests_count);
          setTotalDonations(parseFloat(data.total_donations));
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="row h-100">
      <div className="col-md-4 mb-3">
        <DashboardCard title="Total # of Registered Users" value={userCount} color="success" />
      </div>
      <div className="col-md-4 mb-3">
        <DashboardCard title="Total # of Kit Requests" value={kitRequestCount} color="info" />
      </div>
      <div className="col-md-4 mb-3">
        <DashboardCard title="Total Donations" value={`$${totalDonations.toFixed(2)}`} color="warning" />
      </div>
    </div>
  );
};

export default DashCardSet;