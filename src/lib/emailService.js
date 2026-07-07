// src/lib/emailService.js
import { supabase } from "./supabase";

/**
 * Transmits the fleet manifest summary email report via the deployed Supabase Edge Function.
 * The production API token is handled securely on the serverless backend.
 */
export const sendFleetEmailReport = async (operatorEmail, profileData) => {
  const { data, error } = await supabase.functions.invoke("send-email", {
    body: { 
      target_email: operatorEmail,
      operator_name: profileData.full_name,
      license_tier: profileData.license_type,
      depot_base: profileData.depot_hub
    }
  });

  if (error) {
    console.error("Supabase Edge Function invocation anomaly:", error);
    throw new Error(error.message || `Edge Function returned status: ${error.status}`);
  }

  return data;
};