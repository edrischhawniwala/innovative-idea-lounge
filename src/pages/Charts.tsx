
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { Bookmark, Share2, Download, ChevronDown } from "lucide-react";

// Mock chart data
const timeframes = ["1D", "1W", "1M", "3M", "6M", "1Y", "All"];

const chartData = {
  "1D": generateHourlyData(24),
  "1W": generateDailyData(7),
  "1M": generateDailyData(30),
  "3M": generateDailyData(90),
  "6M": generateDailyData(180),
  "1Y": generateDailyData(365),
  "All": generateDailyData(1095), // 3 years
};

function generateHourlyData(hours: number) {
  const data = [];
  const basePrice = 38000;
  let price = basePrice;
  const now = new Date();
  
  for (let i = 0; i < hours; i++) {
    const date = new Date(now);
    date.setHours(date.getHours() - hours + i);
    
    // Create some random price movement
    price = price + (Math.random() * 100) - 50;
    
    data.push({
      time: date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      price: price,
      volume: Math.floor(Math.random() * 200) + 50
    });
  }
  
  return data;
}

function generateDailyData(days: number) {
  const data = [];
  const basePrice = 38000;
  let price = basePrice;
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - days + i);
    
    // Create some random price movement but with a slight upward trend
    price = price + (Math.random() * 300) - 125;
    
    data.push({
      time: date.toLocaleDateString([], {month: 'short', day: 'numeric'}),
      price: price,
      volume: Math.floor(Math.random() * 1000) + 200
    });
  }
  
  return data;
}

// Technical indicators data
const indicators = [
  { value: "sma", label: "Simple Moving Average (SMA)" },
  { value: "ema", label: "Exponential Moving Average (EMA)" },
  { value: "bb", label: "Bollinger Bands" },
  { value: "rsi", label: "Relative Strength Index (RSI)" },
  { value: "macd", label: "MACD" },
];

// Community analysis mock data
const communityAnalysis = [
  { sentiment: "bullish", percentage: 65, color: "#10b981" },
  { sentiment: "bearish", percentage: 25, color: "#ef4444" },
  { sentiment: "neutral", percentage: 10, color: "#9ca3af" },
];

export default function Charts() {
  const [activeTimeframe, setActiveTimeframe] = useState("1D");
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 container max-w-screen-xl mx-auto p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Charts</h1>
              <p className="text-muted-foreground">Advanced technical analysis tools</p>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Select defaultValue={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="solana">Solana (SOL)</SelectItem>
                  <SelectItem value="eurusd">EUR/USD</SelectItem>
                  <SelectItem value="gold">Gold (XAU)</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Bookmark className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-0 pt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle className="text-xl">Bitcoin (BTC)</CardTitle>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold">$38,245.67</span>
                    <span className="text-green-500 text-sm">+2.45%</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="flex overflow-x-auto pb-2 mb-4">
                <div className="flex gap-2">
                  {timeframes.map((timeframe) => (
                    <Button
                      key={timeframe}
                      variant={timeframe === activeTimeframe ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTimeframe(timeframe)}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData[activeTimeframe as keyof typeof chartData]}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                    <XAxis dataKey="time" tick={{ fill: '#9ca3af' }} axisLine={{ stroke: '#374151' }} />
                    <YAxis 
                      domain={['dataMin - 1000', 'dataMax + 1000']}
                      tick={{ fill: '#9ca3af' }} 
                      axisLine={{ stroke: '#374151' }} 
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']} 
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      name="Price" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Add Indicator</span>
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select indicator" />
                    </SelectTrigger>
                    <SelectContent>
                      {indicators.map((indicator) => (
                        <SelectItem key={indicator.value} value={indicator.value}>
                          {indicator.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    Candlestick
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    Drawing Tools
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Book */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Book</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 divide-x">
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-2 text-green-500">Bids</h4>
                    <div className="space-y-1">
                      {[
                        { price: 38200.50, amount: 1.5 },
                        { price: 38150.25, amount: 2.3 },
                        { price: 38100.00, amount: 4.1 },
                        { price: 38050.75, amount: 3.0 },
                        { price: 38000.00, amount: 5.2 },
                      ].map((bid, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-green-500">${bid.price.toFixed(2)}</span>
                          <span>{bid.amount.toFixed(2)} BTC</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-medium mb-2 text-red-500">Asks</h4>
                    <div className="space-y-1">
                      {[
                        { price: 38250.00, amount: 2.7 },
                        { price: 38300.25, amount: 1.9 },
                        { price: 38350.75, amount: 3.2 },
                        { price: 38400.50, amount: 0.8 },
                        { price: 38450.00, amount: 1.5 },
                      ].map((ask, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-red-500">${ask.price.toFixed(2)}</span>
                          <span>{ask.amount.toFixed(2)} BTC</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Trades */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Trades</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[
                    { price: 38245.67, amount: 0.5, time: "12:45:23", type: "buy" },
                    { price: 38242.50, amount: 1.2, time: "12:44:58", type: "sell" },
                    { price: 38247.25, amount: 0.3, time: "12:44:32", type: "buy" },
                    { price: 38240.00, amount: 0.8, time: "12:44:15", type: "sell" },
                    { price: 38250.75, amount: 0.1, time: "12:43:57", type: "buy" },
                  ].map((trade, index) => (
                    <div key={index} className="px-4 py-2 flex justify-between text-sm">
                      <span className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>
                        ${trade.price.toFixed(2)}
                      </span>
                      <span>{trade.amount.toFixed(2)} BTC</span>
                      <span className="text-muted-foreground">{trade.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Community Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-muted rounded-full h-4 mb-6">
                  {communityAnalysis.map((item, index) => (
                    <div 
                      key={index} 
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                        display: 'inline-block',
                        height: '100%',
                        borderTopLeftRadius: index === 0 ? '0.25rem' : 0,
                        borderBottomLeftRadius: index === 0 ? '0.25rem' : 0,
                        borderTopRightRadius: index === communityAnalysis.length - 1 ? '0.25rem' : 0,
                        borderBottomRightRadius: index === communityAnalysis.length - 1 ? '0.25rem' : 0,
                      }} 
                    />
                  ))}
                </div>
                <div className="flex justify-between text-sm mb-4">
                  {communityAnalysis.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="capitalize">{item.sentiment}</span>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-muted-foreground text-center mt-4">
                  Based on 3,245 traders' positions
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Price Prediction Discussion</h2>
            <Tabs defaultValue="bullish">
              <TabsList>
                <TabsTrigger value="bullish">Bullish Analysis</TabsTrigger>
                <TabsTrigger value="bearish">Bearish Analysis</TabsTrigger>
                <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="bullish" className="p-4 border rounded-md mt-2">
                <p className="mb-2"><span className="font-medium">@sarahtrading:</span> The recent breakout above the 38K resistance level suggests potential for continued upward momentum. With increasing institutional adoption and ETF inflows remaining strong, I'm targeting 42K in the short term.</p>
                <p><span className="font-medium">@marcusfx:</span> Agreed! The RSI is showing strength without being overbought yet, and volume patterns confirm buyer interest at these levels.</p>
              </TabsContent>
              <TabsContent value="bearish" className="p-4 border rounded-md mt-2">
                <p className="mb-2"><span className="font-medium">@jparker:</span> While the short-term trend looks positive, I'm concerned about the divergence on the daily MACD. We might see a pullback to 36K before any sustainable move higher.</p>
                <p><span className="font-medium">@dwilson:</span> The current rally seems overextended when looking at the weekly charts. Historically, BTC tends to retest previous resistance as support after such moves.</p>
              </TabsContent>
              <TabsContent value="technical" className="p-4 border rounded-md mt-2">
                <p className="mb-2"><span className="font-medium">@miketaylor:</span> Key support levels: 37.5K, 36.2K, 35K. Resistance: 38.5K, 39.8K, 41.2K. The 200-day moving average at 35.8K should provide strong support if we see a pullback.</p>
                <p><span className="font-medium">@emilytrades:</span> Volume profile indicates significant interest in the 37-39K range, suggesting we might consolidate here before the next major move.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
