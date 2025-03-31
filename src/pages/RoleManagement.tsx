
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import RoleUpgradeForm from "@/components/roles/RoleUpgradeForm";
import ProviderApprovalList from "@/components/roles/ProviderApprovalList";
import { currentUser } from "@/data/mockData";

const RoleManagement = () => {
  const [activeTab, setActiveTab] = useState("my-role");
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4 container max-w-screen-xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Role Management</h1>
            <p className="text-muted-foreground">
              View and manage user roles and access permissions
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="my-role">My Role</TabsTrigger>
              {isAdmin && <TabsTrigger value="approval-requests">Approval Requests</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="my-role">
              <Card>
                <CardHeader>
                  <CardTitle>Current Role: {currentUser.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</CardTitle>
                  <CardDescription>
                    Your current role defines what actions you can perform in the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RoleUpgradeForm currentRole={currentUser.role} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="approval-requests">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Provider Approval Requests</CardTitle>
                    <CardDescription>
                      Review and approve users who want to become service providers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProviderApprovalList />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;
