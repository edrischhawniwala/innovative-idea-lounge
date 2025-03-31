
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Eye, EyeOff, Plus, FileText, MoreHorizontal, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Mock portfolio data
const portfolioSummary = {
  totalValue: 52487.34,
  dayChange: 1256.78,
  dayChangePercent: 2.45,
  allTimeProfit: 12345.67,
  allTimeProfitPercent: 30.76
};

const portfolioAllocation = [
  { name: "Bitcoin", value: 35, color: "#F7931A" },
  { name: "Ethereum", value: 25, color: "#627EEA" },
  { name: "Stocks", value: 20, color: "#2D71DA" },
  { name: "Forex", value: 10, color: "#40A69F" },
  { name: "Commodities", value: 5, color: "#FFB119" },
  { name: "Cash", value: 5, color: "#B6B6B6" }
];

const profitHistoryData = [
  { month: "Jan", profit: 2100 },
  { month: "Feb", profit: -850 },
  { month: "Mar", profit: 1350 },
  { month: "Apr", profit: 3200 },
  { month: "May", profit: -1200 },
  { month: "Jun", profit: 2800 },
  { month: "Jul", profit: 3600 },
  { month: "Aug", profit: 1700 },
];

const assets = [
  { 
    id: "btc", 
    name: "Bitcoin", 
    symbol: "BTC", 
    amount: 0.42, 
    price: 38245.67, 
    value: 16063.18, 
    allocation: 30.6, 
    change24h: 2.45,
    profit: 3427.84,
    profitPercent: 27.12
  },
  { 
    id: "eth", 
    name: "Ethereum", 
    symbol: "ETH", 
    amount: 5.2, 
    price: 2567.89, 
    value: 13353.03, 
    allocation: 25.44, 
    change24h: -1.23,
    profit: 2156.32,
    profitPercent: 19.25
  },
  { 
    id: "aapl", 
    name: "Apple Inc.", 
    symbol: "AAPL", 
    amount: 25, 
    price: 182.63, 
    value: 4565.75, 
    allocation: 8.7, 
    change24h: 1.25,
    profit: 975.25,
    profitPercent: 27.15
  },
  { 
    id: "msft", 
    name: "Microsoft", 
    symbol: "MSFT", 
    amount: 10, 
    price: 417.88, 
    value: 4178.8, 
    allocation: 7.96, 
    change24h: 0.75,
    profit: 1278.8,
    profitPercent: 44.12
  },
  { 
    id: "eurusd", 
    name: "EUR/USD", 
    symbol: "EUR/USD", 
    amount: 5000, 
    price: 1.0867, 
    value: 5433.5, 
    allocation: 10.35, 
    change24h: -0.12,
    profit: -156.5,
    profitPercent: -2.8
  },
  { 
    id: "gold", 
    name: "Gold", 
    symbol: "XAU", 
    amount: 2, 
    price: 2315.78, 
    value: 4631.56, 
    allocation: 8.82, 
    change24h: 0.58,
    profit: 631.56,
    profitPercent: 15.8
  },
];

const recentTransactions = [
  { id: "t1", type: "buy", asset: "Bitcoin (BTC)", amount: 0.05, price: 38100.25, value: 1905.01, date: "2023-08-12" },
  { id: "t2", type: "sell", asset: "Ethereum (ETH)", amount: 1.2, price: 2600.75, value: 3120.9, date: "2023-08-10" },
  { id: "t3", type: "buy", asset: "Microsoft (MSFT)", amount: 5, price: 410.50, value: 2052.5, date: "2023-08-05" },
  { id: "t4", type: "buy", asset: "Gold (XAU)", amount: 1, price: 2250.30, value: 2250.3, date: "2023-07-28" },
  { id: "t5", type: "sell", asset: "Apple Inc. (AAPL)", amount: 10, price: 180.75, value: 1807.5, date: "2023-07-20" },
];

export default function Portfolio() {
  const [showValues, setShowValues] = useState(true);
  const [timeframe, setTimeframe] = useState("1M");

  const toggleValueVisibility = () => {
    setShowValues(!showValues);
  };

  const formatCurrency = (value: number) => {
    return showValues ? `$${value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '******';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 container max-w-screen-xl mx-auto p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Portfolio</h1>
              <p className="text-muted-foreground">Track your investments and performance</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={toggleValueVisibility}>
                {showValues ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showValues ? "Hide Values" : "Show Values"}
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>
          
          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm mb-1">Total Portfolio Value</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(portfolioSummary.totalValue)}
                </div>
                <div className={`flex items-center mt-1 text-sm ${portfolioSummary.dayChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {portfolioSummary.dayChangePercent >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>
                    {showValues ? `$${portfolioSummary.dayChange.toLocaleString(undefined, {minimumFractionDigits: 2})}` : '******'} ({portfolioSummary.dayChangePercent}%) Today
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm mb-1">All-Time Profit</div>
                <div className="text-2xl font-bold text-green-500">
                  {formatCurrency(portfolioSummary.allTimeProfit)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {portfolioSummary.allTimeProfitPercent}% Return
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm mb-1">Assets</div>
                <div className="text-2xl font-bold">{assets.length}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  In {Object.keys(assets.reduce((acc: Record<string, boolean>, asset) => {
                    const type = asset.id.includes('btc') || asset.id.includes('eth') ? 'crypto' : 
                                asset.id.includes('usd') ? 'forex' : 'stocks';
                    acc[type] = true;
                    return acc;
                  }, {})).length} asset classes
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm mb-1">Transactions</div>
                <div className="text-2xl font-bold">{recentTransactions.length}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Last 30 days
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Allocation Chart */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {portfolioAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Profit History Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Profit History</CardTitle>
                <Select defaultValue={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1W">1 Week</SelectItem>
                    <SelectItem value="1M">1 Month</SelectItem>
                    <SelectItem value="3M">3 Months</SelectItem>
                    <SelectItem value="1Y">1 Year</SelectItem>
                    <SelectItem value="ALL">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profitHistoryData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                      <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} />
                      <YAxis 
                        tick={{ fill: '#9ca3af' }} 
                        axisLine={{ stroke: '#374151' }} 
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip formatter={(value: number) => [`$${value}`, 'Profit']} />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Assets and Transactions Tabs */}
          <Tabs defaultValue="assets">
            <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-6">
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assets">
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Asset</th>
                        <th className="text-right p-4">Price</th>
                        <th className="text-right p-4">Amount</th>
                        <th className="text-right p-4">Value</th>
                        <th className="text-right p-4">Allocation</th>
                        <th className="text-right p-4">24h Change</th>
                        <th className="text-right p-4">Profit/Loss</th>
                        <th className="text-center p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {assets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-accent/50 transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{asset.name}</p>
                              <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                            </div>
                          </td>
                          <td className="text-right p-4">
                            ${asset.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className="text-right p-4">{asset.amount}</td>
                          <td className="text-right p-4">
                            {formatCurrency(asset.value)}
                          </td>
                          <td className="text-right p-4">
                            {asset.allocation.toFixed(1)}%
                          </td>
                          <td className={`text-right p-4 ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                          </td>
                          <td className={`text-right p-4 ${asset.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {showValues ? `$${asset.profit.toLocaleString(undefined, {minimumFractionDigits: 2})}` : '******'} 
                            <span className="block text-xs">
                              ({asset.profitPercent >= 0 ? '+' : ''}{asset.profitPercent}%)
                            </span>
                          </td>
                          <td className="text-center p-4">
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions">
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Type</th>
                        <th className="text-left p-4">Asset</th>
                        <th className="text-right p-4">Amount</th>
                        <th className="text-right p-4">Price</th>
                        <th className="text-right p-4">Value</th>
                        <th className="text-right p-4">Date</th>
                        <th className="text-center p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-accent/50 transition-colors">
                          <td className="p-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'buy' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                            }`}>
                              {transaction.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4">{transaction.asset}</td>
                          <td className="text-right p-4">{transaction.amount}</td>
                          <td className="text-right p-4">
                            ${transaction.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className="text-right p-4">
                            {formatCurrency(transaction.value)}
                          </td>
                          <td className="text-right p-4">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="text-center p-4">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
