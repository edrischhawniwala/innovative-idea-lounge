
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { User } from "@/types";

interface RoleUpgradeFormProps {
  currentRole: User['role'];
}

const roleOptions = [
  { value: 'member', label: 'Registered Member', description: 'Basic access to the platform' },
  { value: 'service_user', label: 'Service User', description: 'Subscribe to and purchase services' },
  { value: 'service_provider', label: 'Service Provider', description: 'Offer services to users (requires approval)' },
];

const serviceProviderFormSchema = z.object({
  serviceType: z.string().min(1, { message: "Please select a service type" }),
  experience: z.string().min(10, { message: "Experience must be at least 10 characters" }),
  qualifications: z.string().min(10, { message: "Qualifications must be at least 10 characters" }),
  serviceDescription: z.string().min(20, { message: "Description must be at least 20 characters" }),
  contactEmail: z.string().email({ message: "Please enter a valid email" }),
  contactPhone: z.string().optional(),
});

const RoleUpgradeForm: React.FC<RoleUpgradeFormProps> = ({ currentRole }) => {
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);
  const [showProviderForm, setShowProviderForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof serviceProviderFormSchema>>({
    resolver: zodResolver(serviceProviderFormSchema),
    defaultValues: {
      serviceType: "",
      experience: "",
      qualifications: "",
      serviceDescription: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setShowProviderForm(value === 'service_provider' && currentRole !== 'service_provider');
  };

  const onSubmit = (values: z.infer<typeof serviceProviderFormSchema>) => {
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Role upgrade request:", { role: selectedRole, ...values });
      
      if (selectedRole === 'service_provider') {
        toast.success("Your service provider application has been submitted for review. We'll notify you once it's approved.");
      } else {
        toast.success(`Your role has been updated to ${selectedRole.replace('_', ' ')}.`);
      }
      
      setSubmitting(false);
    }, 1500);
  };

  const isUpgradeNeeded = currentRole !== selectedRole;
  const isPendingProvider = currentRole === 'service_provider' && selectedRole === 'service_provider';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Select Role</h3>
        <RadioGroup 
          defaultValue={currentRole} 
          value={selectedRole}
          onValueChange={handleRoleChange}
          className="flex flex-col space-y-3"
        >
          {roleOptions.map(option => (
            <div key={option.value} className="flex items-start space-x-3 p-3 border rounded-md">
              <RadioGroupItem value={option.value} id={option.value} />
              <div className="flex-1">
                <label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                  {option.label}
                </label>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>

      {showProviderForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Alert className="bg-muted">
              <AlertTitle>Service Provider Approval Required</AlertTitle>
              <AlertDescription>
                Your application to become a service provider will be reviewed by our team.
                Please fill out the form below with accurate information.
              </AlertDescription>
            </Alert>
            
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Signals, Analysis, Education" {...field} />
                  </FormControl>
                  <FormDescription>The primary service you will offer</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Experience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your professional experience in this field" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualifications</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List your relevant qualifications, certifications, or credentials" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the services you will offer on our platform" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Processing..." : "Submit Application"}
            </Button>
          </form>
        </Form>
      )}
      
      {!showProviderForm && isUpgradeNeeded && (
        <Button 
          onClick={() => {
            toast.success(`Your role has been updated to ${selectedRole.replace('_', ' ')}.`);
          }}
          className="w-full"
        >
          Update Role
        </Button>
      )}
      
      {isPendingProvider && (
        <Alert>
          <AlertTitle>Application Under Review</AlertTitle>
          <AlertDescription>
            Your application to become a service provider is currently under review.
            We'll notify you once a decision has been made.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RoleUpgradeForm;
