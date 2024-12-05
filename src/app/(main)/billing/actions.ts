"use server";

import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function createCustomerPortalSession() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const stripeCustomerId = user.privateMetadata?.stripeCustomerId as
    | string
    | undefined;

  if (!stripeCustomerId) {
    throw new Error("Stripe Customer Id is missing");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
  });

  if (!session.url) {
    throw new Error("Failed to create customer portal session");
  }

  return session.url;
}
