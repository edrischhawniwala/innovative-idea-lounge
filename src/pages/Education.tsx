
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Avatar from "@/components/common/Avatar";
import { BookOpen, Search, Play, Star, Users, Clock, BookMarked, Filter } from "lucide-react";

// Mock course data
const courses = [
  {
    id: "course1",
    title: "Trading Fundamentals",
    description: "Learn the basics of trading, including key concepts, terminology, and market analysis.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    instructor: { name: "Sarah Martinez", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    rating: 4.8,
    reviews: 245,
    students: 1250,
    duration: "6 hours",
    level: "Beginner",
    price: 49.99,
    tags: ["basics", "fundamentals", "analysis"]
  },
  {
    id: "course2",
    title: "Technical Analysis Mastery",
    description: "Master the art of technical analysis with advanced chart patterns and indicators.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    instructor: { name: "Marcus Chen", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
    rating: 4.9,
    reviews: 372,
    students: 2430,
    duration: "12 hours",
    level: "Intermediate",
    price: 79.99,
    tags: ["technical", "charts", "indicators"]
  },
  {
    id: "course3",
    title: "Forex Trading Strategies",
    description: "Learn comprehensive strategies for trading the forex markets successfully.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    instructor: { name: "Jessica Parker", avatar: "https://randomuser.me/api/portraits/women/27.jpg" },
    rating: 4.7,
    reviews: 189,
    students: 875,
    duration: "8 hours",
    level: "Intermediate",
    price: 59.99,
    tags: ["forex", "strategies", "currency"]
  },
  {
    id: "course4",
    title: "Cryptocurrency Investment",
    description: "Understand how to evaluate and invest in cryptocurrencies for long-term growth.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    instructor: { name: "David Wilson", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    rating: 4.6,
    reviews: 215,
    students: 1580,
    duration: "10 hours",
    level: "All Levels",
    price: 69.99,
    tags: ["crypto", "bitcoin", "investment"]
  },
  {
    id: "course5",
    title: "Risk Management for Traders",
    description: "Learn essential risk management techniques to protect your capital and maximize returns.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    instructor: { name: "Emily Johnson", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
    rating: 4.9,
    reviews: 156,
    students: 920,
    duration: "5 hours",
    level: "All Levels",
    price: 39.99,
    tags: ["risk", "management", "capital"]
  },
  {
    id: "course6",
    title: "Options Trading Masterclass",
    description: "Master options trading with strategies for income generation and risk hedging.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    instructor: { name: "Robert Brown", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
    rating: 4.8,
    reviews: 203,
    students: 1120,
    duration: "14 hours",
    level: "Advanced",
    price: 89.99,
    tags: ["options", "derivatives", "strategies"]
  },
];

// Mock articles data
const articles = [
  {
    id: "article1",
    title: "Understanding Market Cycles",
    excerpt: "Learn how to identify different market cycles and adjust your trading strategy accordingly.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    author: { name: "Sarah Martinez", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    date: "2023-08-15",
    readTime: "8 min read",
    tags: ["market cycles", "trading strategy"]
  },
  {
    id: "article2",
    title: "Top 5 Technical Indicators Every Trader Should Know",
    excerpt: "Discover the essential technical indicators that can improve your trading decisions.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    author: { name: "Marcus Chen", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
    date: "2023-08-10",
    readTime: "6 min read",
    tags: ["technical indicators", "trading"]
  },
  {
    id: "article3",
    title: "Fundamental Analysis: A Comprehensive Guide",
    excerpt: "Learn how to analyze a company's financial statements to make informed investment decisions.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    author: { name: "Jessica Parker", avatar: "https://randomuser.me/api/portraits/women/27.jpg" },
    date: "2023-08-05",
    readTime: "12 min read",
    tags: ["fundamental analysis", "investing"]
  },
  {
    id: "article4",
    title: "Psychology of Trading: Overcoming Emotional Biases",
    excerpt: "Understand the psychological aspects of trading and strategies to overcome emotional biases.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    author: { name: "David Wilson", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    date: "2023-08-01",
    readTime: "10 min read",
    tags: ["psychology", "emotional trading"]
  },
];

export default function Education() {
  const [activeTab, setActiveTab] = useState("courses");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 container max-w-screen-xl mx-auto p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Education</h1>
              <p className="text-muted-foreground">Learn trading and investing from experts</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses and articles..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="courses" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Courses</span>
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <BookMarked className="h-4 w-4" />
                <span>Articles</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="courses">
              {filteredCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <Card key={course.id} className="overflow-hidden">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={course.image} 
                            alt={course.title} 
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{course.title}</CardTitle>
                              <CardDescription className="mt-2">{course.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar user={{name: course.instructor.name, avatar: course.instructor.avatar}} size="sm" />
                            <span className="text-sm font-medium">{course.instructor.name}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            <Badge variant="outline" className="text-xs">{course.level}</Badge>
                            {course.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between mb-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span>{course.students.toLocaleString()} students</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-400" />
                              <span>{course.rating} ({course.reviews})</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-4">
                          <div className="text-lg font-bold">${course.price}</div>
                          <Button>
                            <Play className="h-4 w-4 mr-2" />
                            Enroll Now
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No courses found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="articles">
              {filteredArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredArticles.map((article) => (
                      <Card key={article.id} className="flex flex-col md:flex-row overflow-hidden">
                        <div className="md:w-1/3 h-48 md:h-auto">
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-4">
                          <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                          <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar user={{name: article.author.name, avatar: article.author.avatar}} size="sm" />
                            <span className="text-sm">{article.author.name}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{new Date(article.date).toLocaleDateString()}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{article.readTime}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                          
                          <Button variant="link" className="p-0 mt-2">Read Article</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No articles found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
