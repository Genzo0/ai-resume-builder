"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCustomerPortalSession } from "./actions";

export default function ManageSubscriptionButton() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const redirectUrl = await createCustomerPortalSession();

      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={() => handleClick()} disabled={loading}>
      Manage Subscription
    </Button>
  );
}
