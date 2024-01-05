import React, { 
  useState, 
  useEffect 
} from "react"

import { 
  DashboardCardProps, 
  DashboardSales 
} from "../../utils/types"

import Loader from "../../utils/Loader"
import 'chart.js/auto'
import { Line } from "react-chartjs-2"
import { formatDate } from "../../utils"
import { getDashboardData } from "../../api"

const Card: React.FC<DashboardCardProps> = ({ title, value, bgColor }) => {
  return (
    <div className={`p-4 rounded-md shadow ${bgColor}`}>
      <div className="text-white text-sm font-semibold mb-2">{title}</div>
      <div className="text-white text-2xl font-bold">{value}</div>
    </div>
  )
}

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [fulfilledOrders, setFulfilledOrders] = useState<number | 0>(0)
  const [cancelledOrders, setCancelledOrders] = useState<number | 0>(0)
  const [totalRevenue, setTotalRevenue] = useState<number | 0>(0)
  const [activeUsers, setActiveUsers] = useState<number | 0>(0)
  const [sales, setSales] = useState<DashboardSales[] | null>([])

  const chartData = {
    labels: sales?.map((sale: DashboardSales) => formatDate(sale.year_month)),
    datasets: [
      {
        label: "Sales",
        data: sales?.map((sale: DashboardSales) => sale.total_sales),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }
  
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      const { data } = await getDashboardData()
      if (data) {
        setFulfilledOrders(data.total_fulfilled_orders)
        setCancelledOrders(data.total_cancelled_orders)
        setTotalRevenue(data.total_revenue)
        setActiveUsers(data.total_active_users)
        setSales(data.sales)
      }
      setLoading(false)
    }

    loadDashboardData()
  }, [])

  if(loading) return <Loader className='flex flex-col justify-center items-center h-screen' />

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Fulfilled Orders" value={fulfilledOrders} bgColor="bg-green-500" />
        <Card title="Cancelled Orders" value={cancelledOrders} bgColor="bg-red-500" />
        <Card title="Yearly Revenue" value={'$' + totalRevenue} bgColor="bg-blue-500" />
        <Card title="Active Users" value={activeUsers} bgColor="bg-indigo-500" />
      </div>
      <div className="mt-8 bg-white p-6 rounded-md shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Monthly Sales</h3>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default Dashboard