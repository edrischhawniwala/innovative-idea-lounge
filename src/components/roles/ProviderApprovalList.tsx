
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { toast } from "sonner";

// Mock applications for demonstration
const mockApplications = [
  {
    id: "app-1",
    userId: "user-123",
    userName: "Michael Johnson",
    userAvatar: "/placeholder.svg",
    submittedAt: "2023-10-15T10:30:00Z",
    serviceType: "Financial Analysis",
    experience: "Over 10 years of experience in financial markets, previously worked at Goldman Sachs as a senior analyst. Specialized in cryptocurrency market analysis and trading strategies.",
    qualifications: "CFA Level III, MBA from Stanford University, Series 7 & 63 licenses.",
    serviceDescription: "I offer comprehensive financial analysis for crypto traders, including market trends, technical analysis, and investment strategies tailored to individual risk profiles.",
    contactEmail: "michael.j@example.com",
    contactPhone: "+1 (555) 123-4567",
    status: "pending"
  },
  {
    id: "app-2",
    userId: "user-456",
    userName: "Sarah Williams",
    userAvatar: "/placeholder.svg",
    submittedAt: "2023-10-14T15:20:00Z",
    serviceType: "Educational Courses",
    experience: "5 years teaching blockchain technology at university level. Created online courses with over 50,000 students enrolled.",
    qualifications: "Ph.D. in Computer Science, Certified Blockchain Developer, Published author on blockchain technology.",
    serviceDescription: "Comprehensive educational courses on blockchain fundamentals, smart contract development, and cryptocurrency trading strategies for beginners to advanced users.",
    contactEmail: "sarah.w@example.com",
    contactPhone: "+1 (555) 987-6543",
    status: "pending"
  },
  {
    id: "app-3",
    userId: "user-789",
    userName: "David Chen",
    userAvatar: "/placeholder.svg",
    submittedAt: "2023-10-13T09:15:00Z",
    serviceType: "Trading Signals",
    experience: "8 years as a professional trader with focus on altcoins and DeFi markets. Previously managed a $10M trading portfolio.",
    qualifications: "Certified Technical Analyst, BS in Finance, Developed proprietary trading algorithms.",
    serviceDescription: "Premium trading signals for crypto markets with 24/7 alerts, detailed entry/exit points, and risk management advice.",
    contactEmail: "david.c@example.com",
    contactPhone: "",
    status: "pending"
  }
];

const ProviderApprovalList = () => {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleViewDetails = (application: any) => {
    setSelectedApp(application);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleApprove = () => {
    if (!selectedApp) return;
    
    // Update application status locally
    setApplications(applications.map(app => 
      app.id === selectedApp.id ? {...app, status: 'approved'} : app
    ));
    
    toast.success(`${selectedApp.userName}'s application has been approved`);
    setIsDialogOpen(false);
  };

  const handleReject = () => {
    if (!selectedApp) return;
    
    // Update application status locally
    setApplications(applications.map(app => 
      app.id === selectedApp.id ? {...app, status: 'rejected'} : app
    ));
    
    toast.success(`${selectedApp.userName}'s application has been rejected`);
    setIsDialogOpen(false);
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');

  return (
    <div>
      {pendingApplications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No pending applications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingApplications.map((application) => (
            <div key={application.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <img src={application.userAvatar} alt={application.userName} />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{application.userName}</h4>
                    <p className="text-sm text-muted-foreground">{application.serviceType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Submitted {formatDate(application.submittedAt)}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleViewDetails(application)}>
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle>Provider Application</DialogTitle>
                <DialogDescription>
                  Review the application details below
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <img src={selectedApp.userAvatar} alt={selectedApp.userName} />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedApp.userName}</h3>
                    <Badge variant="outline">{selectedApp.serviceType}</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Experience</h4>
                      <p className="text-sm mt-1">{selectedApp.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Qualifications</h4>
                      <p className="text-sm mt-1">{selectedApp.qualifications}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Service Description</h4>
                      <p className="text-sm mt-1">{selectedApp.serviceDescription}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Contact Information</h4>
                      <div className="text-sm mt-1">
                        <p>Email: {selectedApp.contactEmail}</p>
                        {selectedApp.contactPhone && <p>Phone: {selectedApp.contactPhone}</p>}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={handleReject}>Reject</Button>
                <Button onClick={handleApprove}>Approve</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderApprovalList;
