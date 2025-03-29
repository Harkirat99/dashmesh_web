
import Header from "@/components/Header";
import Stats from "@/components/modules/dashboard/Stats";
import { AppDispatch, RootState } from "@/store/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getStats } from "@/store/slices/dashboardSlice";
import DateSelector from "@/components/modules/dashboard/DateSelector";
import SalesAreaChart from "@/components/modules/dashboard/charts/SalesAreaChart";
import PaidDueChart from "@/components/modules/dashboard/charts/PaidDueChart";
import DataChart from "@/components/modules/dashboard/charts/DataChart";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState(Date.now());
  const [endDate, setEndDate] = useState(Date.now());
  const { stats, loading } = useSelector((state: RootState) => state.customer);
  
  useEffect(() => {
    dispatch(getStats({startDate, endDate}));
  }, []);
  
  return(
    <>
      <Header title="Dashboard" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <DateSelector />
           
          </div>
        </div>
        <Stats data={stats}/>
        <div className="grid gap-4">
         <SalesAreaChart />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
         <PaidDueChart />
         <DataChart />
        </div>
      </div>
    </>
  )
}

export default Dashboard;
