
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, Star, TrendingUp, TrendingDown, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Define TypeScript interfaces for our market data
interface BaseMarketItem {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: string;
  chart: any[];
}

interface MarketItemWithCap extends BaseMarketItem {
  marketCap: string;
}

type MarketItemType = BaseMarketItem | MarketItemWithCap;

interface MarketData {
  crypto: MarketItemWithCap[];
  forex: BaseMarketItem[];
  stocks: MarketItemWithCap[];
  commodities: BaseMarketItem[];
  [key: string]: MarketItemType[];
}

// Mock market data for different asset classes
const marketData: MarketData = {
  crypto: [
    { id: "btc", name: "Bitcoin", symbol: "BTC", price: 38245.67, change: 2.45, volume: "52.4B", marketCap: "748.2B", chart: generateChartData(2.45) },
    { id: "eth", name: "Ethereum", symbol: "ETH", price: 2567.89, change: -1.23, volume: "28.7B", marketCap: "309.5B", chart: generateChartData(-1.23) },
    { id: "sol", name: "Solana", symbol: "SOL", price: 108.75, change: 5.67, volume: "5.9B", marketCap: "47.2B", chart: generateChartData(5.67) },
    { id: "bnb", name: "Binance Coin", symbol: "BNB", price: 352.41, change: 0.87, volume: "1.8B", marketCap: "54.3B", chart: generateChartData(0.87) },
    { id: "ada", name: "Cardano", symbol: "ADA", price: 0.459, change: -2.34, volume: "812.5M", marketCap: "16.3B", chart: generateChartData(-2.34) },
  ],
  forex: [
    { id: "eurusd", name: "EUR/USD", symbol: "EUR/USD", price: 1.0867, change: -0.12, volume: "132.5B", chart: generateChartData(-0.12) },
    { id: "gbpusd", name: "GBP/USD", symbol: "GBP/USD", price: 1.2654, change: 0.25, volume: "78.3B", chart: generateChartData(0.25) },
    { id: "usdjpy", name: "USD/JPY", symbol: "USD/JPY", price: 150.23, change: 0.35, volume: "94.7B", chart: generateChartData(0.35) },
    { id: "audusd", name: "AUD/USD", symbol: "AUD/USD", price: 0.6598, change: -0.42, volume: "45.2B", chart: generateChartData(-0.42) },
    { id: "usdcad", name: "USD/CAD", symbol: "USD/CAD", price: 1.3547, change: 0.18, volume: "56.9B", chart: generateChartData(0.18) },
  ],
  stocks: [
    { id: "aapl", name: "Apple Inc.", symbol: "AAPL", price: 182.63, change: 1.25, volume: "58.3M", marketCap: "2.83T", chart: generateChartData(1.25) },
    { id: "msft", name: "Microsoft Corp.", symbol: "MSFT", price: 417.88, change: 0.75, volume: "22.1M", marketCap: "3.1T", chart: generateChartData(0.75) },
    { id: "googl", name: "Alphabet Inc.", symbol: "GOOGL", price: 172.48, change: -0.83, volume: "24.7M", marketCap: "2.15T", chart: generateChartData(-0.83) },
    { id: "amzn", name: "Amazon.com Inc.", symbol: "AMZN", price: 184.29, change: 2.17, volume: "35.8M", marketCap: "1.92T", chart: generateChartData(2.17) },
    { id: "nvda", name: "NVIDIA Corp.", symbol: "NVDA", price: 949.50, change: 3.46, volume: "42.5M", marketCap: "2.34T", chart: generateChartData(3.46) },
  ],
  commodities: [
    { id: "xau", name: "Gold", symbol: "XAU/USD", price: 2315.78, change: 0.58, volume: "87.4B", chart: generateChartData(0.58) },
    { id: "xag", name: "Silver", symbol: "XAG/USD", price: 27.35, change: 1.23, volume: "23.6B", chart: generateChartData(1.23) },
    { id: "cl", name: "Crude Oil", symbol: "CL", price: 72.46, change: -1.85, volume: "156.2B", chart: generateChartData(-1.85) },
    { id: "ng", name: "Natural Gas", symbol: "NG", price: 2.187, change: -0.46, volume: "32.8B", chart: generateChartData(-0.46) },
    { id: "hg", name: "Copper", symbol: "HG", price: 4.062, change: 0.75, volume: "18.5B", chart: generateChartData(0.75) },
  ],
};

// Generate some random chart data based on price change direction
function generateChartData(change: number) {
  const data = [];
  const trendFactor = change > 0 ? 1 : -1;
  let value = 100;
  
  for (let i = 0; i < 24; i++) {
    value += trendFactor * (Math.random() * 3) + Math.random() * 2 - 1;
    data.push({
      time: i,
      value: value,
    });
  }
  
  return data;
}

// Market overview data
const marketOverview = [
  { name: "S&P 500", value: "5,036.12", change: 0.87, status: "up" },
  { name: "Nasdaq", value: "16,256.92", change: 1.35, status: "up" },
  { name: "Dow Jones", value: "37,986.40", change: 0.56, status: "up" },
  { name: "Bitcoin", value: "$38,245.67", change: 2.45, status: "up" },
  { name: "Ethereum", value: "$2,567.89", change: -1.23, status: "down" },
  { name: "Gold", value: "$2,315.78", change: 0.58, status: "up" },
  { name: "Oil (WTI)", value: "$72.46", change: -1.85, status: "down" },
  { name: "USD Index", value: "104.23", change: -0.12, status: "down" },
];

// Function to check if an item has market cap
function hasMarketCap(item: MarketItemType): item is MarketItemWithCap {
  return 'marketCap' in item;
}

export default function Markets() {
  const [activeTab, setActiveTab] = useState("crypto");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = marketData[activeTab as keyof typeof marketData].filter(
    item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 container max-w-screen-xl mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Markets</h1>
              <p className="text-muted-foreground">Track prices and market movements</p>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                className="pl-10 w-full md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Market Overview */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-4 pb-2 min-w-max">
              {marketOverview.map((item) => (
                <Card key={item.name} className="bg-card w-[180px] border shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground">{item.name}</p>
                        <p className="text-xl font-semibold">{item.value}</p>
                      </div>
                      <div className={`flex items-center text-sm ${
                        item.status === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {item.status === 'up' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span>{item.change}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Featured Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Bitcoin (BTC) Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketData.crypto[0].chart}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis dataKey="time" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Market Categories */}
          <Tabs defaultValue="crypto" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full md:w-[500px] mb-6">
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="forex">Forex</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="commodities">Commodities</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Name</th>
                        <th className="text-right p-4">Price</th>
                        <th className="text-right p-4">24h Change</th>
                        <th className="text-right p-4">Volume</th>
                        {activeTab !== 'forex' && activeTab !== 'commodities' && (
                          <th className="text-right p-4">Market Cap</th>
                        )}
                        <th className="text-right p-4">Chart</th>
                        <th className="text-right p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                          <tr key={item.id} className="hover:bg-accent/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center">
                                <Button variant="ghost" size="icon" className="mr-2">
                                  <Star className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td className="text-right p-4">
                              <p className="font-medium">${typeof item.price === 'number' ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.price}</p>
                            </td>
                            <td className={`text-right p-4 ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              <div className="flex items-center justify-end">
                                {item.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                                {item.change.toFixed(2)}%
                              </div>
                            </td>
                            <td className="text-right p-4">{item.volume}</td>
                            {activeTab !== 'forex' && activeTab !== 'commodities' && hasMarketCap(item) && (
                              <td className="text-right p-4">{item.marketCap}</td>
                            )}
                            <td className="p-4">
                              <div className="h-10 w-48">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={item.chart}>
                                    <Line 
                                      type="monotone" 
                                      dataKey="value" 
                                      stroke={item.change >= 0 ? "#10b981" : "#ef4444"} 
                                      dot={false} 
                                      strokeWidth={2} 
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </td>
                            <td className="text-right p-4">
                              <Button variant="outline" size="sm" className="flex items-center">
                                <span>Details</span>
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center p-8">
                            <p className="text-muted-foreground">No results found</p>
                          </td>
                        </tr>
                      )}
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
