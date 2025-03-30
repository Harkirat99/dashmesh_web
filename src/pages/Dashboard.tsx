
import Header from "@/components/Header";
import Stats from "@/components/modules/dashboard/Stats";
import { AppDispatch, RootState } from "@/store/index";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getStats, getOrdersChart } from "@/store/slices/dashboardSlice";
import { getSeasonsDropdown } from "@/store/slices/seasonSlice";
import DateSelector from "@/components/modules/dashboard/DateSelector";
import SalesAreaChart from "@/components/modules/dashboard/charts/SalesAreaChart";
import PaidDueChart from "@/components/modules/dashboard/charts/PaidDueChart";
import DataChart from "@/components/modules/dashboard/charts/DataChart";
import moment from "moment-timezone";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState(moment().subtract(1, "month").toISOString());
  const [endDate, setEndDate] = useState(moment().toISOString());
  const { ordersAreaChart, stats } = useSelector((state: RootState) => state.dashboard);
  const { dropdown } = useSelector((state: RootState) => state.season);

  const handleDateChanged = ({start, end}: any) => {
    if(start)setStartDate(start);
    if(end) setEndDate(end);
  } 

  useEffect(() => { 
    dispatch(getStats({startDate, endDate}));
    dispatch(getOrdersChart({startDate, endDate}));
  }, [startDate, endDate]);
  useEffect(() => {
    dispatch(getSeasonsDropdown({}));
  }, [])
  return(
    <>
      <Header title="Dashboard" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <DateSelector data={dropdown} handleDateChanged={handleDateChanged}/>
           
          </div>
        </div>
        <Stats data={stats}/>
        <div className="grid gap-4">
         <SalesAreaChart entities={ordersAreaChart}/>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
         <PaidDueChart data={stats}/>
         <DataChart />
        </div>
      </div>
    </>
  )
}

export default Dashboard;
